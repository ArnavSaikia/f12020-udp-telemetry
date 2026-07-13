function formatLapTime(seconds) {
    if (!seconds || seconds <= 0) return 'no time set';
    const minutes = Math.floor(seconds / 60);
    const secs = (seconds % 60).toFixed(3);
    return `${minutes}:${secs.padStart(6, '0')}`;
}

export function getPosition(raceState) {
    const player = raceState.getPlayerCar();
    if (!player?.lapData) return "No position data yet.";
    return `You are currently P${player.lapData.carPosition}.`;
}

export function getLapsLeft(raceState) {
    const remaining = raceState.getRaceLapsRemaining();
    if (remaining === null) return "No lap data yet.";
    return `${remaining} laps remaining in the race.`;
}

export function getFastestLap(raceState) {
    let best = null;
    for (const car of raceState.cars) {
        if (!car.lapData || !car.participant) continue;
        if (car.lapData.bestLapTime > 0 && (!best || car.lapData.bestLapTime < best.time)) {
            best = { time: car.lapData.bestLapTime, name: car.participant.name };
        }
    }
    if (!best) return "No fastest lap set yet.";
    return `Fastest lap is ${formatLapTime(best.time)} by ${best.name}.`;
}

// Approximation: distance gap ÷ player's current speed. Not exact —
// doesn't account for the other car's speed — but a reasonable estimate
// given what this packet stream actually provides.
function estimateGapSeconds(distanceDeltaMeters, speedKmh) {
    if (speedKmh <= 0) return null;
    const speedMs = speedKmh / 3.6;
    return distanceDeltaMeters / speedMs;
}

function findCarInPosition(raceState, position) {
    return raceState.cars.find((car) => car.lapData?.carPosition === position) ?? null;
}

export function getGapAhead(raceState) {
    const player = raceState.getPlayerCar();
    if (!player?.lapData || !player?.telemetry) return "No gap data yet.";
    const playerPos = player.lapData.carPosition;
    if (playerPos <= 1) return "You are in the lead, no gap ahead.";

    const carAhead = findCarInPosition(raceState, playerPos - 1);
    if (!carAhead?.lapData) return "Could not find the car ahead.";

    const gap = estimateGapSeconds(carAhead.lapData.totalDistance - player.lapData.totalDistance, player.telemetry.speed);
    return gap === null ? "Cannot estimate the gap right now." : `Gap to the car ahead is approximately ${gap.toFixed(1)} seconds.`;
}

export function getGapBehind(raceState) {
    const player = raceState.getPlayerCar();
    if (!player?.lapData || !player?.telemetry) return "No gap data yet.";
    const playerPos = player.lapData.carPosition;

    const carBehind = findCarInPosition(raceState, playerPos + 1);
    if (!carBehind?.lapData) return "No car behind, or could not find them.";

    const gap = estimateGapSeconds(player.lapData.totalDistance - carBehind.lapData.totalDistance, player.telemetry.speed);
    return gap === null ? "Cannot estimate the gap right now." : `Gap to the car behind is approximately ${gap.toFixed(1)} seconds.`;
}