const mongoose = require("mongoose")

// mongoose.connect("mongodb://127.0.0.1:27017/wd2pmJuneCrud")
// .then(()=>{
//     console.log("DataBase is Connected")
// })
// .catch((error)=>{
//     console.log(error);
// })


async function getConnect(){
    try{
        mongoose.connect("mongodb://127.0.0.1:27017/wd2pmJuneCrud")
        console.log("DataBaseis Connected!!!")
    }
    catch(error){
        console.log(error)
    }
}
getConnect()