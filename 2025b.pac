function FindProxyForURL(url, host) {
    var proxy = "";

    // بورتات محددة فردية
    proxy += "PROXY 212.34.1.121:8085; ";
    proxy += "PROXY 212.34.1.121:8086; ";
    proxy += "PROXY 212.34.1.121:8087; ";
    proxy += "PROXY 212.34.1.121:8088; ";
    proxy += "PROXY 212.34.1.121:10010; ";
    proxy += "PROXY 212.34.1.121:10011; ";
    proxy += "PROXY 212.34.1.121:10012; ";
    proxy += "PROXY 212.34.1.121:10013; ";
    proxy += "PROXY 212.34.1.121:20000; ";
    proxy += "PROXY 212.34.1.121:20001; ";
    proxy += "PROXY 212.34.1.121:20002; ";

    // رينج من 7086 لغاية 7995
    for (var p = 7086; p <= 7995; p++) {
        proxy += "PROXY 212.34.1.121:" + p + "; ";
    }

    // fallback إجباري -> 8085
    proxy += "PROXY 212.34.1.121:646";

    return proxy;
}
