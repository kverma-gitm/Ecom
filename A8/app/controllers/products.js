var express = require('express');
var mongoose = require('mongoose');
var auth = require('../../middlewares/auth.js');
var userRouter = express.Router();
var productModel = mongoose.model('product');
var responseGenerator = require('../../lib/responseGenerator');


module.exports.controller = function (app){
	
	//view template of create a product
	userRouter.get('/products/create',function(req,res) {
		res.render('create-product');

	});

//route to edit product
userRouter.get('/products/edit/:id',function (req,res) {
	res.render('edit-product',{
		id:req.params.id,
	});
});

//route to delete product
userRouter.get('/products/delete',function(req,res) {
	res.render('delete-product');
});


	//route to create a product
userRouter.post('/create',function(req,res){
	console.log("here11");
	 if (req.body.Name != undefined && req.body.price != undefined) {
	 	console.log("here22");
	 	var newProduct = new productModel({
	 		productId : Math.floor(Math.random()*100+1),
	 		Name: req.body.Name,
	 		price: req.body.price,
	 		description: req.body.description,
	 		discount : req.body.discount,
	 		model: req.body.model,
	 		brandName:req.body.brandName,
	 		
	 	});
	 	console.log("here");
	 	newProduct.save(function(err) {
	 		if (err) {
	 			console.log(err);
				var myResponse = responseGenerator.generate(true,"some error "+err,500,null);
	 			res.render('error',{
	 				message: myResponse.message,
	 				error: myResponse.data
	 			});
	 		} else {
	 			req.session.product = newProduct;
	 			console.log(req.session);
	 			res.redirect('/users/products');
	 		}
	 	});
}

});

	userRouter.get('/products',function(req,res){
	productModel.find(function(err,result) {
		if (err) {
			console.log(err);
			var myResponse = responseGenerator.generate(true,"some error"+err,404,null);
			res.render('error',{
				message: myResponse.message,
				error: myResponse.data
			});
		} 
		else {
			console.log("result = ");
			console.log(result);
			var length = result.length;
			console.log(length);
			res.render('products',{
				products: result,
				length : length
			});
		}
	});
});

	userRouter.get('/dashboard',function(req,res){
	res.render('dashboard',{
		user: req.session.user
	});
});

//rest api to edit product
userRouter.post('/productedit1/:id',function(req,res) {
	productModel.findOne({'_id': req.params.id},function (err,update) {
		if (err) {
			alert("Some error occurred");
			var myResponse = responseGenerator.generate(true,"Product not found "+err,500,null);
			res.render('error',{
				message: myResponse.message,
				error: myResponse.data
			});
		} 
		else {
			console.log(update);
			update.Name = req.body.Name;
			update.price = req.body.price;
			update.description=req.body.description;
			update.model=req.body.model;
			update.updatedOn=Date.today;
			update.save(function(err,update) {
			  if(err){
				var myResponse = responseGenerator.generate(true,"Product not found "+err,500,null);
				res.render('error',{
				message: myResponse.message,
				error: myResponse.data
			});
			}
			else{
				req.session.product = update;
				console.log(req.session);
				res.redirect('/users/products');
			}
			});
			}
				
			
			
		});
	});

//route to delete a product
userRouter.get('/delete/:Name',function(req,res){ 

	productModel.findOneAndRemove({
		'Name':req.params.Name
	},function(err,foundProduct) {
		if (err) {
                var myResponse = responseGenerator.generate(true, "some error" + err, 500, null);
                res.send(myResponse);
            } else if (foundProduct == null || foundProduct == undefined || foundProduct.Name == undefined || foundProduct == '') {

                var myResponse = responseGenerator.generate(true, "product not found", 404, null);
                //res.send(myResponse);
                res.render('error', {
                    message: myResponse.message,
                    error: myResponse.data
                });

            } else {

            		console.log("product deleted...");
                res.redirect('/users/products');
            }

	});
});

//route to log out
userRouter.get('/logout',function(req,res) {
	res.session.destroy(function(err) {
		res.redirect('/users');
	});
});

app.use(function(err,req,res,next) {
	console.log(err.status);
	res.status(err.status||500);
	if(err.status==404){
		res.render('404',{
			message:err.message,
			error:err
		});
	}else{
		res.render('error',{
			message:err.message,
			error:err
		});
	}
});

app.use('/users',userRouter);
}

