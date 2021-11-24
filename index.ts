import * as dotenv from 'dotenv'

import * as express from 'express'
import * as http from 'http'
import * as socketio from "socket.io"
import cors from 'cors'
import * as note from './controllers/note'
dotenv.config()

const app = express.default()
const PORT = 3000

app.use(express.json())
app.use(cors())


app.use(express.static('www'))


app.get('/notes', note.list)
app.get('/notes/:id', note.get)
app.post('/notes', note.create)
app.put('/notes', note.update)
app.delete('/notes', note.remove)

const server = http.createServer(app)
const io = new socketio.Server(server)

io.on('connection', (socket: any) => {
  console.log("Nova conexão do front com ID de cliente", socket.client.id);/*conectando com id do usuario*/

  socket.on('disconnect', () => {
    console.log("Conexão do front perdida com ID de cliente", socket.client.id);/*desconectando com id do usário*/
  })
  socket.on('message', (data:any) => {
    console.log("Mensagem recebida do front: ", socket.client.id, "com a msg: ", data);
    io.emit('message', data) /*Mesagem recebida do front*/
  })
});

server.listen( PORT,() =>{
  console.log('Rumming at localhost' + PORT)
})