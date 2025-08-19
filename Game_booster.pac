function FindProxyForURL(url, host) {
    var ip = "212.34.1.121";

    // ترتيب الرنجات: الأول للألعاب
    var ranges = [
        [10000, 10004],
        [8085, 8088],
        [20000, 20003]
    ];

    var proxies = [];
    for (var r = 0; r < ranges.length; r++) {
        for (var p = ranges[r][0]; p <= ranges[r][1]; p++) {
            proxies.push("PROXY " + ip + ":" + p);
        }
    }

    // آخر خيار نفس الآيبي مع بورت أساسي
    proxies.push("PROXY " + ip + ":10000");

    return proxies.join("; ");
}
