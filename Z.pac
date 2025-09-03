function FindProxyForURL(url, host) {
    // --- البروكسيات الأردنية ---
    var mainSocks5   = "SOCKS5 91.106.109.12:20002"; 
    var backupProxy  = "HTTP 213.186.179.25:8000; HTTPS 213.186.179.25:8000";
    var proxy_chain  = mainSocks5 + "; " + backupProxy;

    // --- بورتات PUBG Mobile ---
    var recruit_ports = {8011:true, 9030:true, 10012:true, 10039:true};   // التجنيد / البحث
    var match_ports   = {10096:true, 10491:true, 10612:true, 13004:true}; // دخول المباراة
    var play_ports    = {
        12235:true, 13748:true, 13894:true, 13972:true,
        20001:true, 20003:true
    };

    // نطاق UDP (اللعب أثناء المباراة)
    var dynamic_ports = {};
    for (var p = 17000; p <= 20050; p++) {
        dynamic_ports[p] = true;
    }

    // --- استخراج البورت من URL أو host ---
    var port = -1;
    var match = /:(\d+)$/.exec(host);
    if (match) {
        port = parseInt(match[1], 10);
    } else {
        var idx = url.lastIndexOf(":");
        if (idx > -1) {
            var parsed = parseInt(url.substring(idx + 1), 10);
            if (!isNaN(parsed)) port = parsed;
        }
    }

    // --- تحديد البروكسي حسب البورت ---
    if (port !== -1) {
        if (recruit_ports[port]) return proxy_chain; // تجنيد
        if (match_ports[port])   return proxy_chain; // دخول مباراة
        if (play_ports[port])    return proxy_chain; // لعب فعلي
        if (dynamic_ports[port]) return proxy_chain; // UDP
    }

    // --- أي ترافيك آخر: برضه عبر البروكسي للاستقرار ---
    return proxy_chain;
}
