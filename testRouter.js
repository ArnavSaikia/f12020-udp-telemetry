import readline from 'readline';
import { routeText } from './src/nlu/router.js';

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

console.log('Type a driver query (e.g. "how are my tyres") and press Enter. Ctrl+C to quit.\n');

rl.on('line', (line) => {
    const result = routeText(line.trim());
    if (!result) {
        console.log('No confident match found.\n');
    } else {
        console.log(`Intent: ${result.intent}`);
        console.log(`Matched phrase: "${result.matchedPhrase}" (score: ${result.score.toFixed(3)}, lower is better)\n`);
    }
});