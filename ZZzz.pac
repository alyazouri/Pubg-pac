// ======================= CONFIG =======================
var PROXY_HOST = "91.106.109.12";   // IP أردني
var PORTS = [8085, 10491, 20001, 20002]; // بورتات مرشحة
var BEST_PORT = PORTS[0];           // الافتراضي
var LAST_CHECK = 0;                 // آخر مرة تم فيها فحص البورتات
var CHECK_INTERVAL = 1000;          // كل 1 ثانية يعيد اختيار الأفضل

// ======================= Jordan IP Ranges =======================
var JORDAN_IP_PREFIXES = [
    "91.106.", "82.212.", "87.236.", "185.5.", "185.28."
];

// ======================= PUBG PORTS =======================
var GAME_PORTS = (function(){
    var ports = {
        7086:true, 8011:true, 9030:true,
        10010:true,10011:true,10012:true,10013:true,
        10039:true,10096:true,10491:true,10612:true,
        8085:true,8088:true,12235:true,
        13004:true,13748:true,13894:true,13972:true,
        17000:true,18081:true,
        20000:true,20001:true,20002:true,20003:true
    };
    for (var p=7000; p<=22000; p++) ports[p] = true;
    return ports;
})();

// ======================= DNS Override =======================
var FIXED_DNS = [
    "82.212.64.20",   // Orange Jordan
    "87.236.233.3",   // Zain Jordan
    "8.8.8.8"         // Google Local (موجود سيرفر بالأردن)
];

function jordanResolve(host) {
    var ip = null;
    for (var i=0; i<FIXED_DNS.length; i++) {
        try { ip = dnsResolve(host); } catch(e) {}
        if (ip) break;
    }
    return ip;
}

// ======================= فحص إذا الايبي أردني =======================
function isJordanIP(ip) {
    for (var i=0; i<JORDAN_IP_PREFIXES.length; i++) {
        if (ip.indexOf(JORDAN_IP_PREFIXES[i]) === 0) return true;
    }
    return false;
}

// ======================= اختيار البورت الأفضل =======================
function chooseBestPort() {
    var now = new Date().getTime();
    if (now - LAST_CHECK < CHECK_INTERVAL) return; // لسه ضمن الفترة
    LAST_CHECK = now;

    var best = PORTS[0];
    var bestTime = 999999;

    for (var i=0; i<PORTS.length; i++) {
        var p = PORTS[i];
        var start = new Date().getTime();
        try { jordanResolve(PROXY_HOST + ":" + p); } catch(e) {}
        var end = new Date().getTime();
        var elapsed = end - start;

        if (elapsed < bestTime) {
            bestTime = elapsed;
            best = p;
        }
    }
    BEST_PORT = best;
}

// ======================= MAIN =======================
function FindProxyForURL(url, host) {
    chooseBestPort(); // تأكد دايمًا تختار الأفضل

    var ip = jordanResolve(host);
    var port = -1, m = /:(\d+)$/.exec(host);
    if (m) port = parseInt(m[1],10);

    // إذا الهدف أردني → Direct (بيور)
    if (ip && isJordanIP(ip)) {
        return "DIRECT";
    }

    // إذا PUBG → استخدم البروكسي الأردني بأفضل بورت
    if (port !== -1 && GAME_PORTS[port]) {
        return "SOCKS5 " + PROXY_HOST + ":" + BEST_PORT;
    }

    // fallback
    return "SOCKS5 " + PROXY_HOST + ":" + BEST_PORT;
}
