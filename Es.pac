// PUBG PAC - Proxy via Jordan (محسن للأداء)
var proxyIP = "91.106.109.12";
var minPort = 10000;
var maxPort = 27015;
var stickyTTL = 300000;  // ثبات البورت 5 دقائق بدلاً من 60 ثانية

var hostMap = {}; // خريطة لحفظ آخر منفذ لكل مضيف PUBG

function generatePort() {
    var nowSec = Math.floor(Date.now() / 1000);
    var range = maxPort - minPort + 1;
    return minPort + (nowSec % range);
}

function buildProxyString(port) {
    // استخدام SOCKS5 فقط لكونه الأفضل للألعاب (يدعم UDP)
    return "SOCKS5 " + proxyIP + ":" + port;
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
        if (host == d || dnsDomainIs(host, "." + d) || shExpMatch(host, "*." + d)) {
            return true;
        }
    }
    if (shExpMatch(host, "*pubg*") || shExpMatch(host, "*tencent*") ||
        shExpMatch(host, "*qcloud*") || shExpMatch(host, "*proximabeta*")) {
        return true;
    }
    return false;
}

function FindProxyForURL(url, host) {
    host = host.toLowerCase();

    // 1) نطاقات PUBG → بروكسي أردني بمنفذ ثابت قدر الإمكان
    if (isPubgHost(host)) {
        if (hostMap[host] && (Date.now() - hostMap[host].ts) < stickyTTL) {
            return buildProxyString(hostMap[host].port);
        }
        var port = generatePort();
        hostMap[host] = { port: port, ts: Date.now() };
        return buildProxyString(port);
    }

    // 2) باقي الاتصالات → عبر نفس البروكسي (منفذ متغير لكل اتصال)
    return buildProxyString(generatePort());
}
