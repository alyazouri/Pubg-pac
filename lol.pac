// ======================= CONFIG =======================
var PROXIES_CFG = [
    { ip: "2a13:a5c7:25ff:7000", socksPorts: [1080], httpPorts:[3128] }, // IPv6 رئيسي
    { ip: "2a01:4f8:c17:2e3f::1", socksPorts: [1080], httpPorts:[3128] }, // IPv6 احتياطي
    { ip: "91.106.109.12", socksPorts: [1080], httpPorts:[3128] },       // IPv4 رئيسي
    { ip: "213.186.179.25", socksPorts: [1080], httpPorts:[3128] }        // IPv4 احتياطي
];

var FORCE_ALL = true;        // كل الإنترنت يمر عبر البروكسي
var FORBID_DIRECT = true;    // منع الاتصال المباشر
var ROTATE_INTERVAL = 180000; // أطول زمن لتقليل التقطعات

// ======================= HELPERS =======================
function isIPv6Literal(h){ return h && h.indexOf(":") !== -1; }

function proxyTokensFor(ip,socksPorts,httpPorts){
    var host = isIPv6Literal(ip) ? "["+ip+"]" : ip, out=[];
    for(var i=0;i<socksPorts.length;i++) out.push("SOCKS5 "+host+":"+socksPorts[i]);
    for(var j=0;j<httpPorts.length;j++) out.push("PROXY "+host+":"+httpPorts[j]);
    return out;
}

// إنشاء قائمة البروكسيات
var PROXY_LIST = (function(){
    var list=[];
    for(var i=0;i<PROXIES_CFG.length;i++){
        var p = PROXIES_CFG[i];
        var toks = proxyTokensFor(p.ip,p.socksPorts||[],p.httpPorts||[]);
        for(var k=0;k<toks.length;k++) list.push(toks[k]);
    }
    return list;
})();

// حفظ البروكسي الأفضل لكل دومين
var LAST_SUCCESS = {};

// ======================= DYNAMIC PROXY CHAIN =======================
function buildProxyChain(host){
    var sortedProxies = PROXY_LIST.slice();

    // إذا كان هناك بروكسي ناجح مسبقًا، ضعه أولًا
    if(LAST_SUCCESS[host] !== undefined){
        var first = sortedProxies.splice(LAST_SUCCESS[host],1)[0];
        sortedProxies.unshift(first);
    } else {
        // ترتيب ذكي: IPv6 أولًا ثم IPv4
        sortedProxies.sort(function(a,b){ return a.indexOf("[")===0?-1:1; });
    }

    if(!FORBID_DIRECT) sortedProxies.push("DIRECT");
    return sortedProxies.join("; ");
}

// ======================= MAIN =======================
function FindProxyForURL(url, host){
    // كل الإنترنت يمر عبر البروكسي الأفضل لكل دومين
    var proxyChain = buildProxyChain(host);

    // افتراض البروكسي الأول الأسرع لكل دومين، يمكن تحديثه لاحقًا عند نجاح آخر اتصال
    LAST_SUCCESS[host] = 0;

    return proxyChain;
}
