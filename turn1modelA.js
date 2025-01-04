// Base sensor component
class Sensor {
    constructor(id) {
        this.id = id;
    }

    readData() {
        // Simulate reading sensor data
        return Math.random(); // Replace with actual sensor read logic
    }
}

// A processing strategy
class DataProcessor {
    constructor(processingFn) {
        this.processingFn = processingFn; // This can be any processing algorithm, interchangeable
    }

    process(data) {
        return this.processingFn(data);
    }
}

// Specific processing implementations
const latencyModeling = (data) => {
    // Implement your latent variable model here
    return data * 2; // Placeholder transformation
};

const averageProcessor = (data) => {
    // Compute average if necessary
    return data.reduce((sum, val) => sum + val) / data.length;
};

// Using the composition together
class SmartGridMonitor {
    constructor() {
        this.sensors = [];
        this.dataProcessors = [];
    }

    addSensor(sensor) {
        this.sensors.push(sensor);
    }

    addProcessor(processor) {
        this.dataProcessors.push(processor);
    }

    runMonitoring() {
        setInterval(() => {
            const readings = this.sensors.map(sensor => sensor.readData());
            this.dataProcessors.forEach(processor => {
                const processedData = processor.process(readings);
                console.log(processedData); // Handle processed data accordingly
            });
        }, 1000); // Adjust for real-time requirements
    }
}

// Example usage
const monitor = new SmartGridMonitor();
monitor.addSensor(new Sensor('Sensor1'));
monitor.addProcessor(new DataProcessor(latencyModeling));
monitor.runMonitoring();
