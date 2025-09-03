// ======================
// Ultimate Hybrid PAC Script - PUBG Pro iPad (Fully Enhanced)
// ======================

// عنوان البروكسي الخاص بك
var proxyIP = "91.106.109.12";

// آخر بورت استخدمناه
var lastPortUsed = 10000;

// عداد الفشل لتجربة بورتات متعددة عند الفشل
var failCounter = 0;
var maxFails = 5; // يحاول حتى 5 بورتات متتالية قبل إعادة ضبط

// ======================
// دالة لتوليد البورت الجديد
// ======================
// تعمل كل نصف ثانية لتجديد البورت تلقائيًا
function getNextPort() {
    var now = new Date().getTime();
    // الحساب: 10000 + الرقم المتغير كل نصف ثانية ضمن نطاق 10000-27015
    var port = 10000 + Math.floor((now / 500) % (27015 - 10000));
    lastPortUsed = port;
    return lastPortUsed;
}

// ======================
// دالة بناء البروكسيات
// ======================
// تقوم بإعداد البروكسيات بالترتيب: SOCKS5 → SOCKS4 → HTTP Proxy
function buildProxies() {
    var port = getNextPort();
    // Logging خفيف لمعرفة البورت الحالي عند الاتصال
    console.log("Using port: " + port);
    return [
        "SOCKS5 " + proxyIP + ":" + port, // أفضل للببجي
        "SOCKS4 " + proxyIP + ":" + port, // بديل إذا SOCKS5 فشل
        "PROXY " + proxyIP + ":" + port  // آخر حل، HTTP Proxy
    ].join("; ");
}

// ======================
// نطاقات ببجي الرسمية
// ======================
// تشمل السيرفرات، CDN، والنطاقات الرسمية لتوجيه أي حركة مرور ببجي عبر البروكسي
var pubgDomains = [
    "pubgmobile.com", "pubgmobile.net", "pubgmobile.org",
    "igamecj.com", "tencentgames.com", "tencentgames.net",
    "tencent.com", "proximabeta.com", "qcloudcdn.com",
    "qcloud.com", "akamaized.net", "gamepubgm.com",
    "sg-global-pubg.com"
];

// ======================
// نطاقات عربية حسب الأولوية
// ======================
// الأردن أولاً، الخليج ثانياً، باقي العرب ثالثاً
var jordanRegion = [".jo"];
var gulfRegions = [".sa", ".ae", ".kw", ".qa", ".om"];
var otherArabRegions = [".eg", ".iq", ".lb", ".ma", ".tn", ".dz", ".ye", ".sy"];

// ======================
// دوال فحص المناطق
// ======================
// تتحقق إذا النطاق تابع لأي دولة عربية محددة
function isJordanHost(host) {
    for (var i = 0; i < jordanRegion.length; i++) 
        if (host.endsWith(jordanRegion[i])) return true;
    return false;
}

function isGulfHost(host) {
    for (var i = 0; i < gulfRegions.length; i++) 
        if (host.endsWith(gulfRegions[i])) return true;
    return false;
}

function isOtherArabHost(host) {
    for (var i = 0; i < otherArabRegions.length; i++) 
        if (host.endsWith(otherArabRegions[i])) return true;
    return false;
}

// ======================
// Wildcards لأي نطاق جديد للببجي أو Tencent
// ======================
// يلتقط أي نطاق جديد للببجي أو Tencent تلقائيًا
function isPubgWildcard(host) {
    return (
        shExpMatch(host, "*.pubg*") ||
        shExpMatch(host, "*.tencent*") ||
        shExpMatch(host, "*.proximabeta*") ||
        shExpMatch(host, "*.qcloud*") ||
        shExpMatch(host, "*.akamaized*") ||
        shExpMatch(host, "*.gamepubgm*") ||
        shExpMatch(host, "*.sg-global-pubg*")
    );
}

// ======================
// الدالة الرئيسية للسكربت
// ======================
// FindProxyForURL: كل اتصال يصدر من الجهاز يمر من هنا
function FindProxyForURL(url, host) {
    
    // ======================
    // Failover: إذا الفشل أقل من الحد الأقصى
    // ======================
    // عند فشل الاتصال، نجرب بورت جديد مباشرة
    if (failCounter < maxFails) {
        failCounter++;
        return buildProxies();
    } else {
        // إعادة ضبط العداد بعد المحاولات
        failCounter = 0;
    }

    // ======================
    // أولوية الاتصال حسب المنطقة
    // ======================

    // 1️⃣ الأردن → أفضلية قصوى
    if (isJordanHost(host)) return buildProxies();

    // 2️⃣ دول الخليج → أولوية ثانية
    if (isGulfHost(host)) return buildProxies();

    // 3️⃣ باقي العرب → أولوية ثالثة
    if (isOtherArabHost(host)) return buildProxies();

    // 4️⃣ نطاقات ببجي الرسمية
    for (var i = 0; i < pubgDomains.length; i++) {
        if (dnsDomainIs(host, pubgDomains[i]) || shExpMatch(host, "*." + pubgDomains[i])) {
            return buildProxies();
        }
    }

    // 5️⃣ Wildcards → يلتقط أي نطاق جديد للببجي
    if (isPubgWildcard(host)) return buildProxies();

    // ======================
    // باقي المواقع → مباشر (DIRECT)
    // ======================
    return "DIRECT";
}
