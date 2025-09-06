// ======================= CONFIG =======================
var FORCE_ALL             = true;   // إجبار كل الترافيك على البروكسي
var FORBID_DIRECT         = true;   // منع DIRECT لأي ترافيك غير محدد
var BLOCK_IR              = true;   // حجب نطاقات .ir
var ENABLE_SOCKS          = true;   // تفعيل SOCKS5/4
var ENABLE_HTTP           = true;   // تفعيل HTTP Proxy
var USE_DNS_PRIVATE_CHECK = true;   // تفعيل dnsResolve للتحقق من IP
var ORDER_IPV6_FIRST      = true;   // تفضيل IPv6 أولاً

// ======================= PROXIES =======================
var PROXIES_CFG = [
  { ip: "2a13:a5c7:25ff:7000", socksPorts: [20001,20002,20003,20004,8085,10491], httpPorts: [80,443,8080,3128] },
  { ip: "91.106.109.12",       socksPorts: [20001,20002,20003,20004,8085,10491], httpPorts: [80,443,8080,3128] }
];

// ======================= DOMAINS (لعبة فقط) =======================
var GAME_DOMAINS = [
  "igamecj.com","igamepubg.com","pubgmobile.com","tencentgames.com",
  "proximabeta.com","proximabeta.net","tencentyun.com","qcloud.com",
  "qcloudcdn.com","gtimg.com","game.qq.com","cdn-ota.qq.com","cdngame.tencentyun.com","gcloud.qq.com",
  "googleapis.com","gstatic.com","googleusercontent.com",
  "play.googleapis.com","firebaseinstallations.googleapis.com",
  "mtalk.google.com","android.clients.google.com",
  "apple.com","icloud.com","gamecenter.apple.com","gamekit.apple.com","apps.apple.com"
];

var KEYWORDS = ["pubg","tencent","proximabeta","tencentyun","qcloud","gcloud"];

// ======================= HELPERS =======================
function isIPv6Literal(h){ return h && h.indexOf(":")!==-1 && h.indexOf(".")===-1; }
function bracketHost(ip){ return isIPv6Literal(ip) ? "["+ip+"]" : ip; }
function isPlainIP(h){ return (/^\d{1,3}(\.\d{1,3}){3}$/.test(h) || /^[0-9a-fA-F:]+$/.test(h)); }

function hostInList(h,list){
  h=(h||"").toLowerCase();
  for(var i=0;i<list.length;i++){
    var d=list[i].toLowerCase();
    if(h===d||shExpMatch(h,"*."+d)) return true;
  }
  return false;
}

function hasKeyword(s){
  s=(s||"").toLowerCase();
  for(var i=0;i<KEYWORDS.length;i++){
    if(s.indexOf(KEYWORDS[i])!==-1) return true;
  }
  return false;
}

function isIranTLD(h){ h=(h||"").toLowerCase(); return h.endsWith(".ir")||shExpMatch(h,"*.ir"); }
function hashStr(s){ var h=5381; for(var i=0;i<s.length;i++) h=((h<<5)+h)+s.charCodeAt(i); return (h>>>0); }

function endsWithAny(h, arr){
  h=(h||"").toLowerCase();
  for(var i=0;i<arr.length;i++){
    var s=arr[i].toLowerCase();
    if(h===s) return true;
    if(s.charAt(0)==="." && shExpMatch(h,"*"+s)) return true;
    if(s.charAt(0)!=="." && shExpMatch(h,"*."+s)) return true;
  }
  return false;
}

function isLikelyLocalName(h){
  if(isPlainHostName(h)) return true;
  var low=(h||"").toLowerCase();
  if(low==="localhost") return true;
  var localTlds=[".local",".lan",".home",".intranet",".internal",".invalid"];
  return endsWithAny(low,localTlds);
}

function isPrivateIPv4(ip){
  if(isInNet(ip,"127.0.0.0","255.0.0.0")) return true;
  if(isInNet(ip,"10.0.0.0","255.0.0.0")) return true;
  if(isInNet(ip,"172.16.0.0","255.240.0.0")) return true;
  if(isInNet(ip,"192.168.0.0","255.255.0.0")) return true;
  if(isInNet(ip,"169.254.0.0","255.255.0.0")) return true;
  if(isInNet(ip,"100.64.0.0","255.192.0.0")) return true;
  return false;
}

function isPrivateOrLocal(h){
  if(isLikelyLocalName(h)) return true;
  if(isIPv6Literal(h)){
    var low=h.toLowerCase();
    if(low==="::1" || shExpMatch(low,"fe80::*") || shExpMatch(low,"fc*::*") || shExpMatch(low,"fd*::*")) return true;
    return false;
  }
  if(!USE_DNS_PRIVATE_CHECK) return false;
  var ip=null; try{ ip=dnsResolve(h); }catch(e){ ip=null; }
  if(!ip) return false;
  return isPrivateIPv4(ip);
}

// ======================= PROXY TOKENS =======================
function proxyTokensForEntry(entry){
  var tokens=[];
  var host=bracketHost(entry.ip);
  if(ENABLE_SOCKS){
    var ss=entry.socksPorts||[];
    for(var i=0;i<ss.length;i++){
      tokens.push("SOCKS5 "+host+":"+ss[i]);
      tokens.push("SOCKS "+host+":"+ss[i]);
    }
  }
  if(ENABLE_HTTP){
    var hp=entry.httpPorts||[];
    for(var j=0;j<hp.length;j++){
      tokens.push("PROXY "+host+":"+hp[j]);
    }
  }
  return tokens;
}

function dedup(arr){
  var seen={}, out=[];
  for(var i=0;i<arr.length;i++){
    var k=arr[i];
    if(!seen[k]){ seen[k]=1; out.push(k); }
  }
  return out;
}

var PROXY_TOKENS=(function(){
  var v6=[], v4=[];
  for(var i=0;i<PROXIES_CFG.length;i++){
    var p=PROXIES_CFG[i];
    if(isIPv6Literal(p.ip)) v6.push(p); else v4.push(p);
  }
  var ordered = ORDER_IPV6_FIRST ? v6.concat(v4) : v4.concat(v6);
  var toks=[];
  for(var k=0;k<ordered.length;k++){
    var t=proxyTokensForEntry(ordered[k]);
    for(var x=0;x<t.length;x++) toks.push(t[x]);
  }
  return dedup(toks);
})();

function buildProxyChainFor(h){
  if(!PROXY_TOKENS || PROXY_TOKENS.length===0) return "DIRECT";
  var start=hashStr(h||"")%PROXY_TOKENS.length;
  var out=[];
  for(var i=0;i<PROXY_TOKENS.length;i++){
    var idx=(start+i)%PROXY_TOKENS.length;
    out.push(PROXY_TOKENS[idx]);
  }
  if(!FORBID_DIRECT) out.push("DIRECT");
  return out.join("; ");
}

// ======================= MAIN =======================
function FindProxyForURL(url, host){
  if(isPrivateOrLocal(host)) return "DIRECT";
  if(BLOCK_IR && isIranTLD(host)) return "PROXY 127.0.0.1:9";

  var chain=buildProxyChainFor(host);

  if(FORCE_ALL) return chain;
  if(isPlainIP(host)) return chain;
  if(hostInList(host,GAME_DOMAINS) || hasKeyword(host) || hasKeyword(url)) return chain;

  return "DIRECT";
}
