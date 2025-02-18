// Function to toggle between recto and verso visibility
function toggle_view() {
  const body = document.body;
  body.style.transition = 'opacity 0.2s ease'; // Smooth fade-out effect
  body.style.opacity = '0';

  setTimeout(() => {
    const nextPage = location.href.includes('about.html') ? './' : './about.html';
    window.location.href = nextPage;
  }, 500); // Wait for fade-out to complete before navigation
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
