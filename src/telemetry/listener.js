import dgram from 'dgram';
import { parsePacketHeader } from './packetHeader.js';
import { parseCarTelemetryPacket } from './carTelemetryPacket.js';
import { PacketIds } from './packetIds.js';

export function startListener(port = 20777) {
    const socket = dgram.createSocket('udp4');

    socket.on('message', (buffer) => {
        const { header } = parsePacketHeader(buffer);

        //if the packet type is for cars telemetries
        if (header.packetId === PacketIds.CAR_TELEMETRY) {
            const { playerCar } = parseCarTelemetryPacket(buffer, header);
            console.log(
                `Speed: ${playerCar.speed} km/h | Gear: ${playerCar.gear} | RPM: ${playerCar.engineRPM} | DRS: ${playerCar.drs ? 'open' : 'closed'}`
            );
        } else {
            console.log(`Packet ID ${header.packetId} (not parsed yet)`);
        }
    });

    socket.on('error', (err) => console.error('UDP socket error:', err));

    socket.bind(port, () => {
        console.log(`Listening for F1 2020 telemetry on port ${port}...`);
    });

    return socket;
}