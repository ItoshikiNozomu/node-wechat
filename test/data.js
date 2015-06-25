var knex = require('knex')({
    client: 'mysql',
    connection: {
        host: 'localhost',
        user: 'root',
        password:'123456',
        database: 'wechat'
    },
    pool: {
        min: 0,
        max: 7
    }
})

knex('directors').where({
	//location:''
}).then(function(data){
	console.log(data)
})
