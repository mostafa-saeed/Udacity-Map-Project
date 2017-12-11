import $ from './third-party/jquery-3.2.1.min.js';
import mdl from './third-party/material.min.js';
import ko from './third-party/knockout-3.4.2.js';

// window.ko = ko;

window.initMap = function() {
    const map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 8
    });
};