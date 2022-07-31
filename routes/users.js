const router = require('express').Router();
const { createUser, getUsers, userById } = require('../controllers/users');

router.post('/', createUser);
router.get('/', getUsers);
router.get('/:userId', userById);

module.exports = router;