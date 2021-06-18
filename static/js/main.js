
var label=document.querySelector('#label-username')
var input_name=document.querySelector('#username')
var btnjoin=document.querySelector('#btn-join')


var username;


function websocketonmessage(e){


        var msg=JSON.parse(e.data);
        var peerusername=msg['peer'];
        var action =msg['action'];
        if(username === peerusername){

        }
        var reciver_ch=msg['message']['reciver_channel_name'];

        if(action === 'new-peer'){
            createoffer(peerusername,reciver_channel_name)
        }


}

var websocket;

btnjoin.addEventListener('click',()=>{
    username=input_name.value
        if(username===""){
            return
        }
        input_name.value=username;
        input_name.disabled=true;
        input_name.style.visibility='hidden'

        btnjoin.disabled=true;
        btnjoin.innerHTML=username;

        var loc=window.location;
        var wsstart='ws://';
        if(loc.protocol ==='https:'){
            wsstart='wss://';
        }
        var endpoint=wsstart+loc.host +loc.pathname ;
        console.log(endpoint)

        websocket= new WebSocket(endpoint)

        websocket.addEventListener('open',()=>{
            console.log("connnection opened");
            signal('new-peer',{});

        })
        websocket.addEventListener('message',websocketonmessage);
        websocket.addEventListener('close',()=>{
            console.log("connection close");

        });
        websocket.addEventListener('error',()=>{
            console.log("OOOPS error occured");
        });




    }
);
var localstram= new MediaStream();

const constrains={
            'video':false,
            'audio':false,

};
const localvideo=document.querySelector('#local-video');
var localStream;
function gotLocalMediaStream(mediaStream){
            localStream = mediaStream;
            localvideo.srcObject = mediaStream;
            }
function handleLocalMediaStreamError(error) {
            console.log("error accesing media devices",error)
        console.log('navigator.getUserMedia error: ', error);
        }
var userMedia=navigator.mediaDevices.getUserMedia(constrains).then(
            gotLocalMediaStream
        ).catch(
            handleLocalMediaStreamError

        );



function signal(action,message){
    var jsonstr=JSON.stringify({
    'peer':username,
    'action':action,
    'message':message,

});
    websocket.send(jsonstr);
}
var messsage_list= document.querySelector('#message-list');





function createoffer(peerusername,reciver_channel_name){
    var peer =new RTCPeerConnection(null);

    addlocaltracks(peer);

    var dc= peer.createDataChannel('channel');

    dc.addEventListener('open',()=>{
        console.log("rtc connection opened");
    });

    dc.addEventListener('message',(event)=>{
        var message=event.data;

        var li=document.createElement('li');
        li.appendChild(document.createTextNode(message))
        messsage_list.appendChild(li);
    });
    var remote_video = createVideo(peerusername);
    setontrack(peer,peerusername)
}

function addlocaltracks(peer){
    localStream.getTracks().forEach(track =>{
        peer.addTrack(track,localStream);
    });

    return;

}
function createVideo(peerusername) {
    var videocont = document.querySelector('#video-container');

    var remote = document.createElement('video')

    remote.id = peerusername + "-video";
    remote.autoplay = true;
    remote.playsInline = true;

    var videowrapper = document.createElement('div');
    videocont.appendChild(videowrapper);
    videowrapper.appendChild(remote);


    return remote;

}
function setontrack(peer,remotevideo){
    var remotestream=new MediaStream();

    remotevideo.srcObject=remotestream;
    peer.addEventListener('track',async (event)=>{

    })

}