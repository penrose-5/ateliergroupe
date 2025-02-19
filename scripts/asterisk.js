const asterisk = document.querySelector('.asterisk');
const section = document.querySelector('.section');
const notesImage = document.querySelector('.notes-from-architecture-image');

// Apply fade-out effect when mouse enters the asterisk
asterisk.addEventListener('mouseenter', () => {
    section.classList.add('fade-out');
    if (notesImage) {
        notesImage.classList.add('visible'); // Add a class to fade it in
    }
});

// Remove fade-out effect when mouse leaves the asterisk
asterisk.addEventListener('mouseleave', () => {
    section.classList.remove('fade-out');
    if (notesImage) {
        notesImage.classList.remove('visible'); // Remove class to fade it out
    }
});
