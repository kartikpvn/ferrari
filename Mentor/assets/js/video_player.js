
var playbtn = document.getElementById('playbtn')
var pausebtn = document.getElementById('pausebtn')
var video   = document.getElementById('myvideo')
var show_more_1 = document.getElementById('show-more-1')
var show_more_2 = document.getElementById('show-more-2')
var show_less_2 =  document.getElementById('show-less-2')

playbtn.addEventListener("click", play)
pausebtn.addEventListener("click", pause)
video.addEventListener("ended", ended)
show_more_1.addEventListener("click", change_body)
show_more_2.addEventListener("click", show_more)
show_less_2.addEventListener("click", show_less)

function change_body() {
    
    if (show_more_1.innerText == "Show more >>") {
        show_more_1.innerText = "Show less <<";
    }
    else {
        show_more_1.innerText = "Show more >>";
    }
}

function show_more() {
    show_more_2.style.display = "none";
    show_less_2.style.display = "block";
}

function show_less() {
    show_more_2.style.display = "block";
    show_less_2.style.display   = "none";
}

function ended() {
    playbtn.style.display = "block";
    pausebtn.style.display = "none";
}

function play() {
    playbtn.style.display = "none";
    video.play();
    pausebtn.style.display = "block";
}

function pause() {
    pausebtn.style.display = "none";
    playbtn.style.display = "block";
    video.pause();
}
