function FindProxyForURL(url, host) {

    // تجاوز الشبكات المحلية
    if (
        isPlainHostName(host) ||
        shExpMatch(host, "*.local") ||
        shExpMatch(host, "localhost") ||
        shExpMatch(host, "127.*") ||
        shExpMatch(host, "10.*") ||
        shExpMatch(host, "192.168.*") ||
        shExpMatch(host, "169.254.*")
    ) {
        return "DIRECT";
    }

    // بورتات SOCKS5 / HTTP
    var SOCKS_PORT = 10491;  // SOCKS5 (UDP + TCP)
    var HTTP_PORT  = 8085;   // HTTP Proxy

    // بورتات PUBG الرئيسية
    var GAME_PORTS = [
        8011, 9030, 10491, 10612, 12235, 13748,
        17000, 17500, 18081, 20000, 20001, 20002
    ];

    // نطاقات أساسية للعبة فقط
    var GAME_HOSTS = [
        "pubgmobile.com",
        "igamecj.com",
        "proximabeta.com",
        "tencent.com",
        "qcloudcdn.com",
        "cdn.pubgmobile.com",
        "dl.pubgmobile.com"
    ];

    // استخراج البورت
    function extractPort(u, h) {
        try {
            var parts = u.split("/");
            var hostport = parts[2] || h;
            var hp = hostport.split(":");
            if (hp.length > 1) {
                var p = parseInt(hp[1], 10);
                if (!isNaN(p)) return p;
            }
        } catch (e) {}

        if (shExpMatch(u, "https:*")) return 443;
        return 80;
    }

    var port = extractPort(url, host);

    // التوجيه حسب البورت
    for (var i = 0; i < GAME_PORTS.length; i++) {
        if (port === GAME_PORTS[i]) {
            return "SOCKS5 91.106.109.12:" + SOCKS_PORT +
                   "; SOCKS5 91.106.109.11:" + SOCKS_PORT +
                   "; PROXY 91.106.109.12:" + HTTP_PORT +
                   "; PROXY 91.106.109.11:" + HTTP_PORT +
                   "; DIRECT";
        }
    }

    // التوجيه حسب الدومين
    for (var j = 0; j < GAME_HOSTS.length; j++) {
        if (
            dnsDomainIs(host, GAME_HOSTS[j]) ||
            shExpMatch(host, "*." + GAME_HOSTS[j])
        ) {
            return "SOCKS5 91.106.109.12:" + SOCKS_PORT +
                   "; SOCKS5 91.106.109.11:" + SOCKS_PORT +
                   "; PROXY 91.106.109.12:" + HTTP_PORT +
                   "; PROXY 91.106.109.11:" + HTTP_PORT +
                   "; DIRECT";
        }
    }

    // باقي الطلبات تبقى مباشرة
    return "DIRECT";
}
