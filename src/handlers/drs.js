export function getDrsStatus(raceState) {
    const player = raceState.getPlayerCar();
    if (!player?.telemetry || !player?.status) return "No DRS data yet.";
    if (!player.status.drsAllowed) return "DRS is not enabled here.";
    return player.telemetry.drs ? "DRS is open." : "DRS is available but not currently open.";
}