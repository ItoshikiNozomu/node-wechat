var dbConf = require('../../conf/db.json')
var knex = require('knex')({
  client: 'mysql',
  connection: {
    host     : dbConf.host,
    user     : dbConf.user,
    password : dbConf.pwd,
    database : 'wechat'
  },
  pool: {
    min: 0,
    max: 7
  }
})

