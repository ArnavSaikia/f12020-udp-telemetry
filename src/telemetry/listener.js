import dgram from 'dgram';
import { parsePacketHeader } from './packetHeader.js';

export function startListener(port = 20777) {
    const socket = dgram.createSocket('udp4');

    socket.on('message', (buffer) => {
        const { header } = parsePacketHeader(buffer);
        console.log(
            `Packet ID ${header.packetId} | frame ${header.frameIdentifier} | session time ${header.sessionTime.toFixed(2)}s`
        );
    });

    socket.on('error', (err) => {
        console.error('UDP socket error:', err);
    });

    socket.bind(port, () => {
        console.log(`Listening for F1 2020 telemetry on port ${port}...`);
    });

    return socket;
}