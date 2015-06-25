'use strict'
var wUtils = require('../src/wechatUtils')

// wUtils
// 	.getAppAccessToken()
// 	.then(function(tokenObj){
// 		console.log(tokenObj)
// 	})

// wUtils.getMenuDef().then(function(str){
// 	console.log(str)
// })

wUtils.updateMenu().then(function(obj){
	//throw new Error
	console.log(obj)
},function(err){
	console.log(err)
})

