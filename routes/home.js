let express = require('express');
let router = express.Router();
let checkLogin =  require('../middlewares/check.js').checkLogin;
/* GET users listing. */
router.get('/', checkLogin, function(req, res, next) {
  //next();
  res.render('index',{user:req.session.user});
});

module.exports = router;
