export function getPitStatus(raceState) {
    const player = raceState.getPlayerCar();
    if (!player?.status) return "No tyre data yet.";
    const avgWear = player.status.tyresWear.reduce((a, b) => a + b, 0) / 4;

    if (avgWear >= 70) return "Tyre wear is high, recommend pitting soon.";
    if (avgWear >= 50) return "Tyre wear suggests pitting within the next few laps.";
    return "No need to pit yet, tyres are in good condition.";
}

export function getStrategy(raceState) {
    const player = raceState.getPlayerCar();
    if (!player?.status) return "No strategy data yet.";
    const { fuelRemainingLaps, tyresWear } = player.status;
    const avgWear = tyresWear.reduce((a, b) => a + b, 0) / 4;

    if (fuelRemainingLaps < 2) return "Fuel is critical, consider leaning out the fuel mix.";
    if (avgWear >= 70) return "Tyres are worn, plan to pit in the next couple of laps.";
    return "Current strategy looks fine, keep pushing.";
}