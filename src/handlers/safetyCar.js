const SAFETY_CAR_DESCRIPTIONS = {
    0: 'no Safety Car', 1: 'full Safety Car deployed', 2: 'Virtual Safety Car deployed', 3: 'formation lap',
};

export function getSafetyCarStatus(raceState) {
    const session = raceState.session;
    if (!session) return "No safety car data yet.";
    return SAFETY_CAR_DESCRIPTIONS[session.safetyCarStatus] ?? "Unknown safety car status.";
}