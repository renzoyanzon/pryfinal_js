
//Definimos un listado de categorías de gastos estandares
let categoriaGasto= ["Supermercado","Kiosco","Servicios","Hogar","Entretenimiento","Transporte","Deportes","Viajes","Salario"];


//Definimos un listado de los gastos efectuados por el usuario
let listaGastos=[
    {cuenta:"Gastos",fecha:"13/07/2022",categoria:"Supermercado",importe: 8000,nota:"Carrefour"},
    {cuenta:"Gastos",fecha:"14/07/2022",categoria:"Kiosco",importe: 1000,nota:"Varios"},
    {cuenta:"Gastos",fecha:"15/07/2022",categoria:"Entretenimiento",importe: 4000,nota:"Bar"},
    {cuenta:"Gastos",fecha:"19/07/2022",categoria:"Supermercado",importe: 12000,nota:"Walmart"},
    {cuenta:"Gastos",fecha:"15/07/2022",categoria:"Entretenimiento",importe: 1000,nota:"Cine"},
]

// Definimos una clase constructora para que el usuario pueda agregar cada gasto que va ejecutando periodicamente

class Gasto {
    constructor(cuenta,fecha,categoria,importe,nota){
        this.cuenta=cuenta
        this.fecha=fecha
        this.categoria=categoria
        this.importe=importe
        this.nota=nota
    } 

}

//Definimos una función para que el usuario agregue cada gasto al listado cuando así lo desee


//Definimos una función para que el usuario pueda agregar la categoría que desee de gasto al listado

const agregarCategoríaGasto = () =>{
    let gasto = prompt("Indique el gasto que desea agregar a la lista");
    if(categoriaGasto.indexOf(gasto) == -1){
        categoriaGasto.push(gasto);
    } else{
        alert(`El gasto ${gasto} ya existe en el listado`);
    }   
}

//agregarCategoríaGasto();


//Definimos una función para que el usuario puede borrar del listado "categoríaGasto" cualquier categoría que desee
const quitarCategoria = ()=>{
    let borrarCategoria = prompt("Indique que categoria desea borrar");
    if (categoriaGasto.indexOf(borrarCategoria) != -1){
        categoriaGasto.splice(categoriaGasto.indexOf(borrarCategoria),1);
        alert(`La categoría borrada es ${borrarCategoria}`);
    } else{
        alert (`No es posible borrar la categoría ${borrarCategoria} debido a que no existe en el listado `)

    }
    console.log(categoriaGasto);
}

//quitarCategoria();




//Definimos una función para que se agregue al HTML el listado de categoría de gastos.

function crearCategoriaHtml(){
    let contenedorCategoria = document.getElementById("contenedorCategoria");

    categoriaGasto.forEach((el)=>{
        let optionNueva = document.createElement("option");
        optionNueva.innerHTML = el;
        contenedorCategoria.appendChild(optionNueva);
    })
}

crearCategoriaHtml();


// Variables del DOM

const formulario = document.querySelector("#form");
const contenedorLista = document.querySelector ("#contenedorLista .uno");
const contenedorListaDos = document.querySelector ("#contenedorLista .dos");
const contenedorTransaccion = document.querySelector("#contenedorTransaccion");
const contenedorFecha = document.querySelector("#contenedorFecha");
const contenedorCategoria = document.querySelector("#contenedorCategoria");
const contenedorImporte = document.querySelector ("#contenedorImporte");
const contenedorNota = document.querySelector("#contenedorNota");


// Definimos una función que al hacer click en el icono "plus" me muestre el formulario para agregar un gasto
let showForm = document.querySelector("#mostrarForm");
let contenedorFormulario = document.querySelector(".formulario")

function mostrarFormularioClick (){
    showForm.addEventListener("click", (e)=>{
        e.preventDefault(e);
        if(contenedorFormulario.classList.contains("open")){
            contenedorFormulario.classList.remove("open");
        } else{
            contenedorFormulario.classList.add("open");
        }
    }
    )
}

mostrarFormularioClick();




cargarEventListeners();

//Definimos la función para llamar al formulario
function cargarEventListeners (){
    formulario.addEventListener("submit",agregarFormulario); 
 
}


//Definimos una funcion para obtener un identificador en cada operación 



function idTransaccion (){
    let lastId = localStorage.getItem("lastId") || "0";
    let newId = JSON.parse(lastId) + 1;
    localStorage.setItem ("lastId",JSON.stringify(newId));
    return newId;
}

//Definimos una clase constructora para alojar los datos obtenidos del html

class Listado {
    constructor ( id,cuenta,fecha,categoria,importe,cotizacion,nota){
        this.id=id,
        this.cuenta = cuenta,
        this.fecha = fecha,
        this.categoria = categoria,
        this.importe = importe,
        this.cotizacion = cotizacion,
        this.nota = nota 
    }
}


let listado = JSON.parse(localStorage.getItem("listado")) || [];


//Definimos una variable para obtener de una API la cotización actual para convertir las operaciones de pesos a dolares
let obj;
let contenedorUsd = document.querySelector("#btnUsd");

fetch('https://www.dolarsi.com/api/api.php?type=valoresprincipales')
    .then(res => res.json())
    .then(data => obj = parseInt(data[0].casa.compra))
    .then (obj => contenedorUsd.innerHTML = obj)
  



// Definimos la función para que lea la información del HTML y me cree una lista con los datos cargados por el usuairo

function agregarFormulario (e){
    e.preventDefault();
    
    let id = idTransaccion()
    let cuenta= contenedorTransaccion.value
    let fecha = contenedorFecha.value =="" ? "----/--/--" : contenedorFecha.value
    let categoria = contenedorCategoria.value
    let importe = parseInt(contenedorImporte.value == "" ? 0 : contenedorImporte.value)
    let cotizacion = parseInt(obj) 
    let nota= contenedorNota.value =="" ? "(Vacio)" : contenedorNota.value
    let listadoNuevo = new Listado (id,cuenta, fecha,categoria,importe,cotizacion,nota);

    listado.push(listadoNuevo);
    localStorage.setItem("listado",JSON.stringify(listado));

    cargarFormularioHTML(listadoNuevo);
   
}


// Definimos una función para que me cargue los datos leidos del formulario en la tabla del HTML

let listadoVacio = [];

function cargarFormularioHTML (e){
    
    //limpia el listado para que no repita info en la tabla
    limpiarHtml();

    listadoVacio.push (e);
    listadoVacio.forEach ((el)=>{
        
        let nuevaLista = document.createElement("tr");
        nuevaLista.innerHTML = `
        <td> ${el.cuenta} </td>
        <td> ${el.fecha} </td>
        <td> ${el.categoria} </td>
        <td> ${el.importe} </td>
        <td> ${parseInt(el.importe/el.cotizacion) } </td>
        <td> ${el.nota} </td>
        <td> <button id="marcadorBorrado" class="fa fa-trash" aria-hidden="true"></button>  </td>
        `
    contenedorLista.appendChild(nuevaLista);
    })  
}

function limpiarHtml(){
    contenedorLista.innerHTML="";
}



// Agrego funcionalidad para que al hacer click en el icono "mas" me agregue el listado del storage


let showTable = document.querySelector("#mostrarTabla");
let tabla = document.querySelector(".tabla");

function mostrarTablaClick () {
    showTable.addEventListener("click",(e)=>{
        e.preventDefault();
        if(tabla.classList.contains("open") ){
            tabla.classList.remove("open");
        } else{
            tabla.classList.add("open");
        }
    })
}

mostrarTablaClick ()
mostrarTabla();
function mostrarTabla (e){

    if (listado != null){
        listado.forEach (el=>{
            let listadoNuevo = document.createElement ("tr");
            listadoNuevo.setAttribute("data-id",`${el.id}`)

            listadoNuevo.innerHTML = `
            <td> ${el.cuenta} </td>
            <td> ${el.fecha} </td>
            <td> ${el.categoria} </td>
            <td> ${el.importe} </td>
            <td> ${parseInt(el.importe/el.cotizacion) } </td>
            <td> ${el.nota} </td>
            <td> <button id="marcadorBorrado" class="fa fa-trash" aria-hidden="true"></button>  </td>
            ` 
            contenedorListaDos.appendChild (listadoNuevo);
        })
    }
} 

// Agrego una funcionalidad para poder eliminar cada operación individualmente


let quitarOperacion = document.querySelectorAll("#marcadorBorrado");


let eliminarOperacion = ()=>{
    quitarOperacion.forEach((el)=>{
        el.addEventListener("click",eliminar)
    })
}

let eliminar = (e)=>{
    
    let eliminarOp = e.target.parentNode.parentNode
    let idOperacion = eliminarOp.getAttribute("data-id");
    
    eliminarOp.remove();

    eliminarOperacionStorage(idOperacion);
    
}

eliminarOperacion();

// Definimos una función para eliminar del localStorage el objeto eliminado 

function eliminarOperacionStorage(idOperacion){
    let idTransaccion = listado.findIndex(el=>el.id==idOperacion);
    console.log(idTransaccion);
    listado.splice(idTransaccion,1);
    console.log(listado);
    localStorage.setItem("listado",JSON.stringify(listado));
}


console.log(listado[1].fecha);

//Definimos un array para obtener el valor total del gasto por categoría

let categoriaSuper = listado.filter((el)=> el.categoria =="Supermercado");
let categoriaKiosco = listado.filter((el)=> el.categoria =="Kiosco");
let categoriaServicios = listado.filter((el)=> el.categoria =="Servicio");
let categoriaHogar = listado.filter((el)=> el.categoria =="Hogar");
let categoriaEntretenimiento = listado.filter((el)=> el.categoria =="Entretenimiento");
let categoriaTransporte = listado.filter((el)=> el.categoria =="Transporte");
let categoriaDeportes = listado.filter((el)=> el.categoria =="Deportes");
let categoriaViajes = listado.filter((el)=> el.categoria =="Viajes");

sumaCategoriaSuper = categoriaSuper.reduce ((acumulador,el) => acumulador + el.importe,0);
sumaCategoriaKiosco = categoriaKiosco.reduce ((acumulador,el) => acumulador + el.importe,0);
sumaCategoriaServicios = categoriaServicios.reduce ((acumulador,el) => acumulador + el.importe,0);
sumaCategoriaHogar = categoriaHogar.reduce ((acumulador,el) => acumulador + el.importe,0);
sumaCategoriaEntretenimiento = categoriaEntretenimiento.reduce ((acumulador,el) => acumulador + el.importe,0);
sumaCategoriaTransporte = categoriaTransporte.reduce ((acumulador,el) => acumulador + el.importe,0);
sumaCategoriaDeportes = categoriaDeportes.reduce ((acumulador,el) => acumulador + el.importe,0);
sumaCategoriaViajes = categoriaViajes.reduce ((acumulador,el) => acumulador + el.importe,0);


console.log(sumaCategoriaSuper)


/* let filtro = listado.filter((el)=> el.categoria == "Supermercado");
sumaCategorias = filtro.reduce ((acumulador,el) => acumulador + el.importe,0); */


const grafico = document.querySelector("#grafico");
const showChart = document.querySelector("#mostrarChart");
const chart =document.querySelector(".contenedorGrafico")

function mostrarGraficoClick(){
    showChart.addEventListener("click", (e)=>{
        e.preventDefault();
        if(chart.classList.contains("open") ){
            chart.classList.remove("open");
        } else{
            chart.classList.add("open");
        }
    })

}

mostrarGraficoClick()

const datoGraficoGastos = {
    label: "Gastos por categoría",
    data: [sumaCategoriaSuper,sumaCategoriaKiosco,sumaCategoriaServicios,sumaCategoriaHogar,sumaCategoriaEntretenimiento ,sumaCategoriaTransporte,sumaCategoriaDeportes,sumaCategoriaViajes],
    backgroundColor: ['rgba(0, 0, 255, 0.781)',
                    'rgba(0, 195, 255, 0.781)',
                    'rgba(0, 255, 136, 0.781)',
                    'rgba(200, 255, 0, 0.781)',
                    'rgba(255, 174, 0, 0.781)',
                    'rgba(255, 51, 0, 0.781)',
                    'rgba(0, 0, 0, 0.678)',
                    'rgba(43, 43, 80, 0.678)',

],
    borderWidth: 1,
};

new Chart (grafico,{
    type: 'pie',
    data: {
        labels: categoriaGasto,
        datasets:[
            datoGraficoGastos,
        ]
    }
  
})




