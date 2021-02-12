//Node Server which will handle socketio connections
const express=require('express')
const app = express();
const port=process.env.PORT || 8000;

const server = app.listen(port,()=>{
    console.log(`Listening at Port ${port}`);
    });
 
    

const path=require('path');
const io = require('socket.io')(server);



const users={};

//express
app.use('/static',express.static('static'));
app.use(express.urlencoded());


//connection
io.on('connection',socket=>{
    
    socket.on('new-user-joined',name=>{
        users[socket.id]=name;
     socket.broadcast.emit('user-joined',name);  
     socket.emit('userfirst',Object.keys(users).length);     
     socket.broadcast.emit('update-usercount',Object.keys(users).length);     
    });

    socket.on('send',message=>{
        socket.broadcast.emit('recieve',{message:message , name:users[socket.id]})
    });

    socket.on('disconnect', ()=>{

        socket.broadcast.emit('left',users[socket.id]);
        delete users[socket.id];
     socket.broadcast.emit('update-usercount',Object.keys(users).length);     
           
        
     });

 
});
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/chat', function(req, res) {
    res.sendFile(path.join(__dirname + '/chat.html'));
});