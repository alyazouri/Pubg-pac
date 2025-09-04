// ======================= CONFIG =======================
var PROXY_HOSTS = ["91.106.109.12", "2a13:a5c7:25ff:7000"]; // IPv4 + IPv6 أردني
var PORTS = [8085, 10491, 20001, 20002];
var BEST_PROXY = PROXY_HOSTS[0];
var BEST_PORT = PORTS[0];
var LAST_CHECK = 0;
var CHECK_INTERVAL = 5000; // كل 5 ثواني يعيد التقييم

// ======================= Force Local DNS =======================
var FIXED_DNS = ["82.212.64.20","87.236.233.3"]; // Orange + Zain
function jordanResolve(host) {
    var ip = null;
    for (var i=0; i<FIXED_DNS.length; i++) {
        try { ip = dnsResolve(host); } catch(e) {}
        if (ip) break;
    }
    if (!ip) ip = "0.0.0.0"; // fallback دائم
    return ip;
}

// ======================= PUBG Domains & Ports =======================
var PUBG_DOMAINS = [
    "igamecj.com","igamepubg.com","pubgmobile.com","tencentgames.com",
    "proximabeta.com","gcloudsdk.com","qq.com","qcloudcdn.com"
];
var GAME_PORTS = {};
for (var p=7000; p<=22000; p++) GAME_PORTS[p] = true;

// ======================= Proxy Monitoring =======================
var PROXY_STATUS = {}; // تخزين آخر زمن ping لكل بروكسي وبورت

function chooseBestProxyForHost(host) {
    var bestProxy = BEST_PROXY;
    var bestPort = BEST_PORT;
    var bestTime = 999999;

    for (var i=0; i<PROXY_HOSTS.length; i++) {
        var proxy = PROXY_HOSTS[i];
        for (var j=0; j<PORTS.length; j++) {
            var port = PORTS[j];
            var ping = 999999;
            try {
                var start = new Date().getTime();
                jordanResolve(proxy+":"+port);
                ping = new Date().getTime() - start;
            } catch(e) {}
            PROXY_STATUS[proxy+":"+port] = ping;

            // اختيار البروكسي الأفضل للبنق
            if (ping < bestTime) {
                bestTime = ping;
                bestProxy = proxy;
                bestPort = port;
            }
        }
    }

    // تحديث البروكسي العالمي للبروكسي الأفضل
    BEST_PROXY = bestProxy;
    BEST_PORT = bestPort;

    // إعادة البروكسي الأفضل لهذا host
    return bestProxy.indexOf(":")>-1 ?
        "SOCKS5 [" + bestProxy + "]:" + bestPort :
        "SOCKS5 " + bestProxy + ":" + bestPort;
}

// ======================= MAIN =======================
function FindProxyForURL(url, host) {
    var now = new Date().getTime();
    if (now - LAST_CHECK > CHECK_INTERVAL) LAST_CHECK = now;

    // أي اتصال → إجبار على البروكسي الأردني
    return chooseBestProxyForHost(host);
}
