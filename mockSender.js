import dgram from 'dgram';

const HEADER_SIZE = 24;
const CAR_TELEMETRY_SIZE = 58;
const CAR_STATUS_SIZE = 60;
const LAP_DATA_SIZE = 53;
const PARTICIPANT_SIZE = 54;
const NUM_CARS = 22;

function writeHeader(buf, offset, packetId) {
    buf.writeUInt16LE(2020, offset); offset += 2;
    buf.writeUInt8(1, offset); offset += 1;
    buf.writeUInt8(27, offset); offset += 1;
    buf.writeUInt8(1, offset); offset += 1;
    buf.writeUInt8(packetId, offset); offset += 1;
    buf.writeBigUInt64LE(123456789n, offset); offset += 8;
    buf.writeFloatLE(12.5, offset); offset += 4;
    buf.writeUInt32LE(42, offset); offset += 4;
    buf.writeUInt8(0, offset); offset += 1; // playerCarIndex = 0
    buf.writeUInt8(255, offset); offset += 1;
    return offset;
}

function writeCarTelemetry(buf, offset, values = {}) {
    const v = {
        speed: 0, throttle: 0, steer: 0, brake: 0, clutch: 0, gear: 0,
        engineRPM: 0, drs: 0, revLightsPercent: 0,
        brakesTemperature: [0, 0, 0, 0],
        tyresSurfaceTemperature: [0, 0, 0, 0],
        tyresInnerTemperature: [0, 0, 0, 0],
        engineTemperature: 0,
        tyresPressure: [0, 0, 0, 0],
        surfaceType: [0, 0, 0, 0],
        ...values,
    };
    buf.writeUInt16LE(v.speed, offset); offset += 2;
    buf.writeFloatLE(v.throttle, offset); offset += 4;
    buf.writeFloatLE(v.steer, offset); offset += 4;
    buf.writeFloatLE(v.brake, offset); offset += 4;
    buf.writeUInt8(v.clutch, offset); offset += 1;
    buf.writeInt8(v.gear, offset); offset += 1;
    buf.writeUInt16LE(v.engineRPM, offset); offset += 2;
    buf.writeUInt8(v.drs, offset); offset += 1;
    buf.writeUInt8(v.revLightsPercent, offset); offset += 1;
    for (const t of v.brakesTemperature) { buf.writeUInt16LE(t, offset); offset += 2; }
    for (const t of v.tyresSurfaceTemperature) { buf.writeUInt8(t, offset); offset += 1; }
    for (const t of v.tyresInnerTemperature) { buf.writeUInt8(t, offset); offset += 1; }
    buf.writeUInt16LE(v.engineTemperature, offset); offset += 2;
    for (const p of v.tyresPressure) { buf.writeFloatLE(p, offset); offset += 4; }
    for (const s of v.surfaceType) { buf.writeUInt8(s, offset); offset += 1; }
    return offset;
}

function writeCarStatus(buf, offset, values = {}) {
    const v = {
        tractionControl: 0, antiLockBrakes: 1, fuelMix: 1, frontBrakeBias: 55, pitLimiterStatus: 0,
        fuelInTank: 45.2, fuelCapacity: 110, fuelRemainingLaps: 8.4,
        maxRPM: 12000, idleRPM: 4000, maxGears: 8, drsAllowed: 1, drsActivationDistance: 0,
        tyresWear: [22, 21, 25, 24],
        actualTyreCompound: 16, tyreVisualCompound: 16, tyresAgeLaps: 12,
        tyresDamage: [0, 0, 0, 0],
        frontLeftWingDamage: 0, frontRightWingDamage: 0, rearWingDamage: 0,
        drsFault: 0, engineDamage: 0, gearBoxDamage: 0, vehicleFiaFlags: 0,
        ersStoreEnergy: 2400000, ersDeployMode: 2,
        ersHarvestedThisLapMGUK: 0, ersHarvestedThisLapMGUH: 0, ersDeployedThisLap: 0,
        ...values,
    };
    buf.writeUInt8(v.tractionControl, offset); offset += 1;
    buf.writeUInt8(v.antiLockBrakes, offset); offset += 1;
    buf.writeUInt8(v.fuelMix, offset); offset += 1;
    buf.writeUInt8(v.frontBrakeBias, offset); offset += 1;
    buf.writeUInt8(v.pitLimiterStatus, offset); offset += 1;
    buf.writeFloatLE(v.fuelInTank, offset); offset += 4;
    buf.writeFloatLE(v.fuelCapacity, offset); offset += 4;
    buf.writeFloatLE(v.fuelRemainingLaps, offset); offset += 4;
    buf.writeUInt16LE(v.maxRPM, offset); offset += 2;
    buf.writeUInt16LE(v.idleRPM, offset); offset += 2;
    buf.writeUInt8(v.maxGears, offset); offset += 1;
    buf.writeUInt8(v.drsAllowed, offset); offset += 1;
    buf.writeUInt16LE(v.drsActivationDistance, offset); offset += 2;
    for (const w of v.tyresWear) { buf.writeUInt8(w, offset); offset += 1; }
    buf.writeUInt8(v.actualTyreCompound, offset); offset += 1;
    buf.writeUInt8(v.tyreVisualCompound, offset); offset += 1;
    buf.writeUInt8(v.tyresAgeLaps, offset); offset += 1;
    for (const d of v.tyresDamage) { buf.writeUInt8(d, offset); offset += 1; }
    buf.writeUInt8(v.frontLeftWingDamage, offset); offset += 1;
    buf.writeUInt8(v.frontRightWingDamage, offset); offset += 1;
    buf.writeUInt8(v.rearWingDamage, offset); offset += 1;
    buf.writeUInt8(v.drsFault, offset); offset += 1;
    buf.writeUInt8(v.engineDamage, offset); offset += 1;
    buf.writeUInt8(v.gearBoxDamage, offset); offset += 1;
    buf.writeInt8(v.vehicleFiaFlags, offset); offset += 1;
    buf.writeFloatLE(v.ersStoreEnergy, offset); offset += 4;
    buf.writeUInt8(v.ersDeployMode, offset); offset += 1;
    buf.writeFloatLE(v.ersHarvestedThisLapMGUK, offset); offset += 4;
    buf.writeFloatLE(v.ersHarvestedThisLapMGUH, offset); offset += 4;
    buf.writeFloatLE(v.ersDeployedThisLap, offset); offset += 4;
    return offset;
}

function writeLapData(buf, offset, values = {}) {
    const v = {
        lastLapTime: 92.4, currentLapTime: 45.1, sector1TimeInMS: 28000, sector2TimeInMS: 31000,
        bestLapTime: 91.8, bestLapNum: 8,
        bestLapSector1TimeInMS: 27500, bestLapSector2TimeInMS: 30500, bestLapSector3TimeInMS: 33800,
        bestOverallSector1TimeInMS: 27400, bestOverallSector1LapNum: 5,
        bestOverallSector2TimeInMS: 30400, bestOverallSector2LapNum: 6,
        bestOverallSector3TimeInMS: 33700, bestOverallSector3LapNum: 7,
        lapDistance: 2100.5, totalDistance: 18400.2, safetyCarDelta: 0,
        carPosition: 5, currentLapNum: 12, pitStatus: 0, sector: 1,
        currentLapInvalid: 0, penalties: 0, gridPosition: 6, driverStatus: 4, resultStatus: 2,
        ...values,
    };
    buf.writeFloatLE(v.lastLapTime, offset); offset += 4;
    buf.writeFloatLE(v.currentLapTime, offset); offset += 4;
    buf.writeUInt16LE(v.sector1TimeInMS, offset); offset += 2;
    buf.writeUInt16LE(v.sector2TimeInMS, offset); offset += 2;
    buf.writeFloatLE(v.bestLapTime, offset); offset += 4;
    buf.writeUInt8(v.bestLapNum, offset); offset += 1;
    buf.writeUInt16LE(v.bestLapSector1TimeInMS, offset); offset += 2;
    buf.writeUInt16LE(v.bestLapSector2TimeInMS, offset); offset += 2;
    buf.writeUInt16LE(v.bestLapSector3TimeInMS, offset); offset += 2;
    buf.writeUInt16LE(v.bestOverallSector1TimeInMS, offset); offset += 2;
    buf.writeUInt8(v.bestOverallSector1LapNum, offset); offset += 1;
    buf.writeUInt16LE(v.bestOverallSector2TimeInMS, offset); offset += 2;
    buf.writeUInt8(v.bestOverallSector2LapNum, offset); offset += 1;
    buf.writeUInt16LE(v.bestOverallSector3TimeInMS, offset); offset += 2;
    buf.writeUInt8(v.bestOverallSector3LapNum, offset); offset += 1;
    buf.writeFloatLE(v.lapDistance, offset); offset += 4;
    buf.writeFloatLE(v.totalDistance, offset); offset += 4;
    buf.writeFloatLE(v.safetyCarDelta, offset); offset += 4;
    buf.writeUInt8(v.carPosition, offset); offset += 1;
    buf.writeUInt8(v.currentLapNum, offset); offset += 1;
    buf.writeUInt8(v.pitStatus, offset); offset += 1;
    buf.writeUInt8(v.sector, offset); offset += 1;
    buf.writeUInt8(v.currentLapInvalid, offset); offset += 1;
    buf.writeUInt8(v.penalties, offset); offset += 1;
    buf.writeUInt8(v.gridPosition, offset); offset += 1;
    buf.writeUInt8(v.driverStatus, offset); offset += 1;
    buf.writeUInt8(v.resultStatus, offset); offset += 1;
    return offset;
}

function writeParticipant(buf, offset, values = {}) {
    const v = {
        aiControlled: 1, driverId: 255, teamId: 0, raceNumber: 0, nationality: 0,
        name: '', yourTelemetry: 1,
        ...values,
    };
    buf.writeUInt8(v.aiControlled, offset); offset += 1;
    buf.writeUInt8(v.driverId, offset); offset += 1;
    buf.writeUInt8(v.teamId, offset); offset += 1;
    buf.writeUInt8(v.raceNumber, offset); offset += 1;
    buf.writeUInt8(v.nationality, offset); offset += 1;
    buf.write(v.name, offset, 'utf8'); // remaining bytes in the 48-byte field stay zero (buffer pre-zeroed)
    offset += 48;
    buf.writeUInt8(v.yourTelemetry, offset); offset += 1;
    return offset;
}

function buildCarTelemetryPacket() {
    const totalSize = HEADER_SIZE + CAR_TELEMETRY_SIZE * NUM_CARS + 7;
    const buf = Buffer.alloc(totalSize);
    let offset = writeHeader(buf, 0, 6);
    offset = writeCarTelemetry(buf, offset, { speed: 287, gear: 6, engineRPM: 11800, drs: 1 });
    for (let i = 1; i < NUM_CARS; i++) offset = writeCarTelemetry(buf, offset);
    buf.writeUInt32LE(0, offset); offset += 4;
    buf.writeUInt8(255, offset); offset += 1;
    buf.writeUInt8(255, offset); offset += 1;
    buf.writeInt8(6, offset); offset += 1;
    return buf;
}

function buildCarStatusPacket() {
    const totalSize = HEADER_SIZE + CAR_STATUS_SIZE * NUM_CARS;
    const buf = Buffer.alloc(totalSize);
    let offset = writeHeader(buf, 0, 7);
    offset = writeCarStatus(buf, offset);
    for (let i = 1; i < NUM_CARS; i++) offset = writeCarStatus(buf, offset);
    return buf;
}

function buildLapDataPacket() {
    const totalSize = HEADER_SIZE + LAP_DATA_SIZE * NUM_CARS;
    const buf = Buffer.alloc(totalSize);
    let offset = writeHeader(buf, 0, 2);
    // Player (car 0): P5. Car 3 (Hamilton): P2.
    offset = writeLapData(buf, offset, { carPosition: 5, currentLapNum: 12 });
    for (let i = 1; i < NUM_CARS; i++) {
        const overrides = i === 3 ? { carPosition: 2, currentLapNum: 12 } : {};
        offset = writeLapData(buf, offset, overrides);
    }
    return buf;
}

function buildParticipantsPacket() {
    const totalSize = HEADER_SIZE + 1 + PARTICIPANT_SIZE * NUM_CARS;
    const buf = Buffer.alloc(totalSize);
    let offset = writeHeader(buf, 0, 4);
    buf.writeUInt8(20, offset); offset += 1; // numActiveCars

    offset = writeParticipant(buf, offset, { aiControlled: 0, name: 'You' }); // car 0 = player
    for (let i = 1; i < NUM_CARS; i++) {
        const overrides = i === 3 ? { name: 'Lewis Hamilton', teamId: 0 } : { name: `AI Driver ${i}` };
        offset = writeParticipant(buf, offset, overrides);
    }
    return buf;
}

const socket = dgram.createSocket('udp4');

const packets = [
    buildCarTelemetryPacket(),
    buildCarStatusPacket(),
    buildLapDataPacket(),
    buildParticipantsPacket(),
];

let sent = 0;
for (const packet of packets) {
    socket.send(packet, 20777, '127.0.0.1', (err) => {
        sent += 1;
        if (err) console.error('Send failed:', err);
        if (sent === packets.length) {
            console.log(`Sent ${packets.length} fake packets (telemetry, status, lap data, participants).`);
            socket.close();
        }
    });
}