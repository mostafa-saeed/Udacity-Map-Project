import LocationModel from '../models/location';
import AppView from '../views/appView';

function AppViewModel () {
    const self = this;

    self.search = ko.observable('');
    self.showFav = ko.observable(false);
    self.locations = ko.observableArray([]);

    self.map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 42.318185380693, lng: -74.0309000015259},
        zoom: 8,
        streetViewControl: false,
        mapTypeControl: false
    });

    self.infoWindow = new google.maps.InfoWindow();
    self.bounds = new google.maps.LatLngBounds();
    AppView.setEvents();

    LocationModel.getLocations().then((res) => {
        const venues = res.response.venues;
        venues.forEach(location => {
            const newLocation = new LocationModel.Location(location);
            self.locations.push(newLocation);

            newLocation.marker = new google.maps.Marker({
                map: self.map,
                position: {
                    lat: location.location.lat,
                    lng: location.location.lng
                },
                animation: google.maps.Animation.DROP
            });

            self.bounds.extend(newLocation.marker.getPosition());

            google.maps.event.addListener(newLocation.marker, 'click', () => {
                self.infoWindow.setContent(newLocation.infoWindow);
                self.infoWindow.open(self.map, newLocation.marker);
    
                newLocation.marker.setAnimation(google.maps.Animation.BOUNCE);
                setTimeout(() => {
                    newLocation.marker.setAnimation(null);
                }, 3000);
            });

        });
        self.map.fitBounds(self.bounds);

    });

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

    self.favouriteToggle = (location) => {
        const toggle = !location.favourite();
        location.favourite(toggle);
    };

    self.setActiveLocation = (location) => {
        google.maps.event.trigger(location.marker, 'click');        
    };

    return self;
}


export default AppViewModel;