const express = require('express')
const fs = require('fs')
const os = require('node:os')
//const sessionStorage = require('node-sessionstorage')
const {LocalStorage} = require("node-localstorage")
const app = express()
//PORT=5000 node index.js // commande utiliser pour lancé l'app sur le port 5000
const port = process.env.PORT || 3000 
//const port = 5000
const path = "data/liste_francais_utf8.txt"
const nbr_mots = 22740

app.use(express.static('./public'));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

fs.readFile(path, (err, data) => {
        if (err) throw err;
        var localStorage = new LocalStorage('../score/storage'); 
        var words = data.toString().split("\n");
        var d = new Date();
        d.setHours(0)
        d.setMinutes(0)
        d.setSeconds(0)
        d.setMilliseconds(0)
        var num_mot = d.getTime()%nbr_mots;
        //initialise la variable qui stock les statistiques du joueur 
        if((localStorage.getItem(0)) === null){
            var stat = { 
                'nbWords': 0,
                'average': 0,
                'try':0
            }
           //sessionStorage.setItem(0, stat);
           localStorage.setItem(0, JSON.stringify(stat));
           console.log("Set the items Stat");
        } else {
            //stat=sessionStorage.getItem(0);
            stat=JSON.parse((localStorage.getItem(0)));
            console.log("Get the items Stat");
        }
        console.log("type of stat",typeof stat)
        app.get("/size", (req, res)=> {
            res.send(String((words[num_mot].length)-1));
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
            if(JSON.stringify(data_array)===JSON.stringify(word_array)){
                stat.nbWords+=1 //update le nombre de mot trouver
                stat.try+=1
                stat.average = (stat.try)/stat.nbWords //update la moyenne des essaies
    
            } else {
                stat.try+=1 //update le nombre d'essaie sur le mot en cours
            }
        localStorage.setItem(0, JSON.stringify(stat));
        console.log("Update the items Stat");
        res.send(send);
        })
})

app.get('/port', (req,res) => {
    var name = os.hostname()
    res.send("MOTUS APP working on "+name+" port "+port)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})