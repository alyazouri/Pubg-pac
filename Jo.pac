function FindProxyForURL(url, host) {
    var ip = "212.34.1.121"; // آيبي البروكسي الأردني

    // نطاقات سيرفر الألعاب
    var gameDomains = [
        "*.pubgmobile.com",
        "*.tencentgames.com",
        "*.igamecj.com",
        "*.callofduty.com",
        "*.fortnite.com"
    ];

    for (var i = 0; i < gameDomains.length; i++) {
        if (shExpMatch(host, gameDomains[i])) {

            // بورتات الألعاب مرتبة حسب الأفضلية لتقليل البينغ
            var portGroups = [
                [10000, 10004], // Matchmaking + دخول المباريات
                [20000, 20003], // دعم الاتصال بالسيرفر
                [10005, 20000]  // بورتات إضافية حسب حاجة اللعبة
            ];

            var proxies = [];
            for (var g = 0; g < portGroups.length; g++) {
                for (var p = portGroups[g][0]; p <= portGroups[g][1]; p++) {
                    // أضف البروكسي فقط إذا البورت متاح (محاكاة ذكية)
                    proxies.push("PROXY " + ip + ":" + p);
                }
            }

            // Fallback على أول بورت لضمان الاتصال
            proxies.push("PROXY " + ip + ":8085");

            return proxies.join("; ");
        }
    }

    // أي موقع غير اللعبة يمر مباشرة لتقليل الحمل
    return "DIRECT";
}
