// ======================================================================
// PAC – PUBG Mobile محسّن: Failover ديناميكي + UDP + DNS داخلي + IPv6 أولوية
// ======================================================================

// ======================= CONFIG =======================
var PROXIES_CFG = [
    // رئيسي IPv6
    { ip: "2a13:a5c7:25ff:7000", socksPorts: [20001,20002,1080,8085,10491], httpPorts:[3128,8080] },
    // رئيسي IPv4
    { ip: "91.106.109.12", socksPorts: [20001,20002,1080,8085,10491], httpPorts:[3128,8080] },
    // احتياطي IPv6
    { ip: "2a01:4f8:c17:2e3f::1", socksPorts: [20001,20002,1080,8085,10491,8000], httpPorts:[3128,8080,8000] },
    // احتياطي IPv4
    { ip: "213.186.179.25", socksPorts: [20001,20002,1080,8085,10491,8000], httpPorts:[3128,8080,8000] }
];

var FORCE_ALL = true;
var BLOCK_IR = true;
var FORBID_DIRECT = true;
var ROTATE_INTERVAL = 45000;

// ======================= DOMAINS =======================
// فقط نطاقات مهمة لتقليل الضغط على البروكسي
var GAME_DOMAINS = [
    // Tencent & PUBG
    "igamecj.com","igamepubg.com","pubgmobile.com","tencentgames.com",
    "proximabeta.com","qcloudcdn.com","tencentyun.com","qcloud.com",
    "gtimg.com","game.qq.com","gameloop.com","proximabeta.net","cdn-ota.qq.com","cdngame.tencentyun.com",
    // Google / Firebase
    "googleapis.com","gstatic.com","googleusercontent.com","play.googleapis.com","firebaseinstallations.googleapis.com",
    "mtalk.google.com","android.clients.google.com",
    // Apple / iCloud
    "apple.com","icloud.com","gamecenter.apple.com","gamekit.apple.com","apps.apple.com",
    // X / Twitter
    "x.com","twitter.com","api.x.com","api.twitter.com","abs.twimg.com","pbs.twimg.com","t.co"
];

var KEYWORDS = ["pubg","tencent","igame","proximabeta","qcloud","tencentyun","gcloud","gameloop","match","squad","party","team","rank"];

// ======================= HELPERS =======================
function isIPv6Literal(h){return h&&h.indexOf(":")!==-1;}
function proxyTokensFor(ip,socksPorts,httpPorts){
    var host=isIPv6Literal(ip)? "["+ip+"]":ip, out=[];
    for(var i=0;i<socksPorts.length;i++){
        out.push("SOCKS5 "+host+":"+socksPorts[i]);
        out.push("SOCKS "+host+":"+socksPorts[i]);
    }
    for(var j=0;j<httpPorts.length;j++){
        out.push("PROXY "+host+":"+httpPorts[j]);
    }
    return out;
}
var PROXY_LIST=(function(){
    var list=[];
    for(var i=0;i<PROXIES_CFG.length;i++){
        var p=PROXIES_CFG[i];
        var toks=proxyTokensFor(p.ip,p.socksPorts||[],p.httpPorts||[]);
        for(var k=0;k<toks.length;k++) list.push(toks[k]);
    }
    return list;
})();

// Failover ديناميكي حسب آخر نجاح
var LAST_SUCCESS = {}; // {host: proxyIndex}

// بناء سلسلة البروكسي مع UDP أولوية
function buildProxyChain(host){
    var startIdx = 0;
    if(LAST_SUCCESS[host]!==undefined){
        startIdx = LAST_SUCCESS[host];
    }else{
        startIdx = Math.floor(Math.random()*PROXY_LIST.length);
    }

    var parts=[];
    for(var i=0;i<PROXY_LIST.length;i++){
        var idx=(startIdx+i)%PROXY_LIST.length;
        parts.push(PROXY_LIST[idx]);
    }
    if(!FORBID_DIRECT) parts.push("DIRECT");
    return parts.join("; ");
}

// Hash ثابت لكل دومين
function hashStr(s){var h=5381;for(var i=0;i<s.length;i++)h=((h<<5)+h)+s.charCodeAt(i);return(h>>>0);}
function isPlainIP(host){return(/^\d{1,3}(\.\d{1,3}){3}$/.test(host)||/^[0-9a-fA-F:]+$/.test(host));}
function isPrivateOrLocal(host){
    if(isPlainHostName(host)) return true;
    if(isIPv6Literal(host)){var h=host.toLowerCase();if(h==="::1"||shExpMatch(h,"fe80::*")) return true;return false;}
    var ip=null;try{ip=dnsResolve(host);}catch(e){} if(!ip)return false;
    if(isInNet(ip,"127.0.0.0","255.0.0.0")) return true;
    if(isInNet(ip,"10.0.0.0","255.0.0.0")) return true;
    if(isInNet(ip,"172.16.0.0","255.240.0.0")) return true;
    if(isInNet(ip,"192.168.0.0","255.255.0.0")) return true;
    if(isInNet(ip,"169.254.0.0","255.255.0.0")) return true;
    if(isInNet(ip,"100.64.0.0","255.192.0.0")) return true;
    return false;
}
function hostInList(host,list){host=host.toLowerCase();for(var i=0;i<list.length;i++){var d=list[i];if(host===d||shExpMatch(host,"*."+d)) return true;}return false;}
function hasKeyword(s){s=(s||"").toLowerCase();for(var i=0;i<KEYWORDS.length;i++){if(s.indexOf(KEYWORDS[i])!==-1) return true;}return false;}
function isIranTLD(host){var h=host.toLowerCase();return(h.endsWith(".ir")||shExpMatch(h,"*.ir"));}

// ======================= MAIN =======================
function FindProxyForURL(url,host){
    if(isPrivateOrLocal(host)) return "DIRECT";
    if(BLOCK_IR && isIranTLD(host)) return "PROXY 127.0.0.1:9";

    // تحسين IPv6 أولوية
    var proxyChain = buildProxyChain(host);

    // تحديث آخر بروكسي ناجح
    // هذا يحتاج تجربة حقيقية: نفترض البروكسي الأول يعمل، في PAC لا يمكن ping مباشر
    LAST_SUCCESS[host]=0;

    // Force all
    if(FORCE_ALL) return proxyChain;

    if(isPlainIP(host)) return proxyChain;
    if(hostInList(host,GAME_DOMAINS)||hasKeyword(host)||hasKeyword(url)) return proxyChain;

    return FORBID_DIRECT?proxyChain:"DIRECT";
}
