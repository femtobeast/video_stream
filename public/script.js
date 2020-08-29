
const videoGrid = document.getElementById('video-grid')
const myVideo = document.createElement('video');
const socket = io('/')
myVideo.muted = true;
let myVideoStream;

var peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',//online host platform(herouku)
    port: '443'
});

///opening video streamming from browser
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream)
    peer.on('call', call => {
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })

    })

    socket.on('user-connected', (userId) => {
        connectToNewUser(userId, stream);
    })

    let text = $('input')
    console.log(text)

    $('html').keydown((event) => {
        if (event.which == 13 && text.val().length !== 0) {
            console.log(text.val())
            socket.emit('message', text.val());
            text.val('')
        }
    })


    socket.on('createMessage', message => {
        $('ul').append(`<li class="message"><b>User</b><br/>${message}</li>`)
        scrollToBottom();
    })

})

peer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id)
})

// socket.emit('join-room',ROOM_ID)



const connectToNewUser = (userId, stream) => {
    const call = peer.call(userId, stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
    })
}
const addVideoStream = (video, stream) => {
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    videoGrid.append(video);
}


const scrollToBottom = () => {
    let d = $('.main__chat_windows');
    d.scrollTop(d.prop('scrollHeight'));
}


const muteUnmute = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if (enabled) {
        myVideoStream.getAudioTracks()[0].enabled = false;
        setUnMuteButton();
    } else {
        setMuteButton();
        myVideoStream.getAudioTracks()[0].enabled = true;
    }
}


const setMuteButton = () => {
    const html = `<li class="fas fa-microphone"></li>
    <span>Mute</span>`
    document.querySelector('.main__mute_button').innerHTML = html
}
const setUnMuteButton = () => {
    const html = `<li class="unmute fas fa-microphone-slash"></li>
    <span>Unmute</span>`
    document.querySelector('.main__mute_button').innerHTML = html
}

const playStop = () => {
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled) {
        myVideoStream.getVideoTracks()[0].enabled = false;
        setPlayVideo()
    } else {
        setStopVideo()
        myVideoStream.getVideoTracks()[0].enabled = true;
    }
}

const setStopVideo = () => {
    const html = `
      <i class="fas fa-video"></i>
      <span>Stop Video</span>
    `
    document.querySelector('.main__video_button').innerHTML = html;
}

const setPlayVideo = () => {
    const html = `
    <i class="stop fas fa-video-slash"></i>
      <span>Play Video</span>
    `
    document.querySelector('.main__video_button').innerHTML = html;
}