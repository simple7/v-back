module.exports = {
    responseOk: {
        code: 0,
        message: '成功'
    },
    sessionTimeOut:{
        code: -1,
        message: '未登录'
    },
    userNameExits: {
        code: 10001,
        message: '用户名已存在'
    },
    emailExists: {
        code: 10002,
        message: '邮箱已被注册'
    },
    phoneExists: {
        code: 10003,
        message: '手机号已被使用'
    },
    emailFmtErr:{
        code: 10004,
        message: '邮箱格式不正确'
    },
    phoneFmtErr:{
        code: 10005,
        message: '手机格式不正确'
    },
    paramFmtErr:{
        code: 10006,
        message: '请求参数格式有误'
    },
    usernameFmtErr:{
        code: 10007,
        message: '用户名格式不正确'
    },
    passwordFmtErr:{
        code: 10008,
        message: '密码不符合规则'
    },
    loginError: {
        code: 20001,
        message: '用户名或密码错误'
    }
};