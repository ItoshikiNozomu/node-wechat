var express = require('express')
var app = express()
var fs = require('fs')
var w = express()
var engines = require('consolidate')
var dbConf = require('./conf/db.json')
var wUtils = require('./src/wechatUtils')
var bodyParser = require('body-parser')
var Busboy = require('busboy')


var textBodyParser = bodyParser.text({limit:1024*1000*100})
var rawParser = bodyParser.raw({limit:1024*1000*100})
var knex = require('knex')({
    client: 'mysql',
    connection: {
        host: dbConf.host,
        user: dbConf.user,
        password: dbConf.pwd,
        database: 'wechat'
    },
    pool: {
        min: 0,
        max: 7
    }
})

app.set('views', 'src/templates')
app.engine('html', engines.ejs)
app.engine('react', engines.react)
app.use('/w', w)


// app.use (function(req, res, next) {
//     var data=''
//     req.setEncoding('utf8')
//     req.on('data', function(chunk) { 
//        data += chunk
//     })

//     req.on('end', function() {
//         req.raw = data
//         next()
//     })
// })
function decodeBase64Image(dataString) {
   
    
  var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
    response = {};

  if (matches.length !== 3) {
    return new Error('Invalid input string');
  }

  response.type = matches[1];
  response.data = new Buffer(matches[2], 'base64');

  return response;
}

app.get('/', function(req, res) {
    res.send('Hello World')
})

w.get('/director/:id', function(req, res) {
    //todo use Promise.all
    var tasks = []
    var where = {}
    tasks.push(knex('directors').where(where))
    if (req.query.code) {
        tasks.push(wUtils.getUserAccessTokenObj())
    }
    if (req.params.id != '-') {
        //todo 
    }
    Promise.all(tasks).then(function(rows, tokenObj) {
        //console.log(tokenObj)
        //console.log(rows[0])
        app.render('directors.html', {
        	//why array here?
            directors: rows[0],
            openid: tokenObj ? tokenObj.openid : ''
        }, function(err, html) {
            if (err) throw err
                //console.log(html)
            res.send(html)

        })
    })



})


w.get('/institution/:loc/:id', function(req, res) {
    var where = {}
    var tasks = []

    if (req.params.loc != '-') {
        //todo set where clause
    }
    if (req.params.id != '-') {

    }
    tasks.push(knex('institutions').where(where))
    if (req.query.code) {
        tasks.push(wUtils.getUserAccessTokenObj())
    }
    Promise.all(tasks).then(function(rows, tokenObj) {
        app.render('institutions.html', {
            institutions: rows,
            openid: tokenObj ? tokenObj.openid : ''
        }, function(err, html) {
            if (err) throw err

            res.send(html)

        })
    })

})

app.get('/test/:loc/:id', function(req, res) {

    console.log(req.params.loc)
    console.log('####')
    console.log(req.params.id)
    res.send('aaaa')
})

app.post('/imgZipping',textBodyParser,function(req,res){
    
    var decoded = decodeBase64Image(req.body)
	
    fs.writeFile('./'+req.query.name,decoded.data/*,'base64',function(){}*/)
    res.send()
})


app.post('/img', function (req, res) {
    //console.log(12345)
    var bb = new Busboy({ headers: req.headers })
    var _d =[]
   console.log(req.headers)
    bb.on('file', function (fieldName, file, fileName, encoding, mimeType) {
        //console.log(arguments)
        file.on('data', function (data) {
            //console.log(data.length)
            _d.push(data)
          
        })
        file.on('end', function () {
            
            
            fs.writeFile('./'+fileName,Buffer.concat(_d))
        })
    })
    bb.on('finish', function () {
        
        res.send('Done !')
    })
    req.pipe(bb)
})

app.listen(8080)
