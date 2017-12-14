import LocationModel from '../models/location';
import AppView from '../views/appView';

function AppViewModel () {
    const self = this;

    self.search = ko.observable('');
    self.showFav = ko.observable(false);
    self.locations = ko.observableArray([]);

    // init google maps api
    self.map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 42.318185380693, lng: -74.0309000015259},
        zoom: 8,
        streetViewControl: false,
        mapTypeControl: false
    });
    self.infoWindow = new google.maps.InfoWindow();
    self.bounds = new google.maps.LatLngBounds();

    // load locations data from FourSquare API
    LocationModel.getLocations().done((res) => {
        const venues = res.response.venues;
        venues.forEach(location => {
            // create new location
            const newLocation = new LocationModel.Location(location);
            self.locations.push(newLocation);
            // add location marker to map
            newLocation.marker = self.generateLocationMarker(location, newLocation.infoWindow);

        });
        self.map.fitBounds(self.bounds);
        // auto hide unfiltered markers
        self.filteredList.subscribe(() => {
            self.toggleMarkers();
        });

    })
        .fail((jqXHR, status, err) => {
            console.log(err);
            alert('Error getting data from FourSquare API!');
        });

    // locations filter
    // it filters locations either by location name, favourite status or both
    self.filteredList = ko.dependentObservable(() => {
        const search = self.search().toLowerCase();
        const showFav = self.showFav();

        if (search || showFav) {
            return ko.utils.arrayFilter(self.locations(), (location) => {
                if (showFav) {
                    return location.name.toLowerCase().indexOf(search) >= 0 &&
                        location.favourite() === true;
                }
                return location.name.toLowerCase().indexOf(search) >= 0;
            });
        }
        else {
            return self.locations();
        }
    });

    // generate location marker to and add it to the map
    self.generateLocationMarker = (location, infoWindow) => {
        const marker = new google.maps.Marker({
            map: self.map,
            position: {
                lat: location.location.lat,
                lng: location.location.lng
            },
            animation: google.maps.Animation.DROP
        });
        self.bounds.extend(marker.getPosition());

        // set marker event listener
        google.maps.event.addListener(marker, 'click', () => {
            self.infoWindow.setContent(infoWindow);
            self.infoWindow.open(self.map, marker);

            // stop the marker after 3 seconds
            marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(() => {
                marker.setAnimation(null);
            }, 3000);
        });

        return marker;
    };

    // hide unfiltered markers
    self.toggleMarkers = () => {
        self.locations().forEach((loc) => {
            loc.marker.setVisible(false);
        });

        self.filteredList().forEach((loc) => {
            loc.marker.setVisible(true);
        });
    };

    // update location favourite status
    self.favouriteToggle = (location) => {
        const toggle = !location.favourite();
        location.favourite(toggle);
    };

    // listview item click
    self.setActiveLocation = (location) => {
        google.maps.event.trigger(location.marker, 'click');        
    };

    // from submit binding
    self.formSubmit = (form) => {
        AppView.formSubmit(form);
    };

    return self;
}


export default AppViewModel;