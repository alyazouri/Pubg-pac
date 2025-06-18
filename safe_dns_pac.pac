
function FindProxyForURL(url, host) {
    // حجب محتوى إباحي
    if (
        shExpMatch(host, "*pornhub.com") ||
        shExpMatch(host, "*xvideos.com") ||
        shExpMatch(host, "*xnxx.com") ||
        shExpMatch(host, "*redtube.com") ||
        shExpMatch(host, "*youporn.com")
    ) {
        return "PROXY 127.0.0.1:8080";
    }

    // حجب إعلانات مزعجة
    if (
        shExpMatch(host, "*ads.google.com") ||
        shExpMatch(host, "*doubleclick.net") ||
        shExpMatch(host, "*googlesyndication.com") ||
        shExpMatch(host, "*taboola.com") ||
        shExpMatch(host, "*outbrain.com")
    ) {
        return "PROXY 127.0.0.1:8080";
    }

    // باقي المواقع تمر مباشرة
    return "DIRECT";
}
