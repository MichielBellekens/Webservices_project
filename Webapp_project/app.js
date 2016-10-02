//include express to make templates possible
var expr =  require("express");
//include path to be able to get the current dir
var path = require("path");
//parser to get data from the inputfield of the view using post --> see express docs about req.body
var bodyParser = require('body-parser')
//Creates an Express application.
var app = expr();

//set the view engine to ejs for the app express application
app.set("view engine", "ejs");
//Point the views setting to the dir that contains all the project views
app.set("views", path.join(__dirname, 'Views'));
//parser to get data from the inputfield of the view using post --> see express docs about req.body
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.listen(1337,function(){
    console.log('Ready on port 1337');
});


var tabs = [
    {link: "/", text : "Home"},
    {link: "school", text : "school"},
    {link: "spare_time", text : "Spare time"},
    {link: "others", text : "Others"}
];

var activities = [
    {id:0, category: "school", value: "Webservice project"},
    {id:1, category: "school", value: "DSP leren"},
    {id:2, category: "spare_time", value: "Series/films opzoeken"},
    {id:3, category: "spare_time", value: "11.22.63 verder lezen"},
    {id:4, category: "others", value: "bureau overladen"},
    {id:5, category: "others", value: "kabels bureau proper leggen"}
];

app.get('/', function(req,res){
    res.render('Index',{
        title : "To do lists home page",
        tab : tabs,
        message : " This page keeps track of all of your To do list from all your activities"
    });
})

app.get('/school', function(req,res){
    res.render('Tabs',{
        title : "To do lists school",
        tab : tabs,
        Listitems: activities,
        current_category : "school",
        edit_id: null
    });
})

app.get('/spare_time', function(req,res){
    res.render('Tabs',{
        title : "To do lists school",
        tab : tabs,
        Listitems: activities,
        current_category : "spare_time",
        edit_id: null
    });
})

app.get('/others', function(req,res){
    res.render('Tabs',{
        title : "To do lists school",
        tab : tabs,
        Listitems: activities,
        current_category : "others",
        edit_id: null
    });
})

app.get('/edit', function(req,res){
    res.render('Tabs',{
        title : "To do lists school",
        tab : tabs,
        Listitems: activities,
        current_category : req.param("current_cat"),
        edit_id: req.param("id")
    });
})

