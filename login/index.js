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


app.use(express.static('./public'))

app.get('/register', (req, res) => {
    var reg = req.query.reg
    var psw = req.query.psw
    console.log('try to register at '+reg+' with the password '+psw)

    var localStorage = new LocalStorage('./storage')
    if(localStorage.getItem(login)===null){
        var user = {
            'password': psw,
            'id': localStorage.length
        }
        localStorage.setItem(login, JSON.stringify(user))
        console.log("Création d'un nouveau user")
    } else {
        res.send("Pseudo ou Mot de passe déjà éxistant")
    }
    app.set('trust proxy', 1) 
    app.use(session({
        name: 'register',
        keys: [reg, psw, user.id],
        cookie: {
            secure: true,
            httpOnly: true,
            expires: expiryDate
        } 

    }))
    res.send("Création d'un nouveau user")

})

app.get('/login', (req, res) => {
    var login = req.query.login
    var psw = req.query.psw
    console.log('try to connect at '+login+' with the password '+psw)

    var localStorage = new LocalStorage('./storage')
    if(localStorage.getItem(login)===null){ //Mauvais pseudo
        res.send("Pseudo innexistant.")
    } else if (JSON.parse(localStorage.getItem(login)).password != psw){ //Mauvais mot de passe mais pseudo existant
        console.log("Mot de passe incorrect")
        res.send("Mot de passe incorrect")
        //envoie d'une réponse d'erreur
    } else { //Bon speudo et mot de passe
        console.log("Connexion terminer")
        app.set('trust proxy', 1) 
        app.use(session({
            name: 'login',
            keys: [login, psw, JSON.parse(localStorage.getItem(login)).id],
            cookie: {
                secure: true,
                httpOnly: true,
                expires: expiryDate
            } 
    
        }))
        res.send("Connexion terminer")
    }
    

})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

    /*
    app.get('/id', (req, res) => {
        console.log("login: "+login)
        res.send(JSON.parse(localStorage.getItem(login)).id)
    })
    */