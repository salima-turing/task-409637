// Abstract Sensor class
class Sensor {
    constructor(type, data) {
        this.type = type;
        this.data = data;
    }

    getValue() {
        return this.data.value;
    }
}

// Concrete sensor classes (VoltageSensor and CurrentSensor) extending Sensor
class VoltageSensor extends Sensor {
    constructor(data) {
        super('voltage', data);
    }
}

class CurrentSensor extends Sensor {
    constructor(data) {
        super('current', data);
    }
}

// Latent Variable Model (LVM) class
class LatentVariableModel {
    constructor() {
        this.lastPrediction = null;
    }

    predict(sensorReading) {
        // Simple LVM prediction: Just store the last reading as the prediction
        this.lastPrediction = sensorReading.getValue();
        return this.lastPrediction;
    }

    getPrediction() {
        return this.lastPrediction;
    }
}

// Sensor Reader class
class SensorReader {
    constructor() {
        this.sensors = new Map();
        this.lvm = new LatentVariableModel();
    }

    addSensor(sensor) {
        // Add a sensor to the internal map using its type as the key
        this.sensors.set(sensor.type, sensor);
    }

    processSensorReading(reading) {
        // Process a new sensor reading
        const sensorType = reading.sensorType;
        const sensor = this.sensors.get(sensorType);

        if (sensor) {
            sensor.data = reading;
            const prediction = this.lvm.predict(sensor);
            console.log(`Prediction: ${prediction}`);
        } else {
            console.warn(`Sensor type '${sensorType}' not recognized.`);
        }
    }
}

const sensorReader = new SensorReader();

// Add voltage and current sensors
sensorReader.addSensor(new VoltageSensor({ sensorType: 'voltage', value: 120 }));
sensorReader.addSensor(new CurrentSensor({ sensorType: 'current', value: 10 }));
