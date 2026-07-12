import dgram from 'dgram';
import { parsePacketHeader } from './packetHeader.js';
import { parseCarTelemetryPacket } from './carTelemetryPacket.js';
import { parseCarStatusPacket } from './carStatusPacket.js';
import { parseLapDataPacket } from './lapDataPacket.js';
import { parseParticipantsPacket } from './participantsPacket.js';
import { PacketIds } from './packetIds.js';
import { raceState } from '../state/raceState.js';

export function startListener(port = 20777) {
    const socket = dgram.createSocket('udp4');

    socket.on('message', (buffer) => {
        const { header } = parsePacketHeader(buffer);

        switch (header.packetId) {
            case PacketIds.CAR_TELEMETRY:
                raceState.updateFromCarTelemetry(parseCarTelemetryPacket(buffer, header), header);
                break;
            case PacketIds.CAR_STATUS:
                raceState.updateFromCarStatus(parseCarStatusPacket(buffer, header), header);
                break;
            case PacketIds.LAP_DATA:
                raceState.updateFromLapData(parseLapDataPacket(buffer, header), header);
                break;
            case PacketIds.PARTICIPANTS:
                raceState.updateFromParticipants(parseParticipantsPacket(buffer), header);
                break;
        }
    });

    socket.on('error', (err) => console.error('UDP socket error:', err));

    socket.bind(port, () => {
        console.log(`Listening for F1 2020 telemetry on port ${port}...`);
    });

    return socket;
}