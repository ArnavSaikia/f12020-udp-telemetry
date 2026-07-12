import { HEADER_SIZE } from './packetHeader.js';

const LAP_DATA_SIZE = 53;
const NUM_CARS = 22;

function parseSingleLapData(buffer, offset) {
    const lastLapTime = buffer.readFloatLE(offset); offset += 4;
    const currentLapTime = buffer.readFloatLE(offset); offset += 4;
    const sector1TimeInMS = buffer.readUInt16LE(offset); offset += 2;
    const sector2TimeInMS = buffer.readUInt16LE(offset); offset += 2;
    const bestLapTime = buffer.readFloatLE(offset); offset += 4;
    const bestLapNum = buffer.readUInt8(offset); offset += 1;
    const bestLapSector1TimeInMS = buffer.readUInt16LE(offset); offset += 2;
    const bestLapSector2TimeInMS = buffer.readUInt16LE(offset); offset += 2;
    const bestLapSector3TimeInMS = buffer.readUInt16LE(offset); offset += 2;
    const bestOverallSector1TimeInMS = buffer.readUInt16LE(offset); offset += 2;
    const bestOverallSector1LapNum = buffer.readUInt8(offset); offset += 1;
    const bestOverallSector2TimeInMS = buffer.readUInt16LE(offset); offset += 2;
    const bestOverallSector2LapNum = buffer.readUInt8(offset); offset += 1;
    const bestOverallSector3TimeInMS = buffer.readUInt16LE(offset); offset += 2;
    const bestOverallSector3LapNum = buffer.readUInt8(offset); offset += 1;
    const lapDistance = buffer.readFloatLE(offset); offset += 4;
    const totalDistance = buffer.readFloatLE(offset); offset += 4;
    const safetyCarDelta = buffer.readFloatLE(offset); offset += 4;
    const carPosition = buffer.readUInt8(offset); offset += 1;
    const currentLapNum = buffer.readUInt8(offset); offset += 1;
    const pitStatus = buffer.readUInt8(offset); offset += 1;
    const sector = buffer.readUInt8(offset); offset += 1;
    const currentLapInvalid = buffer.readUInt8(offset); offset += 1;
    const penalties = buffer.readUInt8(offset); offset += 1;
    const gridPosition = buffer.readUInt8(offset); offset += 1;
    const driverStatus = buffer.readUInt8(offset); offset += 1;
    const resultStatus = buffer.readUInt8(offset); offset += 1;

    return {
        lastLapTime, currentLapTime, sector1TimeInMS, sector2TimeInMS,
        bestLapTime, bestLapNum, bestLapSector1TimeInMS, bestLapSector2TimeInMS, bestLapSector3TimeInMS,
        bestOverallSector1TimeInMS, bestOverallSector1LapNum, bestOverallSector2TimeInMS, bestOverallSector2LapNum,
        bestOverallSector3TimeInMS, bestOverallSector3LapNum,
        lapDistance, totalDistance, safetyCarDelta,
        carPosition, currentLapNum, pitStatus, sector, currentLapInvalid, penalties,
        gridPosition, driverStatus, resultStatus,
    };
}

export function parseLapDataPacket(buffer, header) {
    let offset = HEADER_SIZE;
    const cars = [];
    for (let i = 0; i < NUM_CARS; i++) {
        cars.push(parseSingleLapData(buffer, offset));
        offset += LAP_DATA_SIZE;
    }
    return { cars, playerCar: cars[header.playerCarIndex] };
}