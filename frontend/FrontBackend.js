console.log("Backend carregado!")
const TimeDiference = 3;
const DiscordAppId = "748185208054087740"
let request = new XMLHttpRequest();
var socket = io.connect("http://localhost:47896");
let BigImage;
let SmallImage;
socket.on("connect", ()=>{
    socket.emit('GetData');
    setTimeout(()=>{
        if (!BigImage) {
            socket.emit('GetData');
        }
    }, 5000)
    socket.on("DataLoad", (RpcCurrentData)=>{
        let data = JSON.parse(RpcCurrentData)
        if (!data.details||data.details === "__NONE__") {data.details = ""}
        if (!data.state||data.state === "__NONE__") {data.state = ""}
        if (!data.largeImageKey||data.largeImageKey === "__NONE__") {data.largeImageKey = ""}
        if (!data.largeImageText||data.largeImageText === "__NONE__") {data.largeImageText = ""}
        if (!data.smallImageKey||data.smallImageKey === "__NONE__") {data.smallImageKey = ""}
        if (!data.smallImageText||data.smallImageText === "__NONE__") {data.smallImageText = ""}
        if (!data.partyId||data.partyId === "__NONE__") {data.partyId = ""}
        if (!data.startTimestamp||data.startTimestamp === "__NONE__") {data.startTimestamp = ""}
        if (!data.endTimestamp||data.endTimestamp === "__NONE__") {data.endTimestamp = ""}
        if (!data.partyMax||data.partyMax === "__NONE__") {data.partyMax = ""}
        if (!data.spectateSecret||data.spectateSecret === "__NONE__") {data.spectateSecret = ""}
        if (!data.joinSecret||data.joinSecret === "__NONE__") {data.joinSecret = ""}
        let AssetsData;
        request.open('GET', "https://discordapp.com/api/oauth2/applications/"+DiscordAppId+"/assets")
        request.responseType = 'text';
        request.onload = function() {
            let SmallImageId;
            let LargeImageId;
            AssetsData = JSON.parse(request.response);
            if (AssetsData) {
                document.getElementsByClassName("SelectBigImage")[0].innerHTML = ""
                document.getElementsByClassName("SelectSmallImage")[0].innerHTML = ""
                AssetsData.forEach(element => {
                    if (element.name === data.largeImageKey) {
                        LargeImageId = element.id; 
                        BigImage = element.name;
                    }
                    if (element.name === data.smallImageKey) {
                        SmallImageId = element.id;
                        SmallImage = element.name;
                    }
                    document.getElementsByClassName("SelectBigImage")[0].innerHTML = document.getElementsByClassName("SelectBigImage")[0].innerHTML+"<img src='https://cdn.discordapp.com/app-assets/748185208054087740/"+element.id+".png' onclick='BigImage=`"+element.name+"`;document.getElementsByClassName(`LargeImage`)[0].src=`https://cdn.discordapp.com/app-assets/748185208054087740/"+element.id+".png`'>"
                    document.getElementsByClassName("SelectSmallImage")[0].innerHTML = document.getElementsByClassName("SelectSmallImage")[0].innerHTML+"<img src='https://cdn.discordapp.com/app-assets/748185208054087740/"+element.id+".png' onclick='SmallImage=`"+element.name+"`;document.getElementsByClassName(`SmallImage`)[0].src=`https://cdn.discordapp.com/app-assets/748185208054087740/"+element.id+".png`'>"
                })
            }
            SmallImageId?document.getElementsByClassName("SmallImage")[0].src="https://cdn.discordapp.com/app-assets/748185208054087740/"+SmallImageId+".png":"/frontend/NoImage.png"
            LargeImageId?document.getElementsByClassName("LargeImage")[0].src="https://cdn.discordapp.com/app-assets/748185208054087740/"+LargeImageId+".png":"/frontend/NoImage.png"
        };
        request.send();
        data.startTimestamp?data.startTimestamp=data.startTimestamp:data.startTimestamp="0"
        data.endTimestamp?data.endTimestamp=data.endTimestamp:data.endTimestamp="0"
        data.startTimestamp===""?data.startTimestamp="0":data.startTimestamp=data.startTimestamp
        data.endTimestamp===""?data.endTimestamp="0":data.endTimestamp=data.endTimestamp
        let startTime = new Date(Number(data.startTimestamp))
        if (!data.endTimestamp.toString().includes(":")) {endTime= new Date(Number(data.endTimestamp))} else {endTime=data.endTimestamp}
        startTime.setHours(startTime.getHours()-TimeDiference)
        //endTime.setHours(endTime.getHours()-TimeDiference)
        startTime = startTime.toISOString().substr(11, 8)
        endTime = endTime.toISOString().substr(11, 8)
        document.getElementsByClassName("detailsInput")[0].value = data.details
        document.getElementsByClassName("stateInput")[0].value = data.state
        document.getElementsByClassName("UserAvatar")[0].src = "https://cdn.discordapp.com/avatars/"+data.rpcId+"/"+data.rpcAvatar+".png?size=512"
        document.getElementsByClassName("UserName")[0].innerHTML = data.rpcName+`<span class="Discriminator"></span>`
        document.getElementsByClassName("Discriminator")[0].innerText = "#"+data.rpcDisc;
        document.getElementsByClassName("largeImageTextInput")[0].value = data.largeImageText;
        document.getElementsByClassName("smallImageTextInput")[0].value = data.smallImageText;
        document.getElementsByClassName("partyIdInput")[0].value = data.partyId;
        document.getElementsByClassName("startTimeInput")[0].value = startTime;
        document.getElementsByClassName("endTimeInput")[0].value = endTime;
        document.getElementsByClassName("partyMaxInput")[0].value = data.partyMax;
        document.getElementsByClassName("spectateSecretInput")[0].value = data.spectateSecret;
        document.getElementsByClassName("joinSecretInput")[0].value = data.joinSecret;
        document.getElementsByClassName("LargeImage")[0].addEventListener("mouseover", () => {
            document.getElementsByClassName("SelectImageBigBox")[0].id = "Apper";
            document.getElementsByClassName("BigImageInput")[0].id = "Apper";
            document.getElementsByClassName("GamePart")[0].style.height = "45em";
        })
        document.getElementsByClassName("BigImageInput")[0].addEventListener("mouseover", () => {
            document.getElementsByClassName("BigImageInput")[0].id = "Apper";
        })
        document.getElementsByClassName("SelectImageBigBox")[0].addEventListener("mouseover", () => {
            document.getElementsByClassName("SelectImageBigBox")[0].id = "Apper";
            document.getElementsByClassName("BigImageInput")[0].id = "Apper";
            document.getElementsByClassName("GamePart")[0].style.height = "45em";
        })
        document.getElementsByClassName("LargeImage")[0].addEventListener("mouseleave", () => {
            document.getElementsByClassName("SelectImageBigBox")[0].id = "Disapper";
            document.getElementsByClassName("BigImageInput")[0].id = "Disapper";
            document.getElementsByClassName("GamePart")[0].style.height = "25em";
        })
        document.getElementsByClassName("BigImageInput")[0].addEventListener("mouseleave", () => {
            document.getElementsByClassName("BigImageInput")[0].id = "Disapper";
        })
        document.getElementsByClassName("SelectImageBigBox")[0].addEventListener("mouseleave", () => {
            document.getElementsByClassName("SelectImageBigBox")[0].id = "Disapper";
            document.getElementsByClassName("BigImageInput")[0].id = "Disapper";
            document.getElementsByClassName("GamePart")[0].style.height = "25em";
        })
        document.getElementsByClassName("SmallImage")[0].addEventListener("mouseover", () => {
            document.getElementsByClassName("SelectImageSmallBox")[0].id = "Apper";
            document.getElementsByClassName("SmallImageInput")[0].id = "Apper";
            document.getElementsByClassName("GamePart")[0].style.height = "45em";
        })
        document.getElementsByClassName("SelectImageSmallBox")[0].addEventListener("mouseover", () => {
            document.getElementsByClassName("SelectImageSmallBox")[0].id = "Apper";
            document.getElementsByClassName("SmallImageInput")[0].id = "Apper";
            document.getElementsByClassName("GamePart")[0].style.height = "45em";
        })
        document.getElementsByClassName("SmallImageInput")[0].addEventListener("mouseover", () => {
            document.getElementsByClassName("SmallImageInput")[0].id = "Apper";
        })
        document.getElementsByClassName("SmallImage")[0].addEventListener("mouseleave", () => {
            document.getElementsByClassName("SelectImageSmallBox")[0].id = "Disapper";
            document.getElementsByClassName("SmallImageInput")[0].id = "Disapper";
            document.getElementsByClassName("GamePart")[0].style.height = "25em";
        })
        document.getElementsByClassName("SelectImageSmallBox")[0].addEventListener("mouseleave", () => {
            document.getElementsByClassName("SelectImageSmallBox")[0].id = "Disapper";
            document.getElementsByClassName("SmallImageInput")[0].id = "Disapper";
            document.getElementsByClassName("GamePart")[0].style.height = "25em";
        })
        document.getElementsByClassName("SmallImageInput")[0].addEventListener("mouseleave", () => {
            document.getElementsByClassName("SmallImageInput")[0].id = "Disapper";
        })
        document.getElementsByClassName("Save")[0].addEventListener("click", () => {
            data.details = document.getElementsByClassName("detailsInput")[0].value;
            data.state = document.getElementsByClassName("stateInput")[0].value;
            data.largeImageText = document.getElementsByClassName("largeImageTextInput")[0].value.toString()
            data.smallImageText = document.getElementsByClassName("smallImageTextInput")[0].value.toString()
            data.partyId = document.getElementsByClassName("partyIdInput")[0].value
            data.startTimestamp = document.getElementsByClassName("startTimeInput")[0].value;
            data.endTimestamp = document.getElementsByClassName("endTimeInput")[0].value;
            data.partyMax = document.getElementsByClassName("partyMaxInput")[0].value;
            data.spectateSecret = document.getElementsByClassName("spectateSecretInput")[0].value;
            data.joinSecret = document.getElementsByClassName("joinSecretInput")[0].value;
            //---------
            data.details===""?data.details="__NONE__":data.details=data.details;
            data.state===""?data.state="__NONE__":data.state=data.state;
            data.largeImageText===""?data.largeImageText="__NONE__":data.largeImageText=data.largeImageText;
            data.smallImageText===""?data.smallImageText="__NONE__":data.smallImageText=data.smallImageText;
            data.partyId===""?data.partyId="__NONE__":data.partyId=data.partyId;
            data.partyMax===""?data.partyMax="__NONE__":data.partyMax=data.partyMax;
            data.spectateSecret===""?data.spectateSecret="__NONE__":data.spectateSecret=data.spectateSecret;
            data.joinSecret===""?data.joinSecret="__NONE__":data.joinSecret=data.joinSecret;
            let StartHours = data.startTimestamp.split(":")[0]
            let StartMinutes = data.startTimestamp.split(":")[1]
            let StartSecounds = data.startTimestamp.split(":")[2]
            let DefinerTimeStart = new Date(Date.now())
            DefinerTimeStart.setHours(StartHours)
            DefinerTimeStart.setMinutes(StartMinutes)
            DefinerTimeStart.setSeconds(StartSecounds)
            data.startTimestamp = Date.parse(DefinerTimeStart).toString();
            console.log(data.endTimestamp)
            let EndHours = data.endTimestamp.split(":")[0]
            let EndMinutes = data.endTimestamp.split(":")[1]
            let EndSecounds = data.endTimestamp.split(":")[2]
            let DefinerTimeEnd = new Date(Date.now())
            DefinerTimeEnd.setHours(EndHours)
            DefinerTimeEnd.setMinutes(EndMinutes)
            DefinerTimeEnd.setSeconds(EndSecounds)
            data.endTimestamp = Date.parse(DefinerTimeEnd).toString();
            data.largeImageKey = BigImage;
            data.smallImageKey = SmallImage;
            console.log(data)
            socket.emit("SetRPC", data.details,data.state,data.largeImageKey,data.largeImageText,data.smallImageKey,data.smallImageText,data.startTimestamp,data.endTimestamp,data.partyId,data.partyMax,data.spectateSecret,data.joinSecret)
        })
    });
});