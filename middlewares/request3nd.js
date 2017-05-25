let request = require('request');
let config = require('../config/default');
let remoteUrl = config.anxinSign;
let moment = require('moment');

let request3nd = {
    /**
     * 调用jar包请求安心签接口
     * @param path  jar请求名
     * @param req   请求参数
     * @returns {Promise} 返回promise
     */
    anXinSign:(path, req) => {
        let url = remoteUrl + '/' + path;
        addHeadToRequest(req);
        return new Promise((resolve, reject) => {
            request.post({
                url: url,
                body: req,
                json: true
            }, function (err, response, body) {
                if (err) {
                    reject(err);
                }
                resolve(body);
            })
        })
    }
};
module.exports = request3nd;

/**
 * 在安心签请求中添加头部字段信息
 * @param {object} req 安心签请求对象
 * @return {object}    添加过头部字段的请求对象
 */
function addHeadToRequest(req) {
    if (typeof req === 'object' && !req.head) {
        req.head = {
            txTime: moment(new Date()).format('YYYYMMDDhhmmss')
        };
        return req;
    }
}