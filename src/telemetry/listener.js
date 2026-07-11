import dgram from 'dgram';
import { parsePacketHeader } from './packetHeader.js';
import { parseCarTelemetryPacket } from './carTelemetryPacket.js';
import { parseCarStatusPacket } from './carStatusPacket.js';
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
        } 
        
        // car statuses
        else if (header.packetId === PacketIds.CAR_STATUS) {
            const { playerCar } = parseCarStatusPacket(buffer, header);
            console.log(
                `Fuel: ${playerCar.fuelInTank.toFixed(1)}kg (${playerCar.fuelRemainingLaps.toFixed(1)} laps left) | Tyre wear: [${playerCar.tyresWear.join(', ')}]% | ERS: ${(playerCar.ersStoreEnergy / 1000).toFixed(0)}kJ`
            );
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