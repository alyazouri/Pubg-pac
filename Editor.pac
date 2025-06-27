function FindProxyForURL(url, host) {
  // قائمة نطاقات الألعاب التي يجب توجيهها عبر البروكسي الأردني
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

  // عنوان البروكسي الأردني عبر بورت 443 (متوافق مع ببجي)
  var jordanProxy = "PROXY 192.168.100.1:8080";

  // دالة لتحديد ما إذا كان عنوان IP أردني (زين أو أمنية فقط)
  function isJordanIP(ip) {
    return (
      shExpMatch(ip, "192.168.0.*")
      shExpMatch(ip, "192.168.100.*")
      shExpMatch(ip, "192.168.8.*")
      shExpMatch(ip, "222.222.*.*")
      shExpMatch(ip, "176.29.*.*")
      shExpMatch(ip, "188.247.*.*")
    );
  }

  // محاولة حل اسم المضيف إلى عنوان IP
  var resolvedIP = dnsResolve(host);

  // في حالة فشل حل DNS أو كان IP غير أردني → نحظر الاتصال
  if (!resolvedIP || !isJordanIP(resolvedIP)) {
    return "PROXY 0.0.0.0:0";
  }

  // التحقق إذا كان اسم النطاق من ضمن نطاقات الألعاب المستهدفة
  for (var i = 0; i < gameDomains.length; i++) {
    if (shExpMatch(host, gameDomains[i])) {
      return jordanProxy;
    }
  }

  // كل المواقع الأخرى تمر بشكل مباشر بدون بروكسي
  return "DIRECT";
}
