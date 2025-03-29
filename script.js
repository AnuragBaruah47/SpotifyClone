async function main() {
    let a= await fetch("http://127.0.0.1:5500/Projects/Spotify_Clone/songs/HDV2")
    let response= await a.text()
    let songs=response.toString()
   const div=document.createElement("div")
   div.innerHTML=songs
   div.getElementsByTagName("div")
   const mainLi=div.getElementsByTagName("a")
   console.log(mainLi);
   
//    const anchor=mainLi.getElementsByTagName("")
   let songArray=[]
   for (let index = 0; index < anchor.length; index++) {
    const element = anchor[index];
   const mainSong=element.href
   if (mainSong.endsWith(".mp3")){
     songArray.push(mainSong)
   }
   }
   console.log(songArray);
   
}
main()