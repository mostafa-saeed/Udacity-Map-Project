import Location from '../models/location';

const test = new Location.Location({
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
});

function AppViewModel () {
    const self = this;

    self.search = ko.observable('');

    self.locations = ko.observableArray(JSON.parse(Location.getLocations()));

    // console.log('Done', JSON.parse(Location.getLocations()));

    window.addTest = () => {
        self.addItem();
    };

    window.clearTest = () => {
        self.clearItems();
    };

    self.clearItems = () => {
        self.locations([]);
        Location.saveLocations(ko.toJSON(self.locations()));
    };

    self.addItem = () => {
        self.locations.push(test);
        Location.saveLocations(ko.toJSON(self.locations));
    };

    self.removeItem = (name) => {
        self.locations.remove((location) => {
            return location.name === name;
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

    self.favouriteToggle = (index) => {
        self.locations()[index].favourite = !self.locations()[index].favourite;
        console.log('testing', self.locations()[index]);
        
    };

    return self;
}


export default AppViewModel;