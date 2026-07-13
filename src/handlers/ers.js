// 4,000,000 J (4 MJ) is the regulation max ERS-K store for this era of F1 cars.
const MAX_ERS_JOULES = 4_000_000;

export function getErsStatus(raceState) {
    const player = raceState.getPlayerCar();
    if (!player?.status) return "No ERS data yet.";

    const percent = (player.status.ersStoreEnergy / MAX_ERS_JOULES) * 100;
    return `ERS battery is at ${percent.toFixed(0)} percent.`;
}