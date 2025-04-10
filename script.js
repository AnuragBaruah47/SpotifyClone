let currFolder;
let songsArray=[]
const button=document.querySelector(".signup-btn")
async function getSongs() {
    let a = await fetch("http://127.0.0.1:5500/Songs/RAP");
    let response = await a.text();
    console.log(response);
    const div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    for (let i = 0; i < as.length; i++) {
        const element = as[i];
        if (element.href.endsWith(".mp3")) {
            songsArray.push(element.href)
        }
    }
    console.log("Songs found in folder", currFolder + ":", songsArray);
    
}

async function main() {
    let songs= await getSongs('RAP')
    //play the first song
    let audio = new Audio(songsArray[0])
    console.log(audio);
    button.addEventListener("click",()=>{
        audio.play()
    })
}
main()
