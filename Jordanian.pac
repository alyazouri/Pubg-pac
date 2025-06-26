function isJordanIP(ip) {
  return (
    shExpMatch(ip, "192.168.*.*")
  );
}

function FindProxyForURL(url, host) {
  var clientIP = myIpAddress();          // تحقق من موقع الجهاز
  var resolvedIP = dnsResolve(host);     // تحقق من موقع السيرفر

  // إذا أنت مش في الأردن، أمنع كل شي
  if (!isJordanIP(clientIP)) {
    return "PROXY 0.0.0.0:0";
  }

  // إذا السيرفر مش أردني، أمنع الوصول
  if (resolvedIP == null || !isJordanIP(resolvedIP)) {
    return "PROXY 0.0.0.0:0";
  }

  // إذا أنت والسيرفر أردنيين، اسمح بالوصول
  return "DIRECT";
}
