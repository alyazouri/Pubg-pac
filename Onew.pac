var PROXY_IP = "212.34.1.121"; // غير الآيبي إذا عندك بروكسي ثاني

function FindProxyForURL(url, host) {
  var proxies = [];

  // 🎯 1) الكلاسيك الأساسي (أسرع وأضمن)
  proxies.push("SOCKS5 " + PROXY_IP + ":8085");

  // 🎯 2) بورتات البحث (10012–10039) + المباريات/التجنيد (14000–18000)
  var ranges = [
    [10012, 10039],
    [14000, 18000]
  ];

  for (var i = 0; i < ranges.length; i++) {
    for (var p = ranges[i][0]; p <= ranges[i][1]; p++) {
      proxies.push("SOCKS5 " + PROXY_IP + ":" + p);
    }
  }

  // 🎯 3) fallback مضمون على الكلاسيك
  proxies.push("SOCKS5 " + PROXY_IP + ":8085");

  return proxies.join("; ");
}
