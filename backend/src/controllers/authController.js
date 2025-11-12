const bcrypt = require('bcryptjs');
const User = require('../models/User');

/**
 * Register a new user
 */
exports.register = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    // Validate input
    if (!username || username.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: 'Usuário deve ter pelo menos 3 caracteres'
      });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Senha deve ter pelo menos 6 caracteres'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ username: username.trim() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Usuário já existe'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      username: username.trim(),
      password: hashedPassword,
      email: email?.trim()
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: 'Usuário cadastrado com sucesso!',
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        createdAt: newUser.createdAt
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao cadastrar usuário'
    });
  }
};

/**
 * Login user
 */
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Usuário e senha são obrigatórios'
      });
    }

    // Find user
    const user = await User.findOne({ username: username.trim() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciais inválidas'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Credenciais inválidas'
      });
    }

    res.json({
      success: true,
      message: 'Login realizado com sucesso',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao fazer login'
    });
  }
};

/**
 * Get current user info
 */
exports.getCurrentUser = async (req, res) => {
  try {
    const { username } = req.query;

    if (!username) {
      return res.status(400).json({
        success: false,
        message: 'Username é obrigatório'
      });
    }

    const user = await User.findOne({ username }).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar usuário'
    });
  }
};
