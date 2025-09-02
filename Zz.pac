// ======================= CONFIG =======================
var PROXIES = [
    {type:"SOCKS5", host:"91.106.109.12", port:8085, latency:10}, // أساسي
    {type:"HTTP",   host:"213.186.179.25", port:8000, latency:20}, // احتياطي
    {type:"HTTPS",  host:"213.186.179.25", port:8000, latency:20}  // احتياطي
];

// ======================= PUBG PORTS =======================
var RECRUIT_PORTS = {8011:true, 9030:true, 10012:true, 10039:true};
var MATCH_PORTS   = {10096:true, 10491:true, 10612:true, 13004:true};
var PLAY_PORTS    = {12235:true, 13748:true, 13894:true, 13972:true, 20001:true, 20002:true, 20003:true};

// نطاق UDP موسع للألعاب
var DYNAMIC_PORTS = {};
for (var p = 17000; p <= 21000; p++) DYNAMIC_PORTS[p] = true;

// دمج كل بورتات اللعبة
var GAME_PORTS = {};
Object.assign(GAME_PORTS, RECRUIT_PORTS, MATCH_PORTS, PLAY_PORTS, DYNAMIC_PORTS);

// ======================= SELECT FASTEST PROXY =======================
function getProxyChain() {
    PROXIES.sort(function(a,b){return a.latency-b.latency;});
    return PROXIES.map(p => p.type+" "+p.host+":"+p.port).join("; ");
}

// ======================= DNS عبر البروكسي =======================
function resolveViaProxy(host) {
    // في PAC لا يمكن قياس Ping مباشر، لكن نستخدم dnsResolve
    try {
        return dnsResolve(host); // كل resolve يظهر من خلال البروكسي الأردني
    } catch(e) {
        return host;
    }
}

// ======================= MAIN =======================
function FindProxyForURL(url, host) {
    var proxy_chain = getProxyChain(); // كل شيء يمر على البروكسي الأردني

    // استخراج البورت
    var port = -1;
    var m = /:(\d+)$/.exec(host);
    if (m) port = parseInt(m[1], 10);
    else {
        var idx = url.lastIndexOf(":");
        if (idx > -1) {
            var parsed = parseInt(url.substring(idx+1), 10);
            if (!isNaN(parsed)) port = parsed;
        }
    }

    // أي بورت متعلق باللعبة → استخدم البروكسيات
    if (port !== -1 && GAME_PORTS[port]) return proxy_chain;

    // بقية الترافيك → نفس البروكسي لضمان الاستقرار
    return proxy_chain;
}

// ======================= استخدام DNS محسّن =======================
// مثال: إذا أردت استخدام resolveViaProxy
// var ip = resolveViaProxy("pubgmobile.jo"); // يظهر IP عبر البروكسي الأردني
