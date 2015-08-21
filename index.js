var express = require('express')
var app = express()
var fs = require('fs')
var w = express()
var engines = require('consolidate')
var dbConf = require('./conf/db.json')
var wUtils = require('./src/wechatUtils')
var bodyParser = require('body-parser')
var Busboy = require('busboy')
var React = require('react')

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

app.set('views', ['src/templates','src/react'])
app.engine('html', engines.ejs)
app.engine('jsx', engines.react)
app.use('/w', w)
require('node-jsx').install()

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

var comp = require('./src/react/index.jsx')

app.get('/index', function (req, res) {
    var pageObj = { 
        name: 'eee',
        title:'welcome',
        scripts:[/*'a.js','b.js'*/] ,
        mainNavLinks:[
            {name:'link1',href:'../link1'}
        ],
        styleSheets:['a.css'],
        options:[{value:'a',displayName:'a'},{value:2,displayName:'b'}]
        }
    res.send(React.renderToString(React.createElement(comp,pageObj)))
  // res.render('index.jsx', { name: 'John' })
  /*
    app.render('index.jsx', pageObj, 
        function (err, html) { 
        console.log(html)
        res.send(html) })
        */
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
    Promise.all(tasks).then(function(v) {
        //console.log(tokenObj)
        //console.log(rows[0])
        app.render('directors.html', {
        	//why array here?
            directors: v[0],
            openid: v[1] ? v[1].openid : ''
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
    Promise.all(tasks).then(function(v) {
        //console.log(arguments)
        app.render('institutions.html', {
            institutions: v[0],
            openid: v[1] ?v[1].openid : ''
        }, function(err, html) {
            if (err) throw err

            res.send(html)

        })
    })

})

w.get('/code',function(){})

//w.get('')
//test code below
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
