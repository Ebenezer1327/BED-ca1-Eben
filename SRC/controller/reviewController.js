const reviewModel = require('../models/reviewModel'); // Import the review model
const db = require('../config/db');

// Controller to get all reviews
async function readAllReview(req, res) {
    try {
        const reviews = await reviewModel.selectAll(); // Fetch all reviews from the database
        res.json(reviews); // Send reviews as a JSON response
    } catch (error) {
        res.status(500).json({ error: error.message }); // Handle error if the query fails
    }
}

// Controller to get a review by its ID
async function readReviewById(req, res) {
    const reviewId = req.params.id; // Get review ID from the URL parameter
    try {
        const review = await reviewModel.selectById({ id: reviewId }); // Fetch the review by ID
        if (review.length > 0) {
            res.json(review); // Send review as a JSON response
        } else {
            res.status(404).json({ message: 'Review not found' }); // Handle case when review is not found
        }
    } catch (error) {
        res.status(500).json({ error: error.message }); // Handle error if the query fails
    }
}

async function createReview(req, res) {
    const { review_amt, user_id, message } = req.body; // Get review details from the request body

    try {
        // Check if the user exists in the User table (or friends table if you prefer)
        const [user] = await db.query(
            `SELECT user_id FROM User WHERE user_id = ?`,
            [user_id]
        );

        // If the user does not exist
        if (user.length === 0) {
            return res.status(400).json({ error: 'User not found, invalid user_id.' });
        }

        // Proceed with inserting the review since the user exists
        const result = await reviewModel.insertSingle({ review_amt, user_id, message }); 
        
        // If insertion was successful
        res.status(201).json({ message: 'Review added successfully', result });
    } catch (error) {
        console.error('Error:', error);  // Log the error for debugging
        res.status(500).json({ error: error.message }); // Handle other errors
    }
}

// Controller to update a review by its ID
async function updateReview(req, res) {
    const reviewId = req.params.id; // Get review ID from the URL parameter
    const { review_amt, user_id, message } = req.body; // Get new review details from the request body
    try {

        // Check if the user exists in the User table (or friends table if you prefer)
        const [user] = await db.query(
            `SELECT user_id FROM User WHERE user_id = ?`,
            [user_id]
        );

        // If the user does not exist
        if (user.length === 0) {
            return res.status(400).json({ error: 'User not found, invalid user_id.' });
        }
        
        const result = await reviewModel.updateById({ id: reviewId, review_amt, user_id, message }); // Update review
        if (result.affectedRows > 0) {
            res.json({ message: 'Review updated successfully' }); // Send success response
        } else {
            res.status(404).json({ message: 'Review not found' }); // Handle case when review is not found
        }
    } catch (error) {
        res.status(500).json({ error: error.message }); // Handle error if the query fails
    }
}

// Controller to delete a review by its ID
async function deleteReview(req, res) {
    const reviewId = req.params.id; // Get review ID from the URL parameter
    try {
        const result = await reviewModel.deleteById({ id: reviewId }); // Delete review
        if (result.affectedRows > 0) {
            res.json({ message: 'Review deleted successfully' }); // Send success response
        } else {
            res.status(404).json({ message: 'Review not found' }); // Handle case when review is not found
        }
    } catch (error) {
        res.status(500).json({ error: error.message }); // Handle error if the query fails
    }
}

module.exports = {
    readAllReview,
    readReviewById,
    createReview,
    updateReview,
    deleteReview
};
