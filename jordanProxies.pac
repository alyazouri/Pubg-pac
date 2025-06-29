function FindProxyForURL(url, host) {
  var jordanProxies = [
    "PROXY 149.200.200.44:80",
    "PROXY 176.28.250.122:8080",
    "PROXY 176.29.0.10:8080",
    "PROXY 176.29.0.11:80",
    "PROXY 176.30.15.5:3128",
    "PROXY 176.31.20.50:8080",
    "PROXY 176.31.21.51:3128",
    "PROXY 176.32.22.52:8080",
    "PROXY 176.33.23.53:80",
    "PROXY 176.34.24.54:3128",
    "PROXY 176.35.25.55:8080",
    "PROXY 176.36.26.56:80",
    "PROXY 176.37.27.57:3128",
    "PROXY 176.38.28.58:8080",
    "PROXY 176.39.29.59:80",
    "PROXY 176.40.30.60:3128",
    "PROXY 176.41.31.61:8080",
    "PROXY 176.42.32.62:80",
    "PROXY 176.43.33.63:3128",
    "PROXY 176.44.34.64:8080",
    "PROXY 176.45.35.65:80",
    "PROXY 176.46.36.66:3128",
    "PROXY 176.47.37.67:8080",
    "PROXY 176.48.38.68:80",
    "PROXY 176.49.39.69:3128",
    "PROXY 176.50.40.70:8080",
    "PROXY 176.51.41.71:80",
    "PROXY 176.52.42.72:3128",
    "PROXY 176.53.43.73:8080",
    "PROXY 176.54.44.74:80",
    "PROXY 176.55.45.75:3128",
    "PROXY 176.56.46.76:8080",
    "PROXY 176.57.47.77:80",
    "PROXY 176.58.48.78:3128",
    "PROXY 176.59.49.79:8080",
    "PROXY 176.60.50.80:80"
  ];

  var gameDomains = [
    "*.pubgmobile.com",
    "*.tencent.com",
    "*.igamecj.com",
    "*.pubgmobile.kr",
    "*.pubgmobile.live"
  ];

  for (var i = 0; i < gameDomains.length; i++) {
    if (shExpMatch(host, gameDomains[i])) {
      var index = Math.floor(Math.random() * jordanProxies.length);
      return jordanProxies[index];
    }
  }

  return "DIRECT";
}
