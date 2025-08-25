
function FindProxyForURL(url, host) {
    var ip = "213.186.179.50";

    var directDomains = [
        "*.shahid.*","*.mbc.net",
        "*.youtube.*","*.googlevideo.*",
        "*.tiktok.*","*.ttlivecdn.*",
        "*.instagram.*","*.cdninstagram.*",
        "*.twitter.*","*.twimg.*",
        "*.netflix.*","*.nflxvideo.*",
        "*.disneyplus.*","*.disneypluscdn.*",
        "*.primevideo.*","*.amazonvideo.*",
        "*.spotify.*","*.soundcloud.*","*.anghami.*",
        "*.whatsapp.*","*.facebook.*","*.messenger.*",
        "*.pubgmobile.*","*.proximabeta.*","*.gcloudsdk.*","*.igamecj.*","*.tencentgames.*",
        "*.apple.*","*.icloud.*","*.mzstatic.*","*.itunes.*","*.apps.apple.*",
        "*.paypal.*","*.visa.*","*.mastercard.*","*.americanexpress.*","*.applepay.*",
        "*.google.*","*.maps.*","*.waze.*","*.uber.*","*.careem.*",
        "*.amazon.*","*.ebay.*","*.aliexpress.*","*.shein.*"
    ];

    for (var i = 0; i < directDomains.length; i++) {
        if (shExpMatch(host, directDomains[i])) return "DIRECT";
    }

    var proxies = [
        "PROXY " + ip + ":8085",
        "PROXY " + ip + ":8086",
        "PROXY " + ip + ":8087",
        "PROXY " + ip + ":8088",
        "PROXY " + ip + ":8089",
        "PROXY " + ip + ":8090",
        "PROXY " + ip + ":10012",
        "PROXY " + ip + ":20000",
        "PROXY " + ip + ":20001",
        "PROXY " + ip + ":20002"
    ];

    return proxies.join(";") + ";DIRECT";
}
