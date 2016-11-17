# Tutorial todolist webapp

##Node.js
1. Ga naar [https://nodejs.org/en/](https://nodejs.org/en/) en download Node.js
2. Volg de installer nadat deze is gedownload
3. Maak een nieuwe map voor uw project

##Express framework
1. In dit project wordt gebruik gemaakt van Express. Dit is een webapplication framework voor Node.js.
2. open de command prompt en navigeer naar je projectmap en geef onderstaand commando in om de nodige node modules te installeren.

        npm install express
        
3. Npm staat voor node package manager en dient om makkelijk node modules te installeren.
4. Kijk nu in uw project folder, hier zou een map **node_modules** moeten staan.
5. Maak een javascript file aan in uw projectfolder, noem deze bijvoorbeeld **app.js**.
6. Maak je eerste express app door volgend code in app.js te kopiëren

    * de express module laden en een express app maken

            var express = require('express')    //De express module laden
            var app = express()                 //Een express app creëren

    * route maken die **Hello World!** als response geeft wanneer er een get request wordt gestuurd naar **localhost:3000/**
        
            app.get('/', function (req, res) {
              res.send('Hello World!')
            })
    
    * route maken die **Hello from secondpage!** als response geeft wanneer er een get request wordt gestuurd naar **localhost:3000//secondpage**
        
            app.get('/secondpage', function (req, res) {
              res.send('Hello from secondpage!')
            })

    * Laat de express app luisteren op poort 3000

            app.listen(3000, function () {
              console.log('Example app listening on port 3000!')
            })

    * Volledige code --> documentatie express get functie [https://expressjs.com/en/4x/api.html#app.get](https://expressjs.com/en/4x/api.html#app.get).
    
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

7. Run onderstaande commando in de commmand prompt.

        node app.js
        
8. In de command prompt wordt nu de tekst **Example app listening on port 3000!** getoond.
9. Open nu uw browser en surf naar *localhost:3000* er zou een pagina moeten verschijnen met de tekst **_Hello World!_**.
10. Indien u naar *localhost:3000/secondpage* surft moet de tekstt **_Hello from secondpage!_** verschijnen.
11. Dit is de basis voor een express webapp.

**_Post requests werken op dezelfde manier maar dan app.post() i.p.v. app.get()_**

##EJS view engine
1. Maak een nieuwe map aan in uw project folder en noem deze Views.
2. Maak een nieuwe file Index.ejs *(embedded javascript)*. Dit is een html file waarin javascript snippets kunnen worden verwerkt.
3. kopieer onderstaande code in Index.ejs

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

4. Nu moeten we nog enkele zaken aanpassen aan de app.js

    * De path module laden

            var path = require('path');			//laad de path module

    * De express app instellen voor gebruik met views via app.set: [http://expressjs.com/en/api.html#app.set](http://expressjs.com/en/api.html#app.set)

            app.set('view engine', 'ejs');				//selecteer de view engine voor de app
            app.set('views', path.join(__dirname, 'Views'));	//Stel de Views folder in als basis voor alle views

    * render de view als response op een get request naar /

            app.get('/', function (req, res) {
              res.render('Index');
            })
    
    * Volledige code
    
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

5. De ejs module is echter nog niet geïnstalleerd. Dit kan via de command promt.

        npm install ejs 
 
6. Start de app nu via de command prompt door het onderstaande commando.
    
        node app.js
 
7. Test of het werkt door naar **localhost:3000** te surfen

#Variabele doorgeven aan de views
De res.render functie heeft ook een parameter locals. Hiermee kan je variabele meegeven aan de view.
Zie documentatie [https://expressjs.com/en/4x/api.html#res.render](https://expressjs.com/en/4x/api.html#res.render)

1. Pas de get route voor / aan zodat deze er als volgt uitziet. 
De variabele title en datum kunnen nu in de view worden gebruikt.

        app.get('/', function (req, res) {
          res.render('Index',{
                title: "Welkom pagina",
                datum: new Date()
          });
        })
         
2. Pas de view Index.ejs aan zodat deze de meegegeven variabele gebruikt.

        <!doctype html>
        <html lang="en">
        <head>
            <meta charset="utf-8">
            <title>My First webapp</title>
        </head>
        <body>
        	<h1><%=title%></h1>
        	<%= datum %>
        </body>
        </html>
        
3. Start de webapp opnieuw
        
        node app.js
        
4. Wanneer je nu naar localhost:3000 surft toont de pagina de titel Welkom pagina en de huidige datum.

5. **<%= %>** wordt gebruikt om javascript elementen zoals variabele in de view te gebruiken. 
Indien je in de view javascript code wilt uitvoeren maar niet rechtstreeks tonen in de view zoals bijvoorbeeld een for lus kan dit via **<% %>**.
#Data uit views doorgeven aan app.js

##Get method

1. Bij een get request kunnen we req.param() gebruiken om de parameters in te lezen.
 Wanneer er bijvoorbeeld een parameter id is meegegeven door **/secondpage?id=1** kunnen we 
 met onderstaande code deze parameter lezen en opslaan in een vatiabele

        var ID = req.param("id");
        
2. De get request uit app.js kan er dan als volgt uitzien. 
 
        app.get('/secondpage', function (req, res) {
          var ID = req.param("id");
          res.render('Index',{
              title: "Welkom op pagina 2 met id "+ID,
              datum: new Date()
          });
        })

3. Wanneer u nu surft naar **localhost:3000/secondpage?id=1** krijgt u de titel **Welkom op pagina 2 met id "opgegeven id"**. 
##Post method

1. Bij een post request moet je req.body gebruiken. 
Om dit te kunnen gebruiken moeten we eerst body-parser installeren en laden.
Documentatie zie [http://expressjs.com/en/4x/api.html#req.body](http://expressjs.com/en/4x/api.html#req.body)

    * Voeg onderstaande lijnen toe aan app.js
    
           var bodyParser = require('body-parser');             //body parsing module laden
           app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

2. De body-parser module moet nu nog worden geïnstalleerd. 
Navigeer via de command prompt naar uw project map en type onderstaand commando.

        npm install body-parser
        
3. Dit kan nu worden gebruikt op een gelijkaardige manier als bij de get request.
id is de naam van het veld uit de ejs file die de post request stuurt.

        var ID = req.body.id;
#Mysql in app.js
1. Installeer mysql op raspberry pi (voor windows download mysql workbench)

        sudo apt-get install mysql-server
        
    * Tijdens de installatie zal je een wachtwoord moeten ingeven voor de root user.

2. Log in op de mysql server.

        mysql -p -u root
        
    * Je wordt gevraagd het wachtwoord uit stap 1 op te geven.
    * Als alles correct is verlopen ben je nu ingelogd. Je krijgt onderstaand scherm te zien
    
            Welcome to the MySQL monitor.  Commands end with ; or \g.
            Your MySQL connection id is 4
            Server version: 5.7.13 MySQL Community Server (GPL)
            
            Copyright (c) 2000, 2016, Oracle and/or its affiliates. All rights reserved.
            
            Oracle is a registered trademark of Oracle Corporation and/or its
            affiliates. Other names may be trademarks of their respective
            owners.
            
            Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.
            
            mysql> 
            
3. Maak een database aan voor je project. Geeft de database een duidelijke naam.

        CREATE DATABASE MY_DATABASE_NAME;
        
4. Gebruik de gewenste database

        USE MY_DATABASE_NAME
        
5. Maak de nodige tabellen aan.

       CREATE TABLE TABLE_NAME
       (
         id              INT unsigned NOT NULL AUTO_INCREMENT, # Unique ID for the record
         name            VARCHAR(150) NOT NULL,                # Name
         birth           DATE NOT NULL,                        # Birthday
         PRIMARY KEY     (id)                                  # Make the id the primary key
       ); 
       
6. Sluit MySQL af.

        quit
        
7. Open de command promt/terminal en ga naar de projectdir en installeer de mysql modules.

        npm install mysql

8. Voeg volgende lijnen toe aan app.js

        var mysql      = require('mysql');  //mysql module laden
        var connection = mysql.createConnection({
          host     : 'localhost',           //database host
          user     : 'me',                  //databse user
          password : 'secret',              //database wachtwoord
          database : 'my_db'                //database naam
        });
        
9. Onderstaande code vraagt alle elementen uit de users database op.
In de callback function wordt eerste nagekeken of er zich geen error heeft voorgedaan.
Indien alles in orde is wordt de waarde uit de category kolom van de eerste rij naar de console geprint.

        connection.query('SELECT * FROM users', function(err, rows, fields) {
          if (err) throw err;
         
          console.log('The solution is: ', rows[0].category);
        });
        

#Apache2 instellingen

1. Installeer Apache2.

        sudo apt-get install apache2
        
2. test of de installatie is gelukt door naar het ip adres van je raspberry pi te surfen
via een ander computer op hetzelfde netwerk. Indien alles correct is verlopen krijgt u de
standaard webpagina te zien.

3. Ga via de terminal naar de /etc/apache2/sites-available directory and create a new
conf file like test.conf .

4. Activeer de nodige modules voor proxy en SSL in apache via de terminal.

        sudo a2enmod ssl        //activeer de ssl module
        sudo a2enmod proxy      //activeer de proxy module --> managen van proxyrequests
        sudo a2enmod proxy_http //nodig om via http en https documenten op te halen
        
5. Open het net aangemaakte document en bouw de conf file op. (grotendeels overgenomen van [http://www.codingtricks.biz/run-nodejs-application-apache/](http://www.codingtricks.biz/run-nodejs-application-apache/))
    * Stel de server informatie in

            <VirtualHost *:443>
               ServerAdmin webmaster@localhost      //contact adres dat de server mee terugstuurd bij een error message
               ServerName todolists.tk              //De naam waarmee de server zichzelf kan identificeren
               ServerAlias www.todolists.tk         //alternatieve naam voor de host

    * Selecteer de gewenste root directory voor de server
    
            DocumentRoot /home/pi/Documents/PROJECT_DIR
    
    * Stel directives in voor de rootdir
    
               <Directory />
                  Options -Indexes +FollowSymLinks  //Selecteer beschikbare server features, geen Indexes en wel symbolische links
                  AllowOverride None        //disable .htaccess files (distributed config files)
                  Require all granted       //grant access to all requests
               </Directory>
            
    * Proxy instellen
    
               ProxyRequests Off    //mag niet als forward proxy server dienen
               ProxyPreserveHost On //de Hostname van de request wordt naar de proxyhost gestuurd i.p.V. de hostname uit proxypass
               ProxyVia Full        //header lijn heeft extra apache httpd server version als een via (comment veld)
               <Proxy *>
                  Require all granted   //geef iedere request toegang tot de proxy
               </Proxy>
               
   * Stel SSL in --> zie ook Letsencrypt titel (mod_ssl)
   
            SSLProxyEngine on	//Gebruik de SSL proxy engine
            SSLEngine on        //Gebruik de SSL engine
            SSLCertificateFile /etc/letsencrypt/live/YOUR_DOMAIN_NAME/cert.pem  //wijst naar de file met de certificate data
            SSLCertificateKeyFile /etc/letsencrypt/live/YOUR_DOMAIN_NAME/privkey.pem    //Wijst naar de file met de private key voor de server
            SSLCertificateChainFile /etc/letsencrypt/live/YOUR_DOMAIN_NAME/chain.pem    //wijst naar de file die de certificate chain bevat
            
    * Maak de stel de proxy verder in.
    
               <Location />     //match het extern pad dat we willen gebruiken
                  ProxyPass http://127.0.0.1:1337/          //pass externe naar interne server
                  ProxyPassReverse http://127.0.0.1:1337/   //pass van interne server naar extern
               </Location>
               
   * Instellingen voor errors en sluit de virtualhost af.
   
               ErrorLog ${APACHE_LOG_DIR}/error.log     //zet de file waarnaar de server alle errors schrijft

               LogLevel warn        //Zet het log level op warn
            </VirtualHost>
            
    * Redirect van requests van poort 80 naar poort 443
    
            <VirtualHost *:80>
               ServerAdmin webmaster@localhost
               ServerName todolists.tk
               ServerAlias www.todolists.tk
            
               Redirect permanent  / https://www.todolists.tk   //alle requests doorsturen naar https (poort 443)
            
            </VirtualHost>
            
6. Activeer onze conf file en deactiveer de andere

        sudo a2ensite todo.conf             //activeer onze conf
        sudo a2dissite 000-default.conf     //Deactiveer de default conf
        
7. Restart Apache om de wijzigingen door te voeren.

        sudo service apache2 restart
#Letsencrypt 
1. Installeer certbot

        sudo apt-get install python-certbot-apache -t jessie-backports
        
2. Maak een certificate via certbot

        certbot --apache certonly
        
    * Je zal enkele zaken moeten opgeven zoals uw domeinnaam, ...

3. Kijk het pad na dat is opgegeven in de apache conf file en pas dit indien nodig aan naar
de plaats waar uw certificaten zijn opgeslagen.


# Gebruikte Node modules

##Express module 
[https://www.npmjs.com/package/express](https://www.npmjs.com/package/express)

##Body-parser module 
[https://www.npmjs.com/package/body-parser](https://www.npmjs.com/package/body-parser)

##Password-hash-and-salt
[https://www.npmjs.com/package/password-hash-and-salt](https://www.npmjs.com/package/password-hash-and-salt)

##Express-session
[https://www.npmjs.com/package/express-session](https://www.npmjs.com/package/express-session)

# Bronnen
* Hoofdbron voor opstart: [https://www.youtube.com/watch?v=QseHOX-5nJQ](https://www.youtube.com/watch?v=QseHOX-5nJQ)
* Site van Node.js [https://nodejs.org/en/](https://nodejs.org/en/)
* Site van express webframework voor Node.js [http://expressjs.com/](http://expressjs.com/)
* Initiële voorbeeldcode [http://expressjs.com/en/starter/hello-world.html](http://expressjs.com/en/starter/hello-world.html)
* Instellingen variabele express app [http://expressjs.com/en/api.html#app.set](http://expressjs.com/en/api.html#app.set)
* npm body-parser [https://www.npmjs.com/package/body-parser](https://www.npmjs.com/package/body-parser)
* Getting values from get/post [https://scotch.io/tutorials/use-expressjs-to-get-url-and-post-parameters](https://scotch.io/tutorials/use-expressjs-to-get-url-and-post-parameters)
* Mysql toevoegen aan project [https://codeforgeek.com/2015/01/nodejs-mysql-tutorial/](https://codeforgeek.com/2015/01/nodejs-mysql-tutorial/)
* Mysql installeren nodejs en documentatie [https://www.npmjs.com/package/mysql](https://www.npmjs.com/package/mysql)
* Mysql opzetten [http://dev.mysql.com/doc/mysql-getting-started/en/](http://dev.mysql.com/doc/mysql-getting-started/en/)
* Mysql installeren op raspberry pi [http://www.raspberry-projects.com/pi/software_utilities/web-servers/mysql](http://www.raspberry-projects.com/pi/software_utilities/web-servers/mysql)
* Apache config [http://www.codingtricks.biz/run-nodejs-application-apache/](http://www.codingtricks.biz/run-nodejs-application-apache/)
* Apache website, meerdere pagina's van deze site zijn zeer handig voor het maken en begrijpen van de configuratie. [http://httpd.apache.org/docs/current/sections.html](http://httpd.apache.org/docs/current/sections.html)
* Maak een gratis domeinnaam aan [http://www.dot.tk/nl/index.html?lang=nl](http://www.dot.tk/nl/index.html?lang=nl)
* installatie npm modules en gebruik [https://www.npmjs.com/](https://www.npmjs.com/)