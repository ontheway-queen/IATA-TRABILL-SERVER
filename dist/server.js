"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app/app"));
const app = new app_1.default();
app.listen();
/* import cluster from 'cluster';
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
  } */
//# sourceMappingURL=server.js.map