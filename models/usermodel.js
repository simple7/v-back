let mongo = require('../middlewares/mongodb.js');
const userSchema = new mongo.Schema({
    username: String,
    password: String,
    emails: Object,
    roles: String,
    chainInfo: Object,
    corpAccounts: Object,
    anxinSign: Object,
    createdAt: String,
    services: String,
    isActive: {
        type: Boolean,
        default: false
    },
    activeToken: String,
    activeExpires: Date,
}, {
    collection: 'userinfo' //表名字
});
module.exports = mongo.model('userinfo', userSchema);
