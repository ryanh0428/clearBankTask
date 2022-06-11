const url = "https://api.thecatapi.com/v1/images/search?limit=9";

const loading = document.querySelector('.loading');
const image = document.querySelector('.image-display');
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
        loading.textContent = 'There was an Error';
    }
};

const generator = async ()=>{
    let imageArray = await fetchCatImage();
    let generateBlock = imageArray.map(function(item){
        return `
        <div class="image-container">
            <img data-id=${item.id} src=${item.url} class="photo" alt= "cat photo">
            <div class="button-container">
            <button type="button" class="favourite">favourite</button>
            <button type="button" class="undo">undo</button>
            </div>
        </div>
        `
    
    })
    fusedBlock = generateBlock.join("");
    console.log(fusedBlock);
    image.innerHTML = fusedBlock;
    const favouriteBtn = document.querySelectorAll(".favourite");
    favouriteBtn.forEach(btn =>btn.addEventListener("click",favouriteAction
    ));
    const undoBtn = document.querySelectorAll(".undo");
    undoBtn.forEach(btn => btn.addEventListener("click",removeAction));
}

generator();

async function favouriteAction(e){
    const element = e.currentTarget.parentElement.previousElementSibling;
    const id = element.dataset.id;
    console.log(id);
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
    console.log(json);
      
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
        console.log(json);
    }catch(error){
        console.log(error.message);
    }
}

//Undo button action
async function removeAction(e){
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
            }
            );
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
    console.log(allfavourite);
    const targetFavourite = allfavourite.find(element => element.image_id == id)
    deleteFavourite (targetFavourite.id);
}


// function retrieveId
// https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch

// {
//     "breeds": [],
//     "height": 337,
//     "id": "24m",
//     "url": "https://cdn2.thecatapi.com/images/24m.jpg",
//     "width": 450
//   },