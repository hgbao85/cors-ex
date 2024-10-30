const { Quiz, Question } = require('../models/Quiz');

// quizController
exports.getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().populate('questions');
    if (!quizzes || quizzes.length === 0) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId).populate('questions');
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createQuiz = async (req, res) => {
  try {
    const newQuiz = new Quiz(req.body);
    await newQuiz.save();
    res.status(201).json({
      message: 'Quiz created successfully',
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.quizId);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    res.json({ message: 'Quiz deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateQuiz = async (req, res) => {
  try {
    const updatedQuiz = await Quiz.findByIdAndUpdate(
      req.params.quizId,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedQuiz) return res.status(404).json({ message: 'Quiz not found' });
    res.json(updatedQuiz);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// questionController

exports.getQuestions = async (req, res) => {
  try {
    const questions = await Question.find();
    if (!questions || questions.length === 0) {
      return res.status(404).json({ message: 'No questions found' });
    }
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addQuestionToQuiz = async (req, res) => {
  try {
    const { text, options, correctAnswerIndex } = req.body;
    const newQuestion = new Question({ text, options, correctAnswerIndex });
    await newQuestion.save();

    const quiz = await Quiz.findById(req.params.quizId);
    quiz.questions.push(newQuestion._id);
    await quiz.save();

    res.status(201).json(quiz);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.addQuestionsToQuiz = async (req, res) => {
  try {
    const questions = await Question.insertMany(req.body.questions);
    const quiz = await Quiz.findById(req.params.quizId);

    questions.forEach(question => quiz.questions.push(question._id));
    await quiz.save();

    res.status(201).json(quiz);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateQuestion = async (req, res) => {
  try {
    const updatedQuestion = await Question.findByIdAndUpdate(
      req.params.questionId,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedQuestion) return res.status(404).json({ message: 'Question not found' });
    res.json(updatedQuestion);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    const deletedQuestion = await Question.findByIdAndDelete(req.params.questionId);
    if (!deletedQuestion) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
    const quiz = await Quiz.findOneAndUpdate(
      { questions: req.params.questionId },
      { $pull: { questions: req.params.questionId } },
      { new: true }
    );

    res.status(200).json({ message: 'Question deleted successfully', quiz });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getQuestionsWithKeyword = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId).populate({
      path: 'questions',
      match: { text: /capital/i }
    });

    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    res.json(quiz.questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
