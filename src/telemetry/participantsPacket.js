import { HEADER_SIZE } from './packetHeader.js';

const PARTICIPANT_SIZE = 54;
const NUM_CARS = 22;

// names stored as fixed 48-byte null-terminated strings.
// read the raw bytes, find the null terminator and decode only up to that point.
function readFixedString(buffer, offset, length) {
    const bytes = buffer.subarray(offset, offset + length);
    const nullIndex = bytes.indexOf(0);
    const trimmed = nullIndex === -1 ? bytes : bytes.subarray(0, nullIndex);
    return trimmed.toString('utf8');
}

function parseSingleParticipant(buffer, offset) {
    const aiControlled = buffer.readUInt8(offset); offset += 1;
    const driverId = buffer.readUInt8(offset); offset += 1;
    const teamId = buffer.readUInt8(offset); offset += 1;
    const raceNumber = buffer.readUInt8(offset); offset += 1;
    const nationality = buffer.readUInt8(offset); offset += 1;
    const name = readFixedString(buffer, offset, 48); offset += 48;
    const yourTelemetry = buffer.readUInt8(offset); offset += 1;

    return { aiControlled, driverId, teamId, raceNumber, nationality, name, yourTelemetry };
}

export function parseParticipantsPacket(buffer) {
    let offset = HEADER_SIZE;
    const numActiveCars = buffer.readUInt8(offset); offset += 1;

    const participants = [];
    for (let i = 0; i < NUM_CARS; i++) {
        participants.push(parseSingleParticipant(buffer, offset));
        offset += PARTICIPANT_SIZE;
    }

    return { numActiveCars, participants };
}