let searchField = document.getElementById('searchField')
let searchBtn = document.getElementById('searchBtn')
let gallery = document.getElementById('gallery')
let nextPage = document.getElementById('next')
let previousPage = document.getElementById('previous')
const url = 'https:api.flickr.com/services/rest?method=flickr.photos.search'
const key = '1246934a7827586119ac64c8bac3a3ea'
const settings = '&sort=relevance&media=photo&format=json&nojsoncallback=1'
let perPage = 20;
let currentPage = 1;


searchBtn.addEventListener('click', async () =>{
    const userSearch = searchField.value
    getImage(userSearch)
})

//ställer in hur många bilder/sida som ska visas
let getSelectedValue = () =>{   
    let selectedValue = document.getElementById('pageSorter').value;
    perPage = selectedValue; //ändrar värde i url o visar valt nr av anv
}

//btns för next/previous photos

nextPage.addEventListener('click', () => {
    currentPage++;
    document.documentElement.scrollTop = 0;
    getImage(searchField.value, currentPage); //för in två parametrar som ska användas i url i funktionen getImage, uppdateras varje gång klickar
})

previousPage.addEventListener('click', () => {
    currentPage--;
    document.documentElement.scrollTop = 0;
    getImage(searchField.value, currentPage); //samma som ovan fast åt andra hållet
})

//får fram bilderna när man söker via denna funktion, 2 parametrar skickas in och uppdateras varje gång sidan laddas om via sök eller nästa/föregående sida
async function getImage(input, currentPage){
    const response = await fetch(`${url}&api_key=${key}&text=${input}&safe_search=1&per_page=${perPage}&page=${currentPage}${settings}`)
    const data = await response.json();
    const imageTracker = data.photos.photo //får fram alla bilderna i array
    displayImages(imageTracker)
}

//skickas sedan in här, där parametern (datan) numera heter pictures
 let displayImages = (pictures) =>{ 
     gallery.innerHTML = ''; //vid varje sökning så refreshas sökresultatet. 
    pictures.forEach(value => {
        const item = document.createElement('figure')
        const img = document.createElement('img')
        const serverId = value.server //hämtar data från varje träff och lägger in i url för att sedan få ut bilder
        const id = value.id
        const secret = value.secret
        const imgSrc = `https://live.staticflickr.com/${serverId}/${id}_${secret}_z.jpg`
            item.setAttribute('class', "column")
            img.setAttribute('class', "img")
            img.setAttribute('src', imgSrc) //läggs till som src för att få fram bilden
            item.append(img)
            gallery.append(item)
            clickImg(img)  
     })
}

let clickImg = (img) =>{ //skickar in bildinfon in i denna funktion för att kunna anv den för att få fram bilden större när man klickar på bilden i galleriet. 
         img.addEventListener('click', (e) =>{
            let myOverlay = document.createElement('div');
            
            //inställningar för höjd och bredd på img. Resterande inställningar i CSS
            myOverlay.style.width = window.innerWidth + 'px';
            myOverlay.style.height = window.innerHeight + 'px';
            
            //skapar figure till img-elementet som sedan ligger på overlayen
            let imgWrap = document.createElement('figure')
            let img = document.createElement('img');
            imgWrap.setAttribute('id', "imgWrapper")
            img.setAttribute('id', "imgOverlay")
            img.src = e.target.src; //img src tas från klickad bild till nya elementet.

            //lägger till stäng-knappen
            let close = document.createElement('figure')
            let closeBtn = document.createElement('p')
            closeBtn.setAttribute('id', "closeBtn")
            closeBtn.innerHTML = "&times;"

            close.append(closeBtn)
            myOverlay.append(img)
            
            //lägger på bilden samt stängknappen på overlayen som är över bodyn
            myOverlay.append(imgWrap)
            imgWrap.append(close)
            imgWrap.append(img)
            document.body.append(myOverlay); //lägger overlayen på själva bodyn på hemsidan.
            //När klickar på x stängs bilden ner och man kommer tillbaka till galleriet
            close.addEventListener('click', () =>{
                if(myOverlay){
                    myOverlay.parentNode.removeChild(myOverlay) //tar bort child till bodyn och body visar sig
                }
            })

         })
}
