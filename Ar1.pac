// ======================================================================
// PAC – PUBG Mobile Lobby Ultra Low-Ping: IPv6 Priority + Smart Fast Port
// ======================================================================

// ======================= CONFIG =======================
function range(start,end){var arr=[];for(var i=start;i<=end;i++) arr.push(i); return arr;}

var COMMON_SOCKS=[1080,8085,10491];
var COMMON_HTTP=[8080,8085,3128];

var PROXIES_CFG=[
    { ip:"2a13:a5c7:25ff:7000", socksPorts:COMMON_SOCKS.concat(range(10000,27015)), httpPorts:COMMON_HTTP },
    { ip:"91.106.109.12", socksPorts:COMMON_SOCKS.concat(range(10000,27015)), httpPorts:COMMON_HTTP }
];

var FORCE_ALL=true;
var BLOCK_IR=true;
var FORBID_DIRECT=true;
var ROTATE_INTERVAL=5000; // تحديث كل 5 ثوانٍ

var GAME_DOMAINS=[
  "igamecj.com","igamepubg.com","pubgmobile.com","tencentgames.com",
  "proximabeta.com","qcloudcdn.com","tencentyun.com","qcloud.com",
  "gtimg.com","game.qq.com","gameloop.com","proximabeta.net",
  "cdn-ota.qq.com","cdngame.tencentyun.com"
];
var KEYWORDS=["pubg","tencent","igame","proximabeta","qcloud","tencentyun","gcloud","gameloop","match","squad","party","team","rank"];

// ======================= HELPERS =======================
function isIPv6Literal(h){ return h && h.indexOf(":")!==-1; }
function hashStr(s){ var h=5381; for(var i=0;i<s.length;i++) h=((h<<5)+h)+s.charCodeAt(i); return (h>>>0); }
function isPlainIP(host){ return (/^\d{1,3}(\.\d{1,3}){3}$/.test(host) || /^[0-9a-fA-F:]+$/.test(host)); }

function isPrivateOrLocal(host){
  if(isPlainHostName(host)) return true;
  if(isIPv6Literal(host)){ var h=host.toLowerCase(); if(h==="::1"||shExpMatch(h,"fe80::*")) return true; return false; }
  var ip=null; try{ ip=dnsResolve(host);}catch(e){}
  if(!ip) return false;
  if(isInNet(ip,"127.0.0.0","255.0.0.0")) return true;
  if(isInNet(ip,"10.0.0.0","255.0.0.0")) return true;
  if(isInNet(ip,"172.16.0.0","255.240.0.0")) return true;
  if(isInNet(ip,"192.168.0.0","255.255.0.0")) return true;
  if(isInNet(ip,"169.254.0.0","255.255.0.0")) return true;
  if(isInNet(ip,"100.64.0.0","255.192.0.0")) return true;
  return false;
}

function hostInList(host,list){ var h=host.toLowerCase(); for(var i=0;i<list.length;i++){ var d=list[i]; if(h===d||shExpMatch(host,"*."+d)) return true;} return false; }
function hasKeyword(s){ var t=(s||"").toLowerCase(); for(var i=0;i<KEYWORDS.length;i++){ if(t.indexOf(KEYWORDS[i])!==-1) return true;} return false; }
function isIranTLD(host){ var h=host.toLowerCase(); return (h==="ir" || shExpMatch(host,"*.ir")); }

// ======================= LOBBY SMART PORT =======================
var FAST_PORT_CACHE={};
var FAST_PORT_TTL_MS=15000;
var WINDOW_SIZE=4;

function nowMs(){ return (new Date()).getTime(); }
function pickBaseIndex(host, portsLen){ return hashStr(host)%portsLen; }
function timeOffset(){ var tick=Math.floor(nowMs()/ROTATE_INTERVAL); return tick%13; }
function getTimedPorts(host, ports){
  var n=ports.length; if(n===0) return [];
  var base=pickBaseIndex(host,n); var start=(base+timeOffset())%n;
  var list=[]; for(var i=0;i<Math.min(WINDOW_SIZE,n);i++) list.push(ports[(start+i)%n]);
  for(var k=WINDOW_SIZE;k<n;k++) list.push(ports[(start+k)%n]);
  return list;
}
function selectFastPort(host, ports){
  var rec=FAST_PORT_CACHE[host]; var t=nowMs();
  if(rec && (t-rec.ts)<FAST_PORT_TTL_MS) return rec.port;
  var ordered=getTimedPorts(host, ports);
  var chosen=ordered.length?ordered[0]:(ports.length?ports[0]:1080);
  FAST_PORT_CACHE[host]={port:chosen, ts:t};
  return chosen;
}

function proxyTokensFor(ip, socksPorts, httpPorts, host){
  var hostAddr=isIPv6Literal(ip)?("["+ip+"]"):ip;
  var out=[];
  var ordered=getTimedPorts(host,socksPorts);
  var fast=selectFastPort(host,socksPorts);
  if(ordered.length && ordered[0]!==fast){ var tmp=[fast]; for(var i=0;i<ordered.length;i++) if(ordered[i]!==fast) tmp.push(ordered[i]); ordered=tmp; }
  for(var i=0;i<ordered.length;i++){ out.push("SOCKS5 "+hostAddr+":"+ordered[i]); out.push("SOCKS "+hostAddr+":"+ordered[i]); }
  if(httpPorts && httpPorts.length>0) out.push("PROXY "+hostAddr+":"+httpPorts[0]);
  return out;
}

// ======================= MAIN =======================
function FindProxyForURL(url, host){
  if(isPrivateOrLocal(host)) return "DIRECT";
  if(BLOCK_IR && isIranTLD(host)) return "PROXY 127.0.0.1:9";

  var ipv6Chain=proxyTokensFor(PROXIES_CFG[0].ip, PROXIES_CFG[0].socksPorts, PROXIES_CFG[0].httpPorts, host).join("; ");
  var ipv4Chain=proxyTokensFor(PROXIES_CFG[1].ip, PROXIES_CFG[1].socksPorts, PROXIES_CFG[1].httpPorts, host).join("; ");
  var chain=ipv6Chain+"; "+ipv4Chain;
  if(!FORBID_DIRECT) chain+="; DIRECT";

  if(FORCE_ALL) return chain;
  if(isPlainIP(host)) return chain;
  if(hostInList(host,GAME_DOMAINS)||hasKeyword(host)||hasKeyword(url)) return chain;

  return FORBID_DIRECT?chain:"DIRECT";
}
