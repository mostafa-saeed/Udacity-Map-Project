const FOUR_SQUARE_END_POINT = 'https://api.foursquare.com/v2/venues/search';
const FOUR_SQUARE_CLIENT_ID = 'XP4LJNBULP5CXM40EHT0RXLXROFYU2Z00FEUGWUG2UEOGKXF';
const FOUR_SQUARE_CLIENT_SECRET = 'J0TW4DT3VAY3WG1SLHXDIOA2Y4CGEQO2Y4HRKWEJINMDKZRB';
const FOUR_SQUARE_SEARCH_DATA = {
    client_id: FOUR_SQUARE_CLIENT_ID,
    client_secret: FOUR_SQUARE_CLIENT_SECRET,
    v: '20170801',
    near: 'Mountain View,CA',
    // near: 'Cairo,NY',
    limit: 10,
    categoryId: '4bf58dd8d48988d1c9941735,512e7cae91d4cbb4e5efe0af'
};

// combine formatted address to one string
const formatAddress = (address) => {
    return address.formattedAddress.reduce((a, b) => {
        return a + b;
    });
};

// generate HTML template for marker info window
const generateInfoWindow = (location, formatAddress) => {
    // extract these values from location
    const { name, contact, url } = location;

    return `<h2> <a href="${url}"> ${name} </a> </h2>
            <span class="address"> ${formatAddress} </span>
            <p class="phone"> ${contact.formattedPhone} </p>
    `;
};


// generate ajax promise
const apiLoad = () => {
    return $.ajax({
        type: 'GET',
        url: FOUR_SQUARE_END_POINT,
        data: FOUR_SQUARE_SEARCH_DATA
    });
};

// Locations model
// ToDo: allow data local storage
function Location(venueLocation) {
    // extract these values from venueLocation
    const { name, location } = venueLocation;
    const formatedAddress = formatAddress(location);
    const infoWindow = generateInfoWindow(venueLocation, formatedAddress);

    return {
        name,
        latLng: {
            lat: location.lat,
            lng: location.lng
        },
        infoWindow,
        favourite: ko.observable(false)
    };
}

function getLocations() {
    // ToDo: localstorage check
    return apiLoad();

}

module.exports = {
    Location,
    getLocations
};