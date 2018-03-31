// note_routes.js
var ObjectID = require('mongodb').ObjectID;
var getIP = require('ipware')().get_ip;


module.exports = function(app, db, passport) {
  


  app.get('/', (req, res) => {
     res.sendFile(process.cwd() + '/public/index.html');
  });
  


  
  app.get('/login/twitter',
  passport.authenticate('twitter'));

app.get('/login/twitter/return', 
  passport.authenticate('twitter', { failureRedirect: '/' }),
  function(req, res) {
    if(req.user){console.log('login user =' +  req.user.username)};
    res.redirect('/');
  });
  
   
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
  

  
  app.get('/mypolls', (req, res) => {
    var ipInfo = getIP(req).clientIp;

     db.collection('polls').find({"owner":ipInfo})
      .toArray(function(err, db_polls) {
        if (err) throw err;
        //console.log(db_polls);
        res.send(db_polls);
    })
  });
  
  
  app.get('/getip', (req, res) => {
    var ipInfo = getIP(req).clientIp;
    var user_ip = { "user_ip": ipInfo};
    //console.log(user_ip);
    res.send(user_ip);
  });
  
  
  app.delete('/poll/:id', (req, res) => {
      const id = req.params.id;
      const details = { name:id };
      db.collection('polls').remove(details, (err, item) => {
        if (err) {
          res.send({'error':'An error has occurred'});
        } else {
          res.send('Note ' + id + ' deleted!');
        } 
      });
  });
  
  
    app.post('/vote', (req, res) => {
      for (var key in req.body){
        var vote = { "name": JSON.parse(key).name, "vote": JSON.parse(key).vote};
      }
      var ipInfo = getIP(req).clientIp;
      db.collection('polls')
      .find({name: vote.name})
          .toArray(function(err, db_polls) {
            if (err) throw err;
            var options_obj = db_polls[0].options;
            if(!options_obj[vote.vote]){
                options_obj[vote.vote]=1;
            }else{
               options_obj[vote.vote]+=1;
            }
            db.collection('polls').update( { name:vote.name } , { $set: { options: options_obj  } } );
            db.collection('polls').update( { name:vote.name } , { $push: { voted:  ipInfo } } );
            res.send('hello');
      })
  });
  
  
  app.post('/newpoll', (req, res) => {
      console.log('post new poll');
      for (var key in req.body){
        var poll = { "name": JSON.parse(key).name, "options": JSON.parse(key).options, "voted":[], "owner": JSON.parse(key).owner};
        //console.log(poll);
      }
      db.collection('polls').insert(poll, (err, result) => {
          if (err) { 
            res.send({ 'error': 'An error has occurred' }); 
          } else {
            res.send(result.ops[0]);
      }

    })
  });
 
  
  app.get('/polls', (req, res) => {
     db.collection('polls').find({})
      .toArray(function(err, db_polls) {
        if (err) throw err;
        //console.log(db_polls);
        if(req.user){
          var obj = {"db_polls": db_polls, 'user': req.user};
          console.log('app.get polls user =' +  req.user.username)
        }else{
          var obj = {"db_polls": db_polls};
        }
        res.send(obj);
    })
  });
  
  
  app.get('/poll/:id', (req, res) => {
    const id = req.params.id;
    const details = { name:id };
    db.collection('polls').findOne(details, (err, item) => {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        //console.log('i wont poll');
        //console.log(req.params.id);
        //console.log(item);
        res.send(item);
      } 
    });
  });
  
    
    
  app.get('/notes/:id', (req, res) => {
    const id = req.params.id;
    const details = { '_id': new ObjectID(id) };
    db.collection('notes').findOne(details, (err, item) => {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        res.send(item);
      } 
    });
  });
  
  
  app.post('/notes', (req, res) => {
    const note = { text: req.body.body, title: req.body.title };
    db.collection('notes').insert(note, (err, result) => {
      if (err) { 
        res.send({ 'error': 'An error has occurred' }); 
      } else {
        res.send(result.ops[0]);
      }
    });
  });
  
  
  app.delete('/notes/:id', (req, res) => {
    const id = req.params.id;
    const details = { '_id': new ObjectID(id) };
    db.collection('notes').remove(details, (err, item) => {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        res.send('Note ' + id + ' deleted!');
      } 
    });
  });
  
  
  app.put ('/notes/:id', (req, res) => {
    const id = req.params.id;
    const details = { '_id': new ObjectID(id) };
    const note = { text: req.body.body, title: req.body.title };
    db.collection('notes').update(details, note, (err, result) => {
      if (err) {
          res.send({'error':'An error has occurred'});
      } else {
          res.send(note);
      } 
    });
  });
  
};