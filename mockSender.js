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

const socket = dgram.createSocket('udp4');
const packet = buildFakeCarTelemetryPacket();

socket.send(packet, 20777, '127.0.0.1', (err) => {
    if (err) console.error('Send failed:', err);
    else console.log(`Sent fake Car Telemetry packet (${packet.length} bytes).`);
    socket.close();
});