var mongoose = require('mongoose');
var express = require('express');
var userRouter = express.Router();
var userModel = mongoose.model('user')
var responseGenerator = require('../../lib/responseGenerator');
var auth = require("../../middlewares/auth");
var dialog = require('dialog');

module.exports.controller = function (app) {

    

 userRouter.get('/login/screen', function (req, res) {
        res.render('login');
    });
    //end get login screen

    userRouter.get('/google/screen', function (req, res) {
    	
        res.redirect("../products");
    });
    //end get google login screen

    userRouter.get('/', function (req, res) {

        res.render('signup');

    }); //end get signup screen

    userRouter.get('/forgotpassword/screen', function (req, res) {

        res.render('forgotpassword');

    }); //end get forgotpassword screen

    userRouter.get('/logout/screen', function (req, res) {
        req.session.user = null;
        res.redirect('/users/login/screen');
    });
     //end get logout screen

    userRouter.get('/dashboard/screen',auth.isLoggedIn, function (req, res) {

        res.render('dashboard', {
            user: req.session.user
        });
        }); //end get dashboard








    //signin module
    userRouter.post('/', function (req, res) {


        if (req.body.firstName != undefined && req.body.lastName != undefined && req.body.email != undefined && req.body.password != undefined) {

            var newUser = new userModel({
                userName: req.body.firstName + '' + req.body.lastName + Math.floor(Math.random() * 100 + 1),
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                country: req.body.country,
                password: req.body.password

            }); // end new user 

             
             newUser.save(function (err) {
                if (err) {
                    console.log("Some error");
                    console.log(err);
                    var myResponse = responseGenerator.generate(true, "some error " + err, 500, null);
                    //res.send(myResponse);
                    res.render('error', {
                        message: myResponse.message,
                        error: myResponse.data
                    });
                }
                 else {
                    req.session.user = newUser;
                    console.log(req.session);
                    delete req.session.user.password;
                    res.redirect('/users/dashboard');
                }
            

            }); //end new user save


        } else {

            var myResponse = {
                error: true,
                message: "Some body parameter is missing",
                status: 403,
                data: null
            };

            //res.send(myResponse);

            res.render('error', {
                message: myResponse.message,
                error: myResponse.data
            });

        }


    }); //end get all users


//login module
    userRouter.post('/login', function (req, res) {

        userModel.findOne({
            $and: [{
                'userName': req.body.userName
            }, {
                'password': req.body.password
            }]
        }, function (err, foundUser) {
            if (err) {
                console.log(err);
                var myResponse = responseGenerator.generate(true, "some error" + err, 500, null);
                res.send(myResponse);
            } else if (foundUser == null || foundUser == undefined || foundUser.userName == undefined) {

                console.log("email and password doesnot match");
                var myResponse = responseGenerator.generate(true, "user not found. Check your username and password", 404, null);
                
                dialog.info('wrong username or password');

                res.redirect("/users/login/screen");
            
                

            } else {


                console.log(req.session);
                req.session.user = foundUser;
                delete req.session.user.password;
                res.redirect('/users/dashboard/screen')

            }

        }); // end find

    }); //end get login screen




    //forgot password module
    userRouter.post('/forgotpassword', function (req, res) {

        userModel.findOne({
            'email': req.body.email
        }, function (err, foundUser) {
            if (err) {
                console.log(err);
            } else if (foundUser == null || foundUser == undefined || foundUser.userName == undefined) {

                dialog.info('user not found.Try Again ');
                res.redirect("/users/forgotpassword/screen");

            } else {

                console.log(req.session);
                req.session.user = foundUser;
                res.render('forgotpassword', {
                    password: req.session.user.password
                });


            }

        }); // end find

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

    app.use('/users', userRouter);

} 

