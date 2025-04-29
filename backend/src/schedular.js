import cron from "node-cron";
import { fork } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Create __dirname manually
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// This console.log should print immediately when starting server
console.log("__dirname is:", __dirname);

// Schedule a task
cron.schedule('0 3 * * *', () => {
    console.log("Cron triggered at", new Date());

    const workerPath = path.join(__dirname, 'worker.js');
    console.log("Forking worker at path:", workerPath);

    const worker = fork(workerPath);

    worker.on('message', (msg) => {
        console.log("message from worker:", msg);
    });

    worker.on('error', (err) => {
        console.error("Worker process error:", err);
    });

    worker.on('exit', (code) => {
        console.log(`Worker process exited with code ${code}`);
    });

    setTimeout(() => {
        worker.kill('SIGTERM');
        console.log("Worker terminated after max lifetime.");
    }, 1000 * 60 * 5); // 5 minutes
});
