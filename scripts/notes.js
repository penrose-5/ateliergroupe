document.addEventListener('DOMContentLoaded', () => {
    const carousels = document.querySelectorAll('.image-carousel');

    carousels.forEach(carousel => {
        const images = carousel.querySelectorAll('.carousel-image');
        const positionCaption = carousel.querySelector('.position-caption');
        const imageDescription = carousel.querySelector('.image-description');
        let currentIndex = 0;

        function updateImage(index) {
            // Remove active class from all images
            images.forEach(img => img.classList.remove('active'));

            // Add active class to current image
            images[index].classList.add('active');

            // Update captions
            positionCaption.textContent = `${index + 1}/${images.length}`;
            imageDescription.textContent = images[index].dataset.caption;
        }

        carousel.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % images.length;
            updateImage(currentIndex);
        });

    })

});
