const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');

// Routes for quizzes
router.get('/quizzes', quizController.getQuizzes);
router.get('/quizzes/:quizId', quizController.getQuizById);
router.post('/quizzes', quizController.createQuiz);
router.delete('/quizzes/:quizId', quizController.deleteQuiz);
router.put('/quizzes/:quizId', quizController.updateQuiz);

// Route for question
router.get('/questions', quizController.getQuestions);
router.post('/quizzes/:quizId/question', quizController.addQuestionToQuiz);
router.post('/quizzes/:quizId/questions', quizController.addQuestionsToQuiz);
router.get('/quizzes/:quizId/populate', quizController.getQuestionsWithKeyword);
router.put('/questions/:questionId', quizController.updateQuestion);
router.delete('/questions/:questionId', quizController.deleteQuestion);

module.exports = router;
