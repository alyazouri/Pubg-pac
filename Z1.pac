// PAC file – توجيه نطاقات PUBG عبر بروكسيات أردنية فقط

// ======================= CONFIG =======================
var PROXY_HOSTS = [
  "91.106.109.12",
  "2a13:a5c7:25ff:7000" // IPv6
];
var PORTS = [8085, 10491, 20001, 20002];

// تدوير البروكسي المفضّل كل 60 ثانية لتوزيع الحمل
var ROTATE_INTERVAL = 60000;
var LAST_ROTATE = 0;
var PROXY_INDEX = 0;

// ======================= PUBG Domains =======================
var PUBG_DOMAINS = [
  "igamecj.com",
  "igamepubg.com",
  "pubgmobile.com",
  "tencentgames.com",
  "proximabeta.com",
  "gcloudsdk.com",
  "qq.com",
  "qcloudcdn.com",
  "tencentyun.com",
  "qcloud.com"
];

// نبني قائمة البروكسيات (كل Host مع كل Port)
var PROXIES = (function () {
  var arr = [];
  for (var i = 0; i < PROXY_HOSTS.length; i++) {
    for (var j = 0; j < PORTS.length; j++) {
      arr.push({ h: PROXY_HOSTS[i], p: PORTS[j] });
    }
  }
  return arr;
})();

function isIPv6Literal(h) {
  return h.indexOf(":") !== -1;
}

function proxyToken(entry) {
  var host = isIPv6Literal(entry.h) ? "[" + entry.h + "]" : entry.h;
  return "SOCKS5 " + host + ":" + entry.p;
}

function buildProxyChain(startIdx) {
  var parts = [];
  for (var k = 0; k < PROXIES.length; k++) {
    var idx = (startIdx + k) % PROXIES.length;
    parts.push(proxyToken(PROXIES[idx]));
  }
  parts.push("DIRECT");
  return parts.join("; ");
}

function isPUBGHost(host) {
  // إذا كان host IP مباشر، نمرره DIRECT
  if (/^\[?[0-9a-fA-F:]+\]?$/.test(host) || /^\d{1,3}(\.\d{1,3}){3}$/.test(host)) {
    return false;
  }
  host = host.toLowerCase();
  for (var i = 0; i < PUBG_DOMAINS.length; i++) {
    var d = PUBG_DOMAINS[i];
    if (shExpMatch(host, "*." + d) || host === d) return true;
  }
  return false;
}

function isPrivateOrLocal(host) {
  // IPv6 محلي
  if (isIPv6Literal(host)) {
    var h = host.toLowerCase();
    if (h === "::1" || shExpMatch(h, "fe80::*")) return true;
    // PAC عادة لا يدعم IPv6 في isInNet، نكتفي بهذا
    return false;
  }

  // أسماء داخلية بدون نقطة
  if (isPlainHostName(host)) return true;

  // افحص الشبكات الخاصة لـ IPv4
  var ip = dnsResolve(host);
  if (!ip) return false;

  if (isInNet(ip, "127.0.0.0", "255.0.0.0")) return true;     // loopback
  if (isInNet(ip, "10.0.0.0", "255.0.0.0")) return true;      // 10/8
  if (isInNet(ip, "172.16.0.0", "255.240.0.0")) return true;  // 172.16/12
  if (isInNet(ip, "192.168.0.0", "255.255.0.0")) return true; // 192.168/16
  return false;
}

// ======================= MAIN =======================
function FindProxyForURL(url, host) {
  if (isPrivateOrLocal(host)) {
    return "DIRECT";
  }

  if (!isPUBGHost(host)) {
    return "DIRECT";
  }

  // تدوير بسيط كل فترة
  var now = new Date().getTime();
  if (now - LAST_ROTATE > ROTATE_INTERVAL) {
    LAST_ROTATE = now;
    PROXY_INDEX = (PROXY_INDEX + 1) % (PROXIES.length || 1);
  }

  return buildProxyChain(PROXY_INDEX);
}
