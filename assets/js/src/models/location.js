const YELP_API_END_POINT = 'https://api.yelp.com/v3/businesses/search';
const YELP_SEARCH_DATA = {
    categories: 'icecream',
    location: 'Cairo,NY'
};
const YELP_ACCESS_TOKEN = 'Bearer vn-fdF-tei-5g7Mgwf7fbp0eSFfY2xtMiSr77W1HTnDXOaHKUb1TrYledv_UwJVuZhtFeADWN46Ft8w_THJkZxaCQ2k6cXct9mUAw8E1IOhglH1fta8bo7vmRdMwWnYx';

const formatAddress = (address) => {
    return address.display_address.reduce((a, b) => {
        return a + b;
    });
};

const generateInfoWindow = (location, formatAddress) => {
    const { name, image, rating, phone, url } = location;

    return `<h2> <a href="${url}"> ${name} </a> </h2>
            <p> <img class="image" src="${image}" alt="${name}'s Image> <span class="rating"> ${rating} </span> </p>
            <span class="address"> ${formatAddress} </span>
            <p class="phone"> ${phone} </p>
    `;
};

const localstorageLoad = () => {
    if (typeof(Storage) === undefined)
        return false;
    
    let locations = localStorage.getItem('locations');

    if (!locations)
        return false;

    // console.log('before', typeof locations, locations);
    locations = JSON.parse(locations);
    // console.log('after', typeof locations, locations);

    if (locations.lenth < 1)
        return false;

    return locations;
};

const apiLoad = () => {
    $.ajax({
        type: 'GET',
        url: YELP_API_END_POINT,
        data: YELP_SEARCH_DATA,
        beforeSend: (request) => {
            request.setRequestHeader('Authorization', YELP_ACCESS_TOKEN);
            console.log('request update', request);
        },
        success: (result) => {
            // map the result
            // save it to localstorage
            console.log('Done', result);
            return result;
        },
        error: function(jqXHR, status, err) {
            console.log('Error', err);
        }
    });
};


function Location(location) {
    const { name, address, rating, latLng } = location;
    const formatedAddress = formatAddress(address);
    const infoWindow = generateInfoWindow(location, formatedAddress);

    return {
        name,
        latLng,
        rating,
        infoWindow,
        favourite: false
    };
}

function getLocations() {
    const localStorageLocations = localstorageLoad();

    if (localStorageLocations)
        return localStorageLocations;
    else
        return apiLoad();
}

function saveLocations(locations) {
    if (typeof(Storage) === undefined)
        return;
    
    locations = JSON.stringify(locations);
    
    localStorage.setItem('locations', locations);
}

module.exports = {
    Location,
    getLocations,
    saveLocations
};