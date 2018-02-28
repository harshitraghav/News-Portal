var express=require('express');
var mongoose=require('mongoose');
nodemailer = require('nodemailer');
var sha1=require('sha1');
var multer=require('multer');
mongoose.connect('mongodb://localhost/NEWS_PORTAL')
var adminsSchema=require('./database/admins');
var newsSchema=require('./database/news');
var regisSchema=require('./database/regis');
var bodyParser=require('body-parser');//middleware 
var cors=require('cors');//middleware 

var app=express();
// create reusable transporter object using the default SMTP transport
 transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // secure:true for port 465, secure:false for port 587
    auth: {
        user: 'sumit.ducat@gmail.com',
        pass: 'password'
    }
});
app.use(express.static('../api'));
 var storage = multer.diskStorage({ //multers disk storage settings
        destination: function (req, file, cb) {
            cb(null, './uploads/');
        },
        filename: function (req, file, cb) {
            var datetimestamp = Date.now();
            cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
        }
    });

    var upload = multer({ //multer settings
                    storage: storage
                }).single('file');

app.use(bodyParser.json());
app.use(cors());
app.post("/signup",function(req,res)
{
    mailOptions = {
    from: 'sumit.ducat@gmail.com', // sender address
    to: req.body.email, // list of receivers
    subject: 'Registration Link', // Subject line
    text: 'Activation Link \n', // plain text body
    html: 'Hello :'+ to +'\n <a href="http://localhost:8045/active/"+to>Click Here</a>' // html body
};
   // console.log(req.body.email);
regis=new regisSchema({email:req.body.email,pass:sha1(req.body.pass),mobile:req.body.mobile});
regis.save(function (err,data){
    if(err)
    {}
    transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    return res.json({msg:"Activation link send to ur mail"})
});

    
})
})
app.get("/single/:id",function(req,res)
{
      dat=req.params.id;
      newsSchema.find({time:dat},function(err,data)
      {
          if(err)
          {}
          if(data.length===0)
          {}
          res.json({dataa:data})
      })
})
app.get("/search/:ser",function(req,res)
{
      ser=req.params.ser;
      newsSchema.find({},function(err,data)
      {
          if(err)
          {}
          if(data.length===0)
          {}
          res.json({dataa:data})
      })
})
app.get("/catnews/:cname",function(req,res)
{
      cname=req.params.cname;
      console.log(cname);
      newsSchema.find({category:cname},function(err,data)
      {
          if(err)
          {}
          if(data.length===0)
          {
            return res.json({error:1,dataa:"No Data"})  
          }
          
          return res.json({error:0,dataa:data})
      })
})
app.post("/sumit",function(req,res)
{
  
})
app.post("/addnews",function(req,res)
{
    upload(req,res,function(err){
            if(err){
                
                console("error")
            }})
            console.log(req.body)
                 
   var news=new newsSchema(req.body);
   console.log("run");
   news.save(function(err,data)
   {
        console.log("save");
       if(err)
       {
           res.json({msg:err})
       }
       res.json({msg:'News Added'})
   })
   
})
app.get("/fetnews",function(req,res)
{
   newsSchema.find(function(err,data)
   {
      if(err)
      {
          res.json({err:1,mesg:'error'})
      }
      if(data.length==0)
      {
          res.json({err:1,mesg:'No news found'})
      }
     res.json({err:0,mesg:data})
   })
})
app.delete("/delcat/:dat",function(req,res)
{    
    console.log("hi");
    console.log(req.params.dat);
       newsSchema.remove({
            time : req.params.dat
        }, function(err, todo) {
            if (err)
                res.send(err);
                else{
                    return res.json({error:0})
                }
                
            // get and return all the todos after you create another
          /*  Todo.find(function(err, todos) {
                if (err)
                    res.send(err)
                res.json(todos);
            });*/
        });

})

app.post("/chpass",function(req,res)
{
    uid=req.body.uid;
    op=req.body.opp;
    np=req.body.npp;
    //alert(np);
    //console.log(np);
    adminsSchema.find({id:uid}).exec(function(err,data)
    {
        if(op===data[0].pass)
        {
          adminSchema.update({id:uid},{$set:{pass:np}},function(err,data)
          {
             return res.json({ error: 0, msg: 'password changed' });
          })
        }
        else
        {
            return res.json({ error: 1, msg: 'op is not correct' });
        }
    })  
})
app.post("/login",function(req,res)
{ //id1=req.body.id
    //pass1=req.body.pass
    id1='admin';
    pass1='admin123';
    adminsSchema.find({id:'admin',pass:'admin123'},function(err,data)
    {
   if (err) {
            return res.json({ error: 1, msg: 'unable to login' })
        }
        if (data.length === 0) {
            return res.json({ error: 1, msg: 'user not found' });
        }
        res.json({ error: 0, msg: 'admin' });
    })
})
app.get("/news",function(req,res)
{
   newsSchema.find(function(err,data)
   {
      if(err)
      {
          res.json({err:1,mesg:'error'})
      }
      if(data.length==0)
      {
          res.json({err:1,mesg:'No news found'})
      }
     res.json({err:0,mesg:data})
   })
})
app.get("/category/:cat",function(req,res)
{
   News.find({category:req.params.cat},function(err,data)
   {
       if(err)
       {
           return res.json({err:1,data:"Error"})
       }
       if(data.length===0)
       {
           return res.json({err:1,data:"No news Found"})
       }
       return res.json({err:0,data:data})
   })
})
app.listen(8045)