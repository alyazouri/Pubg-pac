function FindProxyForURL(url, host) {
    var proxyIP = "213.186.179.25";

    // نطاقات اللعبة
    var gameDomains = [
        "*.pubgmobile.com",
        "*.classicgame.pubgmobile.com",
        "*.tdm.pubgmobile.com",
        "*.wow.pubgmobile.com",
        "*.recruit.pubgmobile.com",
        "*.igamecj.com",
        "*.tencentgames.com",
        "*.qcloudcdn.com"
    ];

    // استثناء التطبيقات: شاهد + مواقع السوشال ميديا
    var excludedDomains = [
        "*.shahid.net",
        "*.shahid.com",
        "*.facebook.com",
        "*.instagram.com",
        "*.tiktok.com",
        "*.snapchat.com",
        "*.twitter.com"
    ];

    function matchDomain(domainList) {
        for (var i = 0; i < domainList.length; i++) {
            if (shExpMatch(host, domainList[i])) {
                return true;
            }
        }
        return false;
    }

    // إذا هو نطاق مستثنى → DIRECT بالكامل
    if (matchDomain(excludedDomains)) {
        return "DIRECT";
    }

    // إذا هو نطاق لعبة → استخدام كل البورتات المهمة
    if (matchDomain(gameDomains)) {
        var ports = [
            8085, 10012, 10013, 10014, 10015, 10016, 10017, 10018, 10019, 10020,
            14000, 15000, 16000, 17000, 18000,
            20000, 20100, 20200, 20300,
            7086, 7087, 7986, 5222, 443, 8443
        ];

        var proxyList = [];
        for (var j = 0; j < ports.length; j++) {
            proxyList.push("PROXY " + proxyIP + ":" + ports[j]);
        }

        // fallback على البروكسي 8085
        proxyList.push("PROXY " + proxyIP + ":8085");

        return proxyList.join("; ");
    }

    // أي موقع آخر → البروكسي على بورت 8085
    return "PROXY " + proxyIP + ":8085";
}
