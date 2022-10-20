const express = require('express')
const session = require('express-session')
const fs = require('fs')
const os = require('node:os')
const http = require('http')
const path = require('path');
//const sessionStorage = require('node-sessionstorage')
const {LocalStorage} = require("node-localstorage")
const app = express()
//PORT=5000 node index.js // commande utiliser pour lancé l'app sur le port 5000
const port = process.env.PORT || 3000 
//const port = 5000
const pathdata = "data/liste_francais_utf8.txt"
const nbr_mots = 22740
const expiryDate = new Date(Date.now() + 60 * 60 * 1000) // 1 hour



// MOTUS -> user se co : logged -> rien faire sinon demander de se co avec :
//     - Discord
//     - Google
//     - Ton truc.

//     clientId = MOTUSId ----------------------------------> Que google / discord connait avant
//     scope : permission ? demande spécifique -> discord 
//     redirecturl    <-------------------------------------- ?token=blablabla
//       /\                                                 /\
//       ||                                                 ||   
// motus -> LoginApp/authorize -> LoginApp : login/register -> motus


var cookieParser = require('cookie-parser');
app.use(cookieParser())

app.set('trust proxy', 1) 
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        expires: expiryDate
    } 
}))

app.set("view engine", "pug")
app.set("views", path.join(__dirname, "views"))

//MOTUS -> /login/authorize?redict=MOTUSURL -> login / register -> redirigé vers MOTUSURL (redict) avec le token en kdo en plus -> sur les cookies du client

//client > MOTUS (token dans cookie) > /login/retrieveUser?token=value > résultat

app.use((req,res,next)=>{
    //console.log("cookies : " + JSON.stringify(req.cookies))
    if(req.cookies.token || req.url.includes("/resultLogin")){
        console.log("ok")
        next()
    }else{
        console.log("KO")
        res.redirect("http://localhost:8000/authorize?clientId=42&scope=plouf&redirect_url=http://localhost:3000/resultLogin")
    }
})

app.get("/resultLogin", (req,res) => {
    token=req.query.token
    res.cookie("token", token, {
        maxAge: 1000 * 60 * 15, // would expire after 15 minutes
        httpOnly: true, // The cookie only accessible by the web server
    })
    console.log("token : " + JSON.stringify(token))
    customfetch(
        'http://login:8000/token?token='+token, 
        (data) => {
            //console.log("cookies : " + JSON.stringify(req.cookies))
            console.log("userdata:",data)
            req.session.user=JSON.parse(data)
            res.redirect("http://localhost:3000/")
        }, () => {
            console.log("Error: " + err.message);
            res.send("Une erreur est survenue lors du traitement de votre mot, nous sommes désolé du dérangement");
      })
})

fs.readFile(pathdata, (err, data) => {
        if (err) throw err;
        var words = data.toString().split("\n");
        var d = new Date();
        d.setHours(0)
        d.setMinutes(0)
        d.setSeconds(0)
        d.setMilliseconds(0)
        var num_mot = d.getTime()%nbr_mots;


        app.get("/", (req, res) => {
            console.table(req.session)
            if(req.session.user==undefined){
                res.redirect("http://localhost:8000/authorize?clientId=42&scope=plouf&redirect_url=http://localhost:3000/resultLogin")
            } else {
                res.render("index", {size : (words[num_mot].length)-1, user: req.session.user.name})
            }
        })


        app.get('/mots', (req, res) => {
            data=words[num_mot]
            word=req.query.mot
            console.log("le mot à trouver", data);
            console.log("le mot donner", word);
            var data_array=data.split('');
            data_array.pop();
            var word_array=word.split('');
            var data_array2 = data_array.slice();
            console.log("le tableau à trouver", data_array);
            console.log("le tableau donner", word_array);
            
            if(word_array.length!=data_array.length){
                //res.send("Le mot est de taille "+ data_array.length+ "<br>");
                return false
            }
            for (let i = 0; i < data_array.length; i++) {
                let e = data_array2[i];
                if(e==word_array[i]){
                    data_array2[i]="0";
                }
            }
            var send="";
            console.log(data_array2);
            send+="<tr>";
            for (let i = 0; i < data_array.length; i++) {
                let e = word_array[i];

                if(e==data_array[i]){
                    // send+="<span style='background-color:green;'>"+e+"|</span>";
                    send+="<td style='background-color:green;'>"+e+"</td>";
                } else if (data_array2.includes(e)) {
                    // send+="<span style='background-color:orange;'>"+e+"|</span>";
                    send+="<td style='background-color:orange;'>"+e+"</td>";
                    data_array2[data_array2.indexOf(e)]="0";
                } else {
                    // send+="<span style='background-color:red;'>"+e+"|</span>";
                    send+="<td style='background-color: #192218'>"+e+"</td>";
                }
            }

            send+="</tr>";
            customfetch("http://score:5000/update?id="+req.session.user.id+"&find="+(JSON.stringify(data_array)==JSON.stringify(word_array)), 

            (data) => res.send(send),
            () => {
                console.log("Error: " + err.message);
                res.send("Une erreur est survenue lors du traitement de votre mot, nous sommes désolé du dérangement");
            })
        })
})

app.get("/score", (req, res)=> {
    customfetch(
        'http://score:5000/stat?id='+req.session.user.id, 
        (data) => {
            data = JSON.parse(data)
            res.render("score", {stat : {nbWords : data.nbWords, average : data.average}, user: req.session.user.name})
        }, () => {
            console.log("Error: " + err.message);
            res.send("Une erreur est survenue lors du traitement de votre mot, nous sommes désolé du dérangement");
      })
})

app.get("/logout", (req, res)=> {
    req.session.user=undefined
    res.redirect("http://localhost:8000/authorize?clientId=42&scope=plouf&redirect_url=http://localhost:3000/resultLogin")
})
  
app.get('/port', (req,res) => {
    var name = os.hostname()
    res.send("MOTUS APP working on "+name+" port "+port)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

customfetch = (url, callbackOK, callbackError) => {
    http.get(url, (resp) => {
        let data = '';
        resp.on('data', (chunk) => {
            data += chunk;
        })
        resp.on('end', () => {
            callbackOK(data)
        })
    })
    .on("error", (err) => {
        callbackError()
      })
}