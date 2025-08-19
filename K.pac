function FindProxyForURL(url, host) {
    var ip = "212.34.1.121";
    var proxies = [];

    for (var p = 10000; p <= 10004; p++) proxies.push("PROXY " + ip + ":" + p);
    for (var p = 20000; p <= 20003; p++) proxies.push("PROXY " + ip + ":" + p);
    for (var p = 8085; p <= 8088; p++) proxies.push("PROXY " + ip + ":" + p);
    for (var p = 10005; p <= 20000; p++) proxies.push("PROXY " + ip + ":" + p);

    proxies.push("PROXY " + ip + ":8085");

    return proxies.join("; ");
} 
// snap : SAEEDJOR11
// ALYAZOURI
