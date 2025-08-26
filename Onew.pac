var PROXY_IP = "212.34.1.121"; // غيّر الآيبي إذا عندك بروكسي أردني ثاني

function FindProxyForURL(url, host) {
  var proxies = [];

  // بورت الكلاسيك الأساسي
  proxies.push("SOCKS5 " + PROXY_IP + ":8085");

  // بورت البحث الأساسي
  proxies.push("SOCKS5 " + PROXY_IP + ":10012");

  // بورت إضافي
  proxies.push("SOCKS5 " + PROXY_IP + ":20000");

  // بورتات البحث من 10013 لحد 10039
  for (var p = 10013; p <= 10039; p++) {
    proxies.push("SOCKS5 " + PROXY_IP + ":" + p);
  }

  // fallback إجباري على 8085
  proxies.push("SOCKS5 " + PROXY_IP + ":8085");

  return proxies.join("; ");
}
