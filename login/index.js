const express = require('express')
const bcrypt = require('bcrypt');
const session = require('express-session')
const {LocalStorage} = require("node-localstorage")
const ExpiryMap = require("map-expire/MapExpire")

const app = express()
const port = process.env.PORT || 8000 
const path = "data/liste_francais_utf8.txt"
const nbr_mots = 22740
const expiryDate = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
const tokenMap = new ExpiryMap([],{duration:1000 * 60 * 15})
const saltRounds = 10;


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
    //hash le psw
    const hash = bcrypt.hashSync(psw, saltRounds);
    console.log('try to register at '+reg)

    var localStorage = new LocalStorage('./storage')
    if((localStorage.getItem(reg))===null){ // vérifer si le compte n'existe pas, puis le crée 
        var user = {
            'password': hash, //pas hasher
            'id': localStorage.length
        }
        localStorage.setItem(reg, JSON.stringify(user))
        req.session.loggedIn=true
        req.session.user=reg
        req.session.name=user.id
        console.log("Création d'un nouveau user")
        console.table(user)
        token = makeid(30)
        tokenMap.set(token, {'id':user.id, 'name':reg})
        res.send({"token": token, "redirect_url": req.session.redirect_url})
    } else { //si le compte exite déjà
        res.send("<br> Pseudo ou Mot de passe déjà éxistant. </br>")
    }
})

app.get('/login', (req, res) => {
    var login = req.query.login
    var psw = req.query.psw
    console.log('try to connect at '+login)

    var localStorage = new LocalStorage('./storage')
    if((localStorage.getItem(login))===null){ //Le compte n'existe pas ou mauvais pseudo
        res.send("<br> Pseudo innexistant. </br>")
    } else if (!bcrypt.compareSync(psw, JSON.parse(localStorage.getItem(login)).password)){ //Mauvais mot de passe mais pseudo existant (psw hasher)
        console.log("Mot de passe incorrect")
        res.send("<br> Mot de passe incorrect. </br>") //envoie d'une réponse d'erreur
    } else { //Bon pseudo et mot de passe
        console.log("Connexion terminer")
        console.table(JSON.parse(localStorage.getItem(login)))
        req.session.loggedIn=true
        req.session.user=login
        req.session.name=JSON.parse(localStorage.getItem(login)).id
        token = makeid(30)
        tokenMap.set(token, {'id':JSON.parse(localStorage.getItem(login)).id, 'name':login})
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

app.get("/token", (req, res)=>{
    userInfo = tokenMap.get(req.query.token)
    console.log("token : " + JSON.stringify(req.query.token))
    console.log("userInfo:",userInfo)
    if(userInfo != undefined){
        res.send(userInfo)
    }else{
        res.send(false)
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})