import Location from '../models/location';
import AppView from '../views/appView';

function AppViewModel () {

    const test = {
        'name': 'Rinaldi\'s Ice Cream & Good Food',
        'image': 'https://s3-media2.fl.yelpcdn.com/bphoto/6l4QvSREnT_OZX4be_196w/o.jpg',
        'url': 'https://www.yelp.com/biz/rinaldis-ice-cream-and-good-food-cairo?adjust_creative=sM2HM_mE-6QIWS6Xj7WZgQ&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=sM2HM_mE-6QIWS6Xj7WZgQ',
        'rating': 4,
        'latLng': {
            'latitude': 42.318185380693,
            'longitude': -74.0309000015259
        },
        'address': {
            'address1': '450 Rt 145',
            'address2': '',
            'address3': '',
            'city': 'Cairo',
            'zip_code': '12413',
            'country': 'US',
            'state': 'NY',
            'display_address': [
                '450 Rt 145',
                'Cairo, NY 12413'
            ]
        },
        'phone': '(518) 622-3355',
    };

    const self = this;

    self.search = ko.observable('');
    self.showFav = ko.observable(false);
    self.locations = ko.observableArray([]);

    self.locations.push(new Location.Location(test));

    AppView.setEvents();

    self.filteredList = ko.dependentObservable(() => {
        const search = self.search().toLowerCase();
        const showFav = self.showFav();

        if (search || showFav === true) {
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

    window.addTest = () => {
        self.locations.push(new Location.Location(test));
    };

    self.removeItem = () => {
        self.locations.remove((location) => {
            // return location.name === name;
            return true;
        });
    };

    self.map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 42.318185380693, lng: -74.0309000015259},
        zoom: 8,
        streetViewControl: false,
        mapTypeControl: false
    });

    self.markers = ko.utils.arrayMap(self.locations(), (loc) => {
        return new google.maps.Marker({
            map: self.map,
            position: {
                lat: loc.latLng.latitude,
                lng: loc.latLng.longitude
            },
            animation: google.maps.Animation.DROP
        });
    });

    self.favouriteToggle = (location) => {
        const toggle = !location.favourite();
        location.favourite(toggle);
        
    };

    self.setActiveLocation = (location) => {
        AppView.showModal(location.infoWindow);
    };

    return self;
}


export default AppViewModel;