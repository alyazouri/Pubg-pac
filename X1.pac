// PAC file – توجيه نطاقات PUBG/Tencent عبر بروكسيات أردنية مع تحسينات

// ======================= CONFIG ======================= var PROXY_HOSTS = [ "91.106.109.12", "2a13:a5c7:25ff:7000" // IPv6 ]; var PORTS = [8085, 10491, 20001, 20002];

// تدوير عشوائي كل 60 ثانية لتوزيع الحمل وتجاوز الأعطال var ROTATE_INTERVAL = 60000; var LAST_ROTATE = 0; var PROXY_INDEX = 0;

// وضع هجومي: يوجّه أي نطاق يُحتمل أنه مرتبط باللعبة أو المطوّر var AGGRESSIVE_MODE = true;

// نطاقات/كلمات يجب عدم توجيهها حتى بالوضع الهجومي (تجنّب بطء المواقع العامة) var BYPASS_DOMAINS = [ "google.com", "gstatic.com", "youtube.com", "facebook.com", "whatsapp.com", "apple.com", "microsoft.com", "windowsupdate.com", "cloudflare.com", "akamaihd.net", "akamaiedge.net" ];

// ======================= PUBG/Tencent Domains ======================= var PUBG_DOMAINS = [ "igamecj.com", "igamepubg.com", "pubgmobile.com", "tencentgames.com", "proximabeta.com", "gcloudsdk.com", "qq.com", "qcloudcdn.com", "tencentyun.com", "qcloud.com", "gtimg.com", "game.qq.com", "gameloop.com", "proximabeta.net", "cdngame.tencentyun.com", "cdn-ota.qq.com" ];

// كلمات مفتاحية لتغطية نطاقات/مسارات محتملة ذات صلة باللعبة أو التجنيد/السكواد var PUBG_KEYWORDS = [ "pubg", "igame", "tencent", "proximabeta", "qcloud", "tencentyun", "gcloud", "gameloop", "qq", "match", "squad", "party", "team", "rank" ];

// نبني قائمة البروكسيات (كل Host × كل Port) var PROXIES = (function () { var arr = []; for (var i = 0; i < PROXY_HOSTS.length; i++) { for (var j = 0; j < PORTS.length; j++) { arr.push({ h: PROXY_HOSTS[i], p: PORTS[j] }); } } return arr; })();

function isIPv6Literal(h) { return h.indexOf(":") !== -1; }

function proxyTokens(entry) { var host = isIPv6Literal(entry.h) ? "[" + entry.h + "]" : entry.h; // نرجع SOCKS5 ثم SOCKS كبدائل return ["SOCKS5 " + host + ":" + entry.p, "SOCKS " + host + ":" + entry.p]; }

function buildProxyChain(startIdx) { if (PROXIES.length === 0) return "DIRECT"; var parts = []; for (var k = 0; k < PROXIES.length; k++) { var idx = (startIdx + k) % PROXIES.length; var toks = proxyTokens(PROXIES[idx]); for (var t = 0; t < toks.length; t++) { parts.push(toks[t]); } } parts.push("DIRECT"); return parts.join("; "); }

function isPlainIP(host) { return (/^\d{1,3}(.\d{1,3}){3}$/.test(host) || /^$?[0-9a-fA-F:]+$?$/.test(host)); }

function isPUBGHost(host) { if (isPlainIP(host)) return false; // IP مباشر: نخليه DIRECT var h = host.toLowerCase(); for (var i = 0; i < PUBG_DOMAINS.length; i++) { var d = PUBG_DOMAINS[i]; if (h === d || shExpMatch(h, "*." + d)) return true; } return false; }

function hasKeyword(hostOrUrl) { var s = (hostOrUrl || "").toLowerCase(); for (var i = 0; i < PUBG_KEYWORDS.length; i++) { if (s.indexOf(PUBG_KEYWORDS[i]) !== -1) return true; } return false; }

function isBypassDomain(host) { var h = host.toLowerCase(); for (var i = 0; i < BYPASS_DOMAINS.length; i++) { var d = BYPASS_DOMAINS[i]; if (h === d || shExpMatch(h, "*." + d)) return true; } return false; }

function isPrivateOrLocal(host) { // أسماء داخلية بدون نقطة if (isPlainHostName(host)) return true;

// IPv6 محلي if (isIPv6Literal(host)) { var h = host.toLowerCase(); if (h === "::1" || shExpMatch(h, "fe80::*")) return true; return false; }

// شبكات خاصة لـ IPv4 var ip = dnsResolve(host); if (!ip) return false; if (isInNet(ip, "127.0.0.0", "255.0.0.0")) return true; if (isInNet(ip, "10.0.0.0", "255.0.0.0")) return true; if (isInNet(ip, "172.16.0.0", "255.240.0.0")) return true; if (isInNet(ip, "192.168.0.0", "255.255.0.0")) return true; return false; }

function shouldProxy(url, host) { if (isBypassDomain(host)) return false;

// نطاقات PUBG/Tencent المعروفة if (isPUBGHost(host)) return true;

if (AGGRESSIVE_MODE) { // التوسيع بالكلمات المفتاحية على host أو كامل URL if (hasKeyword(host) || hasKeyword(url)) return true; } return false; }

// ======================= MAIN ======================= function FindProxyForURL(url, host) { if (isPrivateOrLocal(host)) return "DIRECT";

if (!shouldProxy(url, host)) return "DIRECT";

// تدوير عشوائي كل فترة var now = new Date().getTime(); if (now - LAST_ROTATE > ROTATE_INTERVAL) { LAST_ROTATE = now; PROXY_INDEX = Math.floor(Math.random() * (PROXIES.length || 1)); }

return buildProxyChain(PROXY_INDEX); }

