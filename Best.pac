function FindProxyForURL(url, host) {
  // قائمة بروكسيات أردنية نموذجية (استبدلها بالبروكسيات الحقيقية عندك)
  var jordanProxies = [
    "PROXY 149.200.200.44:80",
    "PROXY 149.200.200.44:8080",
    "PROXY 149.200.200.44:443",
    "PROXY 94.127.213.119:8080",
    "PROXY 94.127.213.119:80",
    "PROXY 94.127.213.119:443",
    "PROXY 194.165.153.189:80",
    "PROXY 194.165.153.189:8080",
    "PROXY 194.165.153.189:443",
    "PROXY 176.28.250.122:8080",
    "PROXY 176.28.250.122:80",
    "PROXY 176.28.250.122:443",
    "PROXY 176.29.0.10:8080",
    "PROXY 176.29.0.10:80",
    "PROXY 176.29.0.10:443",
    "PROXY 176.29.0.11:80",
    "PROXY 176.29.0.11:8080",
    "PROXY 176.29.0.11:443"
  ];

  // دومينات ببجي المهمة
  var gameDomains = [
    "*.tencent.com",
    "*.igamecj.com",
    "*.pubgmobile.com",
    "*.pubgmobile.kr",
    "*.pubgmobile.live",
    "*.qcloud.com",
    "*.gcloudcs.com",
    "*.facegamenetwork.com",
    "*.gamingbuddy.cn",
    "*.gameasea.com",
    "*.gpspeed.cloud.tencent.com",
    "*.sandbox.google.com"
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
