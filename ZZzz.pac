// ======================= CONFIG =======================
var PROXY_HOST = "91.106.109.12";
var PORTS = [8085, 10491];  // بورتات المرشحة
var BEST_PORT = PORTS[0];   // الافتراضي أولاً

// ======================= PUBG PORTS =======================
var GAME_PORTS = (function(){
    var ports = {
        // Recruit & Lobby
        7086:true, 8011:true, 9030:true,
        // Matchmaking
        10010:true, 10011:true, 10012:true, 10013:true,
        10039:true, 10096:true, 10491:true, 10612:true,
        // Voice & Chat
        8085:true, 8088:true, 12235:true,
        // Data / Sync
        13004:true, 13748:true, 13894:true, 13972:true,
        // Core Gameplay
        17000:true, 18081:true,
        20000:true, 20001:true, 20002:true, 20003:true
    };
    // نطاق UDP أوسع (7000 - 22000)
    for (var p=7000; p<=22000; p++) ports[p] = true;
    return ports;
})();

// ======================= Fail Counter =======================
if (typeof __proxyFail === "undefined") __proxyFail = 0;

// ======================= اختيار البورت حسب البنق =======================
function chooseBestPort() {
    var best = PORTS[0];
    var bestTime = 999999;

    for (var i=0; i<PORTS.length; i++) {
        var p = PORTS[i];
        var start = new Date().getTime();
        try {
            dnsResolve(PROXY_HOST); // اختبار سرعة حل DNS
        } catch(e) {}
        var end = new Date().getTime();
        var elapsed = end - start;

        if (elapsed < bestTime) {
            bestTime = elapsed;
            best = p;
        }
    }
    BEST_PORT = best;
}

chooseBestPort();

// ======================= MAIN =======================
function FindProxyForURL(url, host) {
    var port = -1, m = /:(\d+)$/.exec(host);
    if (m) port = parseInt(m[1],10);
    else {
        var idx = url.lastIndexOf(":");
        if (idx > -1) {
            var parsed = parseInt(url.substring(idx+1),10);
            if (!isNaN(parsed)) port = parsed;
        }
    }

    // أي بورت ضمن PUBG أو أي ترافيك آخر → استخدم البورت الأفضل حسب البنق
    if (port !== -1 && GAME_PORTS[port]) {
        return "SOCKS5 " + PROXY_HOST + ":" + BEST_PORT;
    }

    // fallback على نفس البورت الأفضل
    return "SOCKS5 " + PROXY_HOST + ":" + BEST_PORT;
}
