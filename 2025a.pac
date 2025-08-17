function FindProxyForURL(url, host) {
    var proxy = "";

    // بورتات محددة فردية
    proxy += "PROXY 213.186.179.25:8085; ";
    proxy += "PROXY 213.186.179.25:8086; ";
    proxy += "PROXY 213.186.179.25:8087; ";
    proxy += "PROXY 213.186.179.25:8088; ";
    proxy += "PROXY 213.186.179.25:10010; ";
    proxy += "PROXY 213.186.179.25:10011; ";
    proxy += "PROXY 213.186.179.25:10012; ";
    proxy += "PROXY 213.186.179.25:10013; ";
    proxy += "PROXY 213.186.179.25:20000; ";
    proxy += "PROXY 213.186.179.25:20001; ";
    proxy += "PROXY 213.186.179.25:20002; ";

    // رينج من 7086 لغاية 7995
    for (var p = 7086; p <= 7995; p++) {
        proxy += "PROXY 213.186.179.25:" + p + "; ";
    }

    // fallback إجباري -> 8085
    proxy += "PROXY 213.186.179.25:8085";

    return proxy;
}
