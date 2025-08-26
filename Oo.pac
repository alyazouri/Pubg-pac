var PROXY_IP   = "212.34.1.121";   // عدّل إلى IP البروكسي الأردني
var PROXY_PORT = 1080;             // بورت SOCKS5

// دومينات للاستثناء
var bypassDomains = [
  "localhost", "127.0.0.1",
  "*.local", "*.lan",
  "*.gov.jo", "*.edu.jo",
  "*.umniah.com", "*.zain.com", "*.orange.jo"
];

// نطاقات PUBG
var gameDomains = [
  "*.pubgmobile.com",
  "*.classicgame.pubgmobile.com",
  "*.tdm.pubgmobile.com",
  "*.wow.pubgmobile.com",
  "*.recruit.pubgmobile.com"
];

// بورتات TCP مهمة للألعاب والدردشة
var tcpPorts = [5222, 8443];

function FindProxyForURL(url, host) {
    // تجاوز الدومينات المحلية والحكومية
    for (var i = 0; i < bypassDomains.length; i++) {
        if (shExpMatch(host, bypassDomains[i])) return "DIRECT";
    }

    // توجيه نطاقات PUBG عبر البروكسي
    for (var i = 0; i < gameDomains.length; i++) {
        if (shExpMatch(host, gameDomains[i])) return "SOCKS5 " + PROXY_IP + ":" + PROXY_PORT;
    }

    // جميع الاتصالات TCP على البورتات المحددة تمر عبر البروكسي
    var port = url.split(":")[2]; // يحاول التقاط البورت من الرابط
    if (port && tcpPorts.indexOf(parseInt(port)) != -1) {
        return "SOCKS5 " + PROXY_IP + ":" + PROXY_PORT;
    }

    // بقية التصفح أيضًا عبر البروكسي
    return "SOCKS5 " + PROXY_IP + ":" + PROXY_PORT + "; SOCKS " + PROXY_IP + ":" + PROXY_PORT + "; DIRECT";
}
