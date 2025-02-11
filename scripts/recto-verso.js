// Function to toggle between recto and verso visibility
function toggleView() {
    const recto = document.querySelector('.recto');
    const verso = document.querySelector('.verso');
    const body = document.body;

    const isRectoVisible = getComputedStyle(recto).visibility === 'visible';

    if (isRectoVisible) {
        recto.style.visibility = 'hidden';
        recto.style.opacity = '0';
        verso.classList.add('active');
        body.style.overflow = 'hidden'; // Prevent scrolling
        typeWriter();
        email();
    } else {
        recto.style.visibility = 'visible';
        recto.style.opacity = '1';
        verso.classList.remove('active');
        body.style.overflow = ''; // Restore scrolling
    }
}


const text = "OPENING ";
let index = 0;
function typeWriter() {
  if (index < text.length) {
    document.getElementById("typing").textContent += text.charAt(index);
    index++;
    setTimeout(typeWriter, 100);
  }
}


const newsletter = document.getElementById('newsletter');
function email() {
    // Show the sliding div after page load
    setTimeout(() => {
        newsletter.classList.add('show');
    }, 1000);  // Delay to allow the page to load properly
};
