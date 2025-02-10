const asterisk = document.querySelector('.asterisk');
const recto = document.querySelector('.recto');

// Apply fade-out effect when mouse enters the asterisk
asterisk.addEventListener('mouseenter', () => {
    recto.classList.add('fade-out');
});

// Remove fade-out effect when mouse leaves the asterisk
asterisk.addEventListener('mouseleave', () => {
    recto.classList.remove('fade-out');
});