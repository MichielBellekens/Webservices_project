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

//values to parsed database elements
var mysql      = require('mysql');
var connection = mysql.createConnection({
    host     : '127.0.0.1',
    user     : 'root',
    password : '9Mei1995',
    database: 'webapp_todo'
});

connection.connect();

connection.query('SELECT * FROM tabs',function(err,rows){
    if(err) throw err;

    console.log('Data received from Db:\n');
    for (var i = 0; i < rows.length; i++) {
        console.log(rows[i].Text);
    };
    console.log(rows);
});

connection.end();

//All the values for the tabs
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

app.post('/edit', function(req,res){
    var redirect;
    // has to be changed to a databse query when implemented
    for (var i=0; i < activities.length;i++)
    {
        if (activities[i].id == req.body.ID)
        {
            activities[i].value = req.body.change_value;
            redirect = activities[i].category;
            //Since only one value can be edited each time, there is no need to continue with the for loop after the right item has been found
            break;
        }
    }
    res.redirect(redirect);
})
