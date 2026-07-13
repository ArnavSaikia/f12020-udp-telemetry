export function getPenaltyStatus(raceState) {
    const player = raceState.getPlayerCar();
    if (!player?.lapData) return "No penalty data yet.";
    const { penalties } = player.lapData;
    return penalties === 0 ? "No penalties." : `You have ${penalties} seconds of penalties.`;
}