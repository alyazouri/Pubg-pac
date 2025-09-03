function FindProxyForURL(url, host) {

    // ===== البروكسي الأردني SOCKS5 لكل وظائف اللعبة (بورت 5000) =====
    var reservationProxy = "SOCKS5 91.106.109.12:5000"; // الحجز والتجنيد
    var classicProxy = "SOCKS5 91.106.109.12:5000";     // كلاسيك محلي
    var arenaProxy = "SOCKS5 91.106.109.12:5000";       // Arena محلي
    var matchmakingProxy = "SOCKS5 91.106.109.12:5000"; // البحث عن لاعبين

    // ===== البروكسي للطلبات الأخرى =====
    var otherProxy = "SOCKS5 91.106.109.12:20001";      // أي طلب آخر

    // ===== البورتات الرسمية لكل وظيفة (للتوثيق) =====
    var ports = {
        "reservation": 8085,
        "classic": 10010,
        "arena": 13748,
        "matchmaking": 20000
    };

    // ===== نطاقات اللعبة حسب الوظائف =====
    var reservationHosts = ["*.pubg.com/reservation", "*.tencentgames.com/reservation"];
    var classicHosts = ["*.pubg.com/classic", "*.tencentgames.com/classic"];
    var arenaHosts = ["*.pubg.com/arena", "*.tencentgames.com/arena"];
    var matchmakingHosts = ["*.pubg.com/matchmaking", "*.tencentgames.com/matchmaking"];

    // ===== نطاقات محلية موسعة لتعزيز اللاعبين المحليين (بدون pubg.ksa) =====
    var localHosts = ["*.pubg.jo", "*.pubg.local", "*.pubg.amman"];

    // ===== توجيه حسب الوظيفة مع الإشارة للبورت =====
    for (var i = 0; i < reservationHosts.length; i++) {
        if (shExpMatch(host, reservationHosts[i])) {
            return reservationProxy;
        }
    }
    for (var i = 0; i < classicHosts.length; i++) {
        if (shExpMatch(host, classicHosts[i])) {
            return classicProxy;
        }
    }
    for (var i = 0; i < arenaHosts.length; i++) {
        if (shExpMatch(host, arenaHosts[i])) {
            return arenaProxy;
        }
    }
    for (var i = 0; i < matchmakingHosts.length; i++) {
        if (shExpMatch(host, matchmakingHosts[i])) {
            return matchmakingProxy;
        }
    }

    // ===== إذا كان النطاق محلي محدد → نوجه للبروكسي المحلي =====
    for (var i = 0; i < localHosts.length; i++) {
        if (shExpMatch(host, localHosts[i])) {
            return classicProxy;
        }
    }

    // ===== أي طلب آخر يمر عبر البروكسي على بورت 20001 =====
    return otherProxy;
}
