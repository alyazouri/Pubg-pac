// ======================================================
// PAC – PUBG Mobile الأردن (محلي) + UDP / HTTP Proxy
// ======================================================

var FORCE_ALL = true;       // إجبار كل الاتصالات على البروكسي
var BLOCK_IR = true;         // حظر نطاقات .ir
var ENABLE_SOCKS = true;     // تفعيل SOCKS5
var ENABLE_HTTP = true;      // تفعيل HTTP Proxy

// البروكسي المحلي + بورتات UDP للعبة
var FIXED_PROXY = {
  ip: "91.106.109.12",
  socksPorts: [20000, 20001, 20002, 40000, 40001, 8000, 8001, 30000],
  httpPorts: [8080,8081,8085,8087,8088,8880],
  http3: true
};

// دومينات اللعبة والمحلية
var GAME_DOMAINS = [
  "igamecj.com","igamepubg.com","pubgmobile.com","tencentgames.com",
  "proximabeta.com","proximabeta.net","tencentyun.com","qcloud.com",
  "qcloudcdn.com","gtimg.com","game.qq.com","cdn-ota.qq.com",
  "cdngame.tencentyun.com","gcloud.qq.com"
];
var LOCAL_DOMAINS = [
  "pubg.jo","jo-gaming.net","localmatch.pubg.com","matchmaking.jo","pubg-local.jo","jo-server.pubg.com"
];
var KEYWORDS = ["pubg","tencent","proximabeta","tencentyun","qcloud","gcloud"];

// ======================= HELPERS =======================
function bracketHost(ip){
  return (ip.indexOf(":")!==-1 && ip.indexOf(".")===-1) ? "["+ip+"]" : ip;
}
function hostInList(h,list){
  h = (h||"").toLowerCase();
  for(var i=0;i<list.length;i++){
    var d = list[i].toLowerCase();
    if(h === d || h === d + ":" || h.indexOf("."+d) !== -1 || shExpMatch(h, "*."+d) || dnsDomainIs(h, d)){
      return true;
    }
  }
  return false;
}
function hasKeyword(s){
  s = (s||"").toLowerCase();
  for(var i=0;i<KEYWORDS.length;i++){
    if(s.indexOf(KEYWORDS[i]) !== -1) return true;
  }
  return false;
}
function isIranTLD(host){
  host = (host||"").toLowerCase();
  return host === "ir" || host.slice(-3) === ".ir" || host.indexOf(".ir.")!==-1;
}

// ======================= BUILD PROXY =======================
function buildTokens(proxy){
  if(!proxy) return [];
  var toks = [];
  var host = bracketHost(proxy.ip);

  if(ENABLE_SOCKS){
    var sp = proxy.socksPorts || [];
    for(var s=0;s<sp.length;s++){
      toks.push("SOCKS5 " + host + ":" + sp[s]);
    }
  }
  if(ENABLE_HTTP){
    var hp = proxy.httpPorts || [];
    for(var h=0; h<hp.length; h++){
      toks.push("PROXY " + host + ":" + hp[h]);
    }
  }
  return toks;
}

function buildProxyChain(){
  var all = buildTokens(FIXED_PROXY);
  return (all.length === 0) ? "PROXY 127.0.0.1:9" : all.join("; ");
}

// ======================= MAIN =======================
function FindProxyForURL(url, host){
  host = host || url;

  // حظر نطاقات إيران
  if(BLOCK_IR && isIranTLD(host)) return "PROXY 127.0.0.1:9";

  // دومينات اللعبة أو كلمات مفتاحية
  if(hostInList(host, GAME_DOMAINS) || hostInList(host, LOCAL_DOMAINS) || hasKeyword(host) || hasKeyword(url)){
    return buildProxyChain();
  }

  // باقي المواقع إجبارياً عبر البروكسي
  if(FORCE_ALL) return buildProxyChain();

  // fallback: قطع الاتصال
  return "PROXY 127.0.0.1:9";
}
