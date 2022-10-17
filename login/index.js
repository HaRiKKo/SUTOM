const express = require('express')
const fs = require('fs')
const os = require('node:os')
const session = require('express-session')
//const sessionStorage = require('node-sessionstorage')
const {LocalStorage} = require("node-localstorage")
const app = express()
//PORT=5000 node index.js // commande utiliser pour lancé l'app sur le port 5000
const port = process.env.PORT || 8000 
//const port = 5000
const path = "data/liste_francais_utf8.txt"
const nbr_mots = 22740
const expiryDate = new Date(Date.now() + 60 * 60 * 1000) // 1 hour


var cookieParser = require('cookie-parser');
app.use(cookieParser());

app.set('trust proxy', 1) 
app.use(express.static('./public'))
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        expires: expiryDate
    } 
}))

// app.get("/retrieveUser", (req, res) => {
//     console.log("cookies : " + JSON.stringify(req.cookies))
//     if(req.session.loggedIn){
//         res.json({"loggedIn":req.session.loggedIn,"user":req.session.user,"name":req.session.name})
//     } else {
//         res.json({"loggedIn":false})
//     }
//     //return json of the session

//     //si pas co "false"
// })
/*
motus -> retrieveUser -> false -> login
                      -> != false -> do an action
*/

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

app.get('/register', (req, res) => {
    var reg = req.query.reg
    var psw = req.query.psw
    console.log('try to register at '+reg+' with the password '+psw)

    var localStorage = new LocalStorage('./storage')
    if((localStorage.getItem(reg))===null){ // vérifer si le compte n'existe pas, puis le crée 
        var user = {
            'password': psw,
            'id': localStorage.length
        }
        localStorage.setItem(reg, JSON.stringify(user))
        req.session.loggedIn=true
        req.session.user=reg
        req.session.name=user.id
        console.log("Création d'un nouveau user")
        console.table(user)
        token = makeid(30)
        res.send({"token": token, "redirect_url": req.session.redirect_url})
    } else { //si le compte exite déjà
        res.send("<br> Pseudo ou Mot de passe déjà éxistant. </br>")
    }
})

app.get('/login', (req, res) => {
    var login = req.query.login
    var psw = req.query.psw
    console.log('try to connect at '+login+' with the password '+psw)

    var localStorage = new LocalStorage('./storage')
    if((localStorage.getItem(login))===null){ //Le compte n'existe pas ou mauvais pseudo
        res.send("<br> Pseudo innexistant. </br>")
    } else if (JSON.parse(localStorage.getItem(login)).password != psw){ //Mauvais mot de passe mais pseudo existant
        console.log("Mot de passe incorrect")
        res.send("<br> Mot de passe incorrect. </br>")
        //envoie d'une réponse d'erreur
    } else { //Bon pseudo et mot de passe
        console.log("Connexion terminer")
        req.session.loggedIn=true
        req.session.user=login
        req.session.name=JSON.parse(localStorage.getItem(login)).id
        token = makeid(30)
        res.send({"token": token, "redirect_url": req.session.redirect_url})
    }
})

app.get("/authorize", (req, res)=>{
    if(req.query.clientId == '42' && req.query.scope != undefined && req.query.redirect_url == 'http://localhost:3000/resultLogin'){
        req.session.redirect_url = req.query.redirect_url
        res.redirect("/login.html")
    } else {
        res.send("error client")
    }
    
})

app.get("/test", (req, res) => {
    if(req.session.loggedIn){
        res.send("ok "+JSON.stringify(req.session))
    } else if (req.session){ 
        res.send("session "+JSON.stringify(req.session))
    } else {
        res.send("non")
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
