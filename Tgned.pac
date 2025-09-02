function FindProxyForURL(url, host) {
    // تشفير العنوان لتجنب مشاكل
    function d(s){ return decodeURIComponent(escape(atob(s))); }

    // بروكسي أردني مخصص للتجنيد الكلاسيك
    var jordanProxy = d("MjEzLjE4Ni4xNzkuMjU6ODAwMA=="); // 213.186.179.25:8000

    // قائمة بالمواقع التي تحتاج تجاوز البروكسي (DNS، تحديثات، إعلانات)
    var directHosts = [
        "apple.com",
        "icloud.com",
        "pubgmobile.com"
    ];

    // إذا كان المضيف ضمن قائمة التجاوز، نفتح الاتصال مباشرة
    for (var i = 0; i < directHosts.length; i++) {
        if (shExpMatch(host, "*" + directHosts[i] + "*")) {
            return "DIRECT";
        }
    }

    // كل شيء آخر يمر عبر البروكسي الأردني
    return "SOCKS5 " + jordanProxy;
}
