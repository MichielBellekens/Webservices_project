/*REMARKS!!!
<%%> --> execute the code between these tags
<%=%> --> put the right values given with te render on this place as a string
 */


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

//create a list of items that contain an id and an description
var tab = [
    {link:'/',val:'Home page'},
    {link:'school',val:'School'},
    {link:'spare', val:'Spare time'},
    {link:'others', val :'Others'}
];

var school = [
    'Set up raspberry pi',
    'Make webapp views'
];

var Spare_time = [
    'Search for tv shows',
    'Listen to some music'
];

var others=[
    'Do wathever',
    'Do some more whatever'
]


//Create the index page when a get request to the / url is made
app.get('/',function(req, res){
    //Render the index view with the given parameters in the template openings
   res.render('index',{
       title :'To do lists Home',
       items: tab,
       message: "This application groups all of your TO DO lists from all your activities."
   });
});

//Create the index page when a get request to the / url is made
app.get('/school',function(req, res){
    //Render the index view with the given parameters in the template openings
    res.render('Tabs',{
        title :'To do lists school',
        items: tab,
        values: school
    });
});

//Create the index page when a get request to the / url is made
app.get('/spare',function(req, res){
    //Render the index view with the given parameters in the template openings
    res.render('Tabs',{
        title :'To do lists',
        items : tab,
        values: Spare_time
    });
});

//Create the index page when a get request to the / url is made
app.get('/others',function(req, res){
    //Render the index view with the given parameters in the template openings
    res.render('Tabs',{
        title :'To do lists',
        items: tab,
        values: others
    });
});
//parser to get data from the inputfield of the view using post --> see express docs about req.body
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

/*//Handle the post request of the new data
app.post('/add', function (req, res) {
    var newItem = req.body.newItem;
    tab.push({ID:tab.length+1, val: newItem});
    res.redirect('/');
    console.log(tab[tab.length-1]);
});*/

app.listen(1337,function(){
    console.log('Ready on port 1337');
});