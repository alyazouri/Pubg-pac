function isJordanIP(ip) {
  // نطاقات مزودي الخدمة الأردنيين (زين، أمنية، أورنج)
  return (
    shExpMatch(ip, "176.29.*.*") ||   // زين الأردن
    shExpMatch(ip, "188.247.*.*") ||  // أمنية
    shExpMatch(ip, "212.118.*.*") ||  // أورنج
    shExpMatch(ip, "194.126.*.*") ||  // أورنج القديم
    shExpMatch(ip, "82.212.*.*")  ||  // مزودين أردنيين آخرين
    shExpMatch(ip, "192.168.*.*") ||  // شبكة داخلية
    shExpMatch(ip, "10.*.*.*")    ||  // شبكة داخلية
    shExpMatch(ip, "172.16.*.*")      // شبكة داخلية
  );
}

function FindProxyForURL(url, host) {
  var clientIP = myIpAddress();
  var resolvedIP = dnsResolve(host);

  // ✅ التأكد إنك داخل الأردن
  if (!isJordanIP(clientIP)) {
    return "PROXY 0.0.0.0:0"; // منع كامل إذا جهازك مش أردني
  }

  // ✅ التأكد إن الوجهة (الموقع أو الخادم) أردني
  if (resolvedIP != null && isJordanIP(resolvedIP)) {
    return "DIRECT"; // فقط المواقع الأردنية مسموحة
  }

  // 🚫 المنع التام لأي خادم خارجي
  return "PROXY 0.0.0.0:0";
}
