function isJordanIP(ip) {
  // نطاقات IP لأهم مزودي الخدمة في الأردن (زين، أمنية، أورنج)
  return (
    shExpMatch(ip, "176.29.*.*") ||   // زين الأردن
    shExpMatch(ip, "188.247.*.*") ||  // أمنية
    shExpMatch(ip, "212.118.*.*") ||  // أورنج
    shExpMatch(ip, "194.126.*.*") ||  // أورنج القديم
    shExpMatch(ip, "192.168.*.*") ||  // شبكة محلية داخلية
    shExpMatch(ip, "10.*.*.*") ||     // شبكة محلية
    shExpMatch(ip, "172.16.*.*")      // شبكة محلية
  );
}

function FindProxyForURL(url, host) {
  var clientIP = myIpAddress();

  // إذا ما كان الجهاز داخل الأردن، يتم الحظر الكامل
  if (!isJordanIP(clientIP)) {
    return "PROXY 0.0.0.0:0"; // منع كامل
  }

  // نحاول تحويل اسم المضيف إلى عنوان IP
  var resolvedIP = dnsResolve(host);
  if (resolvedIP != null && isJordanIP(resolvedIP)) {
    return "DIRECT"; // الاتصال مسموح فقط إذا الوجهة أردنية
  }

  return "PROXY 0.0.0.0:0"; // أي اتصال لعنوان غير أردني ممنوع
}
