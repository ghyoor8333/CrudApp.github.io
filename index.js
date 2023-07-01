const express = require("express")
const hbs = require("hbs")
const path = require("path")
const bodyParser = require("body-parser")
require("./dbConnect")

const Employee = require("./Models/Employee")

const app = express()
app.use(express.static("views/public"))
app.set("view engine", "hbs")
const encoder = bodyParser.urlencoded()

hbs.registerPartials(path.join(__dirname, "views/partials"))

app.get("/", async (req, res) => {
    try {
        var data = await Employee.find().sort({ id: -1 })
        res.render("index", { data: data })
    } catch (error) {
        res.render("index", { data: [] })
    }
})

app.get("/add", (req, res) => {
    res.render("add", { show: false, message: "", data: {} })
})

app.post("/add", encoder, async (req, res) => {
    try {
        var data = new Employee(req.body)
        await data.save()
        res.redirect("/")
    }
    catch (error) {
        if (error.errors.name)
            res.render("add", { show: true, message: error.errors.name.message, data: data })
        else if (error.errors.email)
            res.render("add", { show: true, message: error.errors.email.message, data: data })
        else if (error.errors.phone)
            res.render("add", { show: true, message: error.errors.phone.message, data: data })
        else if (error.errors.dsg)
            res.render("add", { show: true, message: error.errors.dsg.message, data: data })
        else if (error.errors.salary)
            res.render("add", { show: true, message: error.errors.salary.message, data: data })
        else
            res.render("add", { show: true, message: "Internal Server Error!!!" })
    }
})

app.get("/delete/:_id", async (req, res) => {
    try {
        var data = await Employee.deleteOne({ _id: req.params._id })
        res.redirect("/")
    } catch (error) {
        console.log(error);
        res.redirect("/")
    }
})

app.get("/update/:_id", async (req, res) => {
    try {
        var data = await Employee.findOne({ _id: req.params._id })
        if (data)
            res.render("update", { show: false, data: data, message: "" })
        else
            res.redirect("/")
    } catch (error) {
        console.log(error);
        res.redirect("/")
    }
})

app.post("/update/:_id",encoder, async (req, res) => {
    try {
        var data = await Employee.findOne({ _id: req.params._id })
        if (data){
            data.name = req.body.name,                        
            data.email = req.body.email,                        
            data.phone = req.body.phone,                        
            data.dsg = req.body.dsg,                        
            data.salary = req.body.salary,                        
            data.city = req.body.city,                        
            data.state = req.body.state
            await data.save()                    
        }
        res.redirect("/")
    } catch (error) {
        console.log(error);
        res.redirect("/")
    }
})


app.get("/search",async(req,res)=>{
    try {
        var search = req.query.search
        var data = await Employee.find({$or:[
            {name:{$regex:search,$options:"i"}},
            {email:{$regex:search,$options:"i"}},
            {phone:{$regex:search,$options:"i"}},
            {dsg:{$regex:search,$options:"i"}},
            {city:{$regex:search,$options:"i"}},
            {state:{$regex:search,$options:"i"}}
        ]}).sort({_id:-1})
        res.render("index",{data:data})
    } catch (error) {
        res.redirect("/")
    }
})


app.listen(8000, () => {
    console.log("Server is Running at http://localhost:8000")
})