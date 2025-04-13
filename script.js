let currFolder;
let currentSongs = new Audio();
let songsArray = [];
let songs;
let source;
let currfolder;
const play = document.querySelector("#play");
const button = document.querySelector(".signup-btn");
function formatSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}
async function getSongs(folder) {
  currFolder = folder;
  let a = await fetch(`http://127.0.0.1:5500/Songs/${currFolder}`);
  let response = await a.text();
  const div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songsArray = [];
  for (let i = 0; i < as.length; i++) {
    const element = as[i];
    if (element.href.endsWith(".mp3")) {
      songsArray.push(element.href);
    }
  }
  // show all the songs in the playlist
  let songUl = document
    .querySelector(".songslists")
    .getElementsByTagName("ul")[0];
  songUl.innerHTML = ``;
  for (const song of songsArray) {
    songUl.innerHTML =
      songUl.innerHTML +
      `              <li><img src="./img/music.svg" class="invert" alt="home">
              <div class="info">
                <div>${decodeURIComponent(song).split(`${currFolder}`)[1]}</div>
              </div>
              <div class="playnow">
                <span>Play </span> <span> Now</span>
                <img src="./img/play.svg" class="invert" alt="">
              </div>
            </li>`;
  }
  //attach an event listeners to each songs
  Array.from(
    document.querySelector(".songslists").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", () => {
      playMusic(
        encodeURIComponent(
          e.querySelector(".info").firstElementChild.innerHTML
        ).replaceAll(" ", "")
      );
    });
  });
}
const playMusic = (track) => {
  source = `http://127.0.0.1:5500/Songs/${currFolder}` + track;
  currentSongs.src = source;
  console.log(track)
  console.log(`http://127.0.0.1:5500/Songs/${currFolder}` + track)
  currentSongs.play();
  play.src = `./img/pause.svg`;
  document.querySelector(".songinfo").innerHTML = decodeURIComponent(track);
  console.log(decodeURIComponent(track));
  document.querySelector(".songtime").innerHTML = "00::00/00:00";
};

async function displayAlbums() {
  //1
  let a = await fetch(`http://127.0.0.1:5500/Songs/`);
  let response = await a.text();
  const div = document.createElement("div");
  div.innerHTML = response;
  let allAnchors = div.querySelectorAll("a");
  for (let i = 0; i < allAnchors.length; i++) {
    //2
    const e = allAnchors[i];
    if (e.href.includes("/Songs/")) {
      //3
      let folder = e.href.split("/").splice(-2)[1];
      //get meta data of folder
      let a = await fetch(`http://127.0.0.1:5500/Songs/${folder}/info.json`);
      let response = await a.json();
      let cardContainer = document.querySelector(".cardcontainer");
      cardContainer.innerHTML =
        cardContainer.innerHTML +
        `    <div data-folder="${folder}" class="card">
              <div class="play">
                <?xml version="1.0" encoding="UTF-8"?>
                <svg
                  width="50"
                  height="50"
                  viewBox="0 0 100 100"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="50" cy="50" r="50" fill="#66FF00" />
                  <polygon points="35,25 75,50 35,75" fill="#000000" />
                </svg>
              </div>
              <img src="./songs/${folder}/cover.jpg" alt="" />
              <h2>${response.title}</h2>
              <p>${response.description}</p>
            </div>`;
      //loading the library by clicking card
      document.querySelectorAll(".card").forEach((e) => {
        //4
        e.addEventListener("click", async (item) => {
          //5
          songs = await getSongs(`${item.currentTarget.dataset.folder}`);
        }); //5
      }); //4
    } //3
  } //2
} //1

async function main() {
  songs = await getSongs("HDV1");
  currentSongs.src = songsArray[0];

  

  //display an Album
  displayAlbums();

  //previous and next song
  play.addEventListener("click", () => {
    if (currentSongs.paused) {
      currentSongs.play();
      play.src = `./img/pause.svg`;
    } else if (currentSongs.played) {
      currentSongs.pause();
      play.src = "./img/play.svg";
    }
  });
}

//time update
currentSongs.addEventListener("timeupdate", () => {
  document.querySelector(".songtime").innerHTML = `${formatSeconds(
    currentSongs.currentTime
  )}/${formatSeconds(currentSongs.duration)}`;
  document.querySelector(".circle").style.left =
    (currentSongs.currentTime / currentSongs.duration) * 100 + "%";
});
// seek bar
document.querySelector(".seekbar").addEventListener("click", (e) => {
  let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
  document.querySelector(".circle").style.left = percent + "%";
  currentSongs.currentTime = (currentSongs.duration * percent) / 100;
});

// prev and next

previous.addEventListener("click", () => {
  let index = songsArray.indexOf(currentSongs.src);
  if (index - 1 >= 0) {
    playMusic(
      decodeURIComponent(songsArray[index - 1]).split(`${currFolder}`)[1]
    );
    console.log((songsArray),"here");
    
  }
});

next.addEventListener("click", () => {
  let index = songsArray.indexOf(currentSongs.src);
  if (index + 1 < songsArray.length) {
    playMusic(
      decodeURIComponent(songsArray[index + 1]).split(`${currFolder}`)[1]
    );
  }
});

addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") {
    let index = songsArray.indexOf(currentSongs.src);
    if (index + 1 < songsArray.length) {
      playMusic(
        decodeURIComponent(songsArray[index + 1]).split(`${currFolder}`)[1]
      );
    }
  } else if (e.key === "ArrowLeft") {
    let index = songsArray.indexOf(currentSongs.src);
    if (index - 1 >= 0) {
      playMusic(
        decodeURIComponent(songsArray[index - 1]).split(`${currFolder}`)[1]
      );
    }
  } else if (e.key === " ") {
    if (currentSongs.paused) {
      currentSongs.play();
      play.src = `./img/pause.svg`;
    } else if (currentSongs.played) {
      currentSongs.pause();
      play.src = "./img/play.svg";
    }
  }
});

// volume
document
  .querySelector(".range")
  .getElementsByTagName("input")[0]
  .addEventListener("change", (e) => {
    currentSongs.volume = parseInt(e.target.value) / 100;
  });

  //mute track
  document.querySelector(".volume>img").addEventListener("click",(e)=>{
    if (e.target.src.includes("volume.svg")) {
      e.target.src= e.target.src.replace("volume.svg","mute.svg")
      currentSongs.volume=0
      document.querySelector(".range").getElementsByTagName("input")[0].value=0
    }else{
      e.target.src= e.target.src.replace("mute.svg","volume.svg")
      currentSongs.volume=0.1
      document.querySelector(".range").getElementsByTagName("input")[0].value=10
    }
  })

main();
