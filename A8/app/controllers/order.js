var express = require('express');
var mongoose = require('mongoose');
var auth = require('../../middlewares/auth');
var userRouter = express.Router();
var orderModel = mongoose.model('order');
var responseGenerator = require('../../lib/responseGenerator');
var productModel = mongoose.model('product');

module.exports.controller = function (app){


//add to cart module
	userRouter.get('/addtocart/:Name',auth.isLoggedIn,function(req,res) {
		console.log("Som1");
		productModel.findOne({'Name': req.params.Name},function(err,result) {
			console.log("Som2");
			if (!err) {
				console.log("Som");
				if (req.params.Name!=undefined && req.params.Name!=null) {
					var newOrder = new orderModel({
						userName	:  	req.session.user.userName,
						Name 		:  	result.Name,
						price 		: 	result.price,
						description : 	result.description,
						brandName 	: 	result.brandName,
						model 		: 	result.model,
					});
					console.log("Som3");
					newOrder.save(function(err) {
						if (err) {
							console.log("Some error occurred");
							console.log(err);
							var myResponse = responseGenerator.generate(true,"Sorry!!Product can't be added to cart right now "+err,500,null);
							res.render('error',{
								message: myResponse.message,
								error: myResponse.data
							});
						} else {
							console.log(req.session);
							res.redirect('/users/cart/'+req.session.user.userName);
						}
					});
				}
			}
			else
			{
				alert("Some error occurred");
				var myResponse = responseGenerator.generate(true,"Sorry!!Product can't be added to cart right now "+err,500,null);
				res.render('error',{
					message: myResponse.message,
					error: myResponse.data
				});
			}
		});
	});

//route to view products in cart
userRouter.get('/cart/:userName',auth.isLoggedIn,function(req,res) {
	orderModel.find({'userName':req.params.userName},function(err,result) {
		if (err) {
			console.log("Some error occurred");
			var myResponse = responseGenerator.generate(true,"Sorry!!Product can't be added to cart right now "+err,500,null);
				res.render('error',{
					message: myResponse.message,
					error: myResponse.data
				});
		} 
		else{
			console.log("result");
			console.log(result);
			if(result == [])
			{
				res.render("You have no orders");
			}
			else
			{
				var Olength = result.length;
				res.render('cart',{
				orderItems:result,
				Olength : Olength,
				user:req.session.user,

			
			});
			}
		}
	});
});

//route to delete items from cart
userRouter.get('/cartdelete/:Name',auth.isLoggedIn,function(req,res) {
	orderModel.findOneAndRemove({$and:[{'Name':req.params.Name},{'userName':req.session.user.userName}]},function(err,result) {
		if (err) {
			console.log("Some error occurred");
			var myResponse = responseGenerator.generate(true,"Some error occurred "+err,500,null);
				res.send(myResponse);
		} 
		else if(result== null || result==undefined|| result==" "){
			console.log("Some error occurred 2");
			console.log(err);
			var myResponse = responseGenerator.generate(true,"Product not found",404,null);
			res.render('error',{
				message: myResponse.message,
				error: myResponse.data
			});
		} else{
			console.log("Product deleted");
			res.redirect('/users/cart/'+req.session.user.userName);
		}
	});
});

// application level middleware for generic error
app.use(function(err,req,res,next) {
	console.log(err.status);
	res.status(err.status||500);
	if (err.status==404) {
		res.render('404',{
			message: err.message,
			error: err
		});
	} else{
		res.render('error',{
			message: err.message,
			error: err
		});
	}
});

app.use('/users',userRouter);
}