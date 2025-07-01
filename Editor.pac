function FindProxyForURL(url, host) {
  // قوائم نطاقات PUBG الرسمية
  var pubgDomains = [
    ".pubgmobile.com",
    ".igamecj.com",
    ".tencentgames.com",
    ".gcloudcs.com",
    ".qcloudcdn.com",
    ".pstatp.com",
    ".dldir1.qq.com",
    ".sgamecdn.com"
  ];

  // تحويل إلى بروكسي الأردني فقط إذا كانت PUBG
  for (var i = 0; i < pubgDomains.length; i++) {
    if (dnsDomainIs(host, pubgDomains[i])) {
      return "PROXY 91.106.109.17:5004";
    }
  }

  // الاتصالات المباشرة لأي شيء آخر
  return "DIRECT";
}
