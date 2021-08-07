const urlsNamespace = {
    admin: '/admin',
    worker: '/worker' 
}
const http = require('http');
const io = require('socket.io');

const IntanceSockets = function (opts) {
    this.adminConnect = opts.adminConnect;
    this.workerConnect = opts.workerConnect;
    
    this.admin = io => {
        
        io.on('connection', socket => {
    
            socket.on('connect_admin', () => {
    
            });
    
            socket.on('disconnect', reason => {
    
    
            });
        });
    
    }

    this.worker = io => {

        io.on('connection', socket => {
    
        });
    
    }
    
    this.init = () => {
        //socke admin start namespace
        if(this.adminConnect) this.admin(this.adminConnect);
        else throw new Error('param require adminConnect');

        //socke worker start namespace
        if(this.workerConnect) this.worker(this.workerConnect);
        else throw new Error('param require workerConnect');
    }

    //contruct object start
    this.init();
}

var startSockets = app => {
	var httpServer = http.Server(app);
	var socketIo = io(httpServer);
    
    try {
        //instance sockets start
        new IntanceSockets({
            adminConnect: socketIo.of(urlsNamespace.admin),
            workerConnect: socketIo.of(urlsNamespace.worker)
        })   
    } catch (e) {
        console.log('Sockets Error -> ', e);
    }

    //return el server para escuchar conexion
	return httpServer;
}

module.exports = startSockets;