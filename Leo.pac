function FindProxyForURL(url, host) {
  if (
    dnsDomainIs(host, "pubgmobile.com") ||
    dnsDomainIs(host, "tencent.com") ||
    shExpMatch(host, "*.proximabeta.com") ||
    shExpMatch(host, "*.igamecj.com")
  ) {
    return "PROXY 94.127.213.119:2095";
  }

  return "DIRECT";
}
