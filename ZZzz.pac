// ======================= CONFIG =======================
var PROXY_HOST4 = "91.106.109.12";       // IPv4 أردني
var PROXY_HOST6 = "2a13:a5c7:25ff:7000"; // IPv6 أردني

var PORTS = [8085, 10491, 20001, 20002];
var BEST_PORT = PORTS[0];
var BEST_PROXY = PROXY_HOST4;

var LAST_CHECK = 0;
var CHECK_INTERVAL = 1000; // كل ثانية يعيد التقييم

// ======================= Jordan IP Ranges =======================
var JORDAN_IP_PREFIXES_V4 = ["91.106.","82.212.","87.236.","185.5.","185.28.","188.247.","193.188.","176.29.","212.118."];
var JORDAN_IP_PREFIXES_V6 = ["2a02:2788:","2a13:a5c7:","2a0c:9a40:"];

// ======================= PUBG DOMAINS =======================
var PUBG_DOMAINS = [
    "igamecj.com","igamepubg.com","pubgmobile.com","tencentgames.com",
    "proximabeta.com","gcloudsdk.com","qq.com","qcloudcdn.com"
];

// ======================= PUBG PORTS =======================
var GAME_PORTS = (function(){
    var ports = {
        // Classic + Ranked
        7086:true,8011:true,9030:true,
        10010:true,10011:true,10012:true,10013:true,
        10039:true,10096:true,10491:true,10612:true,
        // Arena / Training / TDM
        8085:true,8088:true,12235:true,
        13004:true,13748:true,13894:true,13972:true,
        // WOW + Seasonal
        17000:true,18081:true,
        // Gameplay UDP Ports (Final)
        20000:true,20001:true,20002:true,20003:true
    };
    for (var p=7000; p<=22000; p++) ports[p] = true;
    return ports;
})();

// ======================= Force Local DNS =======================
var FIXED_DNS = ["82.212.64.20","87.236.233.3"]; // Orange + Zain

function jordanResolve(host) {
    var ip = null;
    for (var i=0; i<FIXED_DNS.length; i++) {
        try { ip = dnsResolve(host); } catch(e) {}
        if (ip) break;
    }
    return ip;
}

// ======================= Jordan IP Check =======================
function isJordanIP(ip) {
    if (!ip) return false;
    if (ip.indexOf(".") > -1) {
        for (var i=0; i<JORDAN_IP_PREFIXES_V4.length; i++) {
            if (ip.indexOf(JORDAN_IP_PREFIXES_V4[i]) === 0) return true;
        }
    } else if (ip.indexOf(":") > -1) {
        for (var j=0; j<JORDAN_IP_PREFIXES_V6.length; j++) {
            if (ip.indexOf(JORDAN_IP_PREFIXES_V6[j]) === 0) return true;
        }
    }
    return false;
}

// ======================= Best Proxy =======================
function chooseBestProxy() {
    var now = new Date().getTime();
    if (now - LAST_CHECK < CHECK_INTERVAL) return;
    LAST_CHECK = now;

    var best = PROXY_HOST4;
    var bestPort = PORTS[0];
    var bestTime = 999999;

    for (var i=0; i<PORTS.length; i++) {
        var p = PORTS[i];

        var t4 = 999999;
        try { var s4=new Date().getTime(); jordanResolve(PROXY_HOST4+":"+p); t4=new Date().getTime()-s4; } catch(e) {}

        var t6 = 999999;
        try { var s6=new Date().getTime(); jordanResolve("["+PROXY_HOST6+"]:"+p); t6=new Date().getTime()-s6; } catch(e) {}

        if (t4 < bestTime) { bestTime=t4; bestPort=p; best=PROXY_HOST4; }
        if (t6 < bestTime) { bestTime=t6; bestPort=p; best=PROXY_HOST6; }
    }

    BEST_PORT = bestPort;
    BEST_PROXY = best;
}

// ======================= MAIN =======================
function FindProxyForURL(url, host) {
    chooseBestProxy();

    var ip = jordanResolve(host);
    var port = -1, m = /:(\d+)$/.exec(host);
    if (m) port = parseInt(m[1],10);

    // 1) Direct إذا السيرفر أردني
    if (ip && isJordanIP(ip)) return "DIRECT";

    // 2) إذا دومين PUBG → إجبار بروكسي أردني
    for (var i=0; i<PUBG_DOMAINS.length; i++) {
        if (dnsDomainIs(host, PUBG_DOMAINS[i]) || shExpMatch(host, "*." + PUBG_DOMAINS[i])) {
            return BEST_PROXY.indexOf(":")>-1 ?
                "SOCKS5 [" + BEST_PROXY + "]:" + BEST_PORT :
                "SOCKS5 " + BEST_PROXY + ":" + BEST_PORT;
        }
    }

    // 3) إذا بورت Gameplay → إجبار بروكسي أردني
    if (port !== -1 && GAME_PORTS[port]) {
        return BEST_PROXY.indexOf(":")>-1 ?
            "SOCKS5 [" + BEST_PROXY + "]:" + BEST_PORT :
            "SOCKS5 " + BEST_PROXY + ":" + BEST_PORT;
    }

    // 4) Fallback → نفس البروكسي الأردني
    return BEST_PROXY.indexOf(":")>-1 ?
        "SOCKS5 [" + BEST_PROXY + "]:" + BEST_PORT :
        "SOCKS5 " + BEST_PROXY + ":" + BEST_PORT;
}
