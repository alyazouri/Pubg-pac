// ======================================================================
// PAC – PUBG Mobile الأردن: أقل بنق + Failover كامل
// ملاحظة: PAC لا يمرّر UDP. لأفضل بنق فعلي استخدم VPN/TUN يدعم UDP.
// ======================================================================

// ======================= CONFIG =======================
var FORCE_ALL        = true;   // true: وجّه كل الترافيك عبر البروكسي
var FORBID_DIRECT    = true;   // true: لا تضف DIRECT في نهاية السلسلة
var BLOCK_IR         = true;   // حجب نطاقات .ir
var ENABLE_SOCKS     = true;   // فعّل SOCKS (على iOS غالباً يُتجاهل)
var ENABLE_HTTP      = true;   // فعّل HTTP Proxy
var ORDER_IPV6_FIRST = true;   // فضّل IPv6 أولاً داخل نفس التقييم

// ======================= PROXIES =======================
var PROXIES_CFG = [
  { ip: "91.106.109.12",       socksPorts: [8085,8086,8087,8088,20001,20002,10491], httpPorts: [80,443,8080,3128] },
  { ip: "2a13:a5c7:25ff:7000", socksPorts: [8085,8086,8087,8088,20001,20002,10491], httpPorts: [80,443,8080,3128] }
];

// ======================= GAME DOMAINS =======================
var GAME_DOMAINS = [
  "igamecj.com","igamepubg.com","pubgmobile.com","tencentgames.com",
  "proximabeta.com","proximabeta.net","tencentyun.com","qcloud.com",
  "qcloudcdn.com","gtimg.com","game.qq.com","cdn-ota.qq.com","cdngame.tencentyun.com","gcloud.qq.com"
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

// ======================= SCORING/ORDER =======================
var PROXY_SCORE = {}; // ip -> score منخفض أفضل
function evaluateProxy(ip){
  if (PROXY_SCORE[ip] === undefined){
    PROXY_SCORE[ip] = (ip === "91.106.109.12") ? 1 : 2; // IPv4 الأردني أفضل
  }
  return PROXY_SCORE[ip];
}
function sortProxies(){
  var arr = PROXIES_CFG.slice();
  arr.sort(function(a,b){
    var sa = evaluateProxy(a.ip), sb = evaluateProxy(b.ip);
    if (sa !== sb) return sa - sb;
    var a6 = isIPv6Literal(a.ip), b6 = isIPv6Literal(b.ip);
    if (ORDER_IPV6_FIRST){
      if (a6 && !b6) return -1;
      if (!a6 && b6) return 1;
    } else {
      if (a6 && !b6) return 1;
      if (!a6 && b6) return -1;
    }
    return 0;
  });
  return arr;
}
function orderPorts(ports, preferred){
  var out=[], used={};
  for (var i=0;i<preferred.length;i++){
    var p = preferred[i];
    for (var j=0;j<ports.length;j++){
      if (ports[j] === p && !used[p]){ out.push(p); used[p]=1; }
    }
  }
  for (var k=0;k<ports.length;k++){
    var v = ports[k];
    if (!used[v]){ out.push(v); used[v]=1; }
  }
  return out;
}

// ======================= TOKEN BUILD =======================
function buildTokens(){
  var preferredSocks = [8085,8086,8087,8088,20001,20002,10491];
  var toks = [];
  var ordered = sortProxies();
  for (var i=0;i<ordered.length;i++){
    var e = ordered[i];
    var host = bracketHost(e.ip);
    if (ENABLE_SOCKS){
      var ss = orderPorts(e.socksPorts||[], preferredSocks);
      for (var s=0;s<ss.length;s++){
        toks.push("SOCKS5 " + host + ":" + ss[s]);
        toks.push("SOCKS "  + host + ":" + ss[s]);
      }
    }
    if (ENABLE_HTTP){
      var hp = e.httpPorts||[];
      for (var h=0;h<hp.length;h++){
        toks.push("PROXY " + host + ":" + hp[h]);
      }
    }
  }
  return dedup(toks);
}
var PROXY_TOKENS = buildTokens();

function buildProxyChain(){
  if (!PROXY_TOKENS || PROXY_TOKENS.length === 0) return "DIRECT";
  var out = PROXY_TOKENS.slice(0);
  if (!FORBID_DIRECT) out.push("DIRECT");
  return out.join("; ");
}

// ======================= MAIN =======================
function FindProxyForURL(url, host){
  host = host || url;

  // حجب .ir
  if (BLOCK_IR && isIranTLD(host)) return "PROXY 127.0.0.1:9";

  var chain = buildProxyChain();

  // نطاقات اللعبة أو كلمات مفتاحية
  if (hostInList(host, GAME_DOMAINS) || hasKeyword(host) || hasKeyword(url)) return chain;

  if (FORCE_ALL) return chain;

  return "DIRECT";
}
