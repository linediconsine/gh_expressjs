const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const request = require("request");
const cookieParser = require('cookie-parser');
const session = require('express-session');

const superagent = require('superagent');
const jest = require('jest');

const GitHubClient = require('./github-client');

// ## Edit this
const SUPER_SECRET_KEY = "SUPER_SECRET_KEY" // TO-DO CRYPT BEFORE SHARE
const GITHUB_CLIENT_ID = ""
const GITHUB_CLIENT_SECRET = ""


// ## Set up express apps
let app = express();
var sessionSettings = {
    secret: SUPER_SECRET_KEY,
    cookie: {}
  }


// ## Middleware & Configurations
app.use(session(sessionSettings));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname,'public')));
app.set('view engine','ejs');
app.set('views', path.join(__dirname,'views'));

const gitHubClient = new GitHubClient(superagent);


// ## Login managins
app.get("/login" ,function(req,res){
    res.render('login', { client_id :  GITHUB_CLIENT_ID,
                            errors : ""});
});

app.get("/logout" ,function(req,res){
    req.session.login = false;
    res.redirect('/login');
});

app.get("/callback" ,function(req,res){
    const GITHUB_CODE = req.query.code;
    gitHubClient.routing_callback(req,res,GITHUB_CLIENT_ID,GITHUB_CLIENT_SECRET,GITHUB_CODE);
});

// ## Homepage Search managing
app.get("/" ,function(req,res){
    const LOGGED = req.session.login == true;
    const FORM_COMPILED =!!req.query.u;

    if(!LOGGED){ 
        //If User not logged, redirect to login
        res.redirect('/login');
    }else{

        if (FORM_COMPILED) { 
            //User is the only required field if is compiled search results
			gitHubClient.routing_search(res,req.query);
        
        } else { 
        
            // The form is not compiled
            res.render('index', { formdata: "", 
                                  results: "" ,
                                  errors : ""
                                });
        }
    }
});

app.listen(3000,function(){
    console.log("Server started on Port  http://localhost:3000");
})


