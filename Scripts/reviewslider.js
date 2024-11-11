document.addEventListener('DOMContentLoaded', function() {
    // Función para cargar las reseñas desde localStorage y añadirlas al slider
    function loadReviewsToSlider() {
      const reviews = JSON.parse(localStorage.getItem('reviews')) || [];
      const sliderTrack = document.getElementById('slider-track');
  
      reviews.forEach((review) => {
        const reviewBox = document.createElement('div');
        reviewBox.className = 'card';
        reviewBox.innerHTML = `
          <img src="${review.photo}" alt="${review.name}">
          <h2>${review.name}</h2>
          <div class="stars">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</div>
          <p>${review.text}</p>
        `;
        sliderTrack.appendChild(reviewBox);
      });
    }
  
    loadReviewsToSlider(); // Cargar las reseñas en el slider cuando la página cargue
  });
  