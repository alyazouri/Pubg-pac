// =======================================================
// PAC — Jordan-first for PUBG (Failover only, no DIRECT)
// مرتّب بالأولوية + منافذ أنسب للّعب
// =======================================================

// 1) ترتيب البروكسيات (من الأفضل للأسوأ)
var PROXIES_CFG = [
  // أولوية 1: IPv4 أردني (أعلى توافق)
  { ip: "91.106.109.12",      socksPorts: [1080,20001,20002,8085,10491], httpPorts: [8080,8000,3128] },

  // أولوية 2: IPv6 أردني
  { ip: "2a13:a5c7:25ff:7000", socksPorts: [1080,20001,20002,8085,10491], httpPorts: [8080,8000,3128] },

  // أولوية 3: احتياطي IPv4
  { ip: "91.106.109.50",      socksPorts: [1080],                         httpPorts: [8080,8000,8008,8081,8181] }
];

// 2) نطاقات PUBG / Tencent
var PUBG = [
  "*.pubgmobile.com","*.igamecj.com","*.proximabeta.com",
  "*.tencent.com","*.tencentgames.com","*.gcloud.qq.com",
  "*.qcloud.com","*.cdn.pubgmobile.com","*.akamaized.net","*.vtcdn.com"
];

// ---------- Utilities ----------
function isIPv6Literal(host){return host.indexOf(":")!==-1&&host.indexOf(".")===-1;}
function bracketIPv6(ip){return ip[0]==="["?ip:"["+ip+"]";}
function proxyTokensFor(ip,socksPorts,httpPorts){
  var tokens=[];
  for(var i=0;i<socksPorts.length;i++){var h=isIPv6Literal(ip)?bracketIPv6(ip):ip;tokens.push("SOCKS "+h+":"+socksPorts[i]);}
  for(var j=0;j<httpPorts.length;j++){var h2=isIPv6Literal(ip)?bracketIPv6(ip):ip;tokens.push("PROXY "+h2+":"+httpPorts[j]);}
  return tokens.join("; ");
}
function isPlainIP(host){var p=host.split(".");if(p.length===4){for(var i=0;i<4;i++){var n=+p[i];if(!(n>=0&&n<=255))return false;}return true;}return false;}
function isPrivateOrLocal(host){
  if(isPlainHostName(host))return true;
  var ip=dnsResolve(host); if(!ip) return false;
  if(isInNet(ip,"10.0.0.0","255.0.0.0"))return true;
  if(isInNet(ip,"172.16.0.0","255.240.0.0"))return true;
  if(isInNet(ip,"192.168.0.0","255.255.0.0"))return true;
  if(isInNet(ip,"127.0.0.0","255.0.0.0"))return true;
  if(isInNet(ip,"169.254.0.0","255.255.0.0"))return true;
  if(isInNet(ip,"100.64.0.0","255.192.0.0"))return true; // CGNAT
  return false;
}
function hostInList(host,list){for(var i=0;i<list.length;i++){if(shExpMatch(host,list[i]))return true;}return false;}
function hasKeyword(s,kw){return s.toLowerCase().indexOf(kw)!==-1;}
function hashStr(s){var h=0;for(var i=0;i<s.length;i++){h=(h*131+s.charCodeAt(i))&0x7fffffff;}return h>>>0;}
function buildProxyChain(host){
  var chain=[]; var h=hashStr(host);
  for(var i=0;i<PROXIES_CFG.length;i++){
    var cfg=PROXIES_CFG[i];

    // SOCKS أولاً (أفضل لعب)
    var sp=cfg.socksPorts.slice(0);
    if(sp.length>1){
      var sidx=h%sp.length;
      chain.push(proxyTokensFor(cfg.ip,[sp[sidx]].concat(sp.slice(0,sidx)).concat(sp.slice(sidx+1)),[]));
    }else{
      chain.push(proxyTokensFor(cfg.ip,sp,[]));
    }

    // ثم HTTP احتياطي
    var hp=cfg.httpPorts.slice(0);
    if(hp.length>0){
      var hidx=h%hp.length;
      var ordered=[hp[hidx]].concat(hp.slice(0,hidx)).concat(hp.slice(hidx+1));
      var tokens=[];
      for(var j=0;j<ordered.length;j++){
        var hostLit=isIPv6Literal(cfg.ip)?bracketIPv6(cfg.ip):cfg.ip;
        tokens.push("PROXY "+hostLit+":"+ordered[j]);
      }
      chain.push(tokens.join("; "));
    }
  }
  // بدون DIRECT — دائماً جرّب البروكسي التالي
  return chain.join("; ");
}

// ---------- Main ----------
function FindProxyForURL(url,host){
  // كل شيء عبر السلسلة (حتى غير PUBG) لعدم استخدام DIRECT
  var hostL = host.toLowerCase();
  if(isPrivateOrLocal(hostL)) return buildProxyChain(hostL);
  return buildProxyChain(hostL);
}
