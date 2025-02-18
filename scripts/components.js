// Function to load HTML components
async function loadComponent(componentName, targetId) {
    try {
        // Using the full path from the repository root
        const response = await fetch(`/components/${componentName}.html`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const html = await response.text();
        document.getElementById(targetId).innerHTML = html;
    } catch (error) {
        console.error(`Error loading ${componentName}:`, error);
        // Provide a fallback or user-friendly error message
        document.getElementById(targetId).innerHTML = `<p>Could not load ${componentName}. Please try refreshing the page.</p>`;
    }
}

// Wait for the DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    loadComponent('header', 'header-placeholder');
    loadComponent('footer', 'footer-placeholder');
});