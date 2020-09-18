const DiscordRPC = require('discord-rpc')
const ClientId = "748185208054087740";
var express = require('express');
var app = express()
var http = require('http').createServer(app)
var io = require('socket.io')(http);
var gui = require('nw.gui');
//nw.Window.open('localhost:47896/frontend/index.html', {}, function(win) {});

var tray;
tray = new gui.Tray({ 
  icon:'frontend/favicon.png', 
  tooltip:'Super Rich Presence'
});

// reusing the custom tray menu (just hiding and showing)
var customTrayMenu = gui.Window.open('./frontend/custom-tray-menu.html', {
  width: 300, height: 300,
  frame: false,
  show: false,
  show_in_taskbar: false 
}, function(win) {
//var win = gui.Window.get();

var iconWidth = 13;
var translate = require('os').platform() == 'darwin' ?
  function (pos) {
    pos.x -= Math.floor(win.width/2-iconWidth);
  } :
  function (pos) {
    pos.x -= Math.floor(win.width/2);
    pos.y -= trayAreaIsTop(pos) ? 0 : win.height;
  };
function trayAreaIsTop(pos) {
  var screen;
  if (gui.Screen.Init) gui.Screen.Init();
  function posInBounds(s) {
    return pos.y > s.bounds.y && pos.y < (s.bounds.y + s.bounds.height) &&
      pos.x > s.bounds.x && pos.x < (s.bounds.x + s.bounds.width);
  }
  screen = gui.Screen.screens.filter(posInBounds)[0];
  return pos.y < (screen.bounds.y + screen.bounds.height) / 2;
}
function showCustomTrayMenuAt(position) {
  translate(position);
  win.moveTo(position.x, position.y);
  win.show();
  win.focus();
}
tray.on('click',showCustomTrayMenuAt);
win.on('blur', function() {
  win.hide()
});
//win.on('close', function() {
//    this.hide()
//})
});
var rpcdefiner = {}

app.use("/frontend", express.static("./frontend"))

io.on('connection', (socket) => {
    console.log("Socket conectado")
    rpcdefiner.details = "Aguardando dados"
    rpcdefiner.state = "Api desconhecida"
    rpcdefiner.largeImageKey = "logolongsrp"
    rpcdefiner.startTimestamp = Date.now()
    rpc.setActivity(rpcdefiner);
    socket.on('disconnect', () => {
        rpcdefiner = {}
        console.log('Socket desconectado');
        rpcdefiner.details = "Aguardando dados"
        rpcdefiner.state = "Api desconectada"
        rpcdefiner.largeImageKey = "logolongerror"
        rpcdefiner.largeImageText = "Por: Space_Interprise"
        rpc.setActivity(rpcdefiner);
        rpcdefiner.rpcAvatar = rpc.user.avatar;
        rpcdefiner.rpcId = rpc.user.id;
        rpcdefiner.rpcName = rpc.user.username;
        rpcdefiner.rpcDisc = rpc.user.discriminator;
        socket.broadcast.emit("DataLoad", JSON.stringify(rpcdefiner))
    });
    socket.on('SetRPC', (details, state, largeImageKey, largeImageText, smallImageKey, smallImageText, startTimestamp, endTimestamp, partyId, partyMax, spectateSecret, joinSecret) => {
        rpcdefiner = {}
        rpcImages ={}
        if (details&&details != "__NONE__") {rpcdefiner.details = details}
        if (state&&state != "__NONE__") {rpcdefiner.state = state}
        if (largeImageKey&&largeImageKey != "__NONE__") {rpcImages.largeImageKey = largeImageKey}
        if (largeImageText&&largeImageText != "__NONE__") {rpcdefiner.largeImageText = largeImageText}
        if (smallImageKey&&smallImageKey != "__NONE__") {rpcImages.smallImageKey = smallImageKey}
        if (smallImageText&&smallImageText != "__NONE__") {rpcdefiner.smallImageText = smallImageText}
        if (partyId&&partyId != "__NONE__") {rpcdefiner.partyId = partyId}
        if (startTimestamp&&startTimestamp != "__NONE__") {rpcdefiner.startTimestamp = Number(startTimestamp)}
        if (endTimestamp&&endTimestamp != "__NONE__") {rpcdefiner.endTimestamp = Number(endTimestamp)}
        if (partyMax&&partyMax != "__NONE__") {rpcdefiner.partyMax = partyMax}
        if (spectateSecret&&spectateSecret != "__NONE__") {rpcdefiner.spectateSecret = spectateSecret}
        if (joinSecret&&joinSecret != "__NONE__") {rpcdefiner.joinSecret = joinSecret}
        if (rpcImages.largeImageKey === "noimage") {rpcdefiner.largeImageKey = " "} else {rpcdefiner.largeImageKey = rpcImages.largeImageKey}
        if (rpcImages.smallImageKey === "noimage") {rpcdefiner.smallImageKey = " "} else {rpcdefiner.smallImageKey = rpcImages.smallImageKey}
        rpc.setActivity(rpcdefiner)
        rpcdefiner.rpcAvatar = rpc.user.avatar;
        rpcdefiner.rpcId = rpc.user.id;
        rpcdefiner.rpcName = rpc.user.username;
        rpcdefiner.rpcDisc = rpc.user.discriminator;
        socket.broadcast.emit("DataLoad", JSON.stringify(rpcdefiner))
    })
    socket.on('GetData', ()=>{
        rpcdefiner.rpcAvatar = rpc.user.avatar;
        rpcdefiner.rpcId = rpc.user.id;
        rpcdefiner.rpcName = rpc.user.username;
        rpcdefiner.rpcDisc = rpc.user.discriminator;
        socket.emit("DataLoad", JSON.stringify(rpcdefiner))
    })
  });

const rpc = new DiscordRPC.Client({
    transport: 'ipc'
});

rpc.on('ready', () => {
    console.log(`SuperRichPresence conectado com ${rpc.user.username+"#"+rpc.user.discriminator}`);
    rpcdefiner.details = "Aguardando dados"
    rpcdefiner.state = "Nenhuma api conectada"
    rpcdefiner.largeImageKey = "logolongsrp"
    rpcdefiner.largeImageText = "Por: Space_Interprise"
    rpc.setActivity(rpcdefiner);
});

rpc.login({ clientId: ClientId }).catch(console.error);

http.listen(47896, () => {
  console.log('Websocket ativado na porta 47896');
});