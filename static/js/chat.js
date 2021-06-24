var label=document.querySelector('#label-username')
var input_name=document.querySelector('#username')
var btnjoin=document.querySelector('#btn-submit')

var websocket



btnjoin.addEventListener('click',()=>{
    username=input_name.value;
    if(username===""){return;}

    btnjoin.disabled=true;
        btnjoin.innerHTML=username;

        var local =window.location;
        var wsstart='ws://';
        if(local.protocol ==='https:'){
            wsstart='wss://';
        }
        var endpoint=wsstart+local.host +"/audio" ;

        websocket=new WebSocket(endpoint);
        websocket.onopen=()=>{
            console.log("connection opened")
        }





});