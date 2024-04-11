let min = undefined
let max = undefined
let seachParam= undefined
function Min(){
    let value = document.getElementById('Min').value
    console.log(value);
    if(value>0){
        min = "min="+value
    }else{
        min = undefined
    }
    changeParams()
}
function Max(){
    let value = document.getElementById('Max').value
    console.log(value);
    if(value>0){
        max = "max="+value
    }else{
        max = undefined
    }
    changeParams()
}


function table(obj, propOrder = ["name","description","imageUrl","unit","stock","pricePerUnit","category","button"]){
    let html = /*html*/`
        <table>
            <tr>`
            +propOrder.map(u => /*html*/`
                <th>${u}</th>
            `).join('')+`
                
            </tr>
            `+ 
                obj.map(u => toHtmlRow(u,propOrder)).join('')
            +`
        </table>
    `
    return html
    console.log(html)
}
function toHtmlRow(obj, propOrder = ["name","description","imageUrl","unit","stock","pricePerUnit","Category"]) {
    let html='<tr>'
    if(propOrder ==undefined || propOrder.length==0){
    }else{
        propOrder.forEach(element => {
            if(element =="imageUrl"){
                html+=`<td><img src="${obj[element]}" alt="" style="width: 50px;"></td>`
            }else if(element =="button"){
                html+=` <td><a
                class="btn btn-primary"
                href="#"
                role="button"
                onclick = "editProduct('${obj.uuid}')"
                ><i class="bi bi-pencil-fill"></i>
            </a> </td>`
            }else{
            html+=`<td>${obj[element]}</td>`
            }
        });
    }
    html+='</tr>'
    return html
} 
function changeParams(){
    //console.log(document.getElementById("classS"))
    seachParam = document.getElementById('classS').value ?  '?category='+document.getElementById('classS').value :  undefined
    if(min){
        seachParam = seachParam ? seachParam+"&"+min : "?"+min
    }
    if(max){
        seachParam = seachParam ? seachParam+"&"+max : "?"+max
    }
    processData()
}

async function getProducts() {
    let response
    let fetchtext ='https://products-dasw.onrender.com/api/products/'+ (seachParam?seachParam:'')
    console.log(seachParam)
    console.log(fetchtext)
        response = await fetch(fetchtext, {
        method: 'GET',
        headers: {
            'x-expediente': '744747',
            "x-auth": "admin"
        }
    })

    data = await response.json()
    sessionStorage.setItem("products",JSON.stringify(data))
    //You can process data here or return the data and call this function
    console.log(data)
    return data;
}
async function processData(){
    //Since getProducts is asynchronous, we must use await to wait for it to execute
    //So this function must also be asynchronous
    let data = await getProducts()
    //console.log(data)
    
    //console.log(data)
    let dataformat =table(data)
    //console.log(dataformat)
    //console.log(dataformat)
    //console.log(document.getElementById('Table'));
    document.getElementById('Table').innerHTML =dataformat;
}


function editProduct(id){
    let products = JSON.parse(sessionStorage.getItem('products'))
    let product = products.find(u => u.uuid == id)

    console.log("user to edit: ",id);
    let modalId = document.getElementById('EditProduct');
    console.log(modalId);
    
    let myModal = new bootstrap.Modal(modalId, {});
    for (key in product) {
        if (key !='_id'){
            let selector = `${key}`
            //console.log(selector)
            document.getElementById(`${selector}`).value = product[key];
        }
        
        
    }
    myModal.show();
    
}

function cancelProduct(){
    let productItems=["name","description","imageUrl","unit","stock","pricePerUnit","category","uuid"]
    productItems.forEach(element => {
            //console.log(element)
            document.getElementById(`${element}`).value=''
    });
}
async function storeProduct(){
    event.preventDefault()
    let ProductEdit = {}
    let productItems=["name","description","imageUrl","unit","stock","pricePerUnit","category"]
    productItems.forEach(element => {
            //console.log(element)
            ProductEdit[element]=document.getElementById(`${element}`).value;
            document.getElementById(`${element}`).value=''
    });
    let id = document.getElementById("uuid").value
    console.log(ProductEdit)
    console.log(id)
    let response
    if(!id){
        response = await fetch('https://products-dasw.onrender.com/api/products', {
        method: 'POST',
        headers: {
            'x-expediente': '744747',
            "x-auth": "admin",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(ProductEdit)
    })
    }else{
        console.log(ProductEdit)
        response = await fetch('https://products-dasw.onrender.com/api/products/'+id, {
        method: 'PUT',
        headers: {
            'x-expediente': '744747',
            "x-auth": "admin",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(ProductEdit)
    })
    }
    let data = await response.json()


    if(!data.error){
        swal("Data Updated", "User:"+ data.name + " updated" , "success");
        processData()
    }else{
        swal("Error", data.error , "error");
    }


    //console.log(data);
    cancelProduct()
    processData()

}
processData()