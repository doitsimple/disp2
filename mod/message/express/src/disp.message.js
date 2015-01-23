module.exports = function(message){
	ws.send('received: %s', message);
}
