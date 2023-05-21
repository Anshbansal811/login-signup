const express = require("express");
const path = require("path");
const app = express();
const multer = require("multer");

require("./db/com");

const signup1 =require("./models/signup");
const port = process.env.PORT || 3000;

const static_path = path.join(__dirname, "../public");
app.use(express.static(static_path));
app.set("public",static_path);

//upload image
app.set("public",path.join(__dirname,"../public"))
app.set("view engine","ejs")

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
  
        // Uploads is the Upload_folder_name
        cb(null, "uploads")
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + "-" + Date.now()+".jpg")
    }
  })
  const maxSize = 1 * 1000 * 1000;

  var upload = multer({ 
    storage: storage,
    limits: { fileSize: maxSize },
    fileFilter: function (req, file, cb){
    
        // Set the filetypes, it is optional
        var filetypes = /jpeg|jpg|png/;
        var mimetype = filetypes.test(file.mimetype);
  
        var extname = filetypes.test(path.extname(
                    file.originalname).toLowerCase());
        
        if (mimetype && extname) {
            return cb(null, true);
        }
      
        cb("Error: File upload only supports the " + "following filetypes - " + filetypes);
      } 
  
// mypic is the name of file attribut
}).single("mypic");       
  
app.get("/",function(req,res){
    res.render("Signup");
})
    
app.post("/uploadProfilePicture",function (req, res, next) {
        
    // Error MiddleWare for multer file upload, so if any
    // error occurs, the image would not be uploaded!
    upload(req,res,function(err) {
  
        if(err) {
  
            // ERROR occurred (here it can be occurred due
            // to uploading image of size greater than
            // 1MB or uploading different file type)
            res.send(err)
        }
        else {
  
            // SUCCESS, image successfully uploaded
            res.send("Success, Image uploaded!")
        }
    })
})
    
// Take any port number of your choice which
// is not taken by any other process
app.listen(8080,function(error) {
    if(error) throw error
        console.log("Server created Successfully on PORT 8080")
})
  //END


app.use(express.json());
app.use(express.urlencoded({extended:false}));

console.log(path.join(__dirname,"../public"));
app.get('/', (req, res) => res.send('Hello my World!'));

app.get("/log",(req,res)=>{
    res.send(`login`);
})
app.post("/log",async(req,res)=>{
    try{
        const usermail=await signup1.findOne({Email:req.body.Email});
        if(usermail.Password_u==req.body.Password_u){
            res.render('../public/an.ejs');
        }else{
            res.send("wrong password");
        }
    }catch(error){
        res.status(400).send("error2");
    }
})

app.get("/sign",(req,res)=>{
    res.send('signup');
})
app.post("/sign",async(req,res)=>{
    try{

        const Password =req.body.Password_u;
        const p2=req.body.conf;
        if(Password===p2){
            const signupemp = new signup1({
                Email:req.body.Email,
                Password_u:req.body.Password_u,
                conf:req.body.conf
            })
            const signu = await signup1.insertMany([signupemp]);
            res.status(201).send(signu);
        }else{
            res.send("Password are not matching")
        }
    }catch(e){
        res.status(400).send(e);
    }
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`))
