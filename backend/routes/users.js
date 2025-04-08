const express = require('express');
const {
  updateProfile,
  updateLevel,
  updateHearts
} = require('../controllers/users');

const router = express.Router();

const { protect } = require('../middleware/auth');
const { uploadProfileImage } = require('../middleware/upload');

router.put('/profile', protect, uploadProfileImage, updateProfile);
router.put('/level', protect, updateLevel);
router.put('/hearts', protect, updateHearts);

module.exports = router;