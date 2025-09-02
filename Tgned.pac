// classic_tdm_war_fastport_local_jordan.pac

var lastPortUsed = 10000;

// قائمة البروكسيات الأردنية
var jordanProxies = [
    "91.106.109.12",
    "213.186.179.25",
    "91.106.110.18"
];
var lastProxyIndex = 0;

// توليد البورت التالي بشكل عشوائي لتسريع العثور على بورت مفتوح
function getNextPort() {
    lastPortUsed += Math.floor(Math.random() * 10) + 1; // زيادة عشوائية بين 1 و10
    if (lastPortUsed > 27015) lastPortUsed = 10000 + (lastPortUsed - 27015);
    return lastPortUsed;
}

// اختيار البروكسي الأردني التالي بالتناوب
function getNextJordanProxy() {
    lastProxyIndex++;
    if (lastProxyIndex >= jordanProxies.length) lastProxyIndex = 0;
    return jordanProxies[lastProxyIndex] + ":" + getNextPort();
}

function FindProxyForURL(url, host) {

    var jordanProxy = getNextJordanProxy();

    // نطاقات يجب الاتصال بها مباشرة بدون بروكسي
    var directHosts = [
        "apple.com","icloud.com","google.com","cdn.pubgmobile.com",
        "auth.pubgmobile.com","assets.pubgmobile.com","*.pubgmobilecdn.com",
        "*.gamelogic.com","*.statistics.pubgmobile.com","*.ads.pubgmobile.com",
        "*.updates.pubgmobile.com","*.login.pubgmobile.com"
    ];

    for (var i = 0; i < directHosts.length; i++) {
        if (shExpMatch(host, "*" + directHosts[i] + "*")) return "DIRECT";
    }

    // مباريات كلاسيك، TDM، WAR – توجه عبر بروكسي أردني
    if (shExpMatch(url, "*.pubgmobile.com*") &&
        (url.indexOf("match") !== -1 ||
         url.indexOf("lobby") !== -1 ||
         url.indexOf("battle") !== -1 ||
         url.indexOf("tdm") !== -1 ||
         url.indexOf("war") !== -1)) {
        return "SOCKS5 " + jordanProxy;
    }

    // الملفات الثابتة والـ CDN مباشرة
    if (shExpMatch(url, "*.assets.*") || shExpMatch(url, "*.cdn.*")) return "DIRECT";

    // أي شيء آخر مباشرة
    return "DIRECT";
}
