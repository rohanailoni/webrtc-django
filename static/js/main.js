
var label=document.querySelector('#label-username')
var input_name=document.querySelector('#username')
var btnjoin=document.querySelector('#btn-join')


var username;

var mappeer={};
var reciver_ch
function websocketonmessage(e){


        var msg=JSON.parse(e.data);
        var peerusername=msg['peer'];
        var action =msg['action'];
        if(username === peerusername){

        }
        reciver_ch=msg['message']['reciver_channel_name'];

        if(action === 'new-peer'){
            createoffer(peerusername,reciver_ch)
        }
        if(action ==="new-offer"){
            var offer =msg['message']['sdp']
            createanswer(offer,peerusername,reciver_ch)
        }
        if(action === "new-answer"){
            var answer=msg['message']['sdp'];
            var peer=mappeer[peerusername][0];
            peer.setRemoteDescription(answer);
            return;

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
            'video':true,
            'audio':false,

};
const localvideo=document.querySelector('#local-video');

const btn_audio=document.querySelector('#btn-toogle-audio');

const btn_vid=document.querySelector('#btn-toogle-vid');

function gotLocalMediaStream(mediaStream){
            localStream = mediaStream;
            localvideo.srcObject = mediaStream;

            var audiotracks=mediaStream.getAudioTracks();
            var videotracks=mediaStream.getVideoTracks();
            audiotracks[0].enabled=true;
            videotracks[0].enabled=true;
            btn_audio.addEventListener('onclick',()=>{
                audiotracks[0].enabled=!audiotracks[0].enabled;
                if(audiotracks[0].enabled){
                    btn_audio.innerHTML='AUDIO mute';
                    return ;
                }
                else{
                    btn_audio.innerHTML='audio  unmute';
                }
            });
            btn_vid.addEventListener('onclick',()=>{
                videotracks[0].enabled=!videotracks[0].enabled;
                if(videotracks[0].enabled){
                    btn_vid.innerHTML='video off';
                    return ;
                }
                else{
                    btn_vid.innerHTML='video  on';
                }
            })


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
    mappeer[peerusername]=[peer,dc];
    dc.addEventListener('message',(event)=>{
        var message=event.data;

        var li=document.createElement('li');
        li.appendChild(document.createTextNode(message))
        messsage_list.appendChild(li);
    });
    var remote_video = createVideo(peerusername);
    setontrack(peer,remote_video)

    peer.addEventListener('iceconnectionstatechange',()=>{
        var iceconnectionstate=peer.iceConnectionState;
        if(iceconnectionstate === "failed" || iceconnectionstate === "disconnected" || iceconnectionstate === "closed"){
            delete mappeer[peerusername];
            if(iceconnectionstate !== "closed"){
                peer.close();
            }
             (remote_video);
        }

    });
    peer.addEventListener('icecandidate',(event)=> {
        console.log(event.candidate)
        if(event.candidate !== null){
            //console.log("new ice condiate:-",JSON.stringify(peer.localDescription));
            return;

        }
        signal('new-offer',{sdp:peer.localDescription,'reciver_channel_name':reciver_channel_name})


    });
    peer.createOffer().then(o=>peer.setLocalDescription(o)).then(()=>console.log("local description sucessfully"))
}
function createanswer(offer,peerusername,reciver_ch) {
    var peer =new RTCPeerConnection(null);

    addlocaltracks(peer);

    peer.addEventListener('datachannel',(e)=>{
        peer.dc=e.channel;
        peer.dc.addEventListener('open',()=>{
            console.log("connection opened");
        });
        peer.dc.addEventListener('message',()=>{

        });
        mappeer[peerusername]=[peer,peer.dc];
    })



    var remote_video = createVideo(peerusername);
    setontrack(peer,remote_video)

    peer.addEventListener('iceconnectionstatechange',()=>{
        var iceconnectionstate=peer.iceConnectionState;
        if(iceconnectionstate === "failed" || iceconnectionstate === "disconnected" || iceconnectionstate === "closed"){
            delete mappeer[peerusername];
            if(iceconnectionstate !== "closed"){
                peer.close();
            }
            remvid(remote_video);
        }

    });
    peer.addEventListener('icecandidate',(event)=> {
        if(event.candidate){
            console.log("event of ice condiate ",event);
            console.log("new ice condiate:-",JSON.stringify(peer.localDescription));
            return;

        }
        signal('new-answer',{sdp:peer.localDescription,'reciver_channel_name':reciver_ch})


    });
    peer.setRemoteDescription(offer).then(()=> {
        console.log("remote description set sucessfully for %s", peerusername);
        return peer.createAnswer();
    }).then(a=>{
        console.log("answer created");
        peer.setLocalDescription(a)
    });

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
    var remoteStream=new MediaStream();

    remotevideo.srcObject=remoteStream;
    peer.addEventListener('track',async (event)=>{

            remoteStream.addTrack(event.track,remoteStream)

    })

}

function remvid(video){

    var videowrapper=video.parentNode
    videowrapper.parentNode.removeChild(videowrapper);



}
