function FindProxyForURL(url, host) {
    var ip = "213.186.179.25";   // آيبي السيرفر الأردني

    // كل المواقع تمر عبر البروكسي الأردني فقط على البورتات المتبقية
    var proxyList = [
        "PROXY " + ip + ":8085",
        "PROXY " + ip + ":8086",
        "PROXY " + ip + ":10012",
        "PROXY " + ip + ":20000",
        "PROXY " + ip + ":20001",
        "PROXY " + ip + ":20002"
    ];

    return proxyList.join(";");
}
