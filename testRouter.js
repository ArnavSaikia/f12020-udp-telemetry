import readline from 'readline';
import { startListener } from './src/telemetry/listener.js';
import { raceState } from './src/state/raceState.js';
import { routeText } from './src/nlu/router.js';
import { handleIntent } from './src/response/generateResponse.js';

startListener(20777);

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

console.log('Run mockSender.js to populate data, then type a driver query. Ctrl+C to quit.\n');

rl.on('line', (line) => {
    const routed = routeText(line.trim());
    const response = handleIntent(routed, raceState);
    console.log(`> ${response}\n`);
});