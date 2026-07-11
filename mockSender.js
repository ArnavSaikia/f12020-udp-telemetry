// mockSender.js
import dgram from 'dgram';

function buildFakeHeaderPacket() {
    const buf = Buffer.alloc(24);
    let offset = 0;

    buf.writeUInt16LE(2020, offset); offset += 2;       // packetFormat
    buf.writeUInt8(1, offset); offset += 1;              // gameMajorVersion
    buf.writeUInt8(27, offset); offset += 1;             // gameMinorVersion
    buf.writeUInt8(1, offset); offset += 1;              // packetVersion
    buf.writeUInt8(6, offset); offset += 1;              // packetId (6 = Car Telemetry)
    buf.writeBigUInt64LE(123456789n, offset); offset += 8; // sessionUID
    buf.writeFloatLE(12.5, offset); offset += 4;         // sessionTime
    buf.writeUInt32LE(42, offset); offset += 4;          // frameIdentifier
    buf.writeUInt8(0, offset); offset += 1;              // playerCarIndex
    buf.writeUInt8(255, offset); offset += 1;            // secondaryPlayerCarIndex

    return buf;
}

const socket = dgram.createSocket('udp4');
const packet = buildFakeHeaderPacket();

socket.send(packet, 20777, '127.0.0.1', (err) => {
    if (err) console.error('Send failed:', err);
    else console.log('Sent fake header packet.');
    socket.close();
});