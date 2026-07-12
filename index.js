import { startListener } from './src/telemetry/listener.js';
import { raceState } from './src/state/raceState.js';

startListener(20777);

// setTimeout(() => {
//     console.log('--- RaceState check ---');

//     const result = raceState.findCarByName('hamilton');
//     if (result) {
//         console.log(`Found: ${result.car.participant.name}, P${result.car.lapData.carPosition}`);
//     }

//     console.log(`Your position: P${raceState.getPlayerCar()?.lapData?.carPosition}`);

//     const s = raceState.session;
//     console.log(`\nWeather code: ${s?.weather} (0=clear,1=light cloud,2=overcast,3=light rain,4=heavy rain,5=storm)`);
//     console.log(`Track temp: ${s?.trackTemperature}°C | Air temp: ${s?.airTemperature}°C`);
//     console.log(`Total laps: ${s?.totalLaps} | Laps remaining: ${raceState.getLapsRemaining()}`);
//     console.log(`Safety car status: ${s?.safetyCarStatus} (0=none,1=full,2=VSC,3=formation lap)`);
// }, 10000);