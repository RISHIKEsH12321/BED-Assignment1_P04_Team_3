// changing the star between gray and gold when clicked
document.addEventListener('DOMContentLoaded', (event) => {
    const stars = document.querySelectorAll('.star');
    
    stars.forEach(star => {
        star.addEventListener('click', () => {
            if (star.classList.contains('gray')) {
                star.classList.remove('gray');
                star.classList.add('gold');
            } else {
                star.classList.remove('gold');
                star.classList.add('gray');
            }
        });
    });
});


