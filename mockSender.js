// mockSender.js
import dgram from 'dgram';

const HEADER_SIZE = 24;
const CAR_TELEMETRY_SIZE = 58;
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

// Writes one car's telemetry. `values` overrides defaults (all zero) for fields we care about.
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

function buildFakeCarTelemetryPacket() {
    const totalSize = HEADER_SIZE + CAR_TELEMETRY_SIZE * NUM_CARS + 7;
    const buf = Buffer.alloc(totalSize);

    let offset = writeHeader(buf, 0, 6); // 6 = Car Telemetry

    // Car 0 = the player. Give it realistic mid-race values.
    offset = writeCarTelemetry(buf, offset, {
        speed: 287,
        throttle: 1.0,
        gear: 6,
        engineRPM: 11800,
        drs: 1,
        tyresSurfaceTemperature: [98, 97, 102, 101], // fronts hotter than rears
    });

    // Cars 1-21: all zeros, we don't care about them yet.
    for (let i = 1; i < NUM_CARS; i++) {
        offset = writeCarTelemetry(buf, offset);
    }

    // Trailing fields
    buf.writeUInt32LE(0, offset); offset += 4; // buttonStatus
    buf.writeUInt8(255, offset); offset += 1;  // mfdPanelIndex
    buf.writeUInt8(255, offset); offset += 1;  // mfdPanelIndexSecondaryPlayer
    buf.writeInt8(6, offset); offset += 1;     // suggestedGear

    return buf;
}

// mockSender.js — add alongside the Car Telemetry builder
const CAR_STATUS_SIZE = 60;

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

function buildFakeCarStatusPacket() {
    const totalSize = HEADER_SIZE + CAR_STATUS_SIZE * NUM_CARS;
    const buf = Buffer.alloc(totalSize);

    let offset = writeHeader(buf, 0, 7); // 7 = Car Status

    offset = writeCarStatus(buf, offset); // car 0 = player, using the realistic defaults above

    for (let i = 1; i < NUM_CARS; i++) {
        offset = writeCarStatus(buf, offset);
    }

    return buf;
}

// Send both packet types to exercise the listener fully:
const socket = dgram.createSocket('udp4');

const telemetryPacket = buildFakeCarTelemetryPacket();
socket.send(telemetryPacket, 20777, '127.0.0.1');

const statusPacket = buildFakeCarStatusPacket();
socket.send(statusPacket, 20777, '127.0.0.1', (err) => {
    if (err) console.error('Send failed:', err);
    else console.log('Sent fake Car Telemetry + Car Status packets.');
    socket.close();
});