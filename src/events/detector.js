import { EventEmitter } from 'events';
import { EventTypes } from './eventTypes.js';
import { THRESHOLDS } from '../../config/thresholds.js';

// tyresSurfaceTemperature array order is [RL, RR, FL, FR] per the spec.
const REAR_LEFT_IDX = 0;
const REAR_RIGHT_IDX = 1;
const FRONT_LEFT_IDX = 2;
const FRONT_RIGHT_IDX = 3;

export class EventDetector extends EventEmitter {
    constructor() {
        super();
        // "previous" holds whether each condition was true last time we checked.
        // Comparing current vs. previous is what gives us edge-triggering.
        this.previous = {
            frontTyresOverheating: false,
            rearTyresOverheating: false,
            lowFuel: false,
            playerPosition: null,
        };
    }

    check(raceState) {
        const player = raceState.getPlayerCar();
        if (!player?.telemetry || !player?.status || !player?.lapData) {
            return; // not enough data yet — nothing to diff against
        }

        this._checkTyreOverheating(player);
        this._checkLowFuel(player);
        this._checkPositionChange(player);
    }

    _checkTyreOverheating(player) {
        const temps = player.telemetry.tyresSurfaceTemperature;
        const frontHot =
            temps[FRONT_LEFT_IDX] > THRESHOLDS.TYRE_SURFACE_OVERHEAT_C ||
            temps[FRONT_RIGHT_IDX] > THRESHOLDS.TYRE_SURFACE_OVERHEAT_C;
        const rearHot =
            temps[REAR_LEFT_IDX] > THRESHOLDS.TYRE_SURFACE_OVERHEAT_C ||
            temps[REAR_RIGHT_IDX] > THRESHOLDS.TYRE_SURFACE_OVERHEAT_C;

        if (frontHot && !this.previous.frontTyresOverheating) {
            this.emit('event', { type: EventTypes.FRONT_TYRES_OVERHEATING, message: 'Front tyres are overheating.' });
        }
        if (rearHot && !this.previous.rearTyresOverheating) {
            this.emit('event', { type: EventTypes.REAR_TYRES_OVERHEATING, message: 'Rear tyres are overheating.' });
        }

        this.previous.frontTyresOverheating = frontHot;
        this.previous.rearTyresOverheating = rearHot;
    }

    _checkLowFuel(player) {
        const isLow = player.status.fuelRemainingLaps <= THRESHOLDS.LOW_FUEL_LAPS;
        if (isLow && !this.previous.lowFuel) {
            this.emit('event', {
                type: EventTypes.LOW_FUEL,
                message: `Fuel is low, ${player.status.fuelRemainingLaps.toFixed(1)} laps remaining.`,
            });
        }
        this.previous.lowFuel = isLow;
    }

    _checkPositionChange(player) {
        const current = player.lapData.carPosition;
        if (this.previous.playerPosition !== null && current !== this.previous.playerPosition) {
            if (current < this.previous.playerPosition) {
                this.emit('event', { type: EventTypes.POSITION_GAINED, message: `Position gained, now P${current}.` });
            } else {
                this.emit('event', { type: EventTypes.POSITION_LOST, message: `Position lost, now P${current}.` });
            }
        }
        this.previous.playerPosition = current;
    }
}

export const eventDetector = new EventDetector();