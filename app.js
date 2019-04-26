var express = require('express');
var multer = require('multer');
var ejs = require('ejs');
var path = require('path');

// Set The Storage Engine
var storage = multer.diskStorage({
  destination: './image/uploads/',
  filename: function(req, file, cb){
    cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Init Upload
var upload = multer({
  storage: storage,
  limits:{fileSize: 1000000},
  fileFilter: function(req, file, cb){
    checkFileType(file, cb);
  }
}).single('myImage');

// Check File Type
function checkFileType(file, cb){
  // Allowed ext
  var filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  var extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  var mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
    return cb(null,true);
  } else {
    cb('Error: Images Only!');
  }
}

// Init app
var myapp = express();

// EJS
myapp.set('view engine', 'ejs');

// Public Folder
myapp.use(express.static('./image'));
myapp.use(express.static(
  path.join(__dirname, 'resources')
  ));

myapp.get('/', (req, res) => res.render('uploadimage'));

myapp.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if(err){
      res.render('uploadimage', {
        msg: err
      });
    } else {
      if(req.file == undefined){
        res.render('uploadimage', {
          msg: 'Error: No File Selected!'
        });
      } else {
        res.render('uploadimage', {
          msg: 'File Uploaded!',
          file: `uploads/${req.file.filename}`
        });
      }
    }
  });
});

var port = 3000;

myapp.listen(port, () => console.log(`Server started on port ${port}`));