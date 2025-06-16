
function FindProxyForURL(url, host) {
  // Match PUBG Mobile IP ranges (example IPs and patterns)
  if (shExpMatch(host, "*.pubgmobile.com") ||
      shExpMatch(host, "*.igamecj.com") ||
      dnsDomainIs(host, "aws.amazon.com") || 
      shExpMatch(host, "dlied1.qq.com") ||
      isInNet(host, "43.249.37.0", "255.255.255.0") || 
      isInNet(host, "52.57.0.0", "255.255.0.0") ||
      isInNet(host, "18.196.0.0", "255.255.0.0") ||
      isInNet(host, "54.93.0.0", "255.255.0.0")) {
    return "DIRECT";
  }

  // Everything else goes through default proxy (if you want to block or route them)
  return "DIRECT";
}
