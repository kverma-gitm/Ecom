var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var orderSchema = new Schema({
	userName 	: {type:String,required:true},
	Name  		: {type:String,required : true},
	price 		: {type:Number,required:true},
	model		: {type:String,default:"Not Specified"},
	description : {type:String,default:"No Description Given"},
	discount 	: {type:Number,default:0},
	brandName	: {type:String,required:true},
	orderedOn	: {type:Date,default:Date.now}

});

mongoose.model('order',orderSchema);