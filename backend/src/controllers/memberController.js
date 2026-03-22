const { Member, User } = require('../models');
const { hashPassword } = require('../utils/passwordHash');

const getAllMembers = async (req, res, next) => {
  try {
    const { status, role, page = 1, limit = 20 } = req.query;
    const where = {};
    if (status) where.status = status;
    if (role) where.role = role;

    const offset = (page - 1) * limit;
    const { count, rows } = await Member.findAndCountAll({
      where,
      include: [{ association: 'user', attributes: ['id', 'email', 'firstName', 'lastName', 'avatar'] }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      data: rows,
      pagination: { total: count, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(count / limit) },
    });
  } catch (error) {
    next(error);
  }
};

const getMemberById = async (req, res, next) => {
  try {
    const member = await Member.findByPk(req.params.id, {
      include: [{ association: 'user', attributes: ['id', 'email', 'firstName', 'lastName', 'avatar'] }],
    });
    if (!member) return res.status(404).json({ success: false, message: 'Member not found' });
    res.json({ success: true, data: member });
  } catch (error) {
    next(error);
  }
};

const createMember = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, role, phone, organization, bio, expertise, joinDate, termEndDate } = req.body;

    let user = await User.findOne({ where: { email } });
    if (!user) {
      const hashedPassword = await hashPassword(password || 'TempPass123!');
      user = await User.create({ email, password: hashedPassword, firstName, lastName, role: role || 'member' });
    }

    const existingMember = await Member.findOne({ where: { userId: user.id } });
    if (existingMember) return res.status(409).json({ success: false, message: 'Member profile already exists' });

    const member = await Member.create({ userId: user.id, role, phone, organization, bio, expertise, joinDate, termEndDate });

    res.status(201).json({ success: true, message: 'Member created', data: member });
  } catch (error) {
    next(error);
  }
};

const updateMember = async (req, res, next) => {
  try {
    const member = await Member.findByPk(req.params.id);
    if (!member) return res.status(404).json({ success: false, message: 'Member not found' });
    await member.update(req.body);
    res.json({ success: true, message: 'Member updated', data: member });
  } catch (error) {
    next(error);
  }
};

const deleteMember = async (req, res, next) => {
  try {
    const member = await Member.findByPk(req.params.id);
    if (!member) return res.status(404).json({ success: false, message: 'Member not found' });
    await member.update({ status: 'inactive' });
    res.json({ success: true, message: 'Member deactivated' });
  } catch (error) {
    next(error);
  }
};

const getMemberStats = async (req, res, next) => {
  try {
    const total = await Member.count();
    const active = await Member.count({ where: { status: 'active' } });
    const inactive = await Member.count({ where: { status: 'inactive' } });
    const alumni = await Member.count({ where: { status: 'alumni' } });
    res.json({ success: true, data: { total, active, inactive, alumni } });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllMembers, getMemberById, createMember, updateMember, deleteMember, getMemberStats };
