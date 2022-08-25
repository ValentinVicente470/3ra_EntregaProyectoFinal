
const sockets = io.connect()

//----------------------------------------------------------------------------------------------
//FUNCION Y RENDER PRODUCTOS

function addProduct(e) {
    const product = {
        name: document.getElementById("name").value,
        price: document.getElementById("price").value,
        stock: document.getElementById("stock").value,
        description: document.getElementById("description").value,
        thumbnail: document.getElementById("thumbnail").value
    }
    sockets.emit("new-product", product);
    return false
}

function render(data1) {
    try {
        if(data1.length > 0) {
            const html1 = data1.map((elem, index) => {
                return(`<tr style= "font-weight: 500;">
                <td> ${elem.name} </td>
                <td> ${elem.price} </td>
                <td> ${elem.description} </td>
                <td> ${elem.stock} </td>
                <td> <img src="${elem.thumbnail}" height="50px"> </img> </td>
                <td> ${elem.id} </td>
                <td> <a class="btn btn-warning material-symbols-outlined" href="/carrito/<%= datos.user%>/productos/${elem.id}"> Add_Shopping_Cart </a></td>
                </tr>`)
            }).join(" ")
            document.getElementById("product").innerHTML = html1
        } else {
            const htmlErr = `<h3 class="prod__error">No se encontraron productos :/</h3>`
            document.getElementById('product').innerHTML = htmlErr
        }
    } catch (error) {
        console.error(error)
    }
}

sockets.on("product", function(data1) {render(data1)})


//----------------------------------------------------------------------------------------------
//FUNCION Y RENDER MENSAJES

function addMessage(a) {
    let date = new Date();
    const message = {
        email: document.getElementById("username").value,
        text: document.getElementById("text").value,
        fecha: date.toLocaleDateString(),
        hora: date.toLocaleTimeString(),
    }
    sockets.emit("new-message", message);
    return false
}

function renders(data2) {
    try {
        if(data2.length > 0){
            const html2 = data2.map((element) => {
                return(`<div class="row">
                    <div class="col">
                        <h3 class="fs-6 text-warning">${element.email}:</h3>
                    </div>
                    <div class="col gx-0">
                        <h3 class="fs-6 text-start text-light">${element.text}</h3>
                    </div>
                    <div class="col gx-0">
                        <h3 class="fs-6 text-end text-secondary">[${element.hora}]</h3>
                    </div>
                </div>`)
            }).join(" ")
        
            document.getElementById("messages").innerHTML = html2
        } else {
            const errHtml = `<p class="chat__err">Aún no hay mensajes :( ¡Sé el primero en enviar uno!</p>`
            
            document.getElementById("messages").innerHTML = errHtml
        }
        
    } catch (err) {
        console.log(err)
    }
}

sockets.on("messages", function(data2) {renders(data2)})



