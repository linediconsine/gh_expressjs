const express = require('express');
const superagent = require('superagent');
const session = require('express-session');
const bodyParser = require("body-parser");
const path = require("path");
const app = express();


const GitHubClient = require('./github-client'); // Github client API Calls
const Settings = require('./settings'); // Github client API Calls
const gitHubClient = new GitHubClient(superagent);

// ## Set up express apps
var sessionSettings = {
    secret: Settings.SUPER_SECRET_KEY,
    cookie: {}
}

if(Settings.GITHUB_CLIENT_ID.length < 1 || Settings.GITHUB_CLIENT_SECRET.length < 1){
    console.log("#Important: \n please confirgure Settings.js \n\n");
}

// ## Middleware & Configurations
app.use(session(sessionSettings));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));





// ## Login managins
app.get("/login", function (req, res) {
    res.render('login', {
        client_id: Settings.GITHUB_CLIENT_ID,
        errors: ""
    });
});

app.get("/logout", function (req, res) {
    req.session.login = false;
    res.redirect('/login');
});

app.get("/callback", function (req, res) {
    const GITHUB_CODE = req.query.code;

    return gitHubClient
        .oAuthAccessToken(Settings.GITHUB_CLIENT_ID, Settings.GITHUB_CLIENT_SECRET, GITHUB_CODE)
        .then((results) => {
            const status = results.status;

            console.log("App::/callback");
            console.log(status);
            console.log(results.body);

            req.session.login = true;
            res.redirect('/');
       
        })
        .catch((err) => {

            console.log("App::/callback::Error");
            console.log(err);
            
            res.redirect('/login');
        })

});

// ## Homepage Search managing
app.get("/", function (req, res) {
    const LOGGED = req.session.login == true;
    const FORM_COMPILED = !!req.query.u;

    if (!LOGGED) {
        // If User not logged, redirect to login
        res.redirect('/login');
    } else {

        if (FORM_COMPILED) {
            // User is the only required field if is compiled search results
            
            return gitHubClient
                .userSearch(req.query)
                .then((reply) => {
                    res.render('index', {
                        formdata: reply.pageData,
                        results: reply.json,
                        errors: ""
                    });
                })
                .catch((err) => {
                    res.render('index', {
                        formdata: reply.pageData,
                        results: reply.json,
                        errors: {
                            error: 'search_error',
                            error_description: err
                        }
                    });
                })
        } else {

            // The form is not compiled
            res.render('index', {
                formdata: "",
                results: "",
                errors: ""
            });
        }
    }
});


module.exports = app