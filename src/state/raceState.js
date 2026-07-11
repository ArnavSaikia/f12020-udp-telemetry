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
        this.cars = Array.from({ length: NUM_CARS }, emptyCar);
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

    getPlayerCar() {
        if (this.playerCarIndex === null) return null;
        return this.cars[this.playerCarIndex];
    }

    getCarByIndex(idx) {
        return this.cars[idx] ?? null;
    }
}

// Singleton: one shared instance the whole app reads/writes.
export const raceState = new RaceState();