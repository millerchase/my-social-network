const router = require('express').Router();

router.use('/users', require('./user-routes'));
router.use('/thoughts', require('./thought-routes'));

module.exports = router;
