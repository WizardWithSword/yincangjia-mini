import {apiDomain} from '../config/index.js'
var JSEncrypt = require('../utils/jsencrypt.js')
var CryptoJS = require('../utils/crypto-js.min.js')
var api = {}
api.getKeys = function () {
  return httpRequest('GET', '/api/keys', '').then((res) => {
    console.log('keys', res)
    if (res.code === '200') {
      wx.setStorageSync('pri', res.result.pri)
      wx.setStorageSync('pub', res.result.pub)
    }
    return res
  })
}
api.getNoticeList = function () {
  return httpRequest('GET', '/api/notice/list').then(res => {
    return apiResDataDeal(res)
  })
}
api.get = function (url, data) {
  return httpRequest('GET', url, data).then(res => {
    return apiResDataDeal(res)
  })
}
api.post = function (url, data) {
  var encdata = encryptData(data)
  return httpRequest('POST', url, encdata).then(res => {
    return apiResDataDeal(res)
  })
}

function httpRequest (method, url, param) {
  url = apiDomain + url
  let uid = wx.getStorageSync('uid') || '1'
  var p = new Promise(function(resolve, reject) {
    wx.request({
      url: url,
      method: method,
      data: param,
      header:{
        "uid": uid,
        "Accept":"application/json",
        "Cache-Control": "no-cache"
      },
      success: function(res) {
        var data = res.data;
        resolve(data)
      },
      fail: function(res){
        console.error(res)
        reject(res)
      }
    })
  })
  return p
}

/**
 * RSA解密
 * @param {[type]} encdata [description]
 * @param {[type]} key     [description]
 */
function RSADecrypt (encdata, key) {
  var crypt2 = new JSEncrypt.JSEncrypt();
  key = key || wx.getStorageSync('pri')
  if (!!key == false) {
    return null
  }
  crypt2.setKey(key)
  return crypt2.decrypt(encdata, 'base64');
}
/**
 * [AESDecrypt AES解密]
 * @param {[type]} encdata [description]
 * @param {[type]} key     [description]
 * @param {[type]} iv      [description]
 */
function AESDecrypt (encdata, key, iv) {
  if (key == null) {
    return encdata
  }
  return CryptoJS.AES.decrypt(encdata, CryptoJS.enc.Utf8.parse(key), {
    iv: CryptoJS.enc.Utf8.parse(iv),
    mode: CryptoJS.mode.CBC,
    padding:CryptoJS.pad.Pkcs7
  }).toString(CryptoJS.enc.Utf8)      
}
/**
 * [RSAEncrypt 客户端公钥加密]
 * @param {[type]} encdata [description]
 * @param {[type]} key     [description]
 */
function RSAEncrypt (encdata, key) {
  var crypt = new JSEncrypt.JSEncrypt();
  key = key || wx.getStorageSync('pub')
  crypt.setKey(key)
  if (!!key == false) {
    return encdata
  }
  console.log('加密公钥：', key)
  return crypt.encrypt(encdata);
}
function AESEncrypt (realdata, key, iv) {
  var d = JSON.stringify(realdata)
  var ed = CryptoJS.AES.encrypt(d, CryptoJS.enc.Utf8.parse(key), {
    iv: CryptoJS.enc.Utf8.parse(iv),
    mode: CryptoJS.mode.CBC,
    padding:CryptoJS.pad.Pkcs7
  }).toString()
  return ed
}
/**
 * [random1632key 生成16位或32位随机字符串]
 * @param  {[type]} length [description]
 * @return {[type]}        [description]
 */
function random1632key (length) {
  var str = Math.random().toString(36).slice(-8)
  return CryptoJS.MD5('md5', str).toString().substr(0, length)
}
function encryptData(data) {
  var key = random1632key(32)
  var iv = random1632key(16)
  var rsakey = RSAEncrypt(key)
  var postdata = AESEncrypt(data, key, iv)
  var obj = {}
  obj.iv = iv
  obj.skey = rsakey
  // obj.k = key // 调试RSA加密
  obj.data = postdata
  return obj
}
/**
 * [apiResDataDeal 接口返回值解密处理]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
function apiResDataDeal (data) {
  if (data.code === '200') {
    var realkey = RSADecrypt(data.skey)
    // console.log('rsakey is qual to key:', realkey)
    var jsonstr = AESDecrypt(data.result, realkey, data.iv)
    data.result = JSON.parse(jsonstr)
    delete data.iv
    delete data.skey
    return data
  } else {
    console.error(data.message)
    data.result = AESDecrypt(data.result, RSADecrypt(data.skey), data.iv)
    return data
  }
}

module.exports = api