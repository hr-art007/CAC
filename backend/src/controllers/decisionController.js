const { Decision, Vote, User } = require('../models');

const getAllDecisions = async (req, res, next) => {
  try {
    const { status, priority, page = 1, limit = 20 } = req.query;
    const where = {};
    if (status) where.status = status;
    if (priority) where.priority = priority;

    const offset = (page - 1) * limit;
    const { count, rows } = await Decision.findAndCountAll({
      where,
      include: [{ association: 'creator', attributes: ['id', 'firstName', 'lastName'] }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
    });

    res.json({ success: true, data: rows, pagination: { total: count, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(count / limit) } });
  } catch (error) {
    next(error);
  }
};

const getDecisionById = async (req, res, next) => {
  try {
    const decision = await Decision.findByPk(req.params.id, {
      include: [
        { association: 'creator', attributes: ['id', 'firstName', 'lastName'] },
        { association: 'vote' },
      ],
    });
    if (!decision) return res.status(404).json({ success: false, message: 'Decision not found' });
    res.json({ success: true, data: decision });
  } catch (error) {
    next(error);
  }
};

const createDecision = async (req, res, next) => {
  try {
    const decision = await Decision.create({ ...req.body, createdBy: req.user.id });
    res.status(201).json({ success: true, message: 'Decision created', data: decision });
  } catch (error) {
    next(error);
  }
};

const updateDecision = async (req, res, next) => {
  try {
    const decision = await Decision.findByPk(req.params.id);
    if (!decision) return res.status(404).json({ success: false, message: 'Decision not found' });
    await decision.update(req.body);
    res.json({ success: true, message: 'Decision updated', data: decision });
  } catch (error) {
    next(error);
  }
};

const deleteDecision = async (req, res, next) => {
  try {
    const decision = await Decision.findByPk(req.params.id);
    if (!decision) return res.status(404).json({ success: false, message: 'Decision not found' });
    await decision.destroy();
    res.json({ success: true, message: 'Decision deleted' });
  } catch (error) {
    next(error);
  }
};

const getDecisionStats = async (req, res, next) => {
  try {
    const total = await Decision.count();
    const pending = await Decision.count({ where: { status: 'pending' } });
    const approved = await Decision.count({ where: { status: 'approved' } });
    const rejected = await Decision.count({ where: { status: 'rejected' } });
    const implemented = await Decision.count({ where: { status: 'implemented' } });
    res.json({ success: true, data: { total, pending, approved, rejected, implemented } });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllDecisions, getDecisionById, createDecision, updateDecision, deleteDecision, getDecisionStats };
