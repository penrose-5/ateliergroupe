// Function to toggle between recto and verso visibility
// function toggle_view() {
//   const body = document.body;
//   body.style.transition = 'opacity 0.2s ease'; // Smooth fade-out effect
//   body.style.opacity = '0';
  
//   setTimeout(() => {
//       // Get current path and log it for debugging
//       const currentPath = window.location.pathname;
//       console.log('Current path:', currentPath);
      
//       // Check if we're in the about directory
//       const isInAbout = currentPath.includes('/about');
//       console.log('Is in about:', isInAbout);
      
//       // Determine next page
//       const nextPage = isInAbout ? '/' : '/about/';
//       console.log('Navigating to:', nextPage);
      
//       window.location.href = nextPage;
//   }, 500);
// }

function toggle_view() {
  const currentPath = window.location.pathname;
  
  // If we're on the homepage (either "/" or "/index.html")
  // If we're on the about page
  if (currentPath === "/about/" || currentPath === "/about/index.html") {
    window.location.href = "/";
  }
  else if (currentPath === "/" || currentPath === "/index.html") {
    window.location.href = "/about/";
  }
}
