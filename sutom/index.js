const express = require('express')
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

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

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
            res.render("index", {size : (words[num_mot].length)-1})
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
                res.send("Le mot est de taille "+ data_array.length+ "<br>");
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
            for (let i = 0; i < data_array.length; i++) {
                let e = word_array[i];
                if(e==data_array[i]){
                    send+="<span style='background-color:green;'>"+e+"|</span>";
                } else if (data_array2.includes(e)) {
                    send+="<span style='background-color:orange;'>"+e+"|</span>";
                    data_array2[data_array2.indexOf(e)]="0";
                } else {
                    send+="<span style='background-color:red;'>"+e+"|</span>";
                } 
            }
            send+="<br>";
            http.get("http://score:5000/update?id=0&find="+(JSON.stringify(data_array)==JSON.stringify(word_array)))
            .on("error", (err) => {
                console.log("Error: " + err.message);
                res.send("Une erreur est survenue lors du traitement de votre mot, nous sommes désolé du dérangement");
              })
              .on('response', () => {
                res.send(send)
              })
        })
})

app.get("/score", (req, res)=>{
    http.get('http://score:5000/stat?id=0', (resp) => {
        let data = '';
        resp.on('data', (chunk) => {
            data += chunk;
        });
        resp.on('end', () => {
            data = JSON.parse(data)
            res.render("score", {stat : {nbWords : data.nbWords, average : data.average}})
        })
    })
    .on("error", (err) => {
        console.log("Error: " + err.message);
        res.send("Une erreur est survenue lors du traitement de votre mot, nous sommes désolé du dérangement");
      })
})


app.use((req,res,next)=>{
    next()
    // if(req.session && req.session.user || req.url == "/login.html"){
    //     console.log("ok")
    //   next()
    // }else{
    //     console.log("KO")
    //     res.redirect("/login.html") http://login:8000 ???
    // }
  })
  
  
// app.get('/id', (req, res) => {
//     http.get("http://login:8000/id")
//             .on("error", (err) => {
//                 console.log("Error: " + err.message);
//                 res.send("Une erreur est survenue lors du traitement de votre requête, nous sommes désolé du dérangement");
//               })
//             .on('response', (id) => {
//                 console.log("id: "+id);
//                 res.send(id);
//               })
// })

app.get('/port', (req,res) => {
    var name = os.hostname()
    res.send("MOTUS APP working on "+name+" port "+port)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})