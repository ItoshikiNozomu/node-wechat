var conf = require('../../conf/db.json')
var knex = require('knex')({
  client: 'mysql',
  connection: {
    host     : conf.host,
    user     : conf.user,
    password : conf.pwd,
    database : 'wechat'
  },
  pool: {
    min: 0,
    max: 7
  }
})

