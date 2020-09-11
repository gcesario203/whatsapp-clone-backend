// Importações e etc
import express from 'express'
import mongoose from 'mongoose'
import Messages from './dbMessages.js'
import Pusher from 'pusher'
import cors from 'cors'

//Configurações do backend
const app = express()
const port = process.env.PORT || 8080
const connection_url = "mongodb+srv://admin:kPPVw79sqhsjkVsA@cluster0.yjfqt.gcp.mongodb.net/zapdb?retryWrites=true&w=majority"

const pusher = new Pusher({
    appId: '1070801',
    key: 'b452de844577660cf20a',
    secret: '6b9fcbd654fc6d176c92',
    cluster: 'us2',
    encrypted: true
  })

//Middlewares
app.use(express.json())
app.use(cors())

app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin', "*")
    res.setHeader('Access-Control-Allow-Headers', "*")
    next()
})

//Configurações de banco de dados
mongoose.connect(connection_url,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})

const db =  mongoose.connection

db.once('open', () => {
    console.log('Conexão iniciada com sucesso')

    const msgCollection = db.collection('messagecontents')
    const changeStream = msgCollection.watch()

    changeStream.on('change', (change) =>{
        console.log(change)

        if(change.operationType === 'insert') {
            const messageDetails = change.fullDocument
            pusher.trigger('messages', 'inserted',{
                name: messageDetails.name,
                message: messageDetails.message,
                timestamp: messageDetails.timestamp,
                received: messageDetails.received
            })
        }else{
            console.log('É amigo kkkkkkkkkkkkkkkkkkkkkkkk')
        }
    })
})

//Rotas da API
app.get('/', (req,res)=>res.status(200).send('De novo novamente essa palhaçada'))

app.get('/messages/sync', (req,res)=>{
    Messages.find((error,data)=>{
        error ? res.status(500).send(error) : res.status(200).send(data)
    })
})

app.post('/messages/new', (req,res)=>{
    const dbMessage = req.body

    Messages.create(dbMessage, (error, data)=>{
        error ? res.status(500).send(error) : res.status(201).send(data)
    })
})

app.listen(port, ()=>console.log('Backend rodando na porta '+ port))