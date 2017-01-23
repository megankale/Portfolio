var pg = require('pg');
var express = require ('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');
app.set('views','./views');

var dbURL = 'postgres://localhost:5432/portfolio'

app.get('/', function(req,res){
  pg.connect(dbURL, function(err,client, done){
    res.render('portfolio/index');
    pg.end();
  })
})

app.get('/posts',function(req,res){
  pg.connect(dbURL, function(err, client, done){
    client.query(`select * from blog`, function(err, result){
      done()
      res.render('posts', {data:result.rows});
      pg.end();
    })
  })
})

app.post('/posts', function(req,res){
  pg.connect(dbURL, function(err, client, done){
    client.query(`insert into blog (title, content) values ('${req.body.title}','${req.body.content}')`, function(err, result){
      console.log(err);
      done();
      res.redirect('/posts')
    })
  })
})

app.get('/posts/:id', function(req, res){
  pg.connect(dbURL, function(err, client, done){
    client.query(`select * from blog where id =  '${req.params.id}'`, function (err, result){
      console.log(err);
      done();
      res.render('posts/show', { data:result.rows[0]});
      pg.end();
    })
  })
})

app.get('/portfolio', function(req,res){
  pg.connect(dbURL, function(err,client, done){
    res.render('portfolio/portfolio');
    pg.end();
  })
})

app.listen(3000, function(){
  console.log("Listening on port 3000");
})
