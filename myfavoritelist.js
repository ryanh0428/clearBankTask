const url = "https://api.thecatapi.com/v1/favourites";

const loading = document.querySelector('.loading');
const image = document.querySelector('.image-display');
const showButton = document.querySelector('.nav-showButton');
const links = document.querySelector(".links");
const date = document.getElementById('date');
date.innerHTML = new Date().getFullYear();
const fetchCatImage = async() =>{
    loading.textContent = 'Loading...';
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
    let generateBlock = imageArray.map(function(item){
        return `
        <div class="image-container">
            <img data-id=${item.id} src=${item.image.url} class="photo" alt= "cat photo">
            <div class="button-container">
                <button type="button" class="undo" onclick="alert('Hello world!')">remove</button>
            </div>
        </div>
        `
    
    })
    fusedBlock = generateBlock.join("");
    console.log(fusedBlock);
    image.innerHTML = fusedBlock;
    const undoBtn = document.querySelectorAll(".undo");
    undoBtn.forEach(btn => btn.addEventListener("click",removeAction));
}
//Undo button action
async function removeAction(e){
    const element = e.currentTarget.parentElement.previousElementSibling;
    const id = element.dataset.id;
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
        element.parentElement.style.display = "none";
    }catch(error){
        console.log(error.message);
    } 
}
generator();
showButton.addEventListener('click', ()=>{
    links.classList.toggle("show-links");
})