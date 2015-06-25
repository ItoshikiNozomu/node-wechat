//var mysql      = require('mysql')
// var pool = mysql.createPool({
//   host     : 'localhost',
//   user     : 'root',
//   password : '123456'

// })
var knex = require('knex')({
  client: 'mysql',
  connection: {
    host     : 'localhost',
    user     : 'root',
    password : '123456',
    database : 'wechat'
  },
  pool: {
    min: 0,
    max: 7
  }
});
// function runSql(sql){
// 	return new Promise(function(res,rej){
// 		pool.getConnection(function(err,conn){
// 			conn.query(sql,function(err,rows){
// 				conn.release()
// 				res(rows)
// 			})
// 		})
// 	})
// }



// function getUserList(opt){
// 	return runSql('select * from wechat.user_info')
	
// }
// function getCustomMenu(){
// 	return runSql('select * from wechat.custom_menu')
	
// }
// function insertUser(obj){
// 	return runSql('insert into ')
// }
// function updateUser(obj){

// }

function testKnex(){
	return  knex.select().table('user_info')
	

}

module.exports = {
	// getUserList:getUserList,
	// getCustomMenu:getCustomMenu,
	testKnex:testKnex
}