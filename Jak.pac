// ======================= CONFIG =======================
const PROXY_HOSTS = ["91.106.109.12", "2a13:a5c7:25ff:7000"]; // IPv4 + IPv6 أردني
const PORTS = [17000, 17500, 20000, 20001, 20002, 10491]; // أفضل بورتات PUBG للأردن
let BEST_PROXY = PROXY_HOSTS[0];
let BEST_PORT = PORTS[0];
let LAST_CHECK = 0;
const CHECK_INTERVAL = 5000; // كل 5 ثواني يعيد التقييم
const DNS_TIMEOUT = 3000; // وقت انتظار DNS

// ======================= Force Local DNS =======================
const FIXED_DNS = ["82.212.64.20", "87.236.233.3"]; // Orange + Zain
let dnsCache = {}; // تخزين نتائج الـ DNS لتقليل الاستعلامات

// ======================= PUBG Domains & Ports =======================
const PUBG_DOMAINS = [
    "igamecj.com", "igamepubg.com", "pubgmobile.com", "tencentgames.com",
    "proximabeta.com", "gcloudsdk.com", "qq.com", "qcloudcdn.com"
];
const GAME_PORTS = {};
for (let p = 7000; p <= 22000; p++) GAME_PORTS[p] = true; // كل المنافذ التي تستخدمها ببجي

// ======================= Force DNS Resolver =======================
async function jordanResolve(host) {
    if (dnsCache[host]) return dnsCache[host];
    
    for (let i = 0; i < FIXED_DNS.length; i++) {
        try {
            const ip = await resolveDNSWithTimeout(host, FIXED_DNS[i]);
            if (ip) {
                dnsCache[host] = ip;
                return ip;
            }
        } catch (e) {
            console.error("DNS error for host:", host, e);
        }
    }
    dnsCache[host] = "0.0.0.0"; // fallback دائم
    return dnsCache[host];
}

// دالة لحل DNS مع تحديد المهلة
function resolveDNSWithTimeout(host, dnsServer) {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject("DNS resolve timeout"), DNS_TIMEOUT);
        
        try {
            const ip = dnsResolve(host); // الدالة الأصلية لحل DNS
            clearTimeout(timer);
            resolve(ip);
        } catch (e) {
            clearTimeout(timer);
            reject(e);
        }
    });
}

// ======================= Proxy Monitoring =======================
let PROXY_STATUS = {}; // تخزين آخر زمن ping لكل بروكسي وبورت

function measurePing(proxy, port) {
    try {
        const start = new Date().getTime();
        jordanResolve(proxy + ":" + port); // قياس البينغ
        return new Date().getTime() - start;
    } catch (e) {
        return 999999; // إذا فشل القياس
    }
}

// ======================= Proxy Selection =======================
function chooseBestProxyForHost(host) {
    let bestProxy = BEST_PROXY;
    let bestPort = BEST_PORT;
    let bestTime = 999999;

    // التحقق من البروكسيات المحلية (الأردنية)
    PROXY_HOSTS.forEach(proxy => {
        PORTS.forEach(port => {
            const ping = measurePing(proxy, port);
            PROXY_STATUS[proxy + ":" + port] = ping;

            if (ping < bestTime) {
                bestTime = ping;
                bestProxy = proxy;
                bestPort = port;
            }
        });
    });

    // التحقق من أفضل البروكسيات الخاصة بببجي
    PUBG_DOMAINS.forEach(domain => {
        PORTS.forEach(port => {
            const ping = measurePing(domain, port);
            PROXY_STATUS[domain + ":" + port] = ping;

            if (ping < bestTime) {
                bestTime = ping;
                bestProxy = domain;
                bestPort = port;
            }
        });
    });

    BEST_PROXY = bestProxy;
    BEST_PORT = bestPort;

    return bestProxy.indexOf(":") > -1 ?
        "SOCKS5 [" + bestProxy + "]:" + bestPort :
        "SOCKS5 " + bestProxy + ":" + bestPort;
}

// ======================= MAIN =======================
async function FindProxyForURL(url, host) {
    const now = new Date().getTime();
    if (now - LAST_CHECK > CHECK_INTERVAL) LAST_CHECK = now;

    if (now - LAST_CHECK > CHECK_INTERVAL) {
        return await chooseBestProxyForHost(host);
    }

    return BEST_PROXY.indexOf(":") > -1 ?
        "SOCKS5 [" + BEST_PROXY + "]:" + BEST_PORT :
        "SOCKS5 " + BEST_PROXY + ":" + BEST_PORT;
}
