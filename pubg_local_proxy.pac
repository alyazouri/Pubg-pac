function FindProxyForURL(url, host) {
  if (
    shExpMatch(host, "*.igamecj.com") ||
    shExpMatch(host, "*.pubgmobile.com") ||
    shExpMatch(host, "*.qcloud.com") ||
    dnsDomainIs(host, "dlied1.qq.com") ||
    dnsDomainIs(host, "cloudfront.pubgmobile.com") ||
    dnsDomainIs(host, "android.bugly.qq.com") ||
    dnsDomainIs(host, "oth.strerr.com") ||
    dnsDomainIs(host, "cdnf.gcloudcs.com") ||
    dnsDomainIs(host, "midasoversea.qq.com")
  ) {
    return "PROXY 176.29.161.121:8080";
  }
  return "DIRECT";
}
