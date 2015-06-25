'use strict'
var appid = 'wx21feab23046d7455'
var appSecret = 'ea4316fbed2c84833f388c55f3187d4b'
var https = require('https')
var http = require('http')
var fetch = require('node-fetch')

var db = require('./db')
var fPromise = null
var fs = require('fs')

var authUrlBase = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appid + '&redirect_uri={url}&response_type=code&scope=snsapi_base#wechat_redirect'

function getAppAccessToken() {
    //a.b()
    if (fPromise) {
        return fPromise
    } else {
        fPromise = fetch([
                'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential',
                'appid=' + appid,
                'secret=' + appSecret
            ].join('&'))
            .then(function(resp){return resp.json()})
            .then(function(obj) {
                //throw new Error('aaaaaaa')
                //a.b()
                //todo expires_in 的单位是？
                setTimeout(function() {
                        fPromise = null
                    }, obj.expires_in-1000)
                
                console.log(obj)
                return obj.access_token
            })
        return fPromise
    }


}






function getUserAccessTokenObj(code) {
    var url = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=' 
            +appid + '&secret=' +appSecret + '&code=' 
            +code + '&grant_type=authorization_code'

    return fetch(url).then(function(resp){return resp.json()})
}

function updateMenu() {
    //"https://api.weixin.qq.com/cgi-bin/menu/create?access_token=" . ACCESS_TOKEN
    return getAppAccessToken()
        .then(function(token) {
            var url = "https://api.weixin.qq.com/cgi-bin/menu/create?access_token=" + token
            return getMenuDef()
                .then(function(defString) {
                    //console.log(url,defString)
                    return fetch(url, {
                        method: 'post',
                        body: defString
                    }).then(function(resp){
                        return resp.json()
                    })
                })
        })


}

function getMenuDef() {
    return db.getCustomMenu()
        .then(function(rows) {
            //todo

            var lv0Btns = []
                
                //todo sort first


            for (var i = 0; i < rows.length; i++) {
                if (rows[i].level == 0) {

                    lv0Btns.push({
                        type: rows[i].type,
                        name: rows[i].name,
                        url: rows[i].need_user_token ? authUrlBase.replace('{url}', encodeURIComponent(rows[i].url)) : rows[i].url

                    })
                }
            }
            //console.log(lv0Btns)
            //todo just lv0 btn here
            return JSON.stringify({
                button: lv0Btns
            })

        })
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function genCode(){
    var codeLength = 5
    var code = ''
    for(var i = 0;i<codeLength;i++){
        code += String.fromCharCode(getRandomInt(65,89))
    }
    return code
}


module.exports = {
    getAppAccessToken: getAppAccessToken,
    getMenuDef: getMenuDef,
    updateMenu:updateMenu
}
