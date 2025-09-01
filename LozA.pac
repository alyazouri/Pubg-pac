function FindProxyForURL(url, host) {
    // ترتيب البروكسيات حسب البنق المتوقع
    var proxies = [
        "SOCKS5 91.106.109.12:1080", // الأفضل للبنق
        "PROXY 91.106.109.12:443"    // SSL fallback
    ];

    // دمج البروكسيات في تسلسل للانتقال التلقائي
    var proxy_chain = proxies.join("; ");

    // بورتات PUBG Mobile (TCP + UDP)
    var pubg_ports_set = new Set([
        443, 8443, 8085, 8088, 10012, 13004,
        8011, 9030, 10039, 10096, 10491, 10612,
        12235, 13748, 13894, 13972
    ]);

    var range_start = 17000;
    var range_end   = 20000;

    // فحص البورت في URL
    var portIndex = url.lastIndexOf(":");
    if (portIndex > -1) {
        var port = parseInt(url.substring(portIndex + 1));
        if (!isNaN(port)) {
            if ((port >= range_start && port <= range_end) || pubg_ports_set.has(port)) {
                return proxy_chain;
            }
        }
    }

    // كل الإنترنت والتطبيقات → استخدم البروكسي المختار حسب الأولوية
    return proxy_chain;
}
