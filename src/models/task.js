const mongoose=require('mongoose')

const task = mongoose.model('tasks',{
    description:{
        type:String,
        required:true
    },
    completed:{
        type:Boolean,
        default:false
    }
})

module.exports=task