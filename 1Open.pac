function FindProxyForURL(url, host) {
    // PUBG-related domains and IPs
    if (
        shExpMatch(host, "*.igamecj.com") ||
        shExpMatch(host, "*.tencentgames.com") ||
        dnsDomainIs(host, "dlied1.qq.com") ||
        isInNet(host, "203.205.0.0", "255.255.0.0") ||
        isInNet(host, "49.51.0.0", "255.255.0.0") ||
        isInNet(host, "91.106.109.0", "255.255.255.0")
    ) {
        // Try fastest first, fallback if failed
        return "PROXY 91.106.109.28:443; PROXY 91.106.109.27:4430; DIRECT";
    }

    // Default: no proxy
    return "DIRECT";
}
