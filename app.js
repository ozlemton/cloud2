
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb+srv://ceng:ceng@cluster0.3ay8r.mongodb.net/hw2?retryWrites=true&w=majority';

const express = require('express');
const app = express();


var http = require('http');
var server = http.createServer(app);
var body = require('body-parser');
var path = require("path");



var GameList = ["dog", "cat", "parrot", "rabbit"];


app.use(body.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname,'./public')));
//app.use(express.static(__dirname + '/'));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname);


app.get('/', function(req,res){
//  res.sendFile(path.join(__dirname,'./public/index.html'));


    MongoClient.connect(url, {useUnifiedTopology: true}, function(err, db) {
        if (err) throw err;
            var dbo = db.db("hw2");

            dbo.collection('games').find().toArray(function(err, results1) {
              if (err) {
                throw err;
              } else {

                console.log(results1);

            dbo.collection('users').find().toArray(function(err, results2) {
              if (err) {
                throw err;
              } else {
                  res.render('index', { games: results1, users: results2 });
                }});



                }});

                
        });


});








// Insert
app.post('/addgame', function(req,res){



const client = new MongoClient(url);




    MongoClient.connect(url, {useUnifiedTopology: true}, function(err, db) {
        if (err) throw err;
            var dbo = db.db("hw2");
//            var obj = {name:name.valueOf(), genre:genre.valueOf(), photo:photo.valueOf()};
            var obj = req.body;

            obj = { ...obj, enabled: true};

            dbo.collection("games").insertOne(obj, function(err, res) {
          if (err) throw err;
          db.close();
        });
      });

    client.close();

    res.redirect('/');

    
});

app.post('/adduser', function(req,res){

    var name =  req.body.name;

const client = new MongoClient(url);


    MongoClient.connect(url, {useUnifiedTopology: true}, function(err, db) {
        if (err) throw err;
            var dbo = db.db("hw2");
//            var obj = {name:name.valueOf(), genre:genre.valueOf(), photo:photo.valueOf()};
            var obj = req.body;

            dbo.collection("users").insertOne(obj, function(err, res) {
          if (err) throw err;
          db.close();
        });
      });

    client.close();

    res.redirect('/');

    
});

//Delete
app.post('/removegame', function (req, res) {


const client = new MongoClient(url);



    MongoClient.connect(url, {useUnifiedTopology: true}, function(err, db) {
        if (err) throw err;
            var dbo = db.db("hw2");
            var query = {name: req.body.removeGameSelect};

            dbo.collection("games").deleteMany(query, function(err, res) {
          if (err) throw err;
          db.close();
        });
      });

    client.close();

    res.redirect('/');


});


app.post('/disablegamerating', function (req, res) {


const client = new MongoClient(url);



    MongoClient.connect(url, {useUnifiedTopology: true}, function(err, db) {
        if (err) throw err;
            var dbo = db.db("hw2");
            var query = {name: req.body.disableGameRatingSelect};
            var newvalues = { $set: {enabled: false} };

            dbo.collection("games").updateMany(query, newvalues, function(err, res) {
          if (err) throw err;
          db.close();
        });
      });

    client.close();

    res.redirect('/');


});

app.post('/enablegamerating', function (req, res) {


const client = new MongoClient(url);



    MongoClient.connect(url, {useUnifiedTopology: true}, function(err, db) {
        if (err) throw err;
            var dbo = db.db("hw2");
            var query = {name: req.body.enableGameRatingSelect};
            var newvalues = { $set: {enabled: true} };

            dbo.collection("games").updateMany(query, newvalues, function(err, res) {
          if (err) throw err;
          db.close();
        });
      });

    client.close();

    res.redirect('/');


});


app.post('/removeuser', function (req, res) {


const client = new MongoClient(url);


    MongoClient.connect(url, {useUnifiedTopology: true}, function(err, db) {
        if (err) throw err;
            var dbo = db.db("hw2");
            var query = {name: req.body.removeUserSelect};

            dbo.collection("users").deleteMany(query, function(err, res) {
          if (err) throw err;
          db.close();
        });
      });

    client.close();

    res.redirect('/');


});






app.get('/loginuser', function (req, res) {


// const client = new MongoClient(url);

var uname = req.query['loginUserSelect'];


    MongoClient.connect(url, {useUnifiedTopology: true}, function(err, db) {
        if (err) throw err;
            var dbo = db.db("hw2");
            var query = {username: uname};
            var projection = { username: 0, _id: 0 };
            var sortparam = { totalplaytime: -1 };

            dbo.collection("gameAndUser").find(query).project(projection)
            .sort(sortparam).toArray(function(err, results) {
              if (err) {
                throw err;
              } else {

                var aggquery = [{$match: {username: uname}}, 
                  {$group: {_id: "$username", rat: {$avg : "$rating"}}}]

              dbo.collection("gameAndUser").aggregate(aggquery).toArray(function(err, rateresult) {
              if (err) {
                throw err;
              } else {


                aggquery = [{$match: {username: uname}}, 
                  {$group: {_id: "$username", ply: {$sum : "$totalplaytime"}}}]

              dbo.collection("gameAndUser").aggregate(aggquery).toArray(function(err, playresult) {
              if (err) {
                throw err;
              } else {


                aggquery = [{$match: {username: uname}}, 
                  {$group: {_id: "$gamename", maxply: {$max : "$totalplaytime"}}}]


              dbo.collection("gameAndUser").aggregate(aggquery).toArray(function(err, mostplayresult) {
              if (err) {
                throw err;
              } else {



            dbo.collection("games").find().toArray(function(err, results2) {
              if (err) {
                throw err;
              } else {


                  res.render('user', { username: uname, 
                      averageRating: rateresult, 
                      totalPlayTime: playresult, 
                      mostPlayedGame: mostplayresult,
                      gameuser: results, 
                      games: results2});
                }});
            }});
            }});
            }});
            }});

          });


// res.render('user', { username: name});

});


/*
function updateGameRating ( gameuser) {

 MongoClient.connect(url, {useUnifiedTopology: true}, function(err, db) {
        if (err) throw err;
            var dbo = db.db("hw2");

            var aggquery = [{$match: {gamename: gameuser.gamename}}, 
            {$group: {_id: "$username", nomin: 
            {$sum : { $multiply: [ "$totalplaytime", "$rating" ] }}}}];


            dbo.collection("gameAndUser").aggregate(aggquery).toArray(function(err, results) {
          if (err) throw err;

          else{

            aggquery = [{$match: {gamename: gameuser.gamename}}, 
            {$group: {_id: "$username", denom: 
            {$sum : "$totalplaytime" }}}];


            dbo.collection("gameAndUser").aggregate(aggquery).toArray(function(err, results2) {
          if (err) throw err;

          else{


            var query = {name: gameuser.gamename};
            var newvalues = {$set:{nomin: results1.nomin, 
              denom: results2.denom}};

              dbo.collection("gameAndUser").updateMany(query, newvalues, function(err, res) {
          if (err) throw err;
          console.log("1 game-user updated");
          db.close();
        });





           }}); }});


}
};
*/



app.post('/rategame', function (req, res) {


  var uname = req.body.rateGameUname;
  var gname = req.body.rateGameSelect;
  var ratenumber = parseInt(req.body.rateGameRatingSelect, 10);



const client = new MongoClient(url);



    MongoClient.connect(url, {useUnifiedTopology: true}, function(err, db) {
        if (err) throw err;
            var dbo = db.db("hw2");
            var query = {username: uname, gamename: gname};


            dbo.collection("gameAndUser").find(query).toArray(function(err, results) {
          if (err) throw err;

          if (JSON.stringify(results) == JSON.stringify({}) || JSON.stringify(results) == JSON.stringify([]) ) 
            {

              var obj = {gamename: gname, username: uname, totalplaytime: 0.0, rating: ratenumber, comment: ""};

              dbo.collection("gameAndUser").insertOne(obj, function(err, res) {
          if (err) throw err;
          db.close();
        });

            } else 
            {

              var newvalues = {$set:{rating: ratenumber}};

              dbo.collection("gameAndUser").updateMany(query, newvalues, function(err, res) {
          if (err) throw err;
          db.close();
        });

            }   

        });
      });

    client.close();

    res.redirect('/loginuser?loginUserSelect=' + uname);


});



app.post('/playgame', function (req, res) {


  var uname = req.body.playGameUname;
  var gname = req.body.playGameSelect;
  var playgame = parseFloat(req.body.playGame);



const client = new MongoClient(url);



    MongoClient.connect(url, {useUnifiedTopology: true}, function(err, db) {
        if (err) throw err;
            var dbo = db.db("hw2");
            var query = {username: uname, gamename: gname};


            dbo.collection("gameAndUser").find(query).toArray(function(err, results) {
          if (err) throw err;

          if (JSON.stringify(results) == JSON.stringify({}) || JSON.stringify(results) == JSON.stringify([]) ) 
            {

              var obj = {gamename: gname, username: uname, totalplaytime: playgame, rating: 0, comment: ""};

              dbo.collection("gameAndUser").insertOne(obj, function(err, res) {
          if (err) throw err;
          db.close();
        });

            } else 
            {

              var newvalues = {$inc: {totalplaytime: playgame}};

              dbo.collection("gameAndUser").updateMany(query, newvalues, function(err, res) {
          if (err) throw err;
          db.close();
        });

            }   

        });
      });

    client.close();

    res.redirect('/loginuser?loginUserSelect=' + uname);


});



app.post('/commentgame', function (req, res) {


  var uname = req.body.commentGameUname;
  var gname = req.body.commentGameSelect;
  var commentgame = req.body.commentGame;



const client = new MongoClient(url);



    MongoClient.connect(url, {useUnifiedTopology: true}, function(err, db) {
        if (err) throw err;
            var dbo = db.db("hw2");
            var query = {username: uname, gamename: gname, totalplaytime: {$gt: 0.0} };


            dbo.collection("gameAndUser").find(query).toArray(function(err, results) {
          if (err) throw err;


          if (JSON.stringify(results) == JSON.stringify({})
             || JSON.stringify(results) == JSON.stringify([])
              ) 
            {

            } else 
              {

              var newvalues = {$set: {comment: commentgame}};

              dbo.collection("gameAndUser").updateMany(query, newvalues, function(err, res) {
          if (err) throw err;
          db.close();
        });

            }   

        });
      });

    client.close();

    res.redirect('/loginuser?loginUserSelect=' + uname);


});


app.get('/lookgames', function (req, res) {


const client = new MongoClient(url);

// ... 

    MongoClient.connect(url, {useUnifiedTopology: true}, function(err, db) {
        if (err) throw err;
            var dbo = db.db("hw2");


            dbo.collection("games").find().toArray(function(err, results) {
          if (err) throw err;

              res.render('game', { games: results});
                      db.close();
        });

              

        });
    

    client.close();

});



server.listen(8080,function(){ 
    console.log("Server listening on port: 8080");});

module.exports = server;