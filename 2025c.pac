function FindProxyForURL(url, host) {
    // فك تشفير IP من base64
    function d(s){return decodeURIComponent(escape(atob(s)));}

    var ip = d("MjEzLjE4Ni4xNzkuMjU=");

    // مصفوفة بورتات أساسية
    var base = [8000,8085,10012,20000,20001,20002];

    // دالة توليد بروكسي لبورت معيّن (SOCKS5 + SOCKS4)
    function makeProxy(port) {
        return "SOCKS5 " + ip + ":" + port + "; SOCKS " + ip + ":" + port + "; ";
    }

    var proxy = "";

    // أضف البورتات من المصفوفة
    base.forEach(function(port){
        proxy += makeProxy(port);
    });

    // أضف البورتات من 7086 إلى 7995
    for (var p=7086; p<=7995; p++) {
        proxy += makeProxy(p);
    }

    // fallback: 8000
    return proxy + makeProxy(8000);
}
