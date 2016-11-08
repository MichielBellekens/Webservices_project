/*
    TO DO
    change session secret to env var
        Globals wegwerken zoadat multiuser mogelijk is
        CHECK TO DO'S IN THE CODE
		check voor connection.connect and connection.end
        CLEAN UP THE CODE
        REMOVE ALL OF THE CONSOLE.LOG() debug statements
        cREATE HTTPS INSTEAD OF HTTP
        SECURITY ANDCERTIFICATES
        CHECK IF VIEWs ARE VALID HTML
        CHECK IF THE TYPE OF THE MAIL ADDRESS IS VALID (--> REGEX)
        CLEAN UP THE COMMENTS
*/
var expr =  require("express");                     //include express to make routing possible
var path = require("path");                         //include path to be able to get the current dir
var bodyParser = require('body-parser');            //parser to get data from the inputfield of the view using post --> see express docs about req.body
var app = expr();                                   //Creates an Express application.
var hashing = require('password-hash-and-salt');    //include the hashin lib to hash and verify the passwords of the users
var session = require('express-session');
app.set("view engine", "ejs");                      //set the view engine to ejs for the app express application --> make templates possible
app.set("views", path.join(__dirname, 'Views'));    //Point the views setting to the dir that contains all the project views
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(expr.static(__dirname + "/styles"));
app.use(session({secret:"Mbellekens1995aqwzsxedc",saveUninitialized: false, resave: false}))
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

var footer = "Michiel Bellekens webapplications & services @Thomas More Denayer Sint-Katelijne-Waver 2016";     //common footer for all the pages


//get all the values from the databse and pass them to a given callback function
function load_from_database(userid, func)
{
    connection.query("SELECT * FROM activities WHERE userID="+userid,function(err,rows){
        if(err) throw err;
        console.log(rows);
        func(rows);
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
    console.log("the session userid =" + req.session.userid);
    res.render('Index',{
        title : "To do lists home page",
        cur_user: req.session.userid,
        tab : tabs,
        footer: footer
    });
});

//function that renders the page after the school page is requested --> only accessible when the activiteis are loaded
app.get('/school', function(req,res){
    if (req.session.userid == null)
    {
        res.redirect('/');
    }
    else
    {
        load_from_database(req.session.userid, function(items)
        {
            console.log("the items are"+items);
            req.session.items = items;
            res.render('Tabs',{
                title : "To do lists school",
                tab : tabs,
                Listitems: items,
                current_category : "school",
                edit_id: null,
                footer: footer
            });
        });
    }
});

//render the spare time tab
app.get('/spare_time', function(req,res){
    if (req.session.userid == null)
    {
        res.redirect('/');
    }
    else
    {
        load_from_database(req.session.userid, function(items)
        {
            req.session.items = items;
            res.render('Tabs',{
                title : "To do lists spare time",
                tab : tabs,
                Listitems: items,
                current_category : "spare_time",
                edit_id: null,
                footer: footer
            });
        });
    }
});

//render the others page
app.get('/others', function(req,res){
    if (req.session.userid == null)
    {
        res.redirect('/');
    }
    else
    {
        load_from_database(req.session.userid, function(items)
        {
            req.session.items = items;
            res.render('Tabs',{
                title : "To do lists others",
                tab : tabs,
                Listitems: items,
                current_category : "others",
                edit_id: null,
                footer: footer
            });
        });
    }
});

//render the page to add an activity
app.get('/add', function(req,res){
    if (req.session.userid == null)
    {
        res.redirect('/');
    }
    else
    {
        res.render('AddNew',{
            title : "Add new item",
            tab : tabs,
            footer: footer,
        });
    }
})

//render the page when the user wants to edit an item --> the id of the item that needs to be edited is passed
app.get('/edit', function(req,res){
    if (req.session.userid == null)
    {
        res.redirect('/');
    }
    else
    {
        res.render('Tabs',{
            title : "To do lists " +req.param("current_cat"),
            tab : tabs,
            Listitems: req.session.items,
            current_category : req.param("current_cat"),
            edit_id: req.param("id"),
            footer: footer
        });
    }
});

//is run when the delete link is pressed --> the get param are used to determine which element needs to be deleted
app.get('/delete', function(req,res){
    console.log("entering the delete post");
    if (req.session.userid == null)
    {
        res.redirect('/');
    }
    else
    {
        var querystring = "DELETE FROM activities WHERE ID=" + connection.escape(req.param("id")) + " AND category= " + connection.escape(req.param("current_cat"));
        console.log(querystring);
        connection.query(querystring,function(err,rows){
            if(err) throw err;

            console.log('Data changed in Db:\n');
            load_from_database(req.session.userid, function(items) {
                req.session.items = items;
                res.redirect(req.param("current_cat"));
            });
        });
    }
});

//save the edited information to the database and reload the local variable activities
app.post('/edit', function(req,res){
    console.log("entering the edit post");
    if (req.session.userid == null)
    {
        res.redirect('/');
    }
    else
    {
        var id = req.body.ID;
        var newmsg = req.body.change_value;
        console.log(id);
        console.log(newmsg);
        connection.query("UPDATE activities SET Value ="+connection.escape(req.body.change_value)+" WHERE ID=" +req.body.ID,function(err,rows){
            if(err) throw err;

            console.log('Data changed in Db:\n');
            connection.query("SELECT category FROM activities WHERE ID="+req.body.ID,function(err,rows){
                if(err) throw err;

                console.log('Data received from Db:\n');
                console.log(rows);
                load_from_database(req.session.userid, function(items)
                {
                    req.session.items = items;
                    res.redirect(rows[0].category);
                });
            });
        });
    }
});

//save the newly added value to the database and reload the local variable activities
app.post('/addnew', function(req,res){
    if (req.session.userid == null)
    {
        res.redirect('/');
    }
    else
    {
        console.log("entering the new post");
        var cat = req.body.Category_select;
        var newdes = req.body.Task_description;
        if(newdes == "")
        {
            res.redirect(cat);
        }
        else
        {
            console.log(cat);
            console.log(newdes);
            var querystring= "INSERT INTO activities (category,Value,userID) VALUES ("+connection.escape(cat)+","+connection.escape(newdes)+","+req.session.userid+")";
            console.log(querystring);
            connection.query(querystring,function(err,rows){
                if(err) throw err;

                load_from_database(req.session.userid, function(items)
                {
                    res.redirect(cat);
                });
            });
        }
    }
});

//log in and check the information provide by the user in the log in fields
app.post('/login', function(req,res){
    var mail = req.body.email;
    var passw = req.body.password;
    var querystring= "Select * FROM users where Mail = "+ connection.escape(mail);
    console.log(querystring);
    connection.query(querystring,function(err,rows){
        if(err) throw err;

        if(rows.length == 1)
        {
            hashing(req.body.password).verifyAgainst(rows[0].Password, function(error, verified) {
                if(error)
                    throw new Error('Failed to verify the password');
                if(!verified) {
                    console.log("Not the correct password");
                }
                else
                {
                    console.log("successfully logged in");
                    req.session.userid = rows[0].ID
                    //load_activities(rows[0].ID);
                    //current_user_id = rows[0].ID;
                    res.redirect('/school');
                }
            });
        }
        else
        {
            res.redirect('/');
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
        footer: footer
    });
});

//Saves the new account --> checks if the mail is allready used in another account
//TO DO ==>  CHECK IF NONE OF THE FIELDS ARE EMPTY
app.post('/create_account', function(req,res){
    var mail = req.body.Mailaddress;
    hashing(req.body.passwd).hash(function (error, hash) {
        if (error)
            throw new Error('Hashing produced an error');

        var querystring= "Select * FROM users where Mail = "+ connection.escape(mail);
        console.log(querystring);
        connection.query(querystring,function(err,rows){
            if(err) throw err;

            console.log(rows.length);
            if(rows.length == 0)
            {
                console.log("Entering creation loop");
                querystring = "INSERT INTO users (Mail, Password) VALUES ("+connection.escape(mail)+",'"+hash+"')";
                connection.query(querystring, function(err, rows)
                {
                    if(err) throw err;

                    querystring = "SELECT * FROM users where Mail="+connection.escape(mail);
                    connection.query(querystring, function (err, rows) {
                        if(err) throw err;

                        req.session.userid = rows[0].ID;
                        res.redirect('/school');
                    });
                    console.log("adding new account");
                });
            }
            else
            {
                console.log("The mail is already used");
                res.redirect('/');
            }
        });
    });
});