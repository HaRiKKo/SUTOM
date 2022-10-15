const express = require('express')
const fs = require('fs')
const os = require('node:os')
const http = require('http');
//const sessionStorage = require('node-sessionstorage')
const {LocalStorage} = require("node-localstorage")
const app = express()
//PORT=5000 node index.js // commande utiliser pour lancé l'app sur le port 5000
const port = process.env.PORT || 5000 
//const port = 5000
const path = "data/liste_francais_utf8.txt"
const nbr_mots = 22740

app.use(express.static('./public'))

app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  
app.get('/stat', (req, res) => {
  var id=req.query.id
  var localStorage = new LocalStorage('./storage')
  stat=JSON.parse((localStorage.getItem(id)))
  console.table(stat)// c'est ca les null je crois !!!
  res.send(stat)
})

app.get('/update', (req,res) => {
  var id=req.query.id
  var find=req.query.find
  console.log('process ', id , " find : " , find)
  var localStorage = new LocalStorage('./storage')
  if((localStorage.getItem(id)) === null){
    var stat = { 
        'nbWords': 0,
        'average': 0,
        'try':0
    }
  } else {
      stat=JSON.parse((localStorage.getItem(id)))
  }

  stat.try+=1 //update le nombre d'essaie sur le mot en cours
  if(find == "true"){
        stat.nbWords+=1 //update le nombre de mot trouver
        stat.average = (stat.try)/stat.nbWords //update la moyenne des essaies
  }
  localStorage.setItem(id, JSON.stringify(stat))
  console.log("Update the items Stat")
  res.send("end")
})


// app.get('/connect', (req, res, next) => {
//   console.log("test session")
//   if(req.session.user){
//     console.log("session exist in score")
//     next()
//   }else{
//     console.log("session not exist in score")
//     res.redirect("http://localhost:8000/login.html") 
//   }
// })


app.get('/port', (req,res) => {
    var name = os.hostname()
    res.send("ScoreAPI APP working on "+name+" port "+port)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})