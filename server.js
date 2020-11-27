const express = require('express')
const app = express()
const data = require("./data.json")
require("dotenv-safe").config()
let jwt = require("jsonwebtoken")
const cors = require('cors') 


app.use(express.json())
app.use(cors())

//GET: Receber dados de um Resource
app.get('/clients', verifyJWT, function (req, res, next) {
    res.json(data)
})

app.get('/clients/:id', verifyJWT, function (req, res, next) {
    const {id} = req.params
    const client = data.find(client => client.id == id)  

    if (!client) {
        return res.status(204).json()
    }
    res.json(client)
})
//POST: Enviar dados ou informações para serem processados por um Resource
app.post('/clients', verifyJWT, function (req, res, next) {
    const {name, username, email} = req.body
    let id = data[data.length-1].id
    ++id
    const newClient = {id, name, username, email}
    data.push(newClient)

    res.json(data)

})
//PUT: Atualiza dados de um Resource
app.put('/clients/:id', verifyJWT, function (req, res, next) {
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
app.delete('/clients/:id', verifyJWT, function (req, res, next) {
    const {id} = req.params
    const client = data.find(client => client.id == id)
    const clientsFiltered = data.filter(client => client.id != id)

    if (!client) {
        return res.status(204).json()
    }

    res.json(clientsFiltered)
})

//autenticação
app.post('/login', (req, res, next) => {
    // simulação de autenticação no banco de dados
    if(req.body.user === 'Marlon' && req.body.pwd === '123') {
        //auth ok
        const id = 1; // id que retornaria do banco de dados
        const token = jwt.sign({id}, process.env.SECRET, {
            expiresIn: 30 // expira em 5 minutos
        })
        console.log('Login realizado e token gerado com sucesso!!');
        
        return res.json({auth: true, token: token})
    }
    res.status(500).json({message: 'Login inválido'})
})

//autorização
function verifyJWT(req, res, next){
    let token = req.headers['x-access-token'];
    if (!token) return res.status(401).json({ auth: false, message: 'No token provided.' });
    
    jwt.verify(token, process.env.SECRET, function(err, decoded) {
    if (err) return res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });
    
    // se tudo estiver ok, salva no request para uso posterior
    req.userId = decoded.id;
    next();
    });
}


app.listen(3010, function () {
    console.log('Server is running port 3010')
})