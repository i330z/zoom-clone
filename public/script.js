const socket = io('/');
// "/"" coz the root is server.js

const videoGrid = document.getElementById('video-grid');
const myPeer = new Peer(undefined, {
    host: '/',
    port: '3001'
})

const myVideo = document.createElement('video');
myVideo.muted = true;


navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true
}).then(stream => {
    addVideoStream(myVideo, stream)

    myPeer.on('call', call => {
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream =>{
            addVideoStream(video, userVideoStream)
        })
    })

    socket.on('user-connected', userId => {
        connectToNewUser(userId, stream)
    })
})

myPeer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id)
})

function addVideoStream(video, stream){
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    videoGrid.append(video)
}

function connectToNewUser(userId, stream) {
    // we are sending video to the user
    const call = myPeer.call(userId, stream)
    // we can the video stream from the other users and passing it to our addVideoStream fn
    const video = document.createElement('video');
    call.on('stream', userVideoStream => {
        addVideoStream(video,userVideoStream)
    })
    call.on('close', () => {
        video.remove();
    })
}

// socket.on('user-connected', userId => {
//     console.log('user connected:', userId);
// } )