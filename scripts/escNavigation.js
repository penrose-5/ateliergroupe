function setupEscNavigation(destinationUrl) {
    // Listen for keydown events
    document.addEventListener('keydown', function(event) {
        // Check if the Escape key was pressed
        if (event.key === 'Escape' || event.keyCode === 27) {
            // Prevent default ESC behavior (like closing dialogs)
            event.preventDefault();
            
            // Navigate to the specified URL
            window.location.href = destinationUrl;
        }
    });
}

// Make the function available globally
window.setupEscNavigation = setupEscNavigation;