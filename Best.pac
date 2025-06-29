function FindProxyForURL(url, host) {
  // قائمة بروكسيات أردنية نموذجية (استبدلها بالبروكسيات الحقيقية عندك)
  var jordanProxies = [
    "PROXY 149.200.200.44:80",
    "PROXY 94.127.213.119:8080",
    "PROXY 194.165.153.189:80",
    "PROXY 176.28.250.122:8080",
    "PROXY 176.29.0.10:8080",
    "PROXY 176.29.0.11:80"
  ];

  // دومينات ببجي المهمة
  var gameDomains = [
    "*.pubgmobile.com",
    "*.tencent.com",
    "*.igamecj.com",
    "*.pubgmobile.kr",
    "*.pubgmobile.live"
  ];

  for (var i = 0; i < gameDomains.length; i++) {
    if (shExpMatch(host, gameDomains[i])) {
      // اختيار بروكسي عشوائي من القائمة
      var index = Math.floor(Math.random() * jordanProxies.length);
      return jordanProxies[index];
    }
  }

  return "DIRECT";
}
