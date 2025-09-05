// PAC – وضع عالمي لإجبار كل الاتصالات عبر بروكسي أردني (قدر الإمكان)

// ======================= CONFIG =======================
var PROXY_HOSTS = [
    "91.106.109.12",
    "2a13:a5c7:25ff:7000" // IPv6
];

var PORTS = [8085, 10491, 20001, 20002];

// قوي جداً: وجّه كل شيء عبر البروكسيات (عدا الشبكات المحليّة)
var FORCE_ALL = true;

// إن أردت وضعاً أقل شمولاً، اجعل FORCE_ALL = false
// واستعمل قوائم المجالات أدناه
var GAME_DOMAINS = [
    "igamecj.com", "igamepubg.com", "pubgmobile.com",
    "tencentgames.com", "proximabeta.com", "gcloudsdk.com",
    "qq.com", "qcloudcdn.com", "tencentyun.com", "qcloud.com",
    "gtimg.com", "game.qq.com", "gameloop.com",
    "proximabeta.net", "cdngame.tencentyun.com", "cdn-ota.qq.com"
];

var KEYWORDS = [
    "pubg", "tencent", "igame", "proximabeta", "qcloud",
    "tencentyun", "gcloud", "gameloop",
    "match", "squad", "party", "team", "rank"
];

// تدوير عشوائي كل 60 ثانية لتفادي الأعطال وتوزيع الحمل
var ROTATE_INTERVAL = 60000;
var LAST_ROTATE = 0;
var PROXY_INDEX = 0;

// ======================= BUILD PROXY CHAIN =======================
var PROXIES = (function () {
    var arr = [];
    for (var i = 0; i < PROXY_HOSTS.length; i++) {
        for (var j = 0; j < PORTS.length; j++) {
            arr.push({ h: PROXY_HOSTS[i], p: PORTS[j] });
        }
    }
    return arr;
})();

function isIPv6Literal(h) {
    return h.indexOf(":") !== -1;
}

function proxyTokens(entry) {
    var host = isIPv6Literal(entry.h) ? "[" + entry.h + "]" : entry.h;
    // نحاول SOCKS5 ثم SOCKS كبدائل
    return [
        "SOCKS5 " + host + ":" + entry.p,
        "SOCKS " + host + ":" + entry.p
    ];
}

function buildProxyChain(startIdx) {
    if (PROXIES.length === 0) return "DIRECT";
    var parts = [];
    for (var k = 0; k < PROXIES.length; k++) {
        var idx = (startIdx + k) % PROXIES.length;
        var toks = proxyTokens(PROXIES[idx]);
        for (var t = 0; t < toks.length; t++) parts.push(toks[t]);
    }
    // في حال فشل كل البروكسيات
    parts.push("DIRECT");
    return parts.join("; ");
}

// ======================= MATCHING HELPERS =======================
function isPlainIP(host) {
    return (
        /^\d{1,3}(\.\d{1,3}){3}$/.test(host) || // IPv4
        /^[0-9a-fA-F:]+$/.test(host)            // IPv6
    );
}

function isPrivateOrLocal(host) {
    // أسماء داخلية
    if (isPlainHostName(host)) return true;

    // IPv6 محلي
    if (isIPv6Literal(host)) {
        var h = host.toLowerCase();
        if (h === "::1" || shExpMatch(h, "fe80::*")) return true;
        return false;
    }

    // IPv4 شبكات خاصة/محلية
    var ip = null;
    try { ip = dnsResolve(host); } catch (e) {}
    if (!ip) return false;

    if (isInNet(ip, "127.0.0.0", "255.0.0.0")) return true;      // loopback
    if (isInNet(ip, "10.0.0.0", "255.0.0.0")) return true;       // 10/8
    if (isInNet(ip, "172.16.0.0", "255.240.0.0")) return true;   // 172.16/12
    if (isInNet(ip, "192.168.0.0", "255.255.0.0")) return true;  // 192.168/16
    if (isInNet(ip, "169.254.0.0", "255.255.0.0")) return true;  // link-local
    if (isInNet(ip, "100.64.0.0", "255.192.0.0")) return true;   // CGNAT

    return false;
}

function hostInList(host, list) {
    host = host.toLowerCase();
    for (var i = 0; i < list.length; i++) {
        var d = list[i];
        if (host === d || shExpMatch(host, "*." + d)) return true;
    }
    return false;
}

function hasKeyword(s) {
    s = (s || "").toLowerCase();
    for (var i = 0; i < KEYWORDS.length; i++)
        if (s.indexOf(KEYWORDS[i]) !== -1) return true;
    return false;
}

// ======================= MAIN =======================
function FindProxyForURL(url, host) {
    // لا نمرر الشبكات المحلية عبر البروكسي
    if (isPrivateOrLocal(host)) return "DIRECT";

    // وضع عالمي: مرّر كل شيء عبر البروكسي الأردني (حتى IPs)
    if (FORCE_ALL) {
        var now = new Date().getTime();
        if (now - LAST_ROTATE > ROTATE_INTERVAL) {
            LAST_ROTATE = now;
            PROXY_INDEX = Math.floor(Math.random() * (PROXIES.length || 1));
        }
        return buildProxyChain(PROXY_INDEX);
    }

    // وضع انتقائي (إذا عطّلت FORCE_ALL): وجّه نطاقات/كلمات اللعبة فقط
    if (hostInList(host, GAME_DOMAINS) || hasKeyword(host) || hasKeyword(url)) {
        var now2 = new Date().getTime();
        if (now2 - LAST_ROTATE > ROTATE_INTERVAL) {
            LAST_ROTATE = now2;
            PROXY_INDEX = Math.floor(Math.random() * (PROXIES.length || 1));
        }
        return buildProxyChain(PROXY_INDEX);
    }

    return "DIRECT";
}
