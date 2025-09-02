function FindProxyForURL(url, host) {
    // البروكسي الأردني المخصص للتجنيد الكلاسيك وTDM
    var jordanProxy = "91.106.109.12:8000"; // بورت التجنيد

    // قائمة المواقع المهمة التي يجب الاتصال بها مباشرة
    var directHosts = [
        "apple.com",
        "icloud.com",
        "google.com",
        "cdn.pubgmobile.com",
        "auth.pubgmobile.com",
        "assets.pubgmobile.com",
        "*.pubgmobilecdn.com",
        "*.gamelogic.com",
        "*.statistics.pubgmobile.com",
        "*.ads.pubgmobile.com",
        "*.updates.pubgmobile.com",
        "*.login.pubgmobile.com"
    ];

    // تجاوز Direct Hosts
    for (var i = 0; i < directHosts.length; i++) {
        if (shExpMatch(host, "*" + directHosts[i] + "*")) {
            return "DIRECT";
        }
    }

    // تمرير كل اتصالات Match، Lobby، Battle وTDM عبر البروكسي الأردني
    if (shExpMatch(url, "*.pubgmobile.com*") &&
        (url.indexOf("match") !== -1 || 
         url.indexOf("lobby") !== -1 || 
         url.indexOf("battle") !== -1 || 
         url.indexOf("tdm") !== -1)) {
        return "SOCKS5 " + jordanProxy;
    }

    // تمرير أي اتصالات ثقيلة أو ملفات CDN مباشرة لتقليل البنق
    if (shExpMatch(url, "*.assets.*") || shExpMatch(url, "*.cdn.*")) {
        return "DIRECT";
    }

    // باقي الاتصالات DIRECT
    return "DIRECT";
}
