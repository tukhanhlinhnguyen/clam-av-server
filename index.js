//Require Express module
const express = require('express');
//Define port for local web server
let port = 3000;
//Initialize express app
const app = express();
//Initialize multer
let multer = require('multer');
//Initialize path
let path = require('path');
//Initialize fs
var fs = require('fs');
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
//Init and config cors
var cors = require('cors')
var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
}
app.use(cors(corsOptions))
// specify the uploads folder
app.use(express.static(path.join(__dirname, 'uploads')));
// headers and content type
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Pass to next layer of middleware
    next();
  });
//config multer
//config folder name middleware
const preuploadMiddleware = (req, res, next) => {
  req.folderName = uuidv4();
  const dir = `./uploads/${req.folderName}`
  fs.mkdir(dir, error => {
    if(error)console.log(error)
  })
  next();
};
  var upload = () => {
      return multer({ storage: multer.diskStorage({
        // destination
        destination: function (req, file, cb) {
            let folderName = req.folderName
            const dir = `./uploads/${folderName}`
            cb(null, dir)
          
        },
        filename: function (req, file, cb) {
          cb(null, file.originalname);
        },
        onError : function(err, next) {
          console.log('error', err);
          next(err);
        }
      })
    });
  }
//Create simple get route for the index
app.get('/', function(req,res){
 res.send('Clam Av Express');
})

//Create upload route
app.post("/upload",preuploadMiddleware, upload().array("files", scan,), function (req, res) {
  console.log("Upload over")
  scan(req.folderName, res)
});

//scan the folder zith clamAV
function scan(foldername, res) {
  console.log(`Scan ${foldername}`)
  const nodeCmd = require('node-cmd');
  nodeCmd.run(  
      `"C:\\Users\\tu-khanh-linh.nguyen\\ClamAV\\clamscan" C:\\Users\\tu-khanh-linh.nguyen\\project\\PocClamAvExpress\\uploads\\${foldername}`,
      (err, data, stderr) => {
          if (!err){
              //return the report
              console.log(data)
              //delete the scanned folder
              fs.rmSync(`C:\\Users\\tu-khanh-linh.nguyen\\project\\PocClamAvExpress\\uploads\\${foldername}`, { recursive: true, force: true });
              //return the report
              res.status(200);
              res.send({
                msg:data
              })
          }else{
              console.log(err)
          }
  });
}

// uuid generator
function uuidv4() {
  const crypto = require('crypto').webcrypto;
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

//run server on port 5000
var server = app.listen(port, function () {
    console.log("Listening on port %s...", port);
});

