const socket = io()

let messages = document.getElementById("message-container");
let usersList = document.getElementById("users-list");

let form = document.getElementById("main-form");
let userform = document.getElementById("user-form");

let usermsg = document.getElementById("message");
let username = document.getElementById("user-name");

let connect = document.getElementById("connect-btn")
let disconnect = document.getElementById("disconnect-btn")
let submit = document.getElementById("submit-btn")

const days = {
    0: "Sunday",
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday"
}

function newUser(){
    if(connect.classList.contains('active')){
        connect.classList.remove('active');
        connect.classList.add('deactive');

        disconnect.classList.remove('deactive');
        disconnect.classList.add('active');
        
        submit.classList.remove('deactive');
        submit.classList.add('active');
    }else{
        return;
    }
    socket.emit('create-user', username.value);
    username.value = '';
    appendUsersToMessage('you');
}

function leaveChat(){
    if(disconnect.classList.contains('active')){
        connect.classList.remove('deactive');
        connect.classList.add('active');

        disconnect.classList.remove('active');
        disconnect.classList.add('deactive');

        submit.classList.remove('active');
        submit.classList.add('deactive');
    }else{
        return;
    }
    removeUsersFromMessage('you');
    socket.emit('delete-user');
}

function sendMessage(){
    if(!submit.classList.contains('active')){
        return;
    }
    let d = new Date();
    let msgd = d.getHours() + ":" + d.getMinutes() + ", " + (days[d.getDay()]);
    let data = {message: usermsg.value, date: msgd}
    socket.emit('user-message', data);
    appendMessage({...data, name:'you'})
    usermsg.value = '';
}

function appendUser(data){
    let val = ``;
    usersList.innerHTML = '';
    data.forEach(element => {
        if(element.isactive){
            val = `<div class="list-name"><i class="fa-solid fa-user list-logo active"></i>${element.name}</div>`;
        }else{
            val = `<div class="list-name"><i class="fa-solid fa-user list-logo"></i>${element.name}</div>`;
        }
        usersList.insertAdjacentHTML('beforeend', val);
    });
}

function appendMessage(data){
    let val = ``
    if(data.name==='you'){
        val = `<div class="received mine"><span class="message-date mine">${data.date}</span><span class="user-name">${data.name}</span>: ${data.message}</div>`
    }else{
        val = `<div class="received"><span class="message-date">${data.date}</span><span class="user-name">${data.name}</span>: ${data.message}</div>`
    }
    messages.insertAdjacentHTML('beforeend', val);
    adjustScroll();
}

function appendUsersToMessage(name){
    let val=``
    let d = new Date();
    let msgd = d.getHours() + ":" + d.getMinutes() + ", " + (days[d.getDay()]);
    if(name==='you'){
        val = `<div class="received mine"><span class="message-date mine">${msgd}</span><span class="user-name">${name} Joined!</span></div>`
    }else{
        val = `<div class="received"><span class="message-date">${msgd}</span><span class="user-name">${name} Joined!</span></div>`
    }
    messages.insertAdjacentHTML('beforeend', val);
    adjustScroll();
}

function removeUsersFromMessage(name){
    let val=``
    let d = new Date();
    let msgd = d.getHours() + ":" + d.getMinutes() + ", " + (days[d.getDay()]);
    if(name==='you'){
        val = `<div class="received mine"><span class="message-date mine">${msgd}</span><span class="user-name">${name} Left!</span></div>`
    }else{
        val = `<div class="received"><span class="message-date">${msgd}</span><span class="user-name">${name} Left!</span></div>`
    }
    messages.insertAdjacentHTML('beforeend', val);
    adjustScroll();
}

function adjustScroll(){
    let scrollHeight = messages.getBoundingClientRect().bottom + document.querySelector(".message-title").getBoundingClientRect().bottom;
    messages.scrollTo(0, scrollHeight);
}

socket.on('chat-message', (data) =>{
    appendMessage(data);
})

socket.on('append-message', (data)=>{
    appendUser(data);
})

socket.on('new-join', (name)=>{
    appendUsersToMessage(name);
})

socket.on('user-left', (name)=>{
    removeUsersFromMessage(name);
})
