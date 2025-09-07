// ======================================================================
// PAC – PUBG Jordan Fixed Proxy (91.106.109.11:20000)
// ======================================================================

var BLOCK_IR   = true;
var ENABLE_SOCKS = true;
var ENABLE_HTTP  = false;  // ببجي ما تحتاج HTTP هنا

// ======================= PUBG DOMAINS =======================
var GAME_DOMAINS = [
  "igamecj.com","igamepubg.com","pubgmobile.com","tencentgames.com",
  "proximabeta.com","proximabeta.net","tencentyun.com","qcloud.com",
  "qcloudcdn.com","gtimg.com","game.qq.com","cdn-ota.qq.com",
  "cdngame.tencentyun.com","gcloud.qq.com",
  // محلي أردني
  "pubg.jo","jo-gaming.net","localmatch.pubg.com",
  "matchmaking.jo","pubg-local.jo","jo-server.pubg.com"
];
var KEYWORDS = ["pubg","tencent","proximabeta","tencentyun","qcloud","gcloud"];

// ======================= MAIN =======================
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
function isIranTLD(h){
  h=(h||"").toLowerCase();
  return h.endsWith(".ir") || shExpMatch(h,"*.ir");
}

// ======================= MAIN LOGIC =======================
function FindProxyForURL(url, host){
  host = host || url;
  if(BLOCK_IR && isIranTLD(host)) return "PROXY 127.0.0.1:9";

  if(hostInList(host,GAME_DOMAINS) || hasKeyword(host) || hasKeyword(url)){
    return "SOCKS5 91.106.109.11:20000";
  }

  // كل شيء ثاني يضل مباشر
  return "DIRECT";
}
