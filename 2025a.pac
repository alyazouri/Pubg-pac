// PAC Script - Hybrid (SOCKS5 + HTTP Proxy)
// Proxy IP: 213.186.179.25
// Ports:
//   • 10012 → 10039
//   • 20000 → 20002
//   • Fallback → 8085

function FindProxyForURL(url, host) {
    var proxyList = "";

    // رينج 10012 → 10039
    for (var p = 10012; p <= 10039; p++) {
        proxyList += "SOCKS5 213.186.179.25:" + p + "; ";
        proxyList += "PROXY 213.186.179.25:" + p + "; ";
    }

    // رينج 20000 → 20002
    for (var p = 20000; p <= 20002; p++) {
        proxyList += "SOCKS5 213.186.179.25:" + p + "; ";
        proxyList += "PROXY 213.186.179.25:" + p + "; ";
    }

    // fallback إجباري -> 8085
    proxyList += "SOCKS5 213.186.179.25:8085; ";
    proxyList += "PROXY 213.186.179.25:8085";

    // إرجاع البروكسي
    return proxyList;
}
