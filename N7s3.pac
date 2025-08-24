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
            return "DIRECT";
        }
    }

    // بورتات دخول المباريات الأردنية
    var pubgPorts = [10010, 10012, 10013, 10039, 10096, 10491, 10612, 11455, 12235, 13748, 13894, 13972, 20000, 20001, 20002];

    for (var i = 0; i < pubgPorts.length; i++) {
        if (url.indexOf(":"+pubgPorts[i]) != -1) {
            return "PROXY " + ip + ":" + pubgPorts[i];
        }
    }

    // باقي الاتصالات عبر بروكسي عادي
    return "PROXY " + ip + ":8085";  
}
