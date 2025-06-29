function FindProxyForURL(url, host) {
  var jordanProxy = "PROXY 149.200.200.44:443";

  var p2pDomains = [
    "*.tencent.com",
    "*.igamecj.com",
    "*.pubgmobile.com",
    "*.pubgmobile.kr",
    "*.pubgmobile.live",
    "*.qcloud.com",
    "*.gcloudcs.com",
    "*.riotgames.com",
    "*.epicgames.com",
    "*.steamcontent.com",
    "*.akamaized.net",
    "*.facegamenetwork.com"
  ];

  for (var i = 0; i < p2pDomains.length; i++) {
    if (shExpMatch(host, p2pDomains[i])) {
      return jordanProxy;
    }
  }
  return "DIRECT";
}
