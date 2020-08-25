const express = require('express')
const app = express()
const data = require("./data.json")

app.use(express.json())

//GET: Receber dados de um Resource
app.get('/clients', function (req, res) {
    res.json(data)
})
app.get('/clients/:id', function (req, res) {
    const {id} = req.params
    const client = data.find(client => client.id == id)

    if (!client) {
        return res.status(204).json()
    }
    res.json(client)
})
//POST: Enviar dados ou informações para serem processados por um Resource
app.post('/clients', function (req, res) {
    const {name, username, email} = req.body
    let id = data[data.length-1].id
    ++id
    const newClient = {id, name, username, email}
    data.push(newClient)

    res.json(newClient)

})
//PUT: Atualiza dados de um Resource
app.put('/clients/:id', function (req, res) {
    const {id} = req.params
    const client = data.find(client => client.id == id)

    if (!client) {
        return res.status(204).json()
    }

    const {name, username, email} = req.body
    client.name = name || client.name
    client.username = username || client.username
    client.email = email || client.email

    res.json(client)
})
//DELETE: Delatar Resource
app.delete('/clients/:id', function (req, res) {
    const {id} = req.params
    const client = data.find(client => client.id == id)
    const clientsFiltered = data.filter(client => client.id != id)

    if (!client) {
        return res.status(204).json()
    }

    res.json(clientsFiltered)


})


app.listen(3000, function () {
    console.log('Server is running')
})