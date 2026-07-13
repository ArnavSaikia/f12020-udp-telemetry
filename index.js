import { startListener } from './src/telemetry/listener.js';
import { raceState } from './src/state/raceState.js';
import { eventDetector } from './src/events/detector.js';

startListener(20777);

eventDetector.on('event', (evt) => {
    console.log(`🔔 [EVENT] ${evt.type}: ${evt.message}`);
});

setInterval(() => {
    eventDetector.check(raceState);
}, 500); // check twice a second — matches the game's Session packet rate, a reasonable cadence