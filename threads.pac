function FindProxyForURL(url, host) {
    // النطاقات الخاصة بتطبيق Threads (Threads + Instagram)
    var threadsDomains = [
        "*.threads.net",
        "*.instagram.com",
        "*.cdn.instagram.com",
        "*.cdn.threads.net"
    ];

    // التحقق من النطاقات
    for (var i = 0; i < threadsDomains.length; i++) {
        if (shExpMatch(host, threadsDomains[i])) {
            // توجيه عبر البروكسي الأردني
            return "PROXY 91.106.109.17:443"; // ضع هنا IP السيرفر الأردني والمنفذ
        }
    }

    // الباقي مباشر
    return "DIRECT";
}
