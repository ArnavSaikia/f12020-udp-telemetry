import { Intents } from '../nlu/intents.js';
import { getFuelStatus } from './fuel.js';
import { getErsStatus } from './ers.js';
import { getTyreStatus, getTyreTemps } from './tyres.js';
import { getDamageStatus } from './damage.js';
import { getPosition, getGapAhead, getGapBehind, getLapsLeft, getFastestLap } from './race.js';
import { getWeatherStatus } from './weather.js';
import { getDrsStatus } from './drs.js';
import { getPitStatus, getStrategy } from './strategy.js';
import { getPenaltyStatus } from './penalties.js';
import { getSafetyCarStatus } from './safetyCar.js';

export const HANDLERS = {
    [Intents.GET_FUEL]: getFuelStatus,
    [Intents.GET_ERS]: getErsStatus,
    [Intents.GET_TYRES]: getTyreStatus,
    [Intents.GET_TYRE_TEMP]: getTyreTemps,
    [Intents.GET_DAMAGE]: getDamageStatus,
    [Intents.GET_POSITION]: getPosition,
    [Intents.GET_GAP_AHEAD]: getGapAhead,
    [Intents.GET_GAP_BEHIND]: getGapBehind,
    [Intents.GET_WEATHER]: getWeatherStatus,
    [Intents.GET_DRS]: getDrsStatus,
    [Intents.GET_PIT_STATUS]: getPitStatus,
    [Intents.GET_STRATEGY]: getStrategy,
    [Intents.GET_FASTEST_LAP]: getFastestLap,
    [Intents.GET_LAPS_LEFT]: getLapsLeft,
    [Intents.GET_PENALTIES]: getPenaltyStatus,
    [Intents.GET_SAFETY_CAR]: getSafetyCarStatus,
};