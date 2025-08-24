function FindProxyForURL(url, host) {
    var pubgDomains = [
        "*.pubgmobile.com",
        "*.tencent.com",
        "*.moba.com",
        "*.pugcdn.com",
        "*.gameapi.pubg.com",
        "*.pd.pubgmobile.com",
        "*.sg.pubgmobile.com",
        "*.esports.pubgmobile.com",
        "*.cdn.pubgmobile.com",
        "*.cdn.taptap.com",
        "*.cdn.pubg.com"
    ];

    for (var i = 0; i < pubgDomains.length; i++) {
        if (shExpMatch(host, pubgDomains[i])) {
            return "PROXY 91.106.109.17:443";
        }
    }
    return "DIRECT";
}
