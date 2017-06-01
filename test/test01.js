let fs = require('fs');
let request = require("request");
let cheerio = require("cheerio");
let mkdirp = require('mkdirp');
let path = require('path');

/**
 * node写的一个爬虫工具，爬取网站图片
 *
 */
// 从第几页开始抓取
let pageNum = 1;

//目标网址
let url = 'http://jandan.net/ooxx/page-'+pageNum+'#comments';

//本地存储目录
let dir = 'd://images';

//创建目录
mkdirp(dir, function(err) {
    if(err){
        console.log(err);
    }
});

//发送请求

function req(url){
    request(url, function(error, response, body) {
        if(!error && response.statusCode == 200) {
            let $ = cheerio.load(body);
            $("#comments img").each(function(){
                let src = $(this).attr("src")
                if(src!=""){
                    console.log("正在下载"+src)
                    let filename = parseUrl(src)
                    download(src,filename)
                }
            })
            let nextPage = $(".cp-pagenavi .next-comment-page");
            if(nextPage.attr("href")){
                console.log("下一页是："+nextPage.attr("href"))
                req(nextPage.attr("href"))
            }else{
                console.log("没了")
            }
        }
    })
}
req(url)

function parseUrl(url){
    let filename = path.basename(url);
    return filename;
}

function download(src,filename){
    if(src.substr(0,4)!="http"){
        src = "http:"+src
    }
    console.log(src)
    request(src).on("error",function(err){
        return false;
    }).pipe(fs.createWriteStream(dir + "/" + filename)).on("close",function(){
        console.log("成功下载"+src);
    }).on("error",function(err){
        return false;
    })
}