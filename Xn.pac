function FindProxyForURL(url, host) {
  var jordanProxy = "PROXY 212.35.70.122:6002"; // غيّر هذا إلى IP وبورت أردني فعلي

  var gameDomains = [
    "*.tencent.com",
    "*.igamecj.com",
    "*.pubgmobile.com",
    "*.pubgmobile.kr",
    "*.pubgmobile.live",
    "*.qcloud.com",
    "*.gcloudcs.com"
  ];

  for (var i = 0; i < gameDomains.length; i++) {
    if (shExpMatch(host, gameDomains[i])) {
      return jordanProxy;
    }
  }

  return "DIRECT";
}
