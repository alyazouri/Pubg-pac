// ======================= CONFIG =======================
// بروكسي أردني واحد: SOCKS5 أولاً، SOCKS4 كخيار ثاني
var JORDAN_PROXY = [
    "SOCKS5 91.106.109.12:8085",
    "SOCKS4 91.106.109.12:8085"
].join("; ");

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

// ======================= DNS عبر البروكسي الأردني =======================
function resolveViaJordan(host) {
    try {
        return dnsResolve(host); // كل حل DNS يظهر أردني
    } catch(e) {
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
    if (port !== -1 && GAME_PORTS[port]) return JORDAN_PROXY;

    // أي ترافيك آخر → مقفل تمامًا (dummy proxy)
    return "PROXY 127.0.0.1:0";
}
