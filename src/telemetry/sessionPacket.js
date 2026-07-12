import { HEADER_SIZE } from './packetHeader.js';

const NUM_MARSHAL_ZONES = 21;
const NUM_WEATHER_SAMPLES = 20;

function parseMarshalZone(buffer, offset) {
    const zoneStart = buffer.readFloatLE(offset); offset += 4;
    const zoneFlag = buffer.readInt8(offset); offset += 1;
    return { zoneStart, zoneFlag };
}

function parseWeatherForecastSample(buffer, offset) {
    const sessionType = buffer.readUInt8(offset); offset += 1;
    const timeOffset = buffer.readUInt8(offset); offset += 1;
    const weather = buffer.readUInt8(offset); offset += 1;
    const trackTemperature = buffer.readInt8(offset); offset += 1;
    const airTemperature = buffer.readInt8(offset); offset += 1;
    return { sessionType, timeOffset, weather, trackTemperature, airTemperature };
}

export function parseSessionPacket(buffer) {
    let offset = HEADER_SIZE;

    const weather = buffer.readUInt8(offset); offset += 1;
    const trackTemperature = buffer.readInt8(offset); offset += 1;
    const airTemperature = buffer.readInt8(offset); offset += 1;
    const totalLaps = buffer.readUInt8(offset); offset += 1;
    const trackLength = buffer.readUInt16LE(offset); offset += 2;
    const sessionType = buffer.readUInt8(offset); offset += 1;
    const trackId = buffer.readInt8(offset); offset += 1;
    const formula = buffer.readUInt8(offset); offset += 1;
    const sessionTimeLeft = buffer.readUInt16LE(offset); offset += 2;
    const sessionDuration = buffer.readUInt16LE(offset); offset += 2;
    const pitSpeedLimit = buffer.readUInt8(offset); offset += 1;
    const gamePaused = buffer.readUInt8(offset); offset += 1;
    const isSpectating = buffer.readUInt8(offset); offset += 1;
    const spectatorCarIndex = buffer.readUInt8(offset); offset += 1;
    const sliProNativeSupport = buffer.readUInt8(offset); offset += 1;
    const numMarshalZones = buffer.readUInt8(offset); offset += 1;

    const marshalZones = [];
    for (let i = 0; i < NUM_MARSHAL_ZONES; i++) {
        marshalZones.push(parseMarshalZone(buffer, offset));
        offset += 5; // float (4) + int8 (1)
    }

    const safetyCarStatus = buffer.readUInt8(offset); offset += 1;
    const networkGame = buffer.readUInt8(offset); offset += 1;
    const numWeatherForecastSamples = buffer.readUInt8(offset); offset += 1;

    const weatherForecastSamples = [];
    for (let i = 0; i < NUM_WEATHER_SAMPLES; i++) {
        weatherForecastSamples.push(parseWeatherForecastSample(buffer, offset));
        offset += 5; // 3×uint8 + 2×int8
    }

    return {
        weather,
        trackTemperature,
        airTemperature,
        totalLaps,
        trackLength,
        sessionType,
        trackId,
        formula,
        sessionTimeLeft,
        sessionDuration,
        pitSpeedLimit,
        gamePaused,
        isSpectating,
        spectatorCarIndex,
        sliProNativeSupport,
        safetyCarStatus,
        networkGame,
        // Only the first N entries are meaningful; the rest are unused array slots.
        marshalZones: marshalZones.slice(0, numMarshalZones),
        weatherForecastSamples: weatherForecastSamples.slice(0, numWeatherForecastSamples),
    };
}