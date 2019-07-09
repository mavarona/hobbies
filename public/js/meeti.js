document.addEventListener('DOMContentLoaded', () => {
    if(document.querySelector('#ubicacion-meeti')){
        showMap();
    }
});

function showMap(){

    const lat = document.querySelector('#lat').value;
    const lng = document.querySelector('#lng').value;
    const address = document.querySelector('#address').value;

    var map = L.map('ubicacion-meeti').setView([lat, lng], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.marker([lat, lng]).addTo(map)
        .bindPopup(address)
        .openPopup();
}
