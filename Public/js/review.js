// Global variable to store the review id being edited
let editingReviewId = null;

// Fetch and display reviews
function fetchReviews() {
    axios.get("http://localhost:3000/review")
        .then(response => {
            const reviews = response.data;
            const reviewsDiv = document.getElementById('reviews');
            reviewsDiv.innerHTML = '';

            const loggedInUserId = localStorage.getItem('user_id');

            reviews.forEach(review => {
                const reviewElement = document.createElement('div');
                reviewElement.classList.add('review');
                reviewElement.innerHTML = `
                    <p><strong>userId:</strong> ${review.user_id}</p>
                    <p><strong>Rating:</strong> ${'★'.repeat(review.review_amt)}${'☆'.repeat(5 - review.review_amt)}</p>
                    <p><strong>Comment:</strong> ${review.message}</p>
                `;

                if (review.user_id === parseInt(loggedInUserId)) {
                    // Only show Edit and Delete buttons if the logged-in user is the one who posted the review
                    reviewElement.innerHTML += `
                        <button onclick="editReview(${review.id}, '${review.message}', ${review.review_amt})">Edit</button>
                        <button onclick="deleteReview(${review.id})">Delete</button>
                    `;
                }

                reviewsDiv.appendChild(reviewElement);
            });
        })
        .catch(error => {
            console.error('Error fetching reviews:', error);
        });
}

// Function to handle review submission
function submitReview() {
    const comment = document.getElementById('add-comment').value.trim();
    if (selectedRating == 0 || !comment) {
        alert('Please provide a rating and a comment.');
        return;
    }

    const user_id = localStorage.getItem('user_id');

    if (!user_id) {
        alert('User is not logged in. Please sign in first.');
        return;
    }

    if (editingReviewId) {
        // If we're editing a review, call the updateReview function
        updateReview(editingReviewId, comment, selectedRating);
    } else {
        // Otherwise, submit a new review
        axios.post('http://localhost:3000/review', {
            user_id: parseInt(user_id),
            review_amt: parseInt(selectedRating),
            message: comment
        })
            .then(response => {
                alert('Review submitted successfully!');
                fetchReviews();
                resetReviewForm();
            })
            .catch(error => {
                console.error('Error submitting review:', error);
                alert('Failed to submit review.');
            });
    }
}

// Function to handle review editing
function editReview(id, currentMessage, currentRating) {
    // Fill the text area with the current message of the review
    document.getElementById('add-comment').value = currentMessage;

    // Set the stars to the current rating value
    stars.forEach(star => star.classList.remove('active'));
    for (let i = 0; i < currentRating; i++) {
        stars[i].classList.add('active');
    }
    selectedRating = currentRating;

    // Set the editingReviewId to the current review ID
    editingReviewId = id;

    // Change the button text to "Update Review"
    const submitButton = document.getElementById('submit-review');
    submitButton.textContent = 'Update Review';
}

// Function to update the review
function updateReview(id, comment, rating) {
    const user_id = localStorage.getItem('user_id');
    if (!user_id) {
        alert('User is not logged in. Please sign in first.');
        return;
    }

    axios.put(`http://localhost:3000/review/${id}`, {
        user_id: parseInt(user_id), // Include the user_id in the updated review data
        review_amt: rating,
        message: comment
    })
        .then(response => {
            alert('Review updated successfully!');
            fetchReviews(); // Refresh the reviews
            resetReviewForm();
        })
        .catch(error => {
            console.error('Error updating review:', error);
            alert('Failed to update review.');
        });
}

// Delete review
function deleteReview(id) {
    if (confirm('Are you sure you want to delete this review?')) {
        axios.delete(`http://localhost:3000/review/${id}`)
            .then(response => {
                alert('Review deleted successfully!');
                fetchReviews();
            })
            .catch(error => {
                console.error('Error deleting review:', error);
                alert('Failed to delete review.');
            });
    }
}

// Handle star selection
const stars = document.querySelectorAll('.star');
let selectedRating = 0;

stars.forEach(star => {
    star.addEventListener('click', function () {
        selectedRating = this.getAttribute('data-value');
        stars.forEach(s => s.classList.remove('active'));
        for (let i = 0; i < selectedRating; i++) {
            stars[i].classList.add('active');
        }
    });
});

// Reset the review form after submitting or updating
function resetReviewForm() {
    document.getElementById('add-comment').value = "";
    stars.forEach(s => s.classList.remove('active'));
    selectedRating = 0;
    editingReviewId = null; // Reset editingReviewId
    const submitButton = document.getElementById('submit-review');
    submitButton.textContent = 'Submit Review'; // Reset button text
}

// Initial fetch
window.onload = fetchReviews;
