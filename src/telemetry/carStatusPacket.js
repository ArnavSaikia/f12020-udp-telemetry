import { HEADER_SIZE } from './packetHeader.js';

const CAR_STATUS_SIZE = 60; // bytes per car
const NUM_CARS = 22;

function parseSingleCarStatus(buffer, offset) {
    const tractionControl = buffer.readUInt8(offset); offset += 1;
    const antiLockBrakes = buffer.readUInt8(offset); offset += 1;
    const fuelMix = buffer.readUInt8(offset); offset += 1;
    const frontBrakeBias = buffer.readUInt8(offset); offset += 1;
    const pitLimiterStatus = buffer.readUInt8(offset); offset += 1;

    const fuelInTank = buffer.readFloatLE(offset); offset += 4;
    const fuelCapacity = buffer.readFloatLE(offset); offset += 4;
    const fuelRemainingLaps = buffer.readFloatLE(offset); offset += 4;

    const maxRPM = buffer.readUInt16LE(offset); offset += 2;
    const idleRPM = buffer.readUInt16LE(offset); offset += 2;
    const maxGears = buffer.readUInt8(offset); offset += 1;
    const drsAllowed = buffer.readUInt8(offset); offset += 1;
    const drsActivationDistance = buffer.readUInt16LE(offset); offset += 2;

    // Order is [RL, RR, FL, FR] per the spec, same as Car Telemetry
    const tyresWear = [];
    for (let i = 0; i < 4; i++) {
        tyresWear.push(buffer.readUInt8(offset));
        offset += 1;
    }

    const actualTyreCompound = buffer.readUInt8(offset); offset += 1;
    const tyreVisualCompound = buffer.readUInt8(offset); offset += 1;
    const tyresAgeLaps = buffer.readUInt8(offset); offset += 1;

    const tyresDamage = [];
    for (let i = 0; i < 4; i++) {
        tyresDamage.push(buffer.readUInt8(offset));
        offset += 1;
    }

    const frontLeftWingDamage = buffer.readUInt8(offset); offset += 1;
    const frontRightWingDamage = buffer.readUInt8(offset); offset += 1;
    const rearWingDamage = buffer.readUInt8(offset); offset += 1;
    const drsFault = buffer.readUInt8(offset); offset += 1;
    const engineDamage = buffer.readUInt8(offset); offset += 1;
    const gearBoxDamage = buffer.readUInt8(offset); offset += 1;
    const vehicleFiaFlags = buffer.readInt8(offset); offset += 1; // signed: -1/0/1/2/3/4

    const ersStoreEnergy = buffer.readFloatLE(offset); offset += 4;
    const ersDeployMode = buffer.readUInt8(offset); offset += 1;
    const ersHarvestedThisLapMGUK = buffer.readFloatLE(offset); offset += 4;
    const ersHarvestedThisLapMGUH = buffer.readFloatLE(offset); offset += 4;
    const ersDeployedThisLap = buffer.readFloatLE(offset); offset += 4;

    return {
        tractionControl,
        antiLockBrakes,
        fuelMix,
        frontBrakeBias,
        pitLimiterStatus,
        fuelInTank,
        fuelCapacity,
        fuelRemainingLaps,
        maxRPM,
        idleRPM,
        maxGears,
        drsAllowed,
        drsActivationDistance,
        tyresWear,
        actualTyreCompound,
        tyreVisualCompound,
        tyresAgeLaps,
        tyresDamage,
        frontLeftWingDamage,
        frontRightWingDamage,
        rearWingDamage,
        drsFault,
        engineDamage,
        gearBoxDamage,
        vehicleFiaFlags,
        ersStoreEnergy,
        ersDeployMode,
        ersHarvestedThisLapMGUK,
        ersHarvestedThisLapMGUH,
        ersDeployedThisLap,
    };
}

export function parseCarStatusPacket(buffer, header) {
    let offset = HEADER_SIZE;

    const cars = [];
    for (let i = 0; i < NUM_CARS; i++) {
        cars.push(parseSingleCarStatus(buffer, offset));
        offset += CAR_STATUS_SIZE;
    }

    return {
        cars,
        playerCar: cars[header.playerCarIndex],
    };
}