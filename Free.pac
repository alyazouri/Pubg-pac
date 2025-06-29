function FindProxyForURL(url, host) {
  if (
    dnsDomainIs(host, "pubgmobile.com") ||
    dnsDomainIs(host, "tencent.com") ||
    shExpMatch(host, "*.proximabeta.com") ||
    shExpMatch(host, "*.igamecj.com")
  ) {
    return "PROXY 149.200.200.44:3128";
  }
  return "DIRECT";
}
