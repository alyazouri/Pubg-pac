function FindProxyForURL(url, host) {
  var pubgDomains = [
    "pubgmobile.com",
    "pubgmobile.kr",
    "tencent.com",
    "igamecj.com",
    "qcloud.com",
    "gcloudcs.com",
    "facegamenetwork.com"
  ];

  for (var i = 0; i < pubgDomains.length; i++) {
    if (shExpMatch(host, "*." + pubgDomains[i]) || host === pubgDomains[i]) {
      return "PROXY 176.28.250.122:443";
    }
  }

  return "DIRECT";
}
