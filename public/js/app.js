import {
    OpenStreetMapProvider
} from 'leaflet-geosearch';

const lat = 20.666332695977;
const lng = -103.3921777456999;

const map = L.map('mapid').setView([lat, lng], 15);

document.addEventListener('DOMContentLoaded', () => {
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
});