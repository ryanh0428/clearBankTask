const url = "https://api.thecatapi.com/v1/images/search?limit=9";

const loading = document.querySelector('.loading');
const image = document.querySelector('.image-display');
const showButton = document.querySelector('.nav-showButton');
const links = document.querySelector(".links");
const date = document.querySelector(".date");
const scollDown = document.querySelector(".scroll-down");
const scrollContainer = document.querySelector(".scroll-container");
date.innerHTML = new Date().getFullYear();

// Receive a json payload from the api for data of 9 images
const fetchCatImage = async() =>{
    scrollContainer.style.display = "none";
    loading.innerHTML = '<div style="margin-top:5rem;"class="image-container"><img src="./loading.gif" class="photo"/></div>';
    try{
        const response = await fetch(url,{
            headers:{
                "x-api-key":"40591b7f-9e94-4029-8c5f-c3260c43fa32"
            }
        });
    if (!response.ok){
        throw new Error(' error');
    }
    const data = await response.json();
    return data;
    }catch(error){
        console.log(error.message);
        loading.textContent = 'There was an Error';
    }
}

//extract the data from jsonpayload and compose a HTML script with the extracted
const generator = async ()=>{
    let imageArray = await fetchCatImage();
    let generateBlock = await imageArray.map(function(item){
        return `
        <div class="image-container">
            <a class="image-link" data-id=${item.id} target="_blank" rel="noopener noreferrer" href=${item.url}>
                <img src=${item.url} class="photo" alt= "cat photo">
            </a>
            <div class="button-container">
            <button type="button" class="favourite">favourite</button>
            <button type="button" class="undo">undo</button>
            </div>
        </div>
        `   
    });
    fusedBlock = generateBlock.join("");
    return fusedBlock;
}

//image container will get the HTML code
const initialGenerator = async ()=>{
    image.innerHTML = await generator();
    addButtonAndEventListner();
}
initialGenerator();

//submit Post request to add a favourite image
const favouriteAction= async(e) =>{
    const element = e.currentTarget.parentElement.previousElementSibling;
    const id = element.dataset.id;
    const data = {"image_id":id, "sub_id": "your-user-1234"};
    const options = {
        method: 'POST',
        headers:{
            "x-api-key":"40591b7f-9e94-4029-8c5f-c3260c43fa32",
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
    const response = await fetch('https://api.thecatapi.com/v1/favourites', options);
    const json = await response.json(); 
}

//submit delete request
const deleteFavourite = async(favouriteId) =>{
    const url = `https://api.thecatapi.com/v1/favourites/${favouriteId}`
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
    }catch(error){
        console.log(error.message);
    }
}

//Obtain a list of element from the favourite API, and find the id required
const removeAction = async(e) =>{
    const element = e.currentTarget.parentElement.previousElementSibling;
    const id = element.dataset.id;
    console.log(id);
    const url = "https://api.thecatapi.com/v1/favourites";
    const fetchFavouriteImage = async() =>{
        try{
            const response = await fetch(url,{
                headers:{
                    "x-api-key":"40591b7f-9e94-4029-8c5f-c3260c43fa32"
                }
            });
        if (!response.ok){
            throw new Error(' error');
        }
        const data = await response.json();

        return data;
        }catch(error){
            console.log(error.message);
        }
    }
    const allfavourite = await fetchFavouriteImage();
    const targetFavourite = allfavourite.find(element => element.image_id == id);//find the element containing the image id of removing target
    try{
        deleteFavourite (targetFavourite.id);//pass value in the id key of the element to the delete method
    }catch(error){
        console.log(error.message);
    }  
}

showButton.addEventListener('click', ()=>{
    links.classList.toggle("show-links");
})

scollDown.addEventListener('click',async()=>{
    image.innerHTML += await generator();
    addButtonAndEventListner();
});

const addButtonAndEventListner=()=>{
    const favouriteBtn = document.querySelectorAll(".favourite");
    favouriteBtn.forEach(btn =>btn.addEventListener("click",favouriteAction
    ));
    const undoBtn = document.querySelectorAll(".undo");
    undoBtn.forEach(btn => btn.addEventListener("click",removeAction));
    scrollContainer.style.display = "flex";
}
