// ======================= CONFIG =======================
// بروكسي أردني واحد: SOCKS5 أولاً، SOCKS4 كخيار ثاني
var PROXY_HOST = "91.106.109.12";
var PROXY_PORT = 8085;

// ======================= PUBG PORTS =======================
var GAME_PORTS = (function(){
    var ports = {
        // Recruit
        8011:true, 9030:true, 10012:true, 10039:true,
        // Match
        10096:true, 10491:true, 10612:true, 13004:true,
        // Play
        12235:true, 13748:true, 13894:true, 13972:true,
        20001:true, 20002:true, 20003:true
    };
    // نطاق UDP أوسع للألعاب (16000 - 22000)
    for (var p=16000; p<=22000; p++) ports[p] = true;
    return ports;
})();

// ======================= Fail Counter =======================
if (typeof __proxyFail === "undefined") __proxyFail = 0;

// اختيار البروكسي مع تبديل إذا فشل كثيرًا
function getJordanProxy() {
    if (__proxyFail >= 5) { // بعد 5 محاولات فشل
        __proxyFail = 0; // إعادة العداد
        return "SOCKS4 " + PROXY_HOST + ":" + PROXY_PORT;
    }
    return "SOCKS5 " + PROXY_HOST + ":" + PROXY_PORT;
}

// تسجيل الفشل (يمكن استخدام dnsResolve كمؤشر بسيط)
function registerFail() {
    __proxyFail++;
}

// ======================= DNS عبر البروكسي الأردني =======================
function resolveViaJordan(host) {
    try {
        return dnsResolve(host);
    } catch(e) {
        registerFail(); // زيادة عداد الفشل إذا DNS لم يحل
        return host;
    }
}

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

    // أي بورت ضمن PUBG أو نطاق UDP الموسع → استخدم البروكسي الأردني
    if (port !== -1 && GAME_PORTS[port]) return getJordanProxy();

    // أي ترافيك آخر → مقفل تمامًا
    return "PROXY 127.0.0.1:0";
}
