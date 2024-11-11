document.getElementById('reviewForm').addEventListener('submit', function(event) {
  event.preventDefault(); 

  const name = document.getElementById('name').value;
  const photoInput = document.getElementById('photo').files[0];
  const reviewText = document.getElementById('reviewText').value;
  const rating = document.getElementById('rating').value;


  const reader = new FileReader();
  reader.onload = function(e) {
      const photoURL = e.target.result;

      const review = {
          name: name,
          photo: photoURL,
          text: reviewText,
          rating: rating
      };

      saveReviewToLocalStorage(review);

      renderReview(review);

      document.getElementById('reviewForm').reset();
  };

  reader.readAsDataURL(photoInput); 
});

function saveReviewToLocalStorage(review) {
  const reviews = JSON.parse(localStorage.getItem('reviews')) || [];
  reviews.push(review);
  localStorage.setItem('reviews', JSON.stringify(reviews));
}

function renderReview(review) {
  const reviewBox = document.createElement('div');
  reviewBox.className = 'card';
  reviewBox.innerHTML = `
      <img src="${review.photo}" alt="${review.name}">
      <h2>${review.name}</h2>
      <div class="stars">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</div>
      <p>${review.text}</p>
  `;
  document.getElementById('addcard').appendChild(reviewBox);
}

function loadReviewsFromLocalStorage() {
  const reviews = JSON.parse(localStorage.getItem('reviews')) || [];
  reviews.forEach(renderReview);
}

window.onload = loadReviewsFromLocalStorage;
