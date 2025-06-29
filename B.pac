function FindProxyForURL(url, host) {
  // بروكسي أردني مؤقت - تأكد من تحديث الـ IP إذا توقف
  var jordanProxy = "PROXY 176.28.250.122:80";

  // قائمة دومينات لعبة PUBG
  var gameDomains = [
    "*.tencent.com",
    "*.igamecj.com",
    "*.pubgmobile.com",
    "*.pubgmobile.kr",
    "*.pubgmobile.live",
    "*.amazonaws.com",
    "dlmobilecg.akamaized.net",
    "*.qcloudcdn.com",
    "*.gcloudcs.com"
  ];

  for (var i = 0; i < gameDomains.length; i++) {
    if (shExpMatch(host, gameDomains[i])) {
      return jordanProxy;
    }
  }

  // باقي المواقع بدون بروكسي
  return "DIRECT";
}
