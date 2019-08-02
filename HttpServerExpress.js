var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require("fs"); //file system
var multer  = require('multer');

app.use(express.static('public'));
//app.use(multer({ dest: '/tmp/'}));
app.use(bodyParser.urlencoded({ extended: false }));

// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.get('/', function (req, res) {
   res.send('Hello World');
})
app.post('/api*',bodyParser.json(),  (req, res) =>{
    console.log('Received: '+JSON.stringify(req.body));
    //res.writeHead(200, {'Content-Type': 'application/json'});
    var response={
        username:'test',
        password:'1234',
        code:'00',
        message:'Success'
    }
    res.send(JSON.stringify(response));
 })

 //Serve html
 
 app.get('/index.htm', function (req, res) {
    res.sendFile( __dirname + "/" + "index.htm" );
 })
 
 app.get('/process_get', function (req, res) {
    // Prepare output in JSON format
    response = {
       first_name:req.query.first_name, 
       last_name:req.query.last_name
    };
    console.log(response);
    res.end(JSON.stringify(response));
 })

 app.post('/process_post', urlencodedParser, function (req, res) {
    // Prepare output in JSON format
    response = {
       first_name:req.body.first_name2,
       last_name:req.body.last_name2
    };
    console.log(response);
    res.end(JSON.stringify(response));
 })

 app.post('/file_upload', function (req, res) {
    console.log(req.files.file.name);
    console.log(req.files.file.path);
    console.log(req.files.file.type);
    var file = __dirname + "/" + req.files.file.name;
    
    fs.readFile( req.files.file.path, function (err, data) {
       fs.writeFile(file, data, function (err) {
          if( err ) {
             console.log( err );
             } else {
                response = {
                   message:'File uploaded successfully',
                   filename:req.files.file.name
                };
             }
          
          console.log( response );
          res.end( JSON.stringify( response ) );
       });
    });
 })

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})

//File upload next stage