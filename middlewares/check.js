let tips = require('../config/tips');
module.exports = {
    checkLogin: function checkLogin(req, res, next) {
        if (!req.session.user) {
            res.json(tips.sessionTimeOut);
        }else{
            next();
        }
    },
    checkNotLogin: function checkNotLogin(req, res, next) {
        if (req.session.user) {
            return res.send(tips.ok);//返回之前的页面
        }
        next();
    }
};
