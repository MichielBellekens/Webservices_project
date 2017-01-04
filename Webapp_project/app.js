/*
    TO DO
    /
*/
var expr =  require("express");                     //include express to make routing possible
var path = require("path");                         //include path to be able to get the current dir
var bodyParser = require('body-parser');            //parser to get data from the inputfield of the view using post --> see express docs about req.body
var app = expr();                                   //Creates an Express application.
var hashing = require('password-hash-and-salt');    //include the hashin lib to hash and verify the passwords of the users
var session = require('express-session');
var csrf = require('csurf');                        //module to prevent cross site request forgery attacks (csrf)
app.set("view engine", "ejs");                      //set the view engine to ejs for the app express application --> make templates possible
app.set("views", path.join(__dirname, 'Views'));    //Point the views setting to the dir that contains all the project views
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(expr.static(__dirname + "/styles"));
app.use(session({secret:"Mbellekens1995aqwzsxedc",saveUninitialized: false, resave: false}))    //use the session module and set some parameters
app.use(csrf());
//listen on an 1337 for all communication
app.listen(1337,'0.0.0.0',function(){
    console.log('Ready on port 1337');
});

//create connection to database
var mysql = require('mysql');
var connection = mysql.createConnection({
    host     : '127.0.0.1',
    user     : 'root',
    password : '9Mei1995',
    database: 'webapp_todo'
});



//get all the values from the databse and pass them to a given callback function
function load_from_database(userid, func)
{
    connection.query("SELECT * FROM activities WHERE userID="+userid,function(err,rows){
        if(err)
        {
            req.session.alert = "An error occured while trying to get activities";
            res.redirect('/');
        }
        else
        {
            func(rows);
        }
    });
}

//All the values for the tabs
var tabs = [
    {link: "/", text : "Home"},
    {link: "school", text : "school"},
    {link: "spare_time", text : "Spare time"},
    {link: "others", text : "Others"},
    {link: "add", text : "Add new item"}
];

//the function to render a page when a get request is send to the root page --> the parameters are passed to fill the variable spots inside the view pages
app.get('/', function(req,res){
    if (req.session.userid != null)
    {
        req.session.alert = null;
    }
    res.render('Index',{
        title : "To do lists home page",
        cur_user: req.session.userid,
        current_category: "/",
        tab : tabs,
        csrf: req.csrfToken(),
        Alert: req.session.alert
    });
});

//function that renders the page after the school page is requested --> only accessible when the activiteis are loaded
app.get('/school', function(req,res){
    if (req.session.userid == null)
    {
        req.session.alert = "Not yet logged in: log in to access the school tab";
        res.redirect('/');
    }
    else
    {
        load_from_database(req.session.userid, function(items)
        {
            req.session.alert = null
            req.session.items = items;
            res.render('Tabs',{
                title : "To do lists school",
                tab : tabs,
                Listitems: items,
                current_category : "school",
                edit_id: null,
                csrf: req.csrfToken(),
                Alert:req.session.alert
            });
        });
    }
});

//render the spare time tab
app.get('/spare_time', function(req,res){
    if (req.session.userid == null)
    {
        req.session.alert = "Not yet logged in: log in to access the spare time tab";
        res.redirect('/');
    }
    else
    {
        req.session.alert = null
        load_from_database(req.session.userid, function(items)
        {
            req.session.items = items;
            res.render('Tabs',{
                title : "To do lists spare time",
                tab : tabs,
                Listitems: items,
                current_category : "spare_time",
                edit_id: null,
                csrf: req.csrfToken(),
                Alert:req.session.alert
            });
        });
    }
});

//render the others page
app.get('/others', function(req,res){
    if (req.session.userid == null)
    {
        req.session.alert = "Not yet logged in: log in to access the others tab";
        res.redirect('/');
    }
    else
    {
        req.session.alert = null
        load_from_database(req.session.userid, function(items)
        {
            req.session.items = items;
            res.render('Tabs',{
                title : "To do lists others",
                tab : tabs,
                Listitems: items,
                current_category : "others",
                edit_id: null,
                csrf: req.csrfToken(),
                Alert:req.session.alert
            });
        });
    }
});

//render the page to add an activity
app.get('/add', function(req,res){
    if (req.session.userid == null)
    {
        req.session.alert = "You can only add an item when you're logged in.";
        res.redirect('/');
    }
    else
    {
        res.render('AddNew',{
            title : "Add new item",
            current_category: "add",
            tab : tabs,
            csrf: req.csrfToken(),
            Alert:req.session.alert
        });
    }
})

//render the page when the user wants to edit an item --> the id of the item that needs to be edited is passed
app.get('/edit', function(req,res){
    if (req.session.userid == null)
    {
        req.session.alert = "You need to be logged in to edit listitems";
        res.redirect('/');
    }
    else
    {
        req.session.alert = null;
        res.render('Tabs',{
            title : "To do lists " +req.param("current_cat"),
            tab : tabs,
            Listitems: req.session.items,
            current_category : req.param("current_cat"),
            edit_id: req.param("id"),
            csrf: req.csrfToken(),
            Alert:req.session.alert
        });
    }
});

//is run when the delete link is pressed --> the get param are used to determine which element needs to be deleted
app.get('/delete', function(req,res){
    if (req.session.userid == null)
    {
        req.session.alert = "You need to be logged in to delete listitems";
        res.redirect('/');
    }
    else
    {
        var querystring = "DELETE FROM activities WHERE userID="+req.session.userid+" AND ID=" + connection.escape(req.param("id")) + " AND category= " + connection.escape(req.param("current_cat"));
        connection.query(querystring,function(err,rows){
            if(err)
            {
                req.session.alert = "An error occured while trying to delete the item";
                res.redirect(req.param("current_cat"));
            }
            else
            {
                load_from_database(req.session.userid, function(items) {
                    req.session.items = items;
                    res.redirect(req.param("current_cat"));
                });
            }
        });
    }
});

//save the edited information to the database and reload the local variable activities
app.post('/edit', function(req,res){
    if (req.session.userid == null)
    {
        req.session.alert = "You cannot post an edit request when you're not logged in";
        res.redirect('/');
    }
    else
    {
        req.session.alert = null;
        var id = req.body.ID;
        var newmsg = req.body.change_value;
        connection.query("UPDATE activities SET Value ="+connection.escape(req.body.change_value)+" WHERE userID="+req.session.userid+" AND ID=" +req.body.ID,function(err,rows){
            if(err)
            {
                req.session.alert = "An error occured while trying to update the item";
                res.redirect('/');
            }
            else
            {
                connection.query("SELECT category FROM activities WHERE ID="+req.body.ID,function(err,rows){
                    if(err)
                    {
                        req.session.alert = "An error occured while trying to get updated items";
                        res.redirect('/');
                    }
                    else
                    {
                        load_from_database(req.session.userid, function(items)
                        {
                            req.session.items = items;
                            res.redirect(rows[0].category);
                        });
                    }
                });
            }
        });
    }
});

//save the newly added value to the database and reload the local variable activities
app.post('/addnew', function(req,res){
    if (req.session.userid == null)
    {
        req.session.alert = "You need to be logged in to add a new listitem";
        res.redirect('/');
    }
    else
    {
        var cat = req.body.Category_select;
        var newdes = req.body.Task_description;
        if(newdes == "")
        {
            req.session.alert = "Please fill the description field";
            res.redirect('/add');
        }
        else
        {
            req.session.alert = null;
            var querystring= "INSERT INTO activities (category,Value,userID) VALUES ("+connection.escape(cat)+","+connection.escape(newdes)+","+req.session.userid+")";
            connection.query(querystring,function(err,rows){
                if(err)
                {
                    req.session.alert = "An error occured while trying to add new item to database";
                    res.redirect('/');
                }
                else
                {
                    load_from_database(req.session.userid, function(items)
                    {
                        res.redirect(cat);
                    });
                }
            });
        }
    }
});

//log in and check the information provide by the user in the log in fields
app.post('/login', function(req,res){
    var mail = req.body.email;
    var passw = req.body.password;
    var querystring= "Select * FROM users where Mail = "+ connection.escape(mail);
    connection.query(querystring,function(err,rows){
        if(err)
        {
            req.session.alert = "An error occured while trying to get usernames";
            res.redirect('/');
        }
        else
        {
            if(rows.length == 1)
            {
                hashing(req.body.password).verifyAgainst(rows[0].Password, function(error, verified) {
                    if(error)
                    {
                        req.session.alert = "An error occured while verifying the password";
                        res.redirect('/');
                    }
                    else if(!verified) {
                        req.session.alert = "You have entered an incorrect password";
                        res.redirect('/');
                    }
                    else
                    {
                        req.session.alert = null;
                        req.session.userid = rows[0].ID
                        //load_activities(rows[0].ID);
                        //current_user_id = rows[0].ID;
                        res.redirect('/school');
                    }
                });
            }
            else
            {
                req.session.alert = "The username/pasword combination you entered could not be found";
                res.redirect('/');
            }
        }
    });
});

//perform all actions to logout the user
app.get('/logout', function(req,res){
    req.session.userid = null;
    req.session.items =  null;
    req.session.destroy();
    res.redirect('/');
});

//render the page to create a new account
app.get('/create_account', function(req,res){
    res.render('create_account',{
        title : "Create a new account",
        tab : tabs,
        csrf: req.csrfToken(),
        Alert: req.session.alert
    });
});

//Saves the new account --> checks if the mail is allready used in another account
app.post('/create_account', function(req,res){
    if(req.body.Mailaddress == "" || req.body.passwd == ""){
        req.session.alert = "You need to fill in both fields";
        res.redirect('/create_account');
    }
    else
    {
        var mail = req.body.Mailaddress;
        hashing(req.body.passwd).hash(function (error, hash) {
            if (error)
            {
                req.session.alert = "An error occured while hashing your password";
                res.redirect('/');
            }
            else
            {
                var querystring= "Select * FROM users where Mail = "+ connection.escape(mail);
                connection.query(querystring,function(err,rows){
                    if(err) throw err;
                    req.session.alert = "An error occured while connecting to database";
                    if(rows.length == 0)
                    {
                        querystring = "INSERT INTO users (Mail, Password) VALUES ("+connection.escape(mail)+",'"+hash+"')";
                        connection.query(querystring, function(err, rows)
                        {
                            if(err) throw err;

                            querystring = "SELECT * FROM users where Mail="+connection.escape(mail);
                            connection.query(querystring, function (err, rows) {
                                if(err) throw err;

                                req.session.userid = rows[0].ID;
                                req.session.alert = null;
                                res.redirect('/school');
                            });
                        });
                    }
                    else
                    {
                        req.session.alert = "De ingegeven username is reeds gebruikt, probeer een andere username";
                        res.redirect('/create_account');
                    }
                });
            }
        });
    }
});