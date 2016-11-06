# Tutorial todolist webapp

##Node.js
1. Ga naar [https://nodejs.org/en/](https://nodejs.org/en/) en download Node.js
2. Volg de installer nadat deze is gedownload
3. Maak een nieuwe map voor uw project
##Express framework
4. In dit project wordt gebruik gemaakt van Express. Dit is een webapplication framework voor Node.js.
5. open de command prompt en navigeer naar je projectmap en geef onderstaand commando in om de nodige node modules te installeren.
```
npm install express
```
6. Npm staat voor node package manager en dient om makkelijk node modules te installeren.
7. Kijk nu in uw project folder, hier zou een map **node_modules** moeten staan.
8. Maak een javascript file aan in uw projectfolder, noem deze bijvoorbeeld **app.js**.
9. Maak je eerste express app door volgend code in app.js te kopiëren

>* de express module laden en een express app maken
>```
>var express = require('express')    //De express module laden
>var app = express()                 //Een express app creëren
>```

>* route maken die **Hello World!** als response geeft wanneer er een get request wordt gestuurd naar **localhost:3000/**
>```
>app.get('/', function (req, res) {
>  res.send('Hello World!')
>})
>```

>* route maken die **Hello from secondpage!** als response geeft wanneer er een get request wordt gestuurd naar **localhost:3000//secondpage**
>```
>app.get('/secondpage', function (req, res) {
>  res.send('Hello from secondpage!')
>})
>```

>* Laat de express app luisteren op poort 3000
>```
>app.listen(3000, function () {
>  console.log('Example app listening on port 3000!')
>})
>```

>* Volledige code --> documentatie express get functie [https://expressjs.com/en/4x/api.html#app.get](https://expressjs.com/en/4x/api.html#app.get).

```javascript
var express = require('express')
var app = express()

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.get('/secondpage', function (req, res) {
  res.send('Hello from secondpage!')
})


app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
```

10. Run onderstaande commando in de commmand prompt.

```
    node app.js
```
11. In de command prompt wordt nu de tekst **Example app listening on port 3000!** getoond.
12. Open nu uw browser en surf naar *localhost:3000* er zou een pagina moeten verschijnen met de tekst **_Hello World!_**.
13. Indien u naar *localhost:3000/secondpage* surft moet de tekstt **_Hello from secondpage!_** verschijnen.
14. Dit is de basis voor een express webapp.

##EJS view engine
1. Maak een nieuwe map aan in uw project folder en noem deze Views.
2. Maak een nieuwe file Index.ejs *(embedded javascript)*. Dit is een html file waarin javascript snippets kunnen worden verwerkt.
3. kopieer onderstaande code in Index.ejs

```html
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>My First webapp</title>
</head>
<body>
	<h1>My First webapp</h1>
	<%= new Date();%>
</body>
</html>
```
4. Nu moeten we nog enkele zaken aanpassen aan de app.js

>* De path module laden
>```
>var path = require('path');			//laad de path module
>```

>* De express app instellen voor gebruik met views via app.set: [http://expressjs.com/en/api.html#app.set](http://expressjs.com/en/api.html#app.set)
>```
>app.set('view engine', 'ejs');				//selecteer de view engine voor de app
>app.set('views', path.join(__dirname, 'Views'));	//Stel de Views folder in als basis voor alle views
>```

>* render de view als response op een get request naar /
>```
>app.get('/', function (req, res) {
>  res.render('Index');
>})
>```


```javascript
var express = require('express')
var app = express()
var path = require('path');	

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'Views'));

app.get('/', function (req, res) {
  res.render('Index');
})


app.get('/secondpage', function (req, res) {
  res.send('Hello from secondpage!');
})


app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
})
```
5. De ejs module is echter nog niet geïnstalleerd. Dit kan via de command promt.

 ```
npm install ejs 
 ```
 
6. Start de app nu via de command prompt door het onderstaande commando.
 
 ```
 node app.js
 ```
 
7. Test of het werkt door naar **localhost:3000** te surfen
#Mysql in app.js

#Apache2 instellingen

#Letsencrypt 







# Bronnen
* Hoofdbron voor opstart: [https://www.youtube.com/watch?v=QseHOX-5nJQ](https://www.youtube.com/watch?v=QseHOX-5nJQ)
* Site van express webframework voor Node.js [http://expressjs.com/](http://expressjs.com/)
* Initiële voorbeeldcode [http://expressjs.com/en/starter/hello-world.html](http://expressjs.com/en/starter/hello-world.html)
* Instellingen variabele express app [http://expressjs.com/en/api.html#app.set](http://expressjs.com/en/api.html#app.set)