import {
    OpenStreetMapProvider
} from 'leaflet-geosearch';
import openStreetMapProvider from 'leaflet-geosearch/lib/providers/openStreetMapProvider';
let lat = '40.518306431151785';
let lng = '-3.7778825438677845';
let address = '';

if(document.querySelector('#lat')){
    lat = document.querySelector('#lat').value || 40.518306431151785;
}
if(document.querySelector('#lng')){
    lat = document.querySelector('#lng').value || -3.7778825438677845;
}
if(document.querySelector('#address')){
    address = document.querySelector('#address').value || '';
}

const map = L.map('mapid').setView([lat, lng], 15);
let markers = new L.FeatureGroup().addTo(map);
let marker;
const geocodeService = L.esri.Geocoding.geocodeService();

if(lat && lng){
    marker = new L.marker([lat, lng], {
        draggable: true,
        autoPan: true
    }).addTo(map).bindPopup(address).openPopup();
    markers.addLayer(marker);
    marker.on('moveend', function(e) {
        marker = e.target;
        const position = marker.getLatLng();
        map.panTo(new L.LatLng(position.lat, position.lng));
        geocodeService.reverse().latlng(position, 15).run(function(err, data) {
            fillReverseCoding(data);
            marker.bindPopup(data.address.LongLabel).openPopup();
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const search = document.querySelector('#formSearch');
    search.addEventListener('input', searchAddress);

});

function searchAddress(e) {
    if (e.target.value.length > 8) {
        markers.clearLayers();
        const provider = new openStreetMapProvider();

        provider.search({
            query: e.target.value
        }).then((result) => {

            geocodeService.reverse().latlng(result[0].bounds[0], 15).run(function(err, data) {
                fillReverseCoding(data);
                map.setView(result[0].bounds[0], 15);
                marker = new L.marker(result[0].bounds[0], {
                    draggable: true,
                    autoPan: true
                }).addTo(map).bindPopup(result[0].label).openPopup();

                markers.addLayer(marker);

                marker.on('moveend', function(e) {
                    marker = e.target;
                    const position = marker.getLatLng();
                    map.panTo(new L.LatLng(position.lat, position.lng));
                    geocodeService.reverse().latlng(position, 15).run(function(err, data) {
                        fillReverseCoding(data);
                        marker.bindPopup(data.address.LongLabel).openPopup();
                    });
                });
            });

        });
    }
}

function fillReverseCoding(result) {
    console.log(result.address.City);
    document.querySelector('#address').value = result.address.Address || '';
    document.querySelector('#city').value = result.address.City || '';
    document.querySelector('#state').value = result.address.Region || '';
    document.querySelector('#country').value = result.address.CountryCode || '';
    document.querySelector('#lat').value = result.latlng.lat || '';
    document.querySelector('#lng').value = result.latlng.lng || '';
}