const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

//Get Username and Room from URL
const { username, room } = Qs.parse(location.search, {
	ignoreQueryPrefix: true,
});

const socket = io();

//Join Chatroom
socket.emit('joinRoom', { username, room });

//Get room and Users
socket.on('roomUsers', ({ room, users }) => {
	outputRoomName(room);
	outputUsers(users);
});

//Message from server
socket.on('message', (message) => {
	console.log(message);
	outputMessage(message);

	//Scroll Down
	chatMessages.scrollTop = chatMessages.scrollHeight;
});

//Message submit
chatForm.addEventListener('submit', (e) => {
	e.preventDefault();

	//Get Message Text
	const msg = e.target.elements.msg.value;

	//Emit a message to server
	socket.emit('chatMessage', msg);

	//Clear Input
	e.target.elements.msg.value = '';
	e.target.elements.msg.focus();
});

//Output Message to DOM
function outputMessage(message) {
	const div = document.createElement('div');
	div.classList.add('message');
	div.innerHTML = `<p class="meta">${message.username}<span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;

	document.querySelector('.chat-messages').appendChild(div);
}

//Add Room name to DOM
function outputRoomName(room) {
	roomName.innerText = room;
}

//Add Users to DOM
function outputUsers(users) {
	userList.innerHTML = `${users
		.map((user) => `<li>${user.username}</li>`)
		.join('')}`;
}
