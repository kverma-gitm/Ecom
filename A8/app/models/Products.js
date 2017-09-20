var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var productSchema = new Schema({

	Name  		: {type:String,required : true},
	price 		: {type:Number,required:true},
	rating 		: {type:Number},
	model		: {type:String,default:"Not Specified"},
	description : {type:String,default:"No Description Given"},
	discount 	: {type:Number,default:0},
	brandName	: {type:String,required:true},
	createdOn	: {type:Date,default:Date.now},
	updatedOn	: {type:Date,default:Date.now}

});

mongoose.model('product',productSchema);