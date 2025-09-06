// ======================================================================
// PAC – PUBG Mobile محسّن: بنق مستقر + Failover ديناميكي + UDP + IPv6 أولوية
// ======================================================================

// ======================= CONFIG =======================
var PROXIES_CFG = [
    { ip: "2a13:a5c7:25ff:7000", socksPorts: [20001,20002,1080,8085,10491], httpPorts:[3128,8080] }, // رئيسي IPv6
    { ip: "91.106.109.12", socksPorts: [20001,20002,1080,8085,10491], httpPorts:[3128,8080] },   // رئيسي IPv4
    { ip: "2a01:4f8:c17:2e3f::1", socksPorts: [20001,20002,1080,8085,10491,8000], httpPorts:[3128,8080,8000] }, // احتياطي IPv6
    { ip: "213.186.179.25", socksPorts: [80,8000], httpPorts:[80,8000] } // احتياطي IPv4 مع بورتات ثابتة
];

var FORCE_ALL = true;
var BLOCK_IR = true;
var FORBID_DIRECT = true;
var ROTATE_INTERVAL = 45000;

// ======================= DOMAINS =======================
var GAME_DOMAINS = [
    "igamecj.com","igamepubg.com","pubgmobile.com","tencentgames.com",
    "proximabeta.com","qcloudcdn.com","tencentyun.com","qcloud.com",
    "gtimg.com","game.qq.com","gameloop.com","proximabeta.net","cdn-ota.qq.com","cdngame.tencentyun.com",
    "googleapis.com","gstatic.com","googleusercontent.com","play.googleapis.com","firebaseinstallations.googleapis.com",
    "mtalk.google.com","android.clients.google.com",
    "apple.com","icloud.com","gamecenter.apple.com","gamekit.apple.com","apps.apple.com",
    "x.com","twitter.com","api.x.com","abs.twimg.com","pbs.twimg.com","t.co"
];

var KEYWORDS = ["pubg","tencent","igame","proximabeta","qcloud","tencentyun","gcloud","gameloop","match","squad","party","team","rank"];

// ======================= Helpers =======================
function isIPv6Literal(h){ return h && h.indexOf(":") !== -1; }

function proxyTokensFor(ip,socksPorts,httpPorts){
    var host = isIPv6Literal(ip) ? "["+ip+"]" : ip, out = [];
    for(var i=0;i<socksPorts.length;i++){
        out.push("SOCKS5 "+host+":"+socksPorts[i]); // دعم UDP
        out.push("SOCKS "+host+":"+socksPorts[i]);
    }
    for(var j=0;j<httpPorts.length;j++){
        out.push("PROXY "+host+":"+httpPorts[j]);
    }
    return out;
}

var PROXY_LIST = (function(){
    var list = [];
    for(var i=0;i<PROXIES_CFG.length;i++){
        var p = PROXIES_CFG[i];
        var toks = proxyTokensFor(p.ip,p.socksPorts||[],p.httpPorts||[]);
        for(var k=0;k<toks.length;k++) list.push(toks[k]);
    }
    return list;
})();

// Failover ديناميكي حسب آخر نجاح
var LAST_SUCCESS = {}; // {host: proxyIndex}

// ترتيب البروكسي حسب آخر نجاح لضمان بنق مستقر
function buildProxyChain(host){
    var proxyOrder = PROXY_LIST.slice();
    if(LAST_SUCCESS[host] !== undefined){
        var last = proxyOrder.splice(LAST_SUCCESS[host],1)[0];
        proxyOrder.unshift(last);
    }
    return proxyOrder.join("; ") + "; DIRECT";
}

// تسجيل نجاح البروكسي الأخير للـ host
function markSuccess(host, proxyIndex){
    LAST_SUCCESS[host] = proxyIndex;
}

// ======================= Jordan IP Ranges =======================
var JORDAN_IP_RANGES = [
    {start: "46.185.0.0", end: "46.185.127.255"},
    {start: "188.247.0.0", end: "188.247.31.255"},
    {start: "185.34.0.0", end: "185.34.3.255"},
    {start: "37.202.0.0", end: "37.202.63.255"},
    {start: "79.173.128.0", end: "79.173.255.255"}
];

function ipToLong(ip){
    var parts = ip.split('.');
    return (parseInt(parts[0])<<24) + (parseInt(parts[1])<<16) + (parseInt(parts[2])<<8) + parseInt(parts[3]);
}

function isInJordanIPRange(ip){
    var ipNum = ipToLong(ip);
    for(var i=0;i<JORDAN_IP_RANGES.length;i++){
        var r = JORDAN_IP_RANGES[i];
        if(ipNum >= ipToLong(r.start) && ipNum <= ipToLong(r.end)) return true;
    }
    return false;
}

// ======================= Main PAC Function =======================
function FindProxyForURL(url, host){
    host = host.toLowerCase();

    if(BLOCK_IR && host.indexOf(".ir") !== -1) return "BLOCK";

    for(var i=0;i<GAME_DOMAINS.length;i++){
        if(shExpMatch(host,"*"+GAME_DOMAINS[i]+"*")) return buildProxyChain(host);
    }

    for(var k=0;k<KEYWORDS.length;k++){
        if(host.indexOf(KEYWORDS[k])!==-1) return buildProxyChain(host);
    }

    try{
        var ip = dnsResolve(host);
        if(ip && !isIPv6Literal(ip) && isInJordanIPRange(ip)){
            return FORBID_DIRECT ? "BLOCK" : "DIRECT";
        }
    }catch(e){
        return buildProxyChain(host);
    }

    if(FORCE_ALL) return buildProxyChain(host);

    return "DIRECT";
}
