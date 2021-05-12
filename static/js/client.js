const href=localStorage.getItem('href');
const socket=io(href);

const form=document.getElementById('send');
const messageinp=document.getElementById('inp-message');
const messagecontainer=document.querySelector('.container');
const send_container=document.getElementById('send-container');


//append message to container
const Append=(message,position,color)=>{
messageElement=document.createElement('div');
messageElement.innerText=message;
messageElement.setAttribute('class',`message ${position}`)
if(color==1)
messageElement.setAttribute('style',`background-color:#ff8888;`)

messagecontainer.appendChild(messageElement);

if(position=='left')
document.getElementById('myaudio').play();

messagecontainer.scrollTop = messagecontainer.scrollHeight;
};

//asks name of the user
const name=localStorage.getItem('name'); 
    
socket.emit('new-user-joined',name);

socket.on('user-joined',name=>{         //user joined the chat
Append(`${name} Joined the chat`,`left`,1);

});

//first time user so create div of members
socket.on('userfirst', userlen=>{
usercount=document.createElement('div');
usercount.innerHTML=`<h4>Members : ${userlen}</h4>`;

send_container.appendChild(usercount);
});

//update all the other users about count

socket.on('update-usercount',userlen=>{
usercount=document.querySelector('#send-container div');
usercount.innerHTML=`<h4>Members : ${userlen}</h4>`;

});

socket.on('recieve',data=>{               //users recieve message
    Append(`${data.name}: ${data.message}`,`left`,0);
    });

form.addEventListener( 'submit',e=>{   //send message
e.preventDefault();

message=messageinp.value;
if(message.length!=0){
socket.emit('send',message);
messageinp.value=``;
Append(`You: ${message}`,`right`,0);
}
});
    
socket.on('left',name=>{    //left the chat
    
    Append(`${name} Left the chat`,`left`,1);
             


});
    

