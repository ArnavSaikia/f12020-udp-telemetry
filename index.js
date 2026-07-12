import { startListener } from './src/telemetry/listener.js';
import { raceState } from './src/state/raceState.js';

startListener(20777);

// setTimeout(() => {
//     console.log('--- RaceState check ---');

//     const result = raceState.findCarByName('hamilton');
//     if (result) {
//         console.log(`Found: ${result.car.participant.name}`);
//         console.log(`Position: P${result.car.lapData.carPosition}`);
//         console.log(`Current lap: ${result.car.lapData.currentLapNum}`);
//     } else {
//         console.log('No car found matching "hamilton"');
//     }

//     const player = raceState.getPlayerCar();
//     console.log(`\nYour position: P${player?.lapData?.carPosition}`);
// }, 10000);