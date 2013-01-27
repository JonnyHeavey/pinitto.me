define(['jquery', 'socket'], function($, socket) {
	
        var openConnectionStatusModal = function() {
            $('#connection-status-modal').modal({
                backdrop: 'static',
                keyboard: false
            });
        };
        var closeConnectionStatusModal = function() {
            $('#connection-status-modal').modal(false);
        }
        var setConnectionStatus = function(message, status) {
            console.log(status, message);            
            $('#connection-status-modal').addClass(status);
            $('#connection-status-modal').find('.status-message').html(message);
            switch (status) {
                case 'connected':
                    return setTimeout(closeConnectionStatusModal(), 2000);
                case 'connecting':
                    openConnectionStatusModal();
                    break;
                case 'offline':
                    openConnectionStatusModal();
                    break;
            }    
        }
        var connectionStatus = function(status) {
             console.log(status);
             switch (status) {
                 case 'offline':
                     return setConnectionStatus("Looks like your internet connection is down, damn!", 'offline'); 
                 case 'online':
                     return setConnectionStatus("We're online again, waiting for server connection", "connecting");
                 case 'connecting':
                     return setConnectionStatus("Attempting to connect, get ready... we're almost there!", "connecting");
                 case 'connected':
                     return setConnectionStatus('...and we\'re connected!', 'connected');
                 case 'reconnecting':
                     return setConnectionStatus("We're now reconnecting like long lost lovers", "connecting");
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
});
