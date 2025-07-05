function FindProxyForURL(url, host) {
  var jordanProxy = "PROXY 94.127.213.119:8080"; // غيّر هذا إلى IP وبورت أردني فعلي

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
