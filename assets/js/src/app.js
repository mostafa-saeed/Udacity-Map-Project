import ko from './third-party/knockout-3.4.2.js';
import $ from './third-party/jquery-3.2.1.min.js';
window.$ = window.jQuery = $;
import mdl from './third-party/material.min.js';
window.ko = ko;

import AppViewModel from './view-models/appViewModel';


window.startAPP = () => {
    console.log('Staring APP!');
    ko.applyBindings(new AppViewModel());
};