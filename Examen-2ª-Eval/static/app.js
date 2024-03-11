import { haversineDistance } from "./utils.js";

var map;
var currentLocation = null;

// Inicialización del mapa
function initMap(){
    map = L.map('mapa').setView([36.719332, -4.423457], 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
};

// Añade un punto al mapa y su correspondiente listener
function addToMap(data){
    let marker = L.marker([data.geometry.coordinates[1], data.geometry.coordinates[0]]).addTo(map);
    marker.bindPopup(
        `<h3>${data.properties.DESCRIPCION}</h3>
         <p>${data.properties.DIRECCION}</p>
        `);
    marker.addEventListener("click",()=>{
        console.log(data.nombre);
        updateInfo(data);
    });
    console.log(marker);
}

// Inicializar el mapa
initMap();

// Carga de datos
fetch("static/datos.json")
.then( (res) => res.json() )
.then( (data) => {
    data.forEach(element => {
        console.log(element);
        addToMap(element);
    });
} )
.catch( (err)=>{
    console.log("Error en el fetch");
    console.log(err);
});

document.addEventListener("DOMContentLoaded", function() {
    var lista = document.querySelector('.lista');

    fetch('static/datos.json')
        .then(response => response.json())
        .then(data => {
            data.forEach(parada => {
                var item = document.createElement('li');
                item.textContent = `${parada.properties.DESCRIPCION} - ${parada.properties.DIRECCION}`;
                lista.appendChild(item);

                // Añade un controlador de eventos de clic a cada elemento de la lista
                item.addEventListener('click', function() {
                    // Obtiene las coordenadas de la parada de taxis
                    var latitud = parada.geometry.coordinates[1];
                    var longitud = parada.geometry.coordinates[0];
                    
                    // Centra el mapa en las coordenadas de la parada de taxis al hacer clic
                    map.setView([latitud, longitud], 15);
                });
            });
        })
        .catch(error => console.error('Error al cargar el archivo JSON:', error));
});
