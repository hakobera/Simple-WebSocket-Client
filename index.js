new function() {
	var ws = null;
	var connected = false;

	var serverUrl;
	var protocolHeader;
	var connectionStatus;
	var sendMessage;

	var connectButton;
	var disconnectButton;
	var sendButton;

	var open = function() {
		var url = serverUrl.val();
		// comma-separated protocol headers are passed as array
		var protocol = protocolHeader.val().replace(/\s/,'').split(',');;
		if (protocol) {
			try {
				ws = new WebSocket(url, protocol);
			} catch (ex) {
				alert(ex);
			}
		} else {
			ws = new WebSocket(url);
		}
		ws.onopen = onOpen;
		ws.onclose = onClose;
		ws.onmessage = onMessage;
		ws.onerror = onError;

		connectionStatus.text('OPENING ...');
		serverUrl.attr('disabled', 'disabled');
		protocolHeader.attr('disabled', 'disabled');
		connectButton.hide();
		disconnectButton.show();
	}

	var close = function() {
		if (ws) {
			console.log('CLOSING ...');
			ws.close();
		}
		connected = false;
		connectionStatus.text('CLOSED');

		serverUrl.removeAttr('disabled');
		protocolHeader.removeAttr('disabled');
		connectButton.show();
		disconnectButton.hide();
		sendMessage.attr('disabled', 'disabled');
		sendButton.attr('disabled', 'disabled');
	}

	var clearLog = function() {
		$('#messages').html('');
	}

	var onOpen = function(evt) {
		console.log('OPENED: ' + serverUrl.val());
		if (evt.currentTarget.protocol) {
			console.log('Sec-WebSocket-Protocol: ' + evt.currentTarget.protocol);
		}
		connected = true;
		connectionStatus.text('OPENED');
		sendMessage.removeAttr('disabled');
		sendButton.removeAttr('disabled');
	};

	var onClose = function() {
		console.log('CLOSED: ' + serverUrl.val());
		ws = null;
	};

	var onMessage = function(event) {
		var data = event.data;
		addMessage(data);
	};

	var onError = function(event) {
		alert(event.data);
	}

	var addMessage = function(data, type) {
		var msg = $('<pre>').text(data);
		if (type === 'SENT') {
			msg.addClass('sent');
		}
		var messages = $('#messages');
		messages.append(msg);

		var msgBox = messages.get(0);
		while (msgBox.childNodes.length > 1000) {
			msgBox.removeChild(msgBox.firstChild);
		}
		msgBox.scrollTop = msgBox.scrollHeight;
	}

	WebSocketClient = {
		init: function() {
			serverUrl = $('#serverUrl');
			protocolHeader = $('#protocolHeader');
			connectionStatus = $('#connectionStatus');
			sendMessage = $('#sendMessage');

			connectButton = $('#connectButton');
			disconnectButton = $('#disconnectButton');
			sendButton = $('#sendButton');

			connectButton.click(function(e) {
				close();
				open();
			});

			disconnectButton.click(function(e) {
				close();
			});

			sendButton.click(function(e) {
				var msg = $('#sendMessage').val();
				addMessage(msg, 'SENT');
				ws.send(msg);
			});

			$('#clearMessage').click(function(e) {
				clearLog();
			});

			var isCtrl;
			sendMessage.keyup(function (e) {
				if(e.which == 17) isCtrl=false;
			}).keydown(function (e) {
				if(e.which == 17) isCtrl=true;
				if(e.which == 13 && isCtrl == true) {
					sendButton.click();
					return false;
				}
			});
		}
	};
}

$(function() {
	WebSocketClient.init();
});
