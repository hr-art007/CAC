const { Survey, SurveyResponse, Member } = require('../models');
const { Op } = require('sequelize');

const getAllSurveys = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const where = {};
    if (status) where.status = status;

    const offset = (page - 1) * limit;
    const { count, rows } = await Survey.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
    });

    res.json({ success: true, data: rows, pagination: { total: count, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(count / limit) } });
  } catch (error) {
    next(error);
  }
};

const getSurveyById = async (req, res, next) => {
  try {
    const survey = await Survey.findByPk(req.params.id, {
      include: [{ association: 'responses' }],
    });
    if (!survey) return res.status(404).json({ success: false, message: 'Survey not found' });
    res.json({ success: true, data: survey });
  } catch (error) {
    next(error);
  }
};

const createSurvey = async (req, res, next) => {
  try {
    const survey = await Survey.create({ ...req.body, createdBy: req.user.id });
    res.status(201).json({ success: true, message: 'Survey created', data: survey });
  } catch (error) {
    next(error);
  }
};

const updateSurvey = async (req, res, next) => {
  try {
    const survey = await Survey.findByPk(req.params.id);
    if (!survey) return res.status(404).json({ success: false, message: 'Survey not found' });
    await survey.update(req.body);
    res.json({ success: true, message: 'Survey updated', data: survey });
  } catch (error) {
    next(error);
  }
};

const deleteSurvey = async (req, res, next) => {
  try {
    const survey = await Survey.findByPk(req.params.id);
    if (!survey) return res.status(404).json({ success: false, message: 'Survey not found' });
    await survey.destroy();
    res.json({ success: true, message: 'Survey deleted' });
  } catch (error) {
    next(error);
  }
};

const submitSurveyResponse = async (req, res, next) => {
  try {
    const survey = await Survey.findByPk(req.params.id);
    if (!survey) return res.status(404).json({ success: false, message: 'Survey not found' });
    if (survey.status !== 'active') return res.status(400).json({ success: false, message: 'Survey is not active' });

    const { answers, isAnonymous } = req.body;
    const member = await Member.findOne({ where: { userId: req.user.id } });

    const response = await SurveyResponse.create({
      surveyId: survey.id,
      memberId: isAnonymous ? null : (member ? member.id : null),
      answers,
      isAnonymous: isAnonymous || false,
    });

    res.status(201).json({ success: true, message: 'Response submitted', data: response });
  } catch (error) {
    next(error);
  }
};

const getSurveyResults = async (req, res, next) => {
  try {
    const survey = await Survey.findByPk(req.params.id, {
      include: [{ association: 'responses' }],
    });
    if (!survey) return res.status(404).json({ success: false, message: 'Survey not found' });

    const responseCount = survey.responses.length;
    const analytics = {};

    survey.questions.forEach((q) => {
      const questionAnswers = survey.responses.map((r) => r.answers[q.id]).filter(Boolean);
      analytics[q.id] = { question: q.text, type: q.type, totalResponses: questionAnswers.length, answers: questionAnswers };
    });

    res.json({ success: true, data: { survey, responseCount, analytics } });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllSurveys, getSurveyById, createSurvey, updateSurvey, deleteSurvey, submitSurveyResponse, getSurveyResults };
