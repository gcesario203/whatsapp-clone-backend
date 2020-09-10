// Importações e etc
import express from 'express'
import mongoose from 'mongoose'

//Configurações do backend
const app = express()
const port = process.env.PORT || 8080
const connection_url = "mongodb+srv://admin:kPPVw79sqhsjkVsA@cluster0.yjfqt.gcp.mongodb.net/zapdb?retryWrites=true&w=majority"

//Middlewares

//Configurações de banco de dados
mongoose.connect(connection_url,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})

//Rotas da API
app.get('/', (req,res)=>res.status(200).send('De novo novamente essa palhaçada'))

app.listen(port, ()=>console.log('Backend rodando na porta '+ port))