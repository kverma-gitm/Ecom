var express = require('express');
var app = express();
var mongoose = require('mongoose'); //mongoose connection
// module for maintaining sessions
var session = require('express-session');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
// path is used the get the path of our files on the computer
var path = require('path');
var passport  = require( 'passport' );
var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;

app.use(passport.initialize());
app.use(passport.session());

var GOOGLE_CLIENT_ID      = "691416009733-8k4b6eoqs8g630f25p4401r6v0pdlgo3.apps.googleusercontent.com"
  , GOOGLE_CLIENT_SECRET  = "2T_I56we_ecCBum-aOtJbZu_";

  passport.serializeUser(function(user, done) {
  done(null, user);
});

  passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

//google login code
passport.use(new GoogleStrategy({
    clientID:     "691416009733-8k4b6eoqs8g630f25p4401r6v0pdlgo3.apps.googleusercontent.com",
    clientSecret: "2T_I56we_ecCBum-aOtJbZu_",
    callbackURL: "http://localhost:3000/auth/google/callback",
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      
      // To keep the example simple, the user's Google profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Google account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }
));


app.use(logger('dev'));
app.use(bodyParser.json({
    limit: '10mb',
    extended: true
}));
app.use(bodyParser.urlencoded({
    limit: '10mb',
    extended: true
}));
app.use(cookieParser());

// initialization of session middleware 
//App level middleware
app.use(session({
    name: 'myCookie',
    secret: 'Secret', // encryption key 
    resave: true,
    httpOnly: true, //used for  mitigating cookie frauds...
    saveUninitialized: true,
    cookie: {
        secure: false
    }
}));

// set the templating engine 
app.set('view engine', 'pug');

//set the views folder
app.set('views', path.join(__dirname + '/app/views'));

//connect to mogoose
var dbPath = "mongodb://localhost/EDB";
db = mongoose.connect(dbPath);
mongoose.connection.once('open',function() {
    console.log("database connection open successful");
});
// end mongoose connection

// fs module, by default module for file management in nodejs
var fs = require('fs');

// include all our model files
fs.readdirSync('./app/models').forEach(function (file) {
    // check if the file is js or not
    if (file.indexOf('.js'))
        // if it is js then include the file from that folder into our express app using require
        require('./app/models/' + file);

}); // end for each

// include controllers
fs.readdirSync('./app/controllers').forEach(function (file) {
    if (file.indexOf('.js')) {
        // include a file as a route variable
        var route = require('./app/controllers/' + file);
        //call controller function of each file and pass your app instance to it
        route.controller(app)

    }

}); //end for each


//including the auth file here
var auth = require('./middlewares/auth');
var userModel = mongoose.model('user');

//set the middleware as an application level middleware
//For all the requests in our application this check will be performed(hence v'll b able to know whether the user is logged in or not)
//  middleware to set request user , and check which user is logged in 
//check if the user is a legitimate user
app.use(function (req, res, next) {
    // checking whether session and session.user exist or not
    if (req.session && req.session.user) {
        userModel.findOne({
            'email': req.session.user.email
        }, function (err, user) {

            if (user) {
                /*part of advanced security
                req.user = user;
                delete req.user.password;
                (maintaining multiple variabes)*/


                //updating the session information, if there would have been any updation after the creation of account
                req.session.user = user;

                delete req.session.user.password;
                next();
            } else {
                // do nothing , because this is just to set the values
            }
        });
    } else {
        next();
    }
});


app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    if (err.status == 404) {
        res.render('404', {
            message: err.message,
            error: err
        });
    } else {
        res.render('error', {
            message: err.message,
            error: err
        });
    }
});

    app.get('/', function (req, res) {
        res.render('index');
    });

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});

//google passport code

app.get('/auth/google',
  passport.authenticate('google', { scope: 
    [ 'https://www.googleapis.com/auth/plus.login',
    , 'https://www.googleapis.com/auth/plus.profile.emails.read' ] }
));
 
app.get( '/auth/google/callback', 
    passport.authenticate( 'google', { 
        successRedirect: '/users/google/screen',
        failureRedirect: '/auth/google/failure'
}));
