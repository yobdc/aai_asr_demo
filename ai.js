const fs = require('fs');
const request = require('request');
const md5 = require('md5');

// function to encode file data to base64 encoded string
function base64_encode(file) {
    // read binary data
    let f = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(f).toString('base64');
}

// function to create file from base64 encoded string
function base64_decode(base64str, file) {
    // create buffer object from base64 encoded string, it is important to tell the constructor that the string is base64 encoded
    var bitmap = new Buffer(base64str, 'base64');
    // write buffer to file
    fs.writeFileSync(file, bitmap);
    console.log('******** File created from base64 encoded string ********');
}

// // convert image to base64 encoded string
// var base64str = base64_encode('yhyl.wav');
// console.log(base64str);

/*
request({
    url: "http://josiahchoi.com/myjson",
    method: "POST",
    json: true,   // <--Very important!!!
    body: myJSONObject
}, function (error, response, body){
    console.log(response);
});

request.post(
    'https://api.ai.qq.com/fcgi-bin/aai/aai_asr',
    { json: { key: 'value' } },
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body)
        }
    }
);
*/

//php函数urlencode的js实现方法
var  URLEncode = function(clearString) {
    var output = '';
    var x = 0;
    clearString = clearString.toString();
    var regex = /(^[a-zA-Z0-9-_.]*)/;
    while (x < clearString.length) {
        var match = regex.exec(clearString.substr(x));
        if (match != null && match.length > 1 && match[1] != '') {
            output += match[1];
            x += match[1].length;
        } else {
            if (clearString.substr(x, 1) == ' ') {
                //原文在此用 clearString[x] == ' ' 做判断, 但ie不支持把字符串当作数组来访问, 
                //修改后两种浏览器都可兼容 
                output += '+';
            }
            else {
                var charCode = clearString.charCodeAt(x);
                var hexVal = charCode.toString(16);
                output += '%' + ( hexVal.length < 2 ? '0' : '' ) + hexVal.toUpperCase();
            }
            x++;
        }
    }
    return output;
}

var ksort = function(arys) {
    //先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获取的属性名进行排序，newkey是一个数组
    var newkey = Object.keys(arys).sort();
    //console.log('newkey='+newkey);
    var newObj = {}; //创建一个新的对象，用于存放排好序的键值对
    for (var i = 0; i < newkey.length; i++) {
        //遍历newkey数组
        newObj[newkey[i]] = arys[newkey[i]];
        //向新创建的对象中按照排好的顺序依次增加键值对

    }
    return newObj; //返回排好序的新对象
}

// getReqSign ：根据 接口请求参数 和 应用密钥 计算 请求签名
// 参数说明
//   - $params：接口请求参数（特别注意：不同的接口，参数对一般不一样，请以具体接口要求为准）
//   - $appkey：应用密钥
// 返回数据
//   - 签名结果
var getReqSign = function (params, appkey) {
    
    // 1. 字典升序排序
    let params2 = ksort(params);
    
    // 2. 拼按URL键值对
    let str = '';
    for (var key in params2){
      if (params2.hasOwnProperty(key)) {
        let value = params2[key];
        if (value !== '') { // 过滤空值，比如sign
           str += key + '=' + URLEncode(value) + '&';
        }
      }
    }
  
    // 3. 拼接app_key
    str += 'app_key=' + appkey;
    //console.log(str);
    
    // 4. MD5运算+转换大写，得到请求签名
    let sign = md5(str || '').toUpperCase();

    return sign.toUpperCase();
}

// 这里需要替换成自己的APP_KEY 和 APP_ID
const URL = 'https://api.ai.qq.com/fcgi-bin/aai/aai_asr';
const APP_KEY = 'VwLCZccX5QTEOArd';
const APP_ID = 1106884219;


let params = {
  app_id: APP_ID,
  format: 2,
  rate: 8000,
  speech: base64_encode('yhyl_8k_16bit_1ch.wav'),
  time_stamp: (Date.now() / 1000).toFixed(0),
  nonce_str: Math.random().toString(36).slice(-5),
  sign: '', // 初始值一定要写成'',不要写成别的值
}
//console.log(params);
params.sign = getReqSign(params, APP_KEY);
//console.log(params);

request.post({
  url:     URL,
  form:    params
}, function(error, response, body){
  console.log(body);
});