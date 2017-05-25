let Crypto = require('node-crypto');
let cp = new Crypto('98huhyegfybahubeif');
let _ = require('lodash');
let moment = require('moment');

const Mycrypto = require('crypto');
const secret = 'abcdefg';

let mothedFunc = {
    rendomGet: function () {
        let unitx = moment().format('X');
        let randomNum = unitx + Math.random();
        let hex = cp.hex(randomNum);
        return "0x" + hex;
    },
    rendomGet64bit: function () {
        let unitx = moment().format('X');
        let randomNum = unitx + Math.random();
        let hex = Mycrypto.createHmac('sha256', secret)
            .update(randomNum)
            .digest('hex');
        return "0x" + hex;
    },
    /**
     * 判断对象中得key是否包含数组中全部值
     * @param info
     * @param keyArr
     * @returns {boolean}
     */
    checkObject: function (info, keyArr) {
        let flag = true;
        if (_.isArray(keyArr) && keyArr.length > 0 && !_.isEmpty(info)) {
            for (key of keyArr) {
                if (!this.isNotNull(info[key])) {
                    flag = false;
                    break;
                }
            }
        } else {
            flag = false;
        }
        return flag;
    },
    /**
     *  判断数组中每个对象中得key是否包含数组中全部值
     * @param info
     * @param keyArr
     * @returns {boolean}
     */
    checkArrayObj: function (info, keyArr) {
        let flag = true;
        if (_.isArray(info) && info.length > 0) {
            for (let obj of info) {
                if (flag === false) {
                    break;
                } else {
                    flag = this.checkObject(obj, keyArr);
                }
            }
        } else {
            flag = false;
        }
        return flag;
    },
    /**
     * 传入的参数都为非空时返回true,否则返回false
     * @returns {boolean}
     */
    isNotNull: function () {
        let obj = Array.from(arguments);
        let flag = true;
        if (obj.length > 0) {
            for (let value of obj) {
                if (_.isUndefined(value) || _.isNull(value) || _.trim(value) === '') {
                    flag = false;
                    break;
                }
            }
        } else {
            flag = false;
        }
        return flag;
    }
};

module.exports = mothedFunc;
