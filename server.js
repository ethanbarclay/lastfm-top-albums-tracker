const express = require('express')
const bodyParser = require('body-parser')

// Create a new instance of express
const app = express()

// Tell express to use the body-parser middleware and to not parse extended bodies
app.use(bodyParser.urlencoded({ extended: false }))

// Serve static files
app.use(express.static('public'))

// Route that receives a POST request for a new user
app.post('/backend', function (req, res) {
  const body = req.body.Body
  res.set('Content-Type', 'text/plain')
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  var user = req.body.user;

  // Post request user to confirm validity
  const { http, https } = require('follow-redirects');
  const options = {
    hostname: 'last.fm',
    port: 443,
    path: '/user/' + user,
    method: 'GET',
    headers: 
    {'content-type': 'application/json'},
    json: true,
    "rejectUnauthorized": false , 
    followAllRedirects: true

  }
  const req2 = https.request(options, res2 => {
    // Check if the request was valid
    if (res2.statusCode == 200) {
        const fs = require('fs');
        // Check if user already exists
        fs.readFile('users.txt', function (err, data) {
            if (err) throw err;
            if(!(data.indexOf(user) >= 0)) {
             // Write user to file
             var users = fs.readFileSync('users.txt');
             if (users == "") {
                fs.appendFile('users.txt', user, function (err) {
                  if (err) throw err;
                });
             } else {
                fs.appendFile('users.txt', ' ' + user, function (err) {
                  if (err) throw err;
                });
             }
            }
          });
    }
  })
  req2.on('error', error => {
    console.error(error)
  })
  req2.end()
})

// Route that receives a GET request for userList
app.get('/backend', function(req,res) {
    res.set('Content-Type', 'text/plain')
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");  
    var fs = require("fs");
    var users = fs.readFileSync('users.txt');
    res.send(users);
    //code to perform particular action.
    //To access GET variable use.
    //request.var1, request.var2 etc
    });

// Tell our app to listen on port 3000
var port = process.env.PORT || 3000;
app.listen(port, function (err) {
  if (err) {
    throw err
  }

  console.log('Server started on port ' + port)
})