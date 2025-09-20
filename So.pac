// ================== PAC — PUBG Jordan Forced Proxy (No DIRECT) ==================
// رئيسي: 109.107.240.101  (يُجرّب 8000 ثم 443)
// احتياطي: 109.107.240.29 (يُجرّب 8000 ثم 443)
// ملاحظة: iOS يستخدم HTTPS/HTTP من PAC؛ أسطر SOCKS تُتجاهل على iOS.

var PROXIES =
  "HTTPS 109.107.240.101:8000; " +
  "HTTPS 109.107.240.101:443; "  +
  "HTTP  109.107.240.101:8000; " +
  "HTTPS 109.107.240.29:8000; "  +
  "HTTPS 109.107.240.29:443; "   +
  "HTTP  109.107.240.29:8000";

// نطاقات ببجي وCDN الشائعة (للإيضاح فقط؛ كل الترافيك سيمر بالبروكسي)
var PUBG = [
  "*.pubgmobile.com","*.igamecj.com","*.proximabeta.com",
  "*.tencent.com","*.tencentgames.com","*.gcloud.qq.com","*.qcloud.com",
  "*.cdn.pubgmobile.com","*.akamaized.net","*.cloudfront.net","*.vtcdn.com"
];

function FindProxyForURL(url, host) {
  // نُعيد سلسلة البروكسيات دائماً (لا يوجد DIRECT)
  return PROXIES;
}
