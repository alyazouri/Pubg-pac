
function FindProxyForURL(url, host) {
    // استثناءات لخوادم PUBG Mobile فقط - تستخدم البروكسي الأردني
    if (shExpMatch(host, "*.pubgmobile.com") ||
        shExpMatch(host, "*.igamecj.com") ||
        dnsDomainIs(host, "aws.amazon.com") || 
        shExpMatch(host, "dlied1.qq.com") ||
        isInNet(host, "43.249.37.0", "255.255.255.0") || 
        isInNet(host, "52.57.0.0", "255.255.0.0") ||
        isInNet(host, "18.196.0.0", "255.255.0.0") ||
        isInNet(host, "54.93.0.0", "255.255.0.0")) {
        return "SOCKS5 149.200.200.44:1080";
    }

    // باقي المواقع تتصل بشكل مباشر بدون بروكسي
    return "DIRECT";
}
