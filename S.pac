function isBlockedIP(ip) {
  // نطاقات سوريا 🇸🇾
  if (
    shExpMatch(ip, "31.9.*.*") || 
    shExpMatch(ip, "46.32.*.*") || 
    shExpMatch(ip, "91.144.*.*") || 
    shExpMatch(ip, "185.44.*.*") || 
    shExpMatch(ip, "5.0.*.*")
  ) return true;

  // نطاقات ليبيا 🇱🇾
  if (
    shExpMatch(ip, "41.208.*.*") || 
    shExpMatch(ip, "41.253.*.*") || 
    shExpMatch(ip, "62.68.*.*") || 
    shExpMatch(ip, "197.116.*.*")
  ) return true;

  // نطاقات أفغانستان 🇦🇫
  if (
    shExpMatch(ip, "103.152.*.*") || 
    shExpMatch(ip, "119.235.*.*") || 
    shExpMatch(ip, "180.94.*.*")
  ) return true;

  // نطاقات إيران 🇮🇷
  if (
    shExpMatch(ip, "2.144.*.*") || 
    shExpMatch(ip, "5.112.*.*") || 
    shExpMatch(ip, "31.56.*.*") || 
    shExpMatch(ip, "37.255.*.*") || 
    shExpMatch(ip, "46.224.*.*") || 
    shExpMatch(ip, "79.132.*.*") || 
    shExpMatch(ip, "91.98.*.*") || 
    shExpMatch(ip, "151.240.*.*")
  ) return true;

  return false;
}

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

  var jordanProxy = "PROXY 82.212.85.201:8080"; // بروكسي أردني أصيل 🇯🇴

  var resolved_ip = dnsResolve(host);
  if (resolved_ip && isBlockedIP(resolved_ip)) {
    return "PROXY 0.0.0.0:0"; // حظر كامل
  }

  for (var i = 0; i < gameDomains.length; i++) {
    if (shExpMatch(host, gameDomains[i])) {
      return jordanProxy;
    }
  }

  return "DIRECT";
}
