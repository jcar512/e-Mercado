let ListaAutos = [];

document.addEventListener("DOMContentLoaded", function() {
    getJSONData(AUTOS).then(resultado => {
        if (resultado.status === "ok") {
            ListaAutos = resultado.data.products;
            showCarList()
        }
    })
})

function showCarList() {

    for(let auto of ListaAutos) {
        document.getElementById("productList").innerHTML +=  `
            <div onclick="setCatID(${auto.id})" class="list-group-item list-group-item-action cursor-active">
                <div class="row">
                    <div class="col-3">
                        <img src="${auto.image}" alt="${auto.description}" class="img-thumbnail">
                    </div>
                    <div class="col">
                        <div class="d-flex w-100 justify-content-between">
                            <h4 class="mb-1">${auto.name} - ${auto.currency} ${auto.cost} </h4>
                            <small class="text-muted">${auto.soldCount} vendidos</small>
                        </div>
                        <p class="mb-1">${auto.description}</p>
                    </div>
                </div>
            </div>
        `
    }
}

