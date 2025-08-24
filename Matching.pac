function FindProxyForURL(url, host) {
    var ip = "213.186.179.50";

    // رنجات UDP للألعاب (بحث + مباريات)
    var ranges = [
        [10000, 10004],  // البحث عن لاعبين + دخول مباريات
        [20000, 20003],  // دعم الاتصال بالسيرفر أثناء اللعب
        [10005, 20000]   // أحياناً تستخدم بورتات إضافية بنفس الرينج
    ];

    var proxies = [];
    for (var r = 0; r < ranges.length; r++) {
        for (var p = ranges[r][0]; p <= ranges[r][1]; p++) {
            proxies.push("PROXY " + ip + ":" + p);
        }
    }

    // آخر خيار: أول بورت في الرنج الأساسي
    proxies.push("PROXY " + ip + ":10000");

    return proxies.join("; ");
}
