function FindProxyForURL(url, host) {
    // قائمة الدومينات الخاصة بـ PUBG Mobile
    var pubgDomains = [
        ".pubgmobile.com",
        ".tencent.com",
        ".moba.com"
    ];

    // تحويل كل دومينات PUBG للسيرفر الأردني
    for (var i = 0; i < pubgDomains.length; i++) {
        if (shExpMatch(host, "*" + pubgDomains[i])) {
            return "PROXY 91.106.109.17:443";
        }
    }

    // باقي المواقع مباشرة بدون بروكسي
    return "DIRECT";
}
