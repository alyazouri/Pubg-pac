function FindProxyForURL(url, host) {
    var ip = "213.186.179.50";   // آيبي السيرفر الأردني

    // استثناء مواقع وتطبيقات للتصفح المباشر
    var excludedDomains = [
        "*.shahid.net",
        "*.shahid.com",
        "*.mbc.net",
        "*.youtube.com",
        "*.googlevideo.com",
        "*.whatsapp.net",
        "*.whatsapp.com",
        "*.facebook.com",
        "*.fbcdn.net",
        "*.messenger.com"
    ];
    for (var i = 0; i < excludedDomains.length; i++) {
        if (shExpMatch(host, excludedDomains[i])) {
            return "DIRECT";  // فتح مباشر بدون بروكسي
        }
    }

    // قائمة البروكسيات الأردنية مع كل البورتات بعد الدمج وإزالة التكرار
    var proxyList = [
        "PROXY " + ip + ":8085",
        "PROXY " + ip + ":8086",
        "PROXY " + ip + ":8087",
        "PROXY " + ip + ":8088",
        "PROXY " + ip + ":8089",
        "PROXY " + ip + ":8090",
        "PROXY " + ip + ":10012",
        "PROXY " + ip + ":10010",
        "PROXY " + ip + ":10013",
        "PROXY " + ip + ":10039",
        "PROXY " + ip + ":10096",
        "PROXY " + ip + ":10491",
        "PROXY " + ip + ":10612",
        "PROXY " + ip + ":11000",
        "PROXY " + ip + ":11455",
        "PROXY " + ip + ":12235",
        "PROXY " + ip + ":13748",
        "PROXY " + ip + ":13894",
        "PROXY " + ip + ":13972",
        "PROXY " + ip + ":14000",
        "PROXY " + ip + ":17000",
        "PROXY " + ip + ":17500",
        "PROXY " + ip + ":20000",
        "PROXY " + ip + ":20001",
        "PROXY " + ip + ":20002",
        "PROXY " + ip + ":8011",
        "PROXY " + ip + ":9030"
    ];

    // إعادة جميع البروكسيات بالترتيب لتجربة كل بروكسي إذا فشل السابق
    return proxyList.join(";");
}
