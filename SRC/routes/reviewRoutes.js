const express = require('express');


const reviewController = require('../controller/reviewController');
const router = express.Router();

router.get('/', reviewController.readAllReview);
router.post('/', reviewController.createReview);
router.get('/:id', reviewController.readReviewById);
router.put('/:id', reviewController.updateReview);
router.delete('/:id', reviewController.deleteReview);
//Test
module.exports = router;