require('dotenv').config();
const { Server, Keypair } = require('soroban-client');
const ExecutionQueue = require('./src/queue');
const GasMonitor = require('./src/gasMonitor');
const MetricsServer = require('./src/metrics');

async function main() {
    console.log("Starting SoroTask Keeper...");
    
    // Initialize gas monitor
    const gasMonitor = new GasMonitor();
    
    // Initialize metrics server
    const metricsServer = new MetricsServer(gasMonitor);
    await metricsServer.start();
    
    // TODO: Initialize Soroban server connection
    // const server = new Server(process.env.SOROBAN_RPC_URL);
    
    // TODO: Load keeper account
    // const keeper = Keypair.fromSecret(process.env.KEEPER_SECRET);
    
    const queue = new ExecutionQueue();
const config = require('./src/config');
const { server } = require('./src/rpc');
const { Keypair } = require('@stellar/stellar-sdk');

async function main() {
    console.log("Starting SoroTask Keeper...");
    console.log(`Configured for network: ${config.networkPassphrase}`);
    console.log(`RPC URL: ${config.rpcUrl}`);

    try {
        // Connection validation / Startup health check
        const networkInfo = await server.getNetwork();
        console.log("Successfully connected to Soroban RPC!");
        console.log("Network Passphrase from RPC:", networkInfo.passphrase);

    // Dummy executor function for now
    const dummyExecutor = async (taskId) => {
        // In a real implementation, this would check the actual gas balance from the contract
        // For now, simulate with a random gas balance
        const simulatedGasBalance = Math.floor(Math.random() * 1000); // Random balance between 0-999
        
        // Check gas balance and decide whether to proceed
        const shouldSkip = await gasMonitor.checkGasBalance(taskId, simulatedGasBalance);
        
        if (shouldSkip) {
            console.log(`Skipping execution for task ${taskId} due to insufficient gas balance.`);
            return;
        }
        
        return new Promise((resolve) => setTimeout(resolve, 500));
    };
        if (networkInfo.passphrase !== config.networkPassphrase) {
            throw new Error(`Network passphrase mismatch! Expected: ${config.networkPassphrase}, Got: ${networkInfo.passphrase}`);
        }
    } catch (err) {
        console.error("Failed to connect to Soroban RPC or network mismatch:", err.message);
        process.exit(1);
    }

    // Load keeper account
    const keeper = Keypair.fromSecret(config.keeperSecret);
    console.log(`Keeper Account: ${keeper.publicKey()}`);

    // Polling loop
    const pollingInterval = setInterval(async () => {
        console.log("Checking for due tasks...");
        // TODO: Query contract for tasks due for execution
    }, config.pollingIntervalMs);
}

main().catch(err => {
    console.error("Keeper failed:", err);
});
    console.error("Keeper initialization failed:", err);
    process.exit(1);
});
