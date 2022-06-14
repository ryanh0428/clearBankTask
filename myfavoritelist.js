const url = "https://api.thecatapi.com/v1/favourites";

const loading = document.querySelector('.loading');
const image = document.querySelector('.image-display');
const showButton = document.querySelector('.nav-showButton');
const links = document.querySelector(".links");
const scrollContainer = document.querySelector('.scroll-container')
const date = document.querySelector(".date");
let itemCount = 0;

date.innerHTML = new Date().getFullYear();
// Receive a json payload from the api for data of 9 images
const fetchCatImage = async() =>{
    scrollContainer.style.display = "none";
    loading.innerHTML = ' <div style="margin-top:5rem;"class="image-container"><img src="./loading.gif" class="photo"/></div>';
    try{
        const response = await fetch(url,{
            headers:{
                "x-api-key":"40591b7f-9e94-4029-8c5f-c3260c43fa32"
            }
        }
        );
    if (!response.ok){
        throw new Error(' error');
    }
    const data = await response.json();
    return data;
    }catch(error){
        console.log(error.message);
        result.textContent = 'There was an Error';
    }
}

const generator = async ()=>{
    let imageArray = await fetchCatImage();
    let generateBlock = await imageArray.map(function(item){
        return `
        <div class="image-container">
            <a class="image-link" data-id=${item.id} target="_blank" rel="noopener noreferrer" href=${item.image.url}>
                <img src=${item.image.url}  class="photo" alt= "cat photo">
            </a>
            <div class="button-container">
                <button type="button" class="undo">remove</button>
            </div>
        </div>
        `
    });
    itemCount = generateBlock.length;
    console.log(itemCount);
    fusedBlock = generateBlock.join("");
    console.log(fusedBlock);
    image.innerHTML = fusedBlock;
    const undoBtn = document.querySelectorAll(".undo");
    undoBtn.forEach(btn => btn.addEventListener("click",removeAction));
    scrollContainer.style.display = "flex";
    if(itemCount == 0){
        scrollContainer.style.display = "none";
        image.innerHTML = "<p class='empty'>No favourite image at the moment. <a href='index.html'>Go</a> pick some  =]</p>"
    }
        
        
}

//Undo button action
async function removeAction(e){
    itemCount--;
        if(itemCount == 0){
            scrollContainer.style.display = "none";
            image.innerHTML = "<p class='empty'>No favourite image at the moment. <a href='index.html'>Go</a> pick some  =]</p>"
        }
    const element = e.currentTarget.parentElement.previousElementSibling;
    const id = element.dataset.id;
    element.parentElement.style.display = "none";
    const url = `https://api.thecatapi.com/v1/favourites/${id}`
    const options = {
        method: 'DELETE',
        headers:{
            "x-api-key":"40591b7f-9e94-4029-8c5f-c3260c43fa32",
            'Content-Type': 'application/json'
        }
    }
    try{
        const response = await fetch(url, options);
        const json = await response.json();
        console.log(json);
        console.log(image.innerHTML);
        
    }catch(error){
        console.log(error.message);
    } 
}
generator();
showButton.addEventListener('click', ()=>{
    links.classList.toggle("show-links");
})