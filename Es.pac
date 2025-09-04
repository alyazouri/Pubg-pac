// ==============================================
// PUBG PAC - Full Jordan Proxy (No Raw DIRECT)
// ==============================================
// الفكرة:
// - كل شيء يمر عبر البروكسي الأردني
// - ببجي: بورت متغير (Hybrid: تجنيد سريع + استقرار بالمباراة)
// - باقي الاتصالات: تضل عبر البروكسي نفسه (بورت مناسب)
// ==============================================

// ---------------- إعدادات ----------------
var proxyIP = "91.106.109.12";
var minPort = 10000;
var maxPort = 27015;
var stickyTTL = 60000; // ثبات البورت 60 ثانية
// -----------------------------------------

var hostMap = {}; // خريطة لحفظ البورتات

function generatePort() {
    var nowSec = Math.floor(Date.now() / 1000);
    var range = maxPort - minPort + 1;
    return minPort + (nowSec % range);
}

function buildProxyString(port) {
    // نجرب SOCKS5 ثم SOCKS4 ثم HTTP PROXY
    return "SOCKS5 " + proxyIP + ":" + port +
           "; SOCKS4 " + proxyIP + ":" + port +
           "; PROXY " + proxyIP + ":" + port;
}

function isPubgHost(host) {
    host = host.toLowerCase();
    var pubgList = [
        "pubgmobile.com","pubgmobile.net","pubgmobile.org",
        "igamecj.com","tencent.com","tencentgames.com","tencentgames.net",
        "proximabeta.com","gpubgm.com","qcloud.com","qcloudcdn.com",
        "akamaized.net","gamepubgm.com","sg-global-pubg.com","tdatamaster.com"
    ];
    for (var i = 0; i < pubgList.length; i++) {
        var d = pubgList[i];
        if (host == d || dnsDomainIs(host, "." + d) || shExpMatch(host, "*." + d)) return true;
    }
    if (shExpMatch(host, "*pubg*") || shExpMatch(host, "*tencent*") ||
        shExpMatch(host, "*qcloud*") || shExpMatch(host, "*proximabeta*")) {
        return true;
    }
    return false;
}

function FindProxyForURL(url, host) {
    host = host.toLowerCase();
    var now = Date.now();

    // 1) نطاقات ببجي → Hybrid Proxy
    if (isPubgHost(host)) {
        var entry = hostMap[host];
        if (entry && (now - entry.ts) <= stickyTTL) {
            return buildProxyString(entry.port);
        }
        var port = generatePort();
        hostMap[host] = {port: port, ts: now};
        return buildProxyString(port);
    }

    // 2) باقي الاتصالات (حتى .jo أو أي موقع ثاني) → البروكسي الأردني برضو
    var port = generatePort();
    return buildProxyString(port);
}
