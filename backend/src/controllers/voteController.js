const { Vote, VoteRecord, Member } = require('../models');

const getAllVotes = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const where = {};
    if (status) where.status = status;

    const offset = (page - 1) * limit;
    const { count, rows } = await Vote.findAndCountAll({
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

const getVoteById = async (req, res, next) => {
  try {
    const vote = await Vote.findByPk(req.params.id, {
      include: [
        { association: 'creator', attributes: ['id', 'firstName', 'lastName'] },
        { association: 'records', include: [{ association: 'member', include: [{ association: 'user', attributes: ['id', 'firstName', 'lastName'] }] }] },
      ],
    });
    if (!vote) return res.status(404).json({ success: false, message: 'Vote not found' });
    res.json({ success: true, data: vote });
  } catch (error) {
    next(error);
  }
};

const createVote = async (req, res, next) => {
  try {
    const vote = await Vote.create({ ...req.body, createdBy: req.user.id });
    res.status(201).json({ success: true, message: 'Vote created', data: vote });
  } catch (error) {
    next(error);
  }
};

const updateVote = async (req, res, next) => {
  try {
    const vote = await Vote.findByPk(req.params.id);
    if (!vote) return res.status(404).json({ success: false, message: 'Vote not found' });
    if (vote.status === 'closed') return res.status(400).json({ success: false, message: 'Cannot update a closed vote' });
    await vote.update(req.body);
    res.json({ success: true, message: 'Vote updated', data: vote });
  } catch (error) {
    next(error);
  }
};

const castVote = async (req, res, next) => {
  try {
    const vote = await Vote.findByPk(req.params.id);
    if (!vote) return res.status(404).json({ success: false, message: 'Vote not found' });
    if (vote.status !== 'open') return res.status(400).json({ success: false, message: 'Vote is not open' });

    const member = await Member.findOne({ where: { userId: req.user.id } });
    if (!member) return res.status(403).json({ success: false, message: 'Only members can vote' });

    const existingRecord = await VoteRecord.findOne({ where: { voteId: vote.id, memberId: member.id } });
    if (existingRecord) return res.status(409).json({ success: false, message: 'Already voted' });

    const { choice, comment } = req.body;
    if (!vote.options.includes(choice)) return res.status(400).json({ success: false, message: 'Invalid choice' });

    const record = await VoteRecord.create({ voteId: vote.id, memberId: member.id, choice, comment });

    const results = {};
    vote.options.forEach((opt) => { results[opt] = 0; });
    const allRecords = await VoteRecord.findAll({ where: { voteId: vote.id } });
    allRecords.forEach((r) => { results[r.choice] = (results[r.choice] || 0) + 1; });
    await vote.update({ results });

    res.json({ success: true, message: 'Vote cast', data: record });
  } catch (error) {
    next(error);
  }
};

const closeVote = async (req, res, next) => {
  try {
    const vote = await Vote.findByPk(req.params.id);
    if (!vote) return res.status(404).json({ success: false, message: 'Vote not found' });
    await vote.update({ status: 'closed' });
    res.json({ success: true, message: 'Vote closed', data: vote });
  } catch (error) {
    next(error);
  }
};

const getVoteStats = async (req, res, next) => {
  try {
    const total = await Vote.count();
    const open = await Vote.count({ where: { status: 'open' } });
    const closed = await Vote.count({ where: { status: 'closed' } });
    res.json({ success: true, data: { total, open, closed } });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllVotes, getVoteById, createVote, updateVote, castVote, closeVote, getVoteStats };
