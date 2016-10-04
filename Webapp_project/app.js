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

var activities;
load_activities();
function load_activities()
{
    connection.query('SELECT * FROM activities',function(err,rows){
        if(err) throw err;
        create_local_variable(rows);
    });
}
function create_local_variable(data) {
    activities = data;
}


//All the values for the tabs
var tabs = [
    {link: "/", text : "Home"},
    {link: "school", text : "school"},
    {link: "spare_time", text : "Spare time"},
    {link: "others", text : "Others"},
    {link: "add", text : "Add new item"}
];

var footer = "2016 Michiel Bellekens webapplications&services @ Thomas More Denayer Sint-Katelijne-Waver";
app.get('/', function(req,res){
    res.render('Index',{
        title : "To do lists home page",
        tab : tabs,
        message : " This page keeps track of all of your To do list from all your activities",
        footer: footer
    });
});

app.get('/school', function(req,res){
    res.render('Tabs',{
        title : "To do lists school",
        tab : tabs,
        Listitems: activities,
        current_category : "school",
        edit_id: null,
        footer: footer
    });
});

app.get('/spare_time', function(req,res){
    res.render('Tabs',{
        title : "To do lists spare time",
        tab : tabs,
        Listitems: activities,
        current_category : "spare_time",
        edit_id: null,
        footer: footer
    });
});

app.get('/others', function(req,res){
    res.render('Tabs',{
        title : "To do lists others",
        tab : tabs,
        Listitems: activities,
        current_category : "others",
        edit_id: null,
        footer: footer
    });
});


app.get('/add', function(req,res){
    res.render('AddNew',{
        title : "Add new item",
        tab : tabs,
        footer: footer,
    });
})

app.get('/edit', function(req,res){
    res.render('Tabs',{
        title : "To do lists " +req.param("current_cat"),
        tab : tabs,
        Listitems: activities,
        current_category : req.param("current_cat"),
        edit_id: req.param("id"),
        footer: footer
    });
});

app.get('/delete', function(req,res){
    console.log("entering the delete post");
    var querystring = 'DELETE FROM activities WHERE ID=' + req.param("id") + ' AND category= "' + req.param("current_cat")+'"';
    console.log(querystring);
    connection.query(querystring,function(err,rows){
        if(err) throw err;

        console.log('Data changed in Db:\n');
        load_activities();
        res.redirect(req.param("current_cat"));
    });
});


app.post('/edit', function(req,res){
    console.log("entering the edit post");
    var id = req.body.ID;
    var newmsg = req.body.change_value;
    console.log(id);
    console.log(newmsg);
    connection.query('UPDATE activities SET Value =" '+req.body.change_value+'" WHERE ID='+req.body.ID,function(err,rows){
            if(err) throw err;

            console.log('Data changed in Db:\n');
        connection.query('SELECT category FROM activities WHERE ID='+req.body.ID,function(err,rows){
            if(err) throw err;

            console.log('Data received from Db:\n');
            console.log(rows);
            res.redirect(rows[0].category);
            load_activities();
            });
        });
});

app.post('/addnew', function(req,res){
    console.log("entering the new post");
    var cat = req.body.Category_select;
    var newdes = req.body.Task_description;
    console.log(cat);
    console.log(newdes);
    var querystring= "INSERT INTO activities (category,Value) VALUES ('"+cat+"','"+newdes+"')";
    console.log(querystring);
    connection.query(querystring,function(err,rows){
        load_activities();
        res.redirect(cat);
    });
});
