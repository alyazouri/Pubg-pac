// classic_tdm_war_fastport.pac
var lastPortUsed = 10000;

function FindProxyForURL(url, host) {

    function getNextPort() {
        lastPortUsed++;
        if (lastPortUsed > 27015) lastPortUsed = 10000;
        return lastPortUsed;
    }

    var jordanProxy = "91.106.109.12:" + getNextPort();

    var directHosts = [
        "apple.com","icloud.com","google.com","cdn.pubgmobile.com",
        "auth.pubgmobile.com","assets.pubgmobile.com","*.pubgmobilecdn.com",
        "*.gamelogic.com","*.statistics.pubgmobile.com","*.ads.pubgmobile.com",
        "*.updates.pubgmobile.com","*.login.pubgmobile.com"
    ];

    for (var i = 0; i < directHosts.length; i++) {
        if (shExpMatch(host, "*" + directHosts[i] + "*")) return "DIRECT";
    }

    if (shExpMatch(url, "*.pubgmobile.com*") &&
        (url.indexOf("match") !== -1 ||
         url.indexOf("lobby") !== -1 ||
         url.indexOf("battle") !== -1 ||
         url.indexOf("tdm") !== -1 ||
         url.indexOf("war") !== -1)) {
        return "SOCKS5 " + jordanProxy;
    }

    if (shExpMatch(url, "*.assets.*") || shExpMatch(url, "*.cdn.*")) return "DIRECT";

    return "DIRECT";
}
