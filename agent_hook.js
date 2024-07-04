document.addEventListener('DOMContentLoaded', function () {

	const connectButton = document.getElementById('connectButton');
	const status = document.getElementById('connectionStatus');
	const subtitleDiv = document.getElementById('subtitle');
	const websocketUrlInput = document.getElementById('websocketUrl');

	connectButton.addEventListener('click', function () {

		let url = websocketUrlInput.value;
		if (!url) {
			url = 'ws://localhost:9001';
		}

		console.log('Websocket URL: ', url)

		const socket = new WebSocket(url);

		socket.onopen = function () {
			console.log('WebSocket connection established.');
			status.textContent = 'Connected';
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
			status.textContent = 'Disconnected';
		};
	});
});