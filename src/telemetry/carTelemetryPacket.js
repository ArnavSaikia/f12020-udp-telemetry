import { HEADER_SIZE } from './packetHeader.js';

const CAR_TELEMETRY_SIZE = 58; // bytes per car, from the size math above
const NUM_CARS = 22;

// Reads ONE car's telemetry struct starting at `offset`.
// Returns the parsed object; caller advances offset by CAR_TELEMETRY_SIZE.
function parseSingleCarTelemetry(buffer, offset) {
    const speed = buffer.readUInt16LE(offset); offset += 2;
    const throttle = buffer.readFloatLE(offset); offset += 4;
    const steer = buffer.readFloatLE(offset); offset += 4;
    const brake = buffer.readFloatLE(offset); offset += 4;
    const clutch = buffer.readUInt8(offset); offset += 1;
    const gear = buffer.readInt8(offset); offset += 1; // signed: -1 = reverse, 0 = neutral
    const engineRPM = buffer.readUInt16LE(offset); offset += 2;
    const drs = buffer.readUInt8(offset); offset += 1;
    const revLightsPercent = buffer.readUInt8(offset); offset += 1;

    // Fixed-size arrays: loop 4 times, reading + advancing offset each time.
    // Order per the spec is always [RL, RR, FL, FR] (rear-left, rear-right, front-left, front-right).
    const brakesTemperature = [];
    for (let i = 0; i < 4; i++) {
        brakesTemperature.push(buffer.readUInt16LE(offset));
        offset += 2;
    }

    const tyresSurfaceTemperature = [];
    for (let i = 0; i < 4; i++) {
        tyresSurfaceTemperature.push(buffer.readUInt8(offset));
        offset += 1;
    }

    const tyresInnerTemperature = [];
    for (let i = 0; i < 4; i++) {
        tyresInnerTemperature.push(buffer.readUInt8(offset));
        offset += 1;
    }

    const engineTemperature = buffer.readUInt16LE(offset); offset += 2;

    const tyresPressure = [];
    for (let i = 0; i < 4; i++) {
        tyresPressure.push(buffer.readFloatLE(offset));
        offset += 4;
    }

    const surfaceType = [];
    for (let i = 0; i < 4; i++) {
        surfaceType.push(buffer.readUInt8(offset));
        offset += 1;
    }

    return {
        speed,
        throttle,
        steer,
        brake,
        clutch,
        gear,
        engineRPM,
        drs,
        revLightsPercent,
        brakesTemperature,
        tyresSurfaceTemperature,
        tyresInnerTemperature,
        engineTemperature,
        tyresPressure,
        surfaceType,
    };
}

export function parseCarTelemetryPacket(buffer, header) {
    let offset = HEADER_SIZE; // body starts right after the 24-byte header

    const cars = [];
    for (let i = 0; i < NUM_CARS; i++) {
        cars.push(parseSingleCarTelemetry(buffer, offset));
        offset += CAR_TELEMETRY_SIZE; // jump past this car's 58 bytes to the next one
    }

    // Trailing fields after the array of 22 cars
    const buttonStatus = buffer.readUInt32LE(offset); offset += 4;
    const mfdPanelIndex = buffer.readUInt8(offset); offset += 1;
    const mfdPanelIndexSecondaryPlayer = buffer.readUInt8(offset); offset += 1;
    const suggestedGear = buffer.readInt8(offset); offset += 1;

    return {
        cars,
        playerCar: cars[header.playerCarIndex], // the one we actually care about
        buttonStatus,
        mfdPanelIndex,
        mfdPanelIndexSecondaryPlayer,
        suggestedGear,
    };
}