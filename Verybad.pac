function FindProxyForURL(url, host) {
  // ألعاب أونلاين معروفة - أضف حسب الحاجة
  if (
    dnsDomainIs(host, "pubgmobile.com") ||
    dnsDomainIs(host, "dlied1.pubgmobile.com") ||
    dnsDomainIs(host, "dlied2.pubgmobile.com") ||
    shExpMatch(host, "*.pubgmobile.com") ||
    shExpMatch(host, "*gamecenter.qq.com")
  ) {
    return "PROXY 91.106.109.17:443; PROXY 91.106.109.17:5000; PROXY 91.106.109.17:5001; PROXY 91.106.109.17:5002; PROXY 91.106.109.17:5003; PROXY 91.106.109.17:5004; PROXY 91.106.109.17:8091; PROXY 91.106.109.17:9323";
  }

  // كل شيء آخر يتصل مباشرة بدون بروكسي
  return "DIRECT";
}
