const express = require('express')
const fs = require('fs')
const os = require('node:os')
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
    var localStorage = new LocalStorage('./storage')
    stat=JSON.parse((localStorage.getItem(0)))
    console.table(stat)
    res.send(stat)
})

app.get('/port', (req,res) => {
    var name = os.hostname()
    res.send("MOTUS APP working on "+name+" port "+port)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})