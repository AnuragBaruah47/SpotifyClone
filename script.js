let currFolder;
let currentSongs=new Audio()
let songsArray = [];
const play=document.querySelector("#play")
const button = document.querySelector(".signup-btn");
function formatSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
      return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
}
async function getSongs() {
  let a = await fetch("http://127.0.0.1:5500/Songs/RAP");
  let response = await a.text();
  // console.log(response);
  const div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  for (let i = 0; i < as.length; i++) {
    const element = as[i];
    if (element.href.endsWith(".mp3")) {
      songsArray.push((element.href));
    }
  }
  // console.log("Songs found in folder", currFolder + ":", songsArray);
}
const playMusic=(track)=>{
  let source="http://127.0.0.1:5500/Songs/RAP/"+(track)
  currentSongs.src=source
  currentSongs.play()
  play.src=`./img/pause.svg`
  document.querySelector(".songinfo").innerHTML=decodeURIComponent(track)
  document.querySelector(".songtime").innerHTML="00::00/00:00"
}
async function main() {
  let songs = await getSongs("RAP");
  currentSongs.src=songsArray[0]
  let audio = new Audio(songsArray[0]);
  // show all the songs in the playlist
  let songUl = document
    .querySelector(".songslists")
    .getElementsByTagName("ul")[0];
  for (const song of songsArray) {
    songUl.innerHTML =
      songUl.innerHTML +
      `              <li><img src="./img/music.svg" class="invert" alt="home">
              <div class="info">
                <div>${decodeURIComponent(song).split("/RAP/")[1]}</div>
                <div>Raftaar</div>
              </div>
              <div class="playnow">
                <span>Play </span> <span> Now</span>
                <img src="./img/play.svg" class="invert" alt="">
              </div>
            </li>`;
  }
  //attach an event listeners to each songs
  Array.from(document.querySelector(".songslists").getElementsByTagName("li")).forEach(e=>{
    e.addEventListener("click",()=>{
      playMusic(encodeURIComponent(e.querySelector(".info").firstElementChild.innerHTML).replaceAll(" ",""))
    })
  })
}

//previous and next song
play.addEventListener("click",()=>{
  if (currentSongs.paused) {
    currentSongs.play()
    play.src=`./img/pause.svg`
  }else if(currentSongs.played){
    currentSongs.pause()
    play.src="./img/play.svg"
  }
})
//time update   
currentSongs.addEventListener("timeupdate",()=>{
  console.log(currentSongs.currentTime,currentSongs.duration)
  document.querySelector(".songtime").innerHTML=`${(formatSeconds(currentSongs.currentTime))}/${formatSeconds(currentSongs.duration)}`
  document.querySelector(".circle").style.left=(currentSongs.currentTime/currentSongs.duration)*100 + "%"
})
// seek bar 
document.querySelector(".seekbar").addEventListener("click",(e)=>{
  let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100
  document.querySelector(".circle").style.left=percent + "%"
  currentSongs.currentTime=(currentSongs.duration)*percent/100
})


main();
