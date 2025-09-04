<think>
**Fine-tuning PAC script logic**

I’m considering how to further fine-tune the PAC script since it uses JS and includes global functions like dnsResolve and isInNet. Using Date().getTime() seems fine, but I notice that some implementations of PAC don't allow it. While many support Date, for compatibility, it's safer to use myIpAddress() instead. If I'm rotatin' proxies, it might be better to use the timeRange function or a simpler approach, keeping PROXY_INDEX constant or rotating based on the host’s hash.**Creating a copyable script**

The user wants a script that they can copy easily, so I need to make sure it works correctly. I’ll include variables like PROXY_HOSTS and PORTS and build the PROXIES list using a combination of these. For robust IPv6 detection, I’ll ensure the function can identify literals accurately. The proxyToken function will return "SOCKS5" tokens, considering a "SOCKS" fallback since many PAC scripts use version 4 or 5. Additionally, I can enhance isPUBGHost with more relevant domains and treat some local addresses in isPrivateOrLocal.**Finalizing the script**

Alright, the earlier script rotates PROXY_INDEX every 60 seconds, and that’s fine. I’ll skip the GAME_PORTS and old ping code. I’m considering expanding the domain list to include "tencent-cloud" and "akamaized.net," but I want to tread carefully. Although PAC lacks "isResolvable," I could use dnsResolve to check proxy hosts at runtime. However, since we're dealing with IP addresses, we can't test port availability anyway. Since the user asked for a ready-to-copy script, I’ll just present clean code without any extra formatting or explanations!**Preparing the code for the user**

The user said they’re ready to copy, and while backticks weren't required, I noticed earlier code was presented without them. Here, it seems code can be presented as plain text, avoiding heavy formatting but allowing for bullet lists. Since readability is important, I’ll present just the code without any backticks. I’m considering including top comments that describe it as a PAC file while defining the FindProxyForURL function and default configuration. However, since the user requested the script only, I’ll stick strictly to providing the code.**Finalizing the script enhancements**

I’m thinking about one more improvement to include detection for URLs that aren't http/https while still passing the host. The PAC function always receives both URL and host, and I’ll only route for PUBG domains and send the rest DIRECT. I wonder if we should also support proxies for websocket connections, since browsers treat them similarly. We should append "DIRECT" after the proxy chain. I’ll also handle potential null or empty hosts but mainly rely on isPlainHostName. However, toggling the routeAllViaJordan feature seems unnecessary; let’s focus on crafting the final code with correct syntax and Arabic comments.
</think>// PAC file – توجيه نطاقات PUBG عبر بروكسيات أردنية فقط

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
