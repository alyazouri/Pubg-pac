function FindProxyForURL(url, host) {
    // البروكسي الأردني الأساسي: SOCKS5
    var mainSocks5 = "SOCKS5 91.106.109.12:8085";   // الأفضل للبنق وUDP

    // البروكسي الأردني الاحتياطي: HTTP/HTTPS
    var backupProxy = "PROXY 213.186.179.25:8000";   // احتياط سريع

    // سلسلة البروكسي: SOCKS5 أولاً ثم HTTP
    var proxy_chain = mainSocks5 + "; " + backupProxy;

    // نطاقات بورت موسعة TCP/UDP
    var udp_ports = [];
    for (var i = 17000; i <= 20050; i++) { // نطاق UDP كامل للألعاب
        udp_ports.push(i);
    }
    var important_ports = new Set([
        8443, 8088, 10012, 13004,
        8011, 9030, 10039, 10096, 10491, 10612,
        12235, 13748, 13894, 13972,
        20001, 20002, 20003
    ]);
    udp_ports.forEach(function(p){ important_ports.add(p); });

    // استخراج البورت من URL
    var portIndex = url.lastIndexOf(":");
    if (portIndex > -1) {
        var port = parseInt(url.substring(portIndex + 1));
        if (!isNaN(port)) {
            if (important_ports.has(port)) {
                return proxy_chain;
            }
        }
    }

    // كل الإنترنت → استخدم نفس السلسلة
    return proxy_chain;
}
