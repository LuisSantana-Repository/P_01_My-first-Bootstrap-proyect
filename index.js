function toHtmlDiv(obj) {
    let html=`
    <div class="col-lg-3 col-md-4 col-sm-6 mb-3">
                    <div class="card h-100">
                        <img src="${obj.imageUrl}" class="card-img-top" alt="${obj.name}">
                        <div class="card-body">
                            <h5 class="card-title">${obj.name}</h5>
                            <p class="card-text">${obj.description}
                            </p>
                            <div class="d-grid gap-2">
                                <button
                                    type="button"
                                    name=""
                                    id=""
                                    class="btn btn-warning"
                                    onclick="AddToCart('${obj.uuid}')" 
                                >
                                <i class="bi bi-cart-plus-fill"></i> Add to cart
                                </button>
                            </div>
                            
                        </div>
                        
                    </div>
                </div>
    `
    return html
} 



async function getProducts() {
    let response
    let seachParam = GetURLParameter("category") ? "?category="+GetURLParameter("category") : ""; 
    seachParam += GetURLParameter("name") ? (seachParam=="" ? "?name="+GetURLParameter("name") : "&name="+GetURLParameter("name") ): "";
    console.log(seachParam)
    console.log(seachParam)
    response = await fetch('https://products-dasw.onrender.com/api/products', {
        method: 'GET',
        headers: {
            'x-expediente': '744747',
            "x-auth": "admin"
        }
    })
    let data = await response.json()
    sessionStorage.setItem("products",JSON.stringify(data))
        response = await fetch('https://products-dasw.onrender.com/api/products'+seachParam, {
        method: 'GET',
        headers: {
            'x-expediente': '744747',
            "x-auth": "admin"
        }
    
    })
    

    data = await response.json()
    //You can process data here or return the data and call this function
    sessionStorage.setItem("localProducts",JSON.stringify(data))
    return data;
}
async function processData(){
    //Since getProducts is asynchronous, we must use await to wait for it to execute
    //So this function must also be asynchronous
    let data = await getProducts()
    await generatePagination()
    let pagination = sessionStorage.getItem("page") ? sessionStorage.getItem("page") : 1
    let end = pagination*4;
    console.log(data)
    data= data.slice(end-4,end)

    let seachParam = GetURLParameter("category"); 
    if(seachParam){
        console.log(seachParam)
        seachParam = `<h1>${seachParam.trim()}</h1>`
        document.querySelector("#Subtitle").innerHTML=seachParam
    }
    //console.log(data)
    let dataformat = data.map(u => {return toHtmlDiv(u)}).join("")
    //console.log(dataformat)
    document.querySelector('#productsCart').innerHTML =dataformat;
    generatePagination();
}


//referencia apa en el .txt


async function generatePagination(){
    let data = JSON.parse(sessionStorage.getItem("localProducts"))
    let length = Math.ceil(data.length/4)
    sessionStorage.setItem("page", 1)
    let html =""
    for (let index = 0; index < length; index++) {
        html+=`
        <li id="${index + 1}" class="page-item" aria-current="page">
            <a class="page-link" onclick="pagination(${index + 1})">${index + 1}</a>
        </li>`
    }
    document.querySelector(`#pagination`).innerHTML=html
    document.querySelector(`[id="1"]`).classList += " active"
}

async function pagination(num){
    let data = sessionStorage.getItem("page")
    document.querySelector(`[id="${data}"]`).classList= "page-item"
    sessionStorage.setItem("page", num)
    document.querySelector(`[id="${num}"]`).classList += " active"
    data = JSON.parse(sessionStorage.getItem("products"))
    let end = num*4;
    data= data.slice(end-4,end)
    let dataformat = data.map(u => {return toHtmlDiv(u)}).join("")
    //console.log(dataformat)
    document.querySelector('#productsCart').innerHTML =dataformat;
}

function AddToCart(id){
    //https://sweetalert.js.org/
    if(!sessionStorage.getItem("user")){
        swal({
            title:"Your not register",
            text:"Login First",
            icon: "error"
        });
    }else{
        let data = JSON.parse(sessionStorage.getItem("products"))
        let item = data.find(u => u.uuid==id)
        console.log(item)
        swal({
            title: "How many items?",
            icon: "info",
            content: {
                element: "input",
                attributes: {
                  placeholder: `1-${item.stock}`,
                  type: "number",
                },
              },
            buttons: true,
          })
          .then(async (selected) => {
            if (selected) {
                console.log(selected)
                if(selected<=item.stock && selected>0){
                    addItem(item.uuid,selected)
                }else{
                    swal({
                        title: "Quantity not correct",
                        icon: "error",
                        
                    });
                }
            } 
            else {
              swal({
                title: "No items added to cart",
                icon: "info",
            });
            }
          });
    }
}

async function addItem(id,number){
    let user =sessionStorage.getItem("user");
    console.log(id);
    response = await fetch('https://products-dasw.onrender.com/api/cart/'+id, {
        method: 'POST',
        headers: {
            'x-expediente': '744747',
            "x-user": user,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "amount": Number(number)
        })
    })
    if(response.status ==200 ||response.status ==201){
        swal({
            title: `Success status: ${response.status} `,
            icon: "success",
            
        });
    }else{
        swal({
            title: `Error status: ${response.status} `,
            icon: "error",
            
        });
    }
}




processData();