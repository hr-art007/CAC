const express = require('express');
const router = express.Router();
const { getAllSurveys, getSurveyById, createSurvey, updateSurvey, deleteSurvey, submitSurveyResponse, getSurveyResults } = require('../controllers/surveyController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);
router.get('/', getAllSurveys);
router.get('/:id', getSurveyById);
router.get('/:id/results', getSurveyResults);
router.post('/', authorize('admin', 'chair', 'staff'), createSurvey);
router.post('/:id/respond', submitSurveyResponse);
router.put('/:id', authorize('admin', 'chair', 'staff'), updateSurvey);
router.delete('/:id', authorize('admin'), deleteSurvey);

module.exports = router;
