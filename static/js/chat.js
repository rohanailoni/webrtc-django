var label=document.querySelector('#label-username')
var input_name=document.querySelector('#username')
var btnjoin=document.querySelector('#btn-submit')
var localvideo=document.querySelector('#local-video')
var websocket
function message_view(e){






}

function getlocalmedia(mediastram){
    localstram=mediastram;
    localvideo.srcObject=mediastram;
}

var localstram=new MediaStream();

var usermedia=navigator.mediaDevices.getUserMedia({"audio":true,"video":true}).then(
    getlocalmedia
)





function signal(action,message){

    const ans={
        "action":action,
        "message":message,
    }

    websocket.send();
}

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
        var endpoint=wsstart+local.host +"/room/" ;

        websocket=new WebSocket(endpoint);

        input_name.value='';
        input_name.disabled=true;

        websocket.addEventListener('open',()=>{
            console.log("comnection opened");
            const a = JSON.stringify({
                "message":"hey ! the good news is i have connected",
            });
            websocket.send(a);

        });
        websocket.addEventListener('message',message_view)
        websocket.addEventListener('close',()=>{
            console.log("connection close");
        });
        websocket.addEventListener('error',()=>{
            console.log("OOOPS error occured");
        });

});