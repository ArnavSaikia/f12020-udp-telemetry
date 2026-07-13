export function getFuelStatus(raceState) {
    const player = raceState.getPlayerCar();
    if (!player?.status) return "No fuel data yet.";

    const { fuelInTank, fuelRemainingLaps } = player.status;
    if (fuelRemainingLaps < 0) {
        return `Fuel is critical — about ${Math.abs(fuelRemainingLaps).toFixed(1)} laps short of the finish.`;
    }
    return `Fuel is ${fuelInTank.toFixed(1)} kilograms, roughly ${fuelRemainingLaps.toFixed(1)} laps remaining.`;
}