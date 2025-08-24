function FindProxyForURL(url, host) {
    var ip = "87.236.233.195";   // آيبي السيرفر الأردني

    // استثناء مواقع وتطبيقات للتصفح المباشر
    var excludedDomains = [
        "*.youtube.com",
        "*.googlevideo.com",  // للفيديوهات
        "*.facebook.com",
        "*.fbcdn.net",
        "*.messenger.com"
    ];
    for (var i = 0; i < excludedDomains.length; i++) {
        if (shExpMatch(host, excludedDomains[i])) {
            return "DIRECT";  // فتح مباشر بدون بروكسي
        }
    }

    // قائمة البروكسيات الأردنية (تجريب البورتات بالترتيب)
    var proxyList = [
        "PROXY " + ip + ":53",
        "PROXY " + ip + ":80",
        "PROXY " + ip + ":443",
        "PROXY " + ip + ":8085",
        "PROXY " + ip + ":8086",
        "PROXY " + ip + ":8087",
        "PROXY " + ip + ":8088",
        "PROXY " + ip + ":8089",
        "PROXY " + ip + ":8090",
        "PROXY " + ip + ":10012",
        "PROXY " + ip + ":20000",
        "PROXY " + ip + ":20001",
        "PROXY " + ip + ":20002"
    ];

    return proxyList.join(";");
}
