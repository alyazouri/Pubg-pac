function FindProxyForURL(url, host) {

    // 1) تجاوز الشبكات المحلية مباشرة بدون بروكسي
    if (
        isPlainHostName(host) || shExpMatch(host, "*.local") ||
        shExpMatch(host, "localhost") || shExpMatch(host, "127.*") ||
        shExpMatch(host, "10.*") || shExpMatch(host, "192.168.*") ||
        shExpMatch(host, "169.254.*")
    ) {
        return "DIRECT"; // الطلب محلي → مباشر
    }

    // 2) تعريف قائمة البروكسيات مع بورت SOCKS5 وHTTP
    var PROXIES = [
        {host: "91.106.109.12", socks: 10491, http: 8085},
        {host: "91.106.109.11", socks: 10491, http: 8085}
    ];

    // 3) هوستات مهمة يجب توجيهها عبر بروكسي
    var CRITICAL_HOSTS = ["pubgmobile.com","igamecj.com","proximabeta.com"];

    // 4) هوستات تحميل أصول يمكن DIRECT أو بروكسي
    var ASSET_HOSTS = ["tencent.com","qcloudcdn.com","cdn.pubgmobile.com","dl.pubgmobile.com"];

    // 5) بورتات اللعبة (PAC لا يؤثر على UDP)
    var GAME_PORTS = [8011,9030,10491,10612,12235,13748,17000,17500,18081,20000,20001,20002];

    // 6) استخراج البورت من URL
    function extractPort(u, h) {
        try {
            var parts = u.split("/");
            var hostport = parts[2] || h;
            var hp = hostport.split(":");
            if (hp.length > 1) {
                var p = parseInt(hp[1], 10);
                if (!isNaN(p)) return p;
            }
        } catch(e){}
        return shExpMatch(u,"https:*")?443:80; // HTTPS → 443، غيرها 80
    }

    // 7) دالة هاش بسيطة لتوزيع ثابت للبروكسي
    function simpleHash(s) {
        var h=0;
        for(var i=0;i<s.length;i++){h+=s.charCodeAt(i);}
        return h;
    }

    // 8) اختيار بروكسي حسب الهواش (ثابت لكل host)
    function selectProxy(h) {
        var idx = simpleHash(h) % PROXIES.length;
        var p = PROXIES[idx];
        return "SOCKS5 " + p.host + ":" + p.socks +
               "; PROXY " + p.host + ":" + p.http +
               "; DIRECT"; // fallback → DIRECT
    }

    var port = extractPort(url, host);

    // 9) إذا البورت يطابق GAME_PORTS → استخدم بروكسي
    for(var i=0;i<GAME_PORTS.length;i++){
        if(port===GAME_PORTS[i]) return selectProxy(host);
    }

    // 10) إذا الهوست ضمن CRITICAL → بروكسي
    for(var j=0;j<CRITICAL_HOSTS.length;j++){
        if(dnsDomainIs(host,CRITICAL_HOSTS[j]) || shExpMatch(host,"*."+CRITICAL_HOSTS[j]))
            return selectProxy(host);
    }

    // 11) إذا الهوست ضمن ASSET → بروكسي أو DIRECT
    for(var k=0;k<ASSET_HOSTS.length;k++){
        if(dnsDomainIs(host,ASSET_HOSTS[k]) || shExpMatch(host,"*."+ASSET_HOSTS[k]))
            return selectProxy(host);
    }

    // 12) باقي الطلبات → DIRECT
    return "DIRECT";
}
