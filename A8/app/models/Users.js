var mongoose = require('mongoose');
var Schema =mongoose.Schema;
var userSchema = new Schema ({

   userName     :  {type:String,required:true},
   firstName    :  {type:String,required:true},
   lastName     :  {type:String,required:true},
   email      :    {type:String,required:true},
   password     :  {type:String,required:true},
   country		:  {type:String,required:true},
   
});

mongoose.model('user',userSchema);