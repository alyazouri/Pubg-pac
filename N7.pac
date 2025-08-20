function FindProxyForURL(url, host) {
    var ip = "212.34.1.121";   // غيّر هذا لأي آيبي أردني بدك تستعمله
    var proxyList = [];

    // UDP Ports المهمة للألعاب
    for (var p = 10012; p <= 10039; p++) {
        proxyList.push("PROXY " + ip + ":" + p);
    }
    for (var p = 14000; p <= 18000; p++) {
        proxyList.push("PROXY " + ip + ":" + p);
    }

    // TCP Ports الأساسية
    proxyList.push("PROXY " + ip + ":443");
    proxyList.push("PROXY " + ip + ":5222");

    // البورت الاحتياطي (مضمون يشتغل)
    proxyList.push("PROXY " + ip + ":8085");

    // رجّع القائمة كاملة، الجهاز يجربها بالترتيب
    return proxyList.join(";");
}
