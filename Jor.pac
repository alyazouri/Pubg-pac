function FindProxyForURL(url, host) {
    var ip = "212.34.1.121"; // آيبي البروكسي الأردني

    // قائمة شاملة لجميع نطاقات PUBG Mobile
    var gameDomains = [
        "*.pubgmobile.com",
        "*.tencentgames.com",
        "*.tencentcloud.com",
        "*.qcloudcdn.com",
        "*.pubgapi.com",
        "*.cdn.pubgmobile.com",
        "*.realtime.pubgmobile.com",
        "*.matchmaking.pubgmobile.com",
        "*.igamecj.com",
        "*.pubgplayer.com"
    ];

    for (var i = 0; i < gameDomains.length; i++) {
        if (shExpMatch(host, gameDomains[i])) {

            var proxies = [];

            // بورتات UDP لتقليل البينغ وتحسين الحركة
            for (var p = 10000; p <= 10004; p++) proxies.push("PROXY " + ip + ":" + p);
            for (var p = 20000; p <= 20003; p++) proxies.push("PROXY " + ip + ":" + p);

            // بورتات TCP لتحديثات اللعبة وLobby
            for (var p = 8085; p <= 8088; p++) proxies.push("PROXY " + ip + ":" + p);

            // بورتات إضافية لتقليل Lag حسب السيرفر
            for (var p = 10005; p <= 20000; p++) proxies.push("PROXY " + ip + ":" + p);

            // إجبار البورت 8085 كخيار احتياطي
            proxies.push("PROXY " + ip + ":8085");

            return proxies.join("; ");
        }
    }

    // أي موقع غير اللعبة يمر مباشرة لتقليل الحمل
    return "DIRECT";
}
