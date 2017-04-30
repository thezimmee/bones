#!/usr/bin/env node

// Before node empties event loop.
process.on('beforeExit', function() {
	console.log('beforeExit', arguments);
});

// When IPC channel is closed.
process.on('disconnect', function() {
	console.log('disconnect', arguments);
});

// When process is about to exit from process.exit() or no more work to perform.
process.on('exit', function() {
	console.log('exit', arguments);
});

// Rejected promise.
process.on('rejectionHandled', function() {
	console.log('rejectionHandled');
});

// When IPC channel receives a message.
process.on('message', function() {
	console.log('message', arguments);
});

// Uncaught JS exception.
process.on('uncaughtException', function() {
	console.log('uncaughtException');
});

// Unhandled promise rejection.
process.on('unhandledRejection', function() {
	console.log('unhandledRejection');
});

// When warning is emitted.
process.on('warning', function() {
	console.log('warning');
});

// Listen for SIGINT (ctrl+c).
process.on('SIGINT', function() {
	console.log('SIGINT', arguments);
	process.exit();
});

// Keep the script open.
setInterval(function() {}, 30000);
