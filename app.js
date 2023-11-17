const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(cors());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.get('/', (req, res) => {
    res.sendFile('index.html');
});

let users=[]

io.on('connection', (socket) => {
    socket.on('create-user', (name)=>{
        //check if user exists
        let flag=0;
        for (let index = 0; index < users.length; index++) {
            const element = users[index];
            if(element.name === name){
                if(element.isactive) return;
                flag = 1;
                users[index] = {...users[index], isactive: true};
                break;
            }
        }
        if(flag !== 1){
            //create a user
            users.push({name: name, id: socket.id, isactive: true});
        }


        //return user name
        socket.broadcast.emit('new-join', name);

        //return users list 
        let names = [];
        users.map(item => names.push({name: item.name, isactive: item.isactive}));
        io.sockets.emit('append-message', names);
    })

    socket.on('delete-user', ()=>{

        let name='';
        for (let index = 0; index < users.length; index++) {
            const element = users[index];
            if(element.id === socket.id){
                name = element.name;
                users[index] = {...users[index], isactive: false};
            }
        }
        socket.broadcast.emit('user-left', name);

        let names = [];
        users.map(item => names.push({name: item.name, isactive: item.isactive}));
        io.sockets.emit('append-message', names);
    })

    socket.on('user-message', (data)=>{
        let name ='';
        users.map(item => {
            if(item.id === socket.id) name = item.name
        })
        let userData = {message: data.message, date: data.date ,name: name}
        socket.broadcast.emit('chat-message', userData);
    })
})