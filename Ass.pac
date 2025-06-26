function FindProxyForURL(url, host) {
  var gameDomains = [
    "*.tencent.com",
    "*.igamecj.com",
    "*.pubgmobile.com",
    "*.pubgmobile.kr",
    "*.pubgmobile.live",
    "*.qcloud.com",
    "*.gcloudcs.com",
    "*.garena.com",
    "*.ff.garena.com",
    "*.game.a3.garena.live"
  ];

  var jordanProxy = "PROXY 192.168.*.*:443";  // ← بورت 443 ✅ متوافق 100% مع ببجي

  var resolved_ip = dnsResolve(host);
  if (resolved_ip && isBlockedIP(resolved_ip)) {
    return "PROXY 0.0.0.0:0"; // حظر نهائي لأي دولة ممنوعة
  }

  for (var i = 0; i < gameDomains.length; i++) {
    if (shExpMatch(host, gameDomains[i])) {
      return jordanProxy;
    }
  }

  return "DIRECT";
}
