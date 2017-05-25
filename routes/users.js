let express = require('express');
let router = express.Router();
let crypto = require('crypto');
let tips = require('../config/tips');
let User = require('../models/usermodel');
let Promise = require('promise');
let xv = require('xxp-verification');
let utils = require('../utils/commonTool');
/**
 * 测试用
 */
router.get('/register', (req, res) => {
    res.render('register');
});
router.get('/login', (req, res) => {
    console.log(req.user);
    res.render('login', {user: req.user});
});
// 处理登录请求
router.post('/login', (req, res) => {
    console.log(req.body);
    if (utils.isNotNull(req.body.username, req.body.password)) {
        let userInfo = {
            username: req.body.username,
            password: getMD5Password(req.body.password),
        };
        User.findOne(
            {
                $or: [{username: userInfo.username}, {emails: {address: userInfo.username}}],
                password: userInfo.password
            },
            (err, data) => {
                if (data) {
                    loginSuccess(data, req, res);
                } else {
                    res.json(tips.loginError);
                }
            }
        )
    } else {
        res.json(tips.paramFmtErr)
    }

});

// 处理注册请求
router.post('/register', (req, res) => {
    if (utils.isNotNull(req.body.username, req.body.password, req.body.email)) {
        let userInfo = {
            username: req.body.username,
            password: req.body.password,
            emails: {address: req.body.email}
        };
        checkDataRep(userInfo, req, res);
    } else {
        res.json(tips.paramFmtErr);
    }

});

router.get('/logout', (req, res, next) => {
    req.session.destroy();
    res.json(tips.sessionTimeOut);
});

router.get('/active/:activeToken', function (req, res, next) {

    // console.log(req.params.activeToken);
    User.find({activeToken: req.params.activeToken, activeExpires: {$gt: Date.now()}}, (err, data) => {

        if (err) {
            res.json(err);
        }
        if (!data) {

            res.json('激活失败');

        } else {
            data.isActive = true;
            User.update({activeToken: data.activeToken}, {$set: data}, function (use) {
                res.send('已成功激活');
            });
        }
    });


});


/**
 * 注册校验
 * @param req
 * @param res
 */
function checkDataRep(userInfo, req, res) {
// 逐一验证储存的信息是否重复
    function userNameCheck() {
        return new Promise((resolve, reject) => {
            let reg = /^[a-zA-z]\w{5,15}$/;
            if (reg.test(userInfo.username)) {
                User.findOne({username: userInfo.username}, function (err, data) {
                    if (data) {
                        reject(tips.userNameExits);
                    } else {
                        resolve('ok');
                    }
                })
            } else {
                reject(tips.usernameFmtErr);
            }
        })
    }

    function emailCheck() {
        return new Promise((resolve, reject) => {
            if (!xv.checkEmail(userInfo.emails.address)) {
                reject(tips.emailFmtErr)
            } else {
                User.findOne({emails: {address: userInfo.emails.address}}, function (err, data) {
                    if (data) {
                        reject(tips.emailExists);
                    } else {
                        resolve('ok');
                    }
                });
            }
        })
    }

    function passwordCheck() {
        return new Promise((resolve, reject) => {
            let reg = /^[A-Za-z0-9]{6,20}$/;
            if (reg.test(userInfo.password)) {
                resolve('ok');
            } else {
                reject(tips.passwordFmtErr);
            }
        })
    }

    function phoneCheck() {
        return new Promise((resolve, reject) => {
            if (!xv.checkMobile(userInfo.phone)) {
                reject(tips.phoneFmtErr);
            } else {
                User.findOne({phone: userInfo.phone}, function (err, data) {
                    if (data) {
                        reject(tips.phoneExists);
                    } else {
                        resolve('ok');
                    }
                })
            }
        })
    }

    Promise.all([userNameCheck(), emailCheck(), passwordCheck()])
        .then(() => {
            registerSuccess(userInfo, req, res);
        }).catch(err => {
        res.json(err);
    })
}


/**
 * 注册成功，保存用户信息、session,返回状态码
 * @param userInfo
 * @param req
 * @param res
 */
function registerSuccess(userInfo, req, res) {
    userInfo.password = getMD5Password(userInfo.password);
    User.create(userInfo, function (err, data) {
        if (err) {
            console.log('注册失败');
            res.send(err);
        }
        req.session.user = userInfo;
        let result = tips.responseOk;
        result.data = {user_id: data._id}
        res.json(result);
    })
}

/**
 * 登录成功 保存session 返回状态码
 * @param userInfo
 * @param req
 * @param res
 */
function loginSuccess(userInfo, req, res) {
    console.log(userInfo.username + "   登录成功");
    req.session.user = userInfo;
    let result = tips.responseOk;
    result.data = {user_id: userInfo._id};
    res.json(result);

}

/**
 * 密码加密处理
 * @param content
 * @returns {*}
 */
function getMD5Password(content) {
    let md5 = crypto.createHash('md5');//定义加密方式:md5不可逆,此处的md5可以换成任意hash加密的方法名称；
    md5.update(content);
    return md5.digest('hex');  //加密后的值
}
/**
 * 存储session
 * @param userInfo
 * @param req
 * @param res
 */
function saveSession(userInfo, req, res) {
    return new Promise((resolve, reject) => {
        req.session.user = userInfo;
        resolve('保存session成功');
    })
}
module.exports = router;
