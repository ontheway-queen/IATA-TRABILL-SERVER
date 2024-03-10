import App from './app/app';
/* const app = new App();
app.listen(); */

import cluster from 'cluster';
import os from 'os';
import process from 'process';

const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running`);

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
    });
} else {
    const app = new App();

    app.listen();

    console.log(`Worker ${process.pid} started`);
}
