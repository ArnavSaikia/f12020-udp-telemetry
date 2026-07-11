// Parses the 24-byte header that starts every UDP packet.
// Returns { header, bytesRead } so callers know where the packet body starts.
export function parsePacketHeader(buffer) {
  let offset = 0;

  const packetFormat = buffer.readUInt16LE(offset); offset += 2;
  const gameMajorVersion = buffer.readUInt8(offset); offset += 1;
  const gameMinorVersion = buffer.readUInt8(offset); offset += 1;
  const packetVersion = buffer.readUInt8(offset); offset += 1;
  const packetId = buffer.readUInt8(offset); offset += 1;
  const sessionUID = buffer.readBigUInt64LE(offset); offset += 8;
  const sessionTime = buffer.readFloatLE(offset); offset += 4;
  const frameIdentifier = buffer.readUInt32LE(offset); offset += 4;
  const playerCarIndex = buffer.readUInt8(offset); offset += 1;
  const secondaryPlayerCarIndex = buffer.readUInt8(offset); offset += 1;

  const header = {
    packetFormat,
    gameMajorVersion,
    gameMinorVersion,
    packetVersion,
    packetId,
    sessionUID,
    sessionTime,
    frameIdentifier,
    playerCarIndex,
    secondaryPlayerCarIndex,
  };

  return { header, bytesRead: offset };
}