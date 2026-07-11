import dgram from 'dgram';
import { parsePacketHeader } from './packetHeader.js';
import { parseCarTelemetryPacket } from './carTelemetryPacket.js';
import { parseCarStatusPacket } from './carStatusPacket.js';
import { PacketIds } from './packetIds.js';
import { raceState } from '../state/raceState.js';

export function startListener(port = 20777) {
    const socket = dgram.createSocket('udp4');

    socket.on('message', (buffer) => {
        const { header } = parsePacketHeader(buffer);

        //if the packet type is for cars telemetries
        if (header.packetId === PacketIds.CAR_TELEMETRY) {
            const parsed = parseCarTelemetryPacket(buffer, header);
            raceState.updateFromCarTelemetry(parsed, header);
        } 
        
        //car statuses
        else if (header.packetId === PacketIds.CAR_STATUS) {
            const parsed = parseCarStatusPacket(buffer, header);
            raceState.updateFromCarStatus(parsed, header);
        }
        
        else {
            console.log(`Packet ID ${header.packetId} (not parsed yet)`);
        }
    });

    socket.on('error', (err) => console.error('UDP socket error:', err));

    socket.bind(port, () => {
        console.log(`Listening for F1 2020 telemetry on port ${port}...`);
    });

    return socket;
}