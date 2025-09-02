function FindProxyForURL(url, host) {
    // 1. تجاوز البروكسي للعناوين المحلية أو الداخلية
    if (isPlainHostName(host) ||
        dnsDomainIs(host, ".lan") ||
        isInNet(dnsResolve(host), "192.168.0.0", "255.255.255.0") ||
        isInNet(dnsResolve(host), "10.0.0.0", "255.0.0.0")) {
        return "DIRECT";  // اتصال مباشر للعناصر المحلية
    }

    // 2. قائمة البروكسيات (اخترنا بروكسيات قريبة لتقليل البينق)
    var proxies = [
        "SOCKS5 91.106.109.12:8085", // مثال: بروكسي في الأردن
        "PROXY 213.186.179.25:8000"    // بروكسي احتياطي بنفس الموقع
    ];
    var proxy_chain = proxies.join("; ");

    // 3. تحديد المنفذ المطلوب لفحصه (كما في كودك الأصلي)
    var pubg_ports_set = new Set([443, 8443, 8085, /*... بقية المنافذ ...*/]);
    var range_start = 17000, range_end = 20000;

    var portIndex = url.lastIndexOf(":");
    if (portIndex > -1) {
        var port = parseInt(url.substring(portIndex + 1));
        if (!isNaN(port) && ((port >= range_start && port <= range_end) || pubg_ports_set.has(port))) {
            return proxy_chain;  // استخدم بروكسياتنا للمنفذ المطلوب (مثل لعبة PUBG)
        }
    }

    // 4. القاعدة الافتراضية: استخدم البروكسيات المحددة
    return proxy_chain;
}
