const { Document, User } = require('../models');
const path = require('path');
const fs = require('fs');

const getAllDocuments = async (req, res, next) => {
  try {
    const { type, meetingId, page = 1, limit = 20 } = req.query;
    const where = { isActive: true };
    if (type) where.type = type;
    if (meetingId) where.meetingId = meetingId;

    const offset = (page - 1) * limit;
    const { count, rows } = await Document.findAndCountAll({
      where,
      include: [{ association: 'uploader', attributes: ['id', 'firstName', 'lastName'] }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
    });

    res.json({ success: true, data: rows, pagination: { total: count, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(count / limit) } });
  } catch (error) {
    next(error);
  }
};

const getDocumentById = async (req, res, next) => {
  try {
    const doc = await Document.findByPk(req.params.id, {
      include: [{ association: 'uploader', attributes: ['id', 'firstName', 'lastName'] }],
    });
    if (!doc || !doc.isActive) return res.status(404).json({ success: false, message: 'Document not found' });
    res.json({ success: true, data: doc });
  } catch (error) {
    next(error);
  }
};

const uploadDocument = async (req, res, next) => {
  try {
    const { title, description, type, meetingId, accessLevel, tags, version } = req.body;
    const file = req.file;

    const doc = await Document.create({
      title,
      description,
      type,
      meetingId,
      accessLevel,
      tags: tags ? JSON.parse(tags) : [],
      version,
      fileName: file ? file.originalname : null,
      filePath: file ? file.path : null,
      fileSize: file ? file.size : null,
      mimeType: file ? file.mimetype : null,
      uploadedBy: req.user.id,
    });

    res.status(201).json({ success: true, message: 'Document uploaded', data: doc });
  } catch (error) {
    next(error);
  }
};

const updateDocument = async (req, res, next) => {
  try {
    const doc = await Document.findByPk(req.params.id);
    if (!doc || !doc.isActive) return res.status(404).json({ success: false, message: 'Document not found' });
    await doc.update(req.body);
    res.json({ success: true, message: 'Document updated', data: doc });
  } catch (error) {
    next(error);
  }
};

const deleteDocument = async (req, res, next) => {
  try {
    const doc = await Document.findByPk(req.params.id);
    if (!doc || !doc.isActive) return res.status(404).json({ success: false, message: 'Document not found' });
    await doc.update({ isActive: false });
    res.json({ success: true, message: 'Document deleted' });
  } catch (error) {
    next(error);
  }
};

const downloadDocument = async (req, res, next) => {
  try {
    const doc = await Document.findByPk(req.params.id);
    if (!doc || !doc.isActive || !doc.filePath) return res.status(404).json({ success: false, message: 'Document not found' });
    res.download(doc.filePath, doc.fileName);
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllDocuments, getDocumentById, uploadDocument, updateDocument, deleteDocument, downloadDocument };
