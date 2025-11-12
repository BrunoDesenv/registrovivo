const DiaryEntry = require('../models/DiaryEntry');
const User = require('../models/User');

/**
 * Get all diary entries for a user
 */
exports.getEntries = async (req, res) => {
  try {
    const { username } = req.query;

    if (!username) {
      return res.status(400).json({
        success: false,
        message: 'Username é obrigatório'
      });
    }

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // Get all entries for this user
    const entries = await DiaryEntry.find({ userId: user._id })
      .sort({ createdAt: -1 }); // Sort by newest first

    res.json({
      success: true,
      entries: entries.map(entry => ({
        id: entry._id,
        title: entry.title,
        content: entry.content,
        createdAt: entry.createdAt
      }))
    });
  } catch (error) {
    console.error('Get entries error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar entradas'
    });
  }
};

/**
 * Get a single diary entry by ID
 */
exports.getEntryById = async (req, res) => {
  try {
    const { id } = req.params;
    const { username } = req.query;

    if (!username) {
      return res.status(400).json({
        success: false,
        message: 'Username é obrigatório'
      });
    }

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // Find entry
    const entry = await DiaryEntry.findOne({ _id: id, userId: user._id });

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: 'Entrada não encontrada'
      });
    }

    res.json({
      success: true,
      entry: {
        id: entry._id,
        title: entry.title,
        content: entry.content,
        createdAt: entry.createdAt
      }
    });
  } catch (error) {
    console.error('Get entry error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar entrada'
    });
  }
};

/**
 * Create a new diary entry
 */
exports.createEntry = async (req, res) => {
  try {
    const { username, title, content } = req.body;

    // Validate input
    if (!username) {
      return res.status(400).json({
        success: false,
        message: 'Username é obrigatório'
      });
    }

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Título e conteúdo são obrigatórios'
      });
    }

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // Create new entry
    const newEntry = new DiaryEntry({
      userId: user._id,
      title: title.trim(),
      content: content.trim()
    });

    await newEntry.save();

    res.status(201).json({
      success: true,
      message: 'Entrada criada com sucesso',
      entry: {
        id: newEntry._id,
        title: newEntry.title,
        content: newEntry.content,
        createdAt: newEntry.createdAt
      }
    });
  } catch (error) {
    console.error('Create entry error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao criar entrada'
    });
  }
};

/**
 * Delete a diary entry
 */
exports.deleteEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const { username } = req.query;

    if (!username) {
      return res.status(400).json({
        success: false,
        message: 'Username é obrigatório'
      });
    }

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // Delete entry
    const result = await DiaryEntry.findOneAndDelete({
      _id: id,
      userId: user._id
    });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Entrada não encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Entrada excluída com sucesso'
    });
  } catch (error) {
    console.error('Delete entry error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao excluir entrada'
    });
  }
};
