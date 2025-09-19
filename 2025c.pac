function FindProxyForURL(url, host) {
  // استثناءات للشبكات/الأسماء المحلية
  if (isPlainHostName(host) ||
      shExpMatch(host, "*.local") ||
      isInNet(dnsResolve(host), "10.0.0.0",  "255.0.0.0") ||
      isInNet(dnsResolve(host), "172.16.0.0","255.240.0.0") ||
      isInNet(dnsResolve(host), "192.168.0.0","255.255.0.0")) {
    return "DIRECT";
  }

  // نطاقات PUBG الشائعة
  var PUBG = [
    "*.pubgmobile.com",
    "*.igamecj.com",
    "*.proximabeta.com",
    "*.tencent.com",
    "*.tencentgames.com",
    "*.gcloud.qq.com",
    "*.qcloud.com",
    "*.cdn.pubgmobile.com",
    "*.akamaized.net",
    "*.vtcdn.com"
  ];

  // بروكسي أردني خارجي فقط
  var JO_SOCKS  = "SOCKS5 213.186.179.25:8000; SOCKS 213.186.179.25:8000";
  var JO_HTTP   = "PROXY 213.186.179.25:8000";
  var JO_CHAIN  = JO_SOCKS + "; " + JO_HTTP + "; DIRECT";

  for (var i = 0; i < PUBG.length; i++) {
    if (shExpMatch(host, PUBG[i])) {
      return JO_CHAIN;
    }
  }

  return "DIRECT";
}
