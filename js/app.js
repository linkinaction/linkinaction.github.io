// Main application entry point
import { initializeNavigation, showSection } from './navigation.js';
import { loadGoogleMapsScript, filterLocations } from './map.js';
import { initializeContactForm, setupFormValidation } from './contact-form.js';

document.addEventListener('DOMContentLoaded', function() {
    // Initialize navigation
    initializeNavigation();
    
    // Initialize search filters
    const keywordSearch = document.getElementById('keyword-search');
    const programTypeFilter = document.getElementById('program-type-filter');
    const locationFilter = document.getElementById('location-filter');
    
    if (keywordSearch && programTypeFilter && locationFilter) {
        keywordSearch.addEventListener('input', filterLocations);
        programTypeFilter.addEventListener('change', filterLocations);
        locationFilter.addEventListener('change', filterLocations);
    }

    // Initialize contact form
    initializeContactForm();
    setupFormValidation();

    // Initial page load
    showSection(window.location.hash);
});