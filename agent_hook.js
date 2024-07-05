let connectButton;
let subtitleDiv;
let websocketUrlInput;
let socket;

const spinner = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';

document.addEventListener('DOMContentLoaded', function () {

	connectButton = document.getElementById('connectButton');
	subtitleDiv = document.getElementById('subtitle');
	websocketUrlInput = document.getElementById('websocketUrl');

	connectButton.addEventListener('click', open_socket);
});

const STATUS = {
	CONNECTED: 'connected',
	CONNECTING: 'connecting',
	DISCONNECTED: 'disconnected'
}

function open_socket() {

	set_button(STATUS.CONNECTING);

	let url = websocketUrlInput.value;
	if (!url) {
		url = 'ws://localhost:9001';
	}

	console.log('Websocket URL: ', url)

	socket = new WebSocket(url);

	socket.onopen = function () {
		console.log('WebSocket connection established.');
		set_button(STATUS.CONNECTED);
	};

	socket.onmessage = function (event) {
		try {
			const data = JSON.parse(event.data);
			if (data.type === 'copyText' && data.sentence) {
				subtitleDiv.textContent = data.sentence;
			}
		} catch (e) {
			console.error('Error parsing JSON:', e);
		}
	};

	socket.onerror = function (error) {
		console.error('WebSocket Error:', error);
	};

	socket.onclose = function () {
		console.log('WebSocket connection closed.');
		set_button(STATUS.DISCONNECTED);
	};

}

function close_socket() {

	set_button(STATUS.DISCONNECTED);

	if (socket) {
		socket.close();
		socket = null;
	}

}

function set_button(status) {

	const btn = document.getElementById('connectButton');

	if (Object.values(STATUS).includes(status)) {
		btn.classList.remove('btn-success')
		btn.classList.remove('btn-primary')
		btn.classList.remove('btn-danger')
		connectButton.removeEventListener('click', open_socket);
		connectButton.removeEventListener('click', close_socket);
	}

	switch (status) {

		case STATUS.CONNECTED:

			btn.classList.add('btn-success')
			btn.textContent = 'Connected';
			btn.disabled = false;
			break;

		case STATUS.CONNECTING:

			btn.classList.add('btn-primary')
			btn.innerHTML = spinner + ' Connecting...';
			btn.disabled = true;
			break;

		case STATUS.DISCONNECTED:

			btn.classList.add('btn-danger')
			btn.textContent = 'Disconnected';
			btn.disabled = false;
			break;

		default:
			console.error('Invalid status:', status);

	}
}