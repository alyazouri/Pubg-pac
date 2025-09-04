// pac_pubg_jordan_ping_smart.pac
function FindProxyForURL(url, host) {
    var localIPv6 = "[2a13:a5c7:25ff:7000::]"; // استبدل بالعنوان المحلي الخاص بك
    var startPort = 10000;
    var endPort = 11000;

    // قائمة البروكسيات
    var proxies = [];
    for (var port = startPort; port <= endPort; port++) {
        proxies.push("SOCKS5 " + localIPv6 + (port - startPort + 1) + ":" + port);
    }

    // بروكسي HTTP كخيار احتياطي
    proxies.push("PROXY " + localIPv6 + "8080");

    // خيار DIRECT أخير
    proxies.push("DIRECT");

    // إذا كان الاتصال بمواقع ببجي، اختر أسرع بورت
    if (host.indexOf("pubg") !== -1) {
        // تجربة ping وهمية (PAC لا يدعم ping حقيقي، لكن ترتيب البروكسيات حسب أولوياتك)
        // يمكنك تعديل ترتيب البروكسيات يدوياً حسب نتائج اختبار ping حقيقي
        return proxies[0]; // أول بروكسي = أسرع بورت
    }

    // لكل المواقع الأخرى، استخدم كامل قائمة البروكسيات
    return proxies.join("; ");
}
