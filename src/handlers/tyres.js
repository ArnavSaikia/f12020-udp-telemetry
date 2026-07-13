import { REAR_LEFT_IDX, REAR_RIGHT_IDX, FRONT_LEFT_IDX, FRONT_RIGHT_IDX } from '../telemetry/tyreIndices.js';
import { THRESHOLDS } from '../../config/thresholds.js';

// F1 2020 tyre compound codes: 16=soft, 17=medium, 18=hard, 7=intermediate, 8=wet
const COMPOUND_NAMES = { 16: 'soft', 17: 'medium', 18: 'hard', 7: 'intermediate', 8: 'wet' };

export function getTyreStatus(raceState) {
    const player = raceState.getPlayerCar();
    if (!player?.status) return "No tyre data yet.";

    const { tyresWear, actualTyreCompound, tyresAgeLaps } = player.status;
    const avgWear = tyresWear.reduce((a, b) => a + b, 0) / 4;
    const compoundName = COMPOUND_NAMES[actualTyreCompound] ?? 'unknown compound';

    return `${compoundName} tyres, ${tyresAgeLaps} laps old, average wear ${avgWear.toFixed(0)} percent.`;
}

export function getTyreTemps(raceState) {
    const player = raceState.getPlayerCar();
    if (!player?.telemetry) return "No tyre temperature data yet.";

    const temps = player.telemetry.tyresSurfaceTemperature;
    const frontAvg = (temps[FRONT_LEFT_IDX] + temps[FRONT_RIGHT_IDX]) / 2;
    const rearAvg = (temps[REAR_LEFT_IDX] + temps[REAR_RIGHT_IDX]) / 2;
    const hot = THRESHOLDS.TYRE_SURFACE_OVERHEAT_C;

    if (frontAvg > hot && rearAvg > hot) return `All four tyres are overheating — front ${frontAvg.toFixed(0)}°, rear ${rearAvg.toFixed(0)}°.`;
    if (frontAvg > hot) return `Front tyres are overheating at ${frontAvg.toFixed(0)} degrees.`;
    if (rearAvg > hot) return `Rear tyres are overheating at ${rearAvg.toFixed(0)} degrees.`;
    return `Tyre temps look fine — front ${frontAvg.toFixed(0)}°, rear ${rearAvg.toFixed(0)}°.`;
}