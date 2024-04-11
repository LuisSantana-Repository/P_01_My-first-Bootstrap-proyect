function toHtmlDiv(obj) {
    //console.log(obj);
    let data = JSON.parse(sessionStorage.getItem("products"))
    let item = data.find(u => u.uuid==obj.uuid)
    let html=/*html*/ `
        <div class="media border p-3 w-100">
        <img src="${obj.product.imageUrl}" alt="${obj.product.name}" class="mr-3 mt-3 rounded-circle" style="max-width: 100px;">
                        <div class="media-body">
                            <h4>${obj.product.name}<a hid
                                name=""
                                id=""
                                class="btn btn-danger"
                                href="#"
                                role="button"
                                onclick="deleteItem('${obj.uuid}')"
                                ><i class="bi bi-trash-fill"></i></a
                            >
                            </h4>

                            <div class="input-group mb- w-50">
                                <span class="input-group-text" id="prefixId">Quantity:</span>
                                <input
                                    type="number"
                                    id="number${obj.uuid}"
                                    class="form-control"
                                    value="${obj.amount}"
                                    disabled
                                    aria-describedby="prefixId"
                                />
                                <a
                                    name=""
                                    id="edit${obj.uuid}"
                                    class="btn btn-success"
                                    href="#"
                                    onclick="allowEdit('${obj.uuid}')" 
                                    role="button"
                                    
                                    ><i class="bi bi-pencil-fill"></i></a
                                >
                                <a
                                    name=""
                                    id="accept${obj.uuid}"
                                    class="btn btn-success"
                                    href="#"
                                    role="button"
                                    onclick="changenumber('${obj.uuid}')"
                                    hidden
                                    ><i class="bi bi-check-lg"></i></a
                                >
                                <a
                                    name=""
                                    id="cancel${obj.uuid}"
                                    class="btn btn-danger"
                                    href="#"
                                    role="button"
                                    onclick="cancel('${obj.uuid}')"
                                    hidden
                                    ><i class="bi bi-file-excel"></i></a
                                >
                                
                            </div>
                            <div class="input-group w-50">
                                <span class="input-group-text" id="prefixId">Price:</span>
                                <input
                                    type="number"
                                    name="name"
                                    id="name"
                                    class="form-control"
                                    value="${obj.product.pricePerUnit}"
                                    aria-describedby="suffixId" disabled
                                />
                                <span class="input-group-text" id="suffixId">MXN</span>
                            </div>
                        </div>
                    </div>
    `

    return html
} 

function purchaseList(list){
    html =/*html*/`
        <div class="media border p-3 ms-lg-3 ms-md-3  w-100" >
                        <div class="media-body">
                            <h4>Total purchase:</h4>`
                            html += list.cart.map(u => /*html*/`
                                <p><b>${u.product.name}:</b> ${u.amount} x ${u.product.pricePerUnit} MX</p>
                            `).join("")
                            html+=/*html*/`
                            
                            <h5>Total: ${list.total} MXN</h5>
                            <div class="d-grid gap-2 px-5">
                                <a
                                    name="Pay"
                                    id=""
                                    class="btn btn-primary"
                                    href="P01_orders.html"
                                    role="button"
                                    >Pay</a
                                >

                            </div>

                            <div class="d-grid gap-2 px-5 py-3">
                                <button
                                    type="button"
                                    name="Pay"
                                    id=""
                                    class="btn btn-danger"
                                >
                                    Cancel
                                </button>
                            </div>
                            
                        </div>
                    </div>
    `
    return html
}

async function GetData(){
    let user = sessionStorage.getItem("user")


    let response = await fetch('https://products-dasw.onrender.com/api/cart', {
        method: 'GET',
        headers: {
            'x-expediente': '744747',
            "x-user": user
        }
    })
    let data = await response.json()
    sessionStorage.setItem("cart",JSON.stringify(data))
    return data
}

async function ProccessData(){
    let data =await GetData()
    console.log(data)
    let cart = data.cart
    //console.log(cart);
    let html = cart.map(u => {return toHtmlDiv(u)}).join("")
    document.querySelector('#items').innerHTML = html;
    html =purchaseList(data) 
    console.log(html)
    document.querySelector('#list').innerHTML = html;
}
function allowEdit(id){
    //console.log(`#edit${id}`)
    let editButton = document.getElementById(`edit${id}`)
    editButton.hidden=true
    let acceptButton = document.getElementById(`accept${id}`)
    let StopButton = document.getElementById(`cancel${id}`)
    let value = document.getElementById(`number${id}`)
    acceptButton.hidden = false;
    StopButton.hidden = false;
    value.disabled= false
}
function notaAllowEdit(id){
    //console.log(`#edit${id}`)
    let editButton = document.getElementById(`edit${id}`)
    editButton.hidden=false
    let acceptButton = document.getElementById(`accept${id}`)
    let StopButton = document.getElementById(`cancel${id}`)
    let value = document.getElementById(`number${id}`)
    acceptButton.hidden = true;
    StopButton.hidden = true;
    value.disabled= true
}
async function changenumber(id){
    let user = sessionStorage.getItem("user")
    let value = document.getElementById(`number${id}`).value
    value= Number(value)
    console.log(value)
    if(value == 0){
        deleteItem(id)
        notaAllowEdit(id)
    }if(value<0){
        swal({
            title: "Not negative numbers",
            icon: "error",
        });
        notaAllowEdit(id)
    }else{
        notaAllowEdit(id)
        let response = await fetch('https://products-dasw.onrender.com/api/cart/'+id, {
        method: 'POST',
        headers: {
            'x-expediente': '744747',
            "x-user": user,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "amount": Number(value)
        })
    })
    console.log(response)
    GetData();
    let data = await response.json()
    //console.log(response)
    }
}
async function cancel(id){
    let list = JSON.parse(sessionStorage.getItem("cart"))
    //console.log(list)
    list = list.cart
    let item = list.find(u => u.uuid == id)
    
    document.getElementById(`number${id}`).value = item.amount
    notaAllowEdit(id)

}

async function deleteItem(id){
    let list = JSON.parse(sessionStorage.getItem("cart"))
    let user = sessionStorage.getItem("user")
    list = list.cart
    let item = list.find(u => u.uuid == id)
    console.log(item)
    swal({
        title: "Are you sure?",
        text: `You want to delete ${item.product.name}?`,
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then(async(willDelete) => {
        if (willDelete) {
            let response = await fetch('https://products-dasw.onrender.com/api/cart/'+id, {
            method: 'DELETE',
            headers: {
                'x-expediente': '744747',
                "x-user": user
            }
        })
        ProccessData()
          swal("The Product has been deleted!", {
            icon: "success",
          });
        } else {
          swal("Not deleted");
          cancel(id)
        }
      });
}
ProccessData()