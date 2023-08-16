export const environment = {
    broker: {
        //hostname: '192.168.1.104', //host running the broker
        hostname: 'localhost',
        port: 8080, //port of the broker listening to websockets
        clean: true, // Retain session
        connectTimeout: 400, // Timeout period
        reconnectPeriod: 390 // Reconnect period
    }
}