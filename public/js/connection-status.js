define(['jquery', 'socket', 'bootstrap'], function($, socket) {

        var failedConnection;
	
        var openConnectionStatusModal = function() {
            $('#connection-status-modal').modal({
                backdrop: 'static',
                keyboard: false
            });
        };
        var closeConnectionStatusModal = function() {
            $('#connection-status-modal').modal('hide');
        }
        var setConnectionStatus = function(message, status) {
            $('#connection-status-modal').removeClass('offline')
                .removeClass('connecting')
                .removeClass('connected')
                .addClass(status);

            $('#connection-status-modal').find('.status-message').html(message);
            if (failedConnection) clearTimeout(failedConnection);
            switch (status) {
                case 'connected':
                    return setTimeout(closeConnectionStatusModal(), 2000);
                case 'connecting':
                case 'offline':
                    failedConnection = setTimeout(function() { connectionStatus('reconnect_failed'); }, 20000);
                    openConnectionStatusModal();
                    break;
            }    
        }
        var connectionStatus = function(status) {
             switch (status) {
                 case 'offline':
                     return setConnectionStatus("Looks like your internet connection is down, damn!", 'offline'); 
                 case 'online':
                     return setConnectionStatus("We're online again, waiting for server connection", "connecting");
                 case 'connected':
                     return setConnectionStatus('...and we\'re connected!', 'connected');
                 case 'reconnecting':
                 case 'connecting':
                     return setConnectionStatus("Attempting to connect to the server...", "connecting");
                 case 'reconnect_failed':
                     return setConnectionStatus("Reconnection has failed, we suggest you refresh the page...", "offline");
            }
        }

        $(window).bind('offline', function() {
            connectionStatus('offline');
        });
        $(window).bind('online', function() {
            connectionStatus('online');
        });
        socket.on('connection', function() {
            connectionStatus('connected');
        });
        socket.on('connecting', function() {
            connectionStatus('connecting');
        });
        socket.on('connected', function() {
            connectionStatus('connected');
        });
        socket.on('reconnecting', function() {
            connectionStatus('reconnecting');
        });
        socket.on('reconnect_failed', function() {
            connectionStatus('reconnect_failed');
        });
        socket.on('connect', function() {
            connectionStatus('connected');
        });

        return connectionStatus;
});
