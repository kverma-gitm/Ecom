var mongoose = require('mongoose');
var userModel = mongoose.model('user')
var responseGenerator = require('../lib/responseGenerator');
exports.isLoggedIn = function(req,res,next){

	if(!req.user && !req.session.user){
    console.log(req.user);
    console.log(req.session.user);
		res.redirect('/users/login/screen');
	}
	else{
		userModel.findOne({'userName': req.session.user.userName}, function(err , foundUser){
			if(err){
                var myResponse = responseGenerator.generate(true,"some error"+err,500,null);
                res.render('error' , {message: myResponse.message,
                                      error: myResponse.data});
            }
            else if(foundUser==null || foundUser==undefined || foundUser.userName==undefined){

                var myResponse = responseGenerator.generate(true,"user not found",404,null);
                //res.send(myResponse);
                res.render('error', {
                  message: myResponse.message,
                  error: myResponse.data
                });

            }
            else{ 

         
                  console.log(req.session);
                  req.session.user = foundUser;
                  delete req.session.user.password;
                   //if it exists move forward
		          next();
                  
            }

		});
        
	}

}// end isLoggedIn
