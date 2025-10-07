const GOOGLE_MAPS_API_KEY = 'AIzaSyBTO9piU4s9LVGYvob043hACb2S2hg7CMU'; 

document.addEventListener('DOMContentLoaded', function() {
    // --- Global Variables ---
    let map;
    let infoWindow;
    const sections = document.querySelectorAll('.page-section');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    // --- Location Data Store ---
    const locations = [
        { name: "TIES (The Immigrant Education Society)", address: "3675 63 Ave NE #200", phone: "587-392-4177", lat: 51.1085, lng: -113.9514, quadrant: "NE", type: "language", marker: null },
        { name: "TIES (The Immigrant Education Society)", address: "3820 32 St NE", phone: "403-291-0002", lat: 51.0864, lng: -113.9885, quadrant: "NE", type: "language", marker: null },
        { name: "TIES (The Immigrant Education Society)", address: "1723 40 St SE", phone: "403-235-3666", lat: 51.0384, lng: -113.9691, quadrant: "SE", type: "language", marker: null },
        { name: "Calgary Immigrant Women’s Association", address: "138 4 Ave SE, Calgary", phone: "403-263-4414", lat: 51.0489, lng: -114.0599, quadrant: "SW", type: "settlement", marker: null },
        { name: "Calgary Public Library - Central", address: "800 3 St SE", phone: "(403) 260-2600", lat: 51.0450, lng: -114.0583, quadrant: "SE", type: "library", marker: null },
        { name: "Immigrant Services Calgary", address: "910 7 Ave SW #1200", phone: "(403) 265-1120", lat: 51.0486, lng: -114.0823, quadrant: "SW", type: "settlement", marker: null },
        { name: "Calgary Food Bank", address: "5000 11 St SE", phone: "(403) 253-2055", lat: 50.9986, lng: -114.0416, quadrant: "SE", type: "food", marker: null },
    ];

    // --- Google Maps Initialization ---
    function loadGoogleMapsScript() {
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
        
        // Wait for Firebase to be ready before fetching data
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
        location.marker = marker; // Store marker reference

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
    
    // --- Search and Filtering Logic ---
    function filterLocations() {
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

    // --- Firebase Firestore Logic ---
    function fetchResourcesAndAddMarkers() {
        const db = window.firebaseDb;
        if (!db) return;
        
        // Dynamic imports for Firestore functions
        import("https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js").then(({ collection, query, onSnapshot }) => {
            const q = query(collection(db, `artifacts/your-app-id/public/data/community_resources`)); // Update path if needed
            onSnapshot(q, (snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === "added") {
                        const resource = change.doc.data();
                        const exists = locations.some(loc => loc.name === resource.name && loc.address === resource.address);
                        if (!exists && resource.lat && resource.lng) {
                            const newLocation = {
                                name: resource.name,
                                address: resource.address || "Address not provided",
                                phone: resource.phone || "Phone not provided",
                                lat: resource.lat,
                                lng: resource.lng,
                                quadrant: resource.quadrant || "all",
                                type: resource.type || "settlement",
                                marker: null
                            };
                            locations.push(newLocation);
                            addMarker(newLocation);
                        }
                    }
                });
            }, (error) => {
                console.error("Firestore: Error fetching documents: ", error);
            });
        });
    }

    // --- Page Navigation & Event Listeners ---
    function showSection(hash) {
        const targetHash = (hash === '' || hash === '#') ? '#home' : hash;
        sections.forEach(s => s.classList.toggle('active', `#${s.id}` === targetHash));
        navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === targetHash));
        mobileMenu.classList.add('hidden');
        window.scrollTo(0, 0);

        if (targetHash === '#directory' && !map) {
            loadGoogleMapsScript();
        } else if (targetHash === '#directory' && map) {
            google.maps.event.trigger(map, 'resize');
        }
    }

    navLinks.forEach(link => link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetHash = link.getAttribute('href');
        history.pushState(null, null, targetHash);
        showSection(targetHash);
    }));

    window.addEventListener('popstate', () => showSection(window.location.hash));
    mobileMenuButton.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
    
    document.getElementById('keyword-search').addEventListener('input', filterLocations);
    document.getElementById('program-type-filter').addEventListener('change', filterLocations);
    document.getElementById('location-filter').addEventListener('change', filterLocations);

    showSection(window.location.hash);
    
    const contactForm = document.getElementById('contact-form');
    const contactMessage = document.getElementById('contact-form-message');
    contactForm.addEventListener('submit', async e => {
        e.preventDefault();
        contactMessage.textContent = 'Sending…';
        contactMessage.className = 'mt-4 text-center text-gray-600';
        try {
            const res = await fetch(contactForm.action, { method: 'POST', body: new FormData(contactForm) });
            if (!res.ok) throw new Error(`Status ${res.status}`);
            contactForm.reset();
            contactMessage.textContent = 'Thank you! Your message has been sent.';
            contactMessage.className = 'mt-4 text-center text-green-600';
        } catch (err) {
            contactMessage.textContent = 'Oops—something went wrong. Please try again.';
            contactMessage.className = 'mt-4 text-center text-red-600';
        }
    });
});