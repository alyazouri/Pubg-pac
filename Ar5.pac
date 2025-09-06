// ======================================================================
// PAC – PUBG Mobile الأردن: Ultra Smart Local + Backup Proxy + HTTP/3 Ready
// ======================================================================

// ======================= CONFIG =======================
var FORCE_ALL        = true;
var FORBID_DIRECT    = true;
var BLOCK_IR         = true;
var ENABLE_SOCKS     = true;
var ENABLE_HTTP      = true;
var ORDER_IPV6_FIRST = false;
var MAX_ACTIVE_PROXIES = 2;

// ======================= PROXIES =======================
var PROXIES_CFG = [
  { 
    ip: "91.106.109.12",
    socksPorts: [20000,20001,20003],
    httpPorts: [8080,8081,8085,8087,8088,8880],
    http3: true // جاهز لاستخدام HTTP/3 على مستوى البروكسي
  },
  { 
    ip: "91.106.109.11",
    socksPorts: [20000,20001,20003],
    httpPorts: [8080,8081,8085,8087,8088,8880],
    http3: true
  }
];

// ======================= GAME DOMAINS =======================
var GAME_DOMAINS = [
  "igamecj.com","igamepubg.com","pubgmobile.com","tencentgames.com",
  "proximabeta.com","proximabeta.net","tencentyun.com","qcloud.com",
  "qcloudcdn.com","gtimg.com","game.qq.com","cdn-ota.qq.com","cdngame.tencentyun.com","gcloud.qq.com"
];

// ======================= LOCAL DOMAINS =======================
var LOCAL_DOMAINS = [
  "pubg.jo",
  "jo-gaming.net",
  "localmatch.pubg.com",
  "matchmaking.jo",
  "pubg-local.jo",
  "jo-server.pubg.com"
];

var KEYWORDS = ["pubg","tencent","proximabeta","tencentyun","qcloud","gcloud"];

// ======================= HELPERS =======================
function isIPv6Literal(h){ return h && h.indexOf(":")!==-1 && h.indexOf(".")===-1; }
function bracketHost(ip){ return isIPv6Literal(ip) ? "["+ip+"]" : ip; }
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
function isIranTLD(h){ h=(h||"").toLowerCase(); return h.endsWith(".ir") || shExpMatch(h,"*.ir"); }
function dedup(arr){
  var seen={}, out=[];
  for(var i=0;i<arr.length;i++){ var k=arr[i]; if(!seen[k]){ seen[k]=1; out.push(k); } }
  return out;
}

// ======================= SCORING =======================
var PROXY_SCORE = {};
function evaluateProxy(ip){
  if(PROXY_SCORE[ip]===undefined){
    switch(ip){
      case "91.106.109.12": PROXY_SCORE[ip]=0; break;
      case "91.106.109.11": PROXY_SCORE[ip]=1; break;
      default: PROXY_SCORE[ip]=5;
    }
  }
  return PROXY_SCORE[ip];
}

// ======================= SORT PROXIES =======================
function sortProxies(){
  var arr = PROXIES_CFG.slice();
  arr.sort(function(a,b){
    var sa=evaluateProxy(a.ip), sb=evaluateProxy(b.ip);
    if(sa!==sb) return sa-sb;
    var a6=isIPv6Literal(a.ip), b6=isIPv6Literal(b.ip);
    if(!ORDER_IPV6_FIRST){
      if(a6&&!b6) return 1;
      if(!a6&&b6) return -1;
    }else{
      if(a6&&!b6) return -1;
      if(!a6&&b6) return 1;
    }
    return 0;
  });
  return arr.slice(0, MAX_ACTIVE_PROXIES);
}

// ======================= SELECT BEST PROXY =======================
function selectFastestProxy(url){
  var ordered = sortProxies();
  for(var i=0;i<ordered.length;i++){
    if(ordered[i].ip==="91.106.109.12") return ordered[i];
  }
  return ordered[0];
}

// ======================= BUILD TOKENS =======================
function buildTokens(proxy){
  var toks=[];
  var host=bracketHost(proxy.ip);
  if(ENABLE_SOCKS){
    for(var s=0;s<(proxy.socksPorts||[]).length;s++)
      toks.push("SOCKS5 "+host+":"+proxy.socksPorts[s]);
  }
  if(ENABLE_HTTP){
    for(var h=0;h<(proxy.httpPorts||[]).length;h++){
      if(proxy.http3){
        toks.push("PROXY "+host+":"+proxy.httpPorts[h]+"; HTTP/3 Ready");
      }else{
        toks.push("PROXY "+host+":"+proxy.httpPorts[h]);
      }
    }
  }
  return dedup(toks);
}

// ======================= BUILD PROXY CHAIN =======================
function buildProxyChain(url){
  var bestProxy=selectFastestProxy(url);
  return buildTokens(bestProxy).join("; ");
}

// ======================= MAIN =======================
function FindProxyForURL(url, host){
  host = host || url;

  if(BLOCK_IR && isIranTLD(host)) return "PROXY 127.0.0.1:9";

  if(hostInList(host,GAME_DOMAINS) || hostInList(host,LOCAL_DOMAINS) || hasKeyword(host) || hasKeyword(url)){
    return buildProxyChain(url);
  }

  if(FORCE_ALL) return buildProxyChain(url);

  return "DIRECT";
}
