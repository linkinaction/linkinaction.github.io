// Map functionality
let map;
let infoWindow;
const locations = [
    { name: "TIES (The Immigrant Education Society)", address: "3675 63 Ave NE #200", phone: "587-392-4177", lat: 51.1085, lng: -113.9514, quadrant: "NE", type: "language", marker: null },
    // ... other locations
];

export function loadGoogleMapsScript() {
    if (document.getElementById('google-maps-script')) return;
    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&callback=initMap&v=weekly`;
    script.async = true;
    document.head.appendChild(script);
}

window.initMap = function() {
    const mapElement = document.getElementById('map');
    if (!mapElement) return;

    const calgary = { lat: 51.0447, lng: -114.0719 };
    map = new google.maps.Map(mapElement, {
        center: calgary,
        zoom: 11,
        mapId: 'DEMO_MAP_ID',
    });

    infoWindow = new google.maps.InfoWindow();
    locations.forEach(location => addMarker(location));
    
    if (window.isAuthReady) {
        fetchResourcesAndAddMarkers();
    } else {
        document.addEventListener('firebaseAuthReady', fetchResourcesAndAddMarkers);
    }
};

function addMarker(location) {
    const marker = new google.maps.Marker({
        position: { lat: location.lat, lng: location.lng },
        map: map,
        title: location.name,
    });
    location.marker = marker;

    marker.addListener('click', () => {
        if (infoWindow) infoWindow.close();
        
        const contentString = `
            <div class="p-2">
                <h3 class="font-bold text-lg mb-1">${location.name}</h3>
                <p class="text-sm mb-1"><strong>Address:</strong> ${location.address}</p>
                <p class="text-sm mb-1"><strong>Phone:</strong> ${location.phone}</p>
            </div>`;

        infoWindow.setContent(contentString);
        infoWindow.open(map, marker);
    });
}

export function filterLocations() {
    const keyword = document.getElementById('keyword-search').value.toLowerCase();
    const type = document.getElementById('program-type-filter').value;
    const quadrant = document.getElementById('location-filter').value;

    locations.forEach(loc => {
        const nameMatch = loc.name.toLowerCase().includes(keyword);
        const addressMatch = loc.address.toLowerCase().includes(keyword);
        const typeMatch = (type === 'all' || loc.type === type);
        const quadrantMatch = (quadrant === 'all' || loc.quadrant === quadrant);

        if ((nameMatch || addressMatch) && typeMatch && quadrantMatch) {
            loc.marker?.setMap(map);
        } else {
            loc.marker?.setMap(null);
        }
    });
}

function fetchResourcesAndAddMarkers() {
    // Firebase Firestore integration
    // ... (move the Firestore code here)
}