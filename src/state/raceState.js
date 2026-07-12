const NUM_CARS = 22;

function emptyCar() {
    return {
        telemetry: null,
        status: null,
        lapData: null,
        participant: null,
    };
}

class RaceState {
    constructor() {
        this.playerCarIndex = null;
        this.numActiveCars = null;
        this.cars = Array.from({ length: NUM_CARS }, emptyCar);
        this.session = null; // global session-level data, not per-car
    }

    updateFromCarTelemetry(parsedPacket, header) {
        this.playerCarIndex = header.playerCarIndex;
        parsedPacket.cars.forEach((carTelemetry, idx) => {
            this.cars[idx].telemetry = carTelemetry;
        });
    }

    updateFromCarStatus(parsedPacket, header) {
        this.playerCarIndex = header.playerCarIndex;
        parsedPacket.cars.forEach((carStatus, idx) => {
            this.cars[idx].status = carStatus;
        });
    }

    updateFromLapData(parsedPacket, header) {
        this.playerCarIndex = header.playerCarIndex;
        parsedPacket.cars.forEach((lapData, idx) => {
            this.cars[idx].lapData = lapData;
        });
    }

    updateFromParticipants(parsedPacket, header) {
        this.playerCarIndex = header.playerCarIndex;
        this.numActiveCars = parsedPacket.numActiveCars;
        parsedPacket.participants.forEach((participant, idx) => {
            this.cars[idx].participant = participant;
        });
    }

    updateFromSession(parsedPacket) {
        this.session = parsedPacket;
    }

    getPlayerCar() {
        if (this.playerCarIndex === null) return null;
        return this.cars[this.playerCarIndex];
    }

    getCarByIndex(idx) {
        return this.cars[idx] ?? null;
    }

    findCarByName(nameQuery) {
        const query = nameQuery.toLowerCase();
        const idx = this.cars.findIndex(
            (car) => car.participant && car.participant.name.toLowerCase().includes(query)
        );
        return idx === -1 ? null : { index: idx, car: this.cars[idx] };
    }

    getLeaderCar() {
        return this.cars.find((car) => car.lapData?.carPosition === 1) ?? null;
    }

    getRaceLapsRemaining() {
        if (!this.session) return null;
        const leaderLap = this.getLeaderCar()?.lapData?.currentLapNum;
        if (leaderLap == null) return null;
        return this.session.totalLaps - leaderLap;
    }

    getPlayerLapsRemaining() {
        if (!this.session) return null;
        const playerLap = this.getPlayerCar()?.lapData?.currentLapNum;
        if (playerLap == null) return null;
        return this.session.totalLaps - playerLap;
    }
}

//singleton instance for whole program to share
export const raceState = new RaceState();