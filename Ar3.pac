// ======================================================================
// PAC – PUBG Mobile أردني + اختيار ديناميكي لأفضل بورت UDP
// ======================================================================

// ======================= CONFIG =======================
var FORCE_ALL             = true;
var FORBID_DIRECT         = true;
var BLOCK_IR              = true;
var ENABLE_SOCKS          = false;
var ENABLE_HTTP           = true;
var USE_DNS_PRIVATE_CHECK = false;
var MTU_SIZE              = 1400;

// ======================= بروكسيات أردنية =======================
var PROXIES_CFG = [
  { ip: "2a13:a5c7:25ff:7000", 
    socksPorts: [20001,20002,20003,20004,8085], 
    httpPorts: [443,8080] 
  },
  { ip: "91.106.109.12", 
    socksPorts: [20001,20002,20003,20004,8085,10491], 
    httpPorts: [443,808] 
  }
];

// بورتات UDP الأردنية للعبة
var GAME_UDP_PORTS = [];
for(var p=20001;p<=20004;p++) GAME_UDP_PORTS.push(p);
for(var p=10000;p<=27015;p+=500) GAME_UDP_PORTS.push(p); // توزيع سريع للبورتات الكبيرة

// ======================= نطاقات اللعبة =======================
var GAME_DOMAINS = [
  "igamecj.com","igamepubg.com","pubgmobile.com","tencentgames.com",
  "proximabeta.com","proximabeta.net","tencentyun.com","qcloud.com",
  "qcloudcdn.com","gtimg.com","game.qq.com","cdn-ota.qq.com","cdngame.tencentyun.com","gcloud.qq.com",
  "googleapis.com","gstatic.com","googleusercontent.com","play.googleapis.com",
  "firebaseinstallations.googleapis.com","mtalk.google.com","android.clients.google.com",
  "apple.com","icloud.com","gamecenter.apple.com","gamekit.apple.com","apps.apple.com",
  "x.com","twitter.com","api.x.com","api.twitter.com","abs.twimg.com","pbs.twimg.com","t.co"
];
var KEYWORDS = ["pubg","tencent","igame","proximabeta","qcloud","tencentyun","gcloud","gameloop","match","squad","party","team","rank","jo","jordan"];

// ======================= HELPERS =======================
function isIPv6Literal(h){ return h && h.indexOf(":")!==-1 && h.indexOf(".")===-1; }
function bracketHost(ip){ return isIPv6Literal(ip) ? "["+ip+"]" : ip; }
function isPlainIP(h){ return (/^\d{1,3}(\.\d{1,3}){3}$/.test(h) || /^[0-9a-fA-F:]+$/.test(h)); }
function hostInList(h,list){ h=(h||"").toLowerCase(); for(var i=0;i<list.length;i++){ var d=list[i].toLowerCase(); if(h===d||shExpMatch(h,"*."+d)) return true; } return false;}
function hasKeyword(s){ s=(s||"").toLowerCase(); for(var i=0;i<KEYWORDS.length;i++){ if(s.indexOf(KEYWORDS[i])!==-1) return true; } return false;}
function isIranTLD(h){ h=(h||"").toLowerCase(); return h.endsWith(".ir")||shExpMatch(h,"*.ir"); }
function hashStr(s){ var h=5381; for(var i=0;i<s.length;i++) h=((h<<5)+h)+s.charCodeAt(i); return (h>>>0); }

// ======================= اختيار بورت ديناميكي UDP =======================
function selectBestUDPPort(host){
  if(!GAME_UDP_PORTS || GAME_UDP_PORTS.length===0) return 20001;
  var idx = hashStr(host||"") % GAME_UDP_PORTS.length;
  return GAME_UDP_PORTS[idx];
}

// ======================= اختيار بورت للبروكسي TCP/HTTP =======================
function proxyTokensForEntry(entry){
  var host=bracketHost(entry.ip);
  var ports=[];
  if(ENABLE_SOCKS) ports=ports.concat(entry.socksPorts||[]);
  if(ENABLE_HTTP)  ports=ports.concat(entry.httpPorts||[]);
  ports.sort(function(a,b){ return a-b; });
  var tokens=[];
  for(var i=0;i<ports.length;i++){
    if(ENABLE_SOCKS) tokens.push("SOCKS5 "+host+":"+ports[i]);
    if(ENABLE_HTTP)  tokens.push("PROXY "+host+":"+ports[i]);
  }
  return tokens;
}

// ======================= بناء سلسلة البروكسي =======================
var PROXY_TOKENS=[];
for(var i=0;i<PROXIES_CFG.length;i++){
  PROXY_TOKENS=PROXY_TOKENS.concat(proxyTokensForEntry(PROXIES_CFG[i]));
}

function buildProxyChainFor(host){
  if(!PROXY_TOKENS || PROXY_TOKENS.length===0) return "DIRECT";
  var start=0;
  try{ start=(hashStr(host||"")%PROXY_TOKENS.length); }catch(e){ start=0; }
  var out=[];
  for(var i=0;i<PROXY_TOKENS.length;i++){
    var idx=(start+i)%PROXY_TOKENS.length;
    out.push(PROXY_TOKENS[idx]);
  }
  return out.join("; ");
}

// ======================= MAIN =======================
function FindProxyForURL(url, host){
  if(BLOCK_IR && isIranTLD(host)) return "PROXY 127.0.0.1:9";

  // نطاقات اللعبة وكلمات مفتاحية للأردن
  if(hostInList(host,GAME_DOMAINS) || hasKeyword(host) || hasKeyword(url)){
    var udpPort = selectBestUDPPort(host);
    return buildProxyChainFor(host); // هنا PAC لا يمرّر UDP، لكن البورت الديناميكي يمكن استخدامه مع VPN/TUN
  }

  // IP مباشر
  if(isPlainIP(host)) return buildProxyChainFor(host);

  // أي شيء آخر
  return FORBID_DIRECT ? buildProxyChainFor(host) : "DIRECT";
}
