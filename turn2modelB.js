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

class DataProcessor {
    constructor(dataProcessor) {
        this.dataProcessor = dataProcessor;
    }

    async process(data) {
        // Override this method in subclasses
        return data;
    }
}

class NoiseReductionProcessor extends DataProcessor {
    async process(data) {
        // Implement noise reduction logic here
        const smoothedData = data.map((reading) => {
            // Simple smoothing example
            return reading - (reading * 0.05);
        });

        return smoothedData;
    }
}

class TrendAnalysisProcessor extends DataProcessor {
    async process(data) {
        // Implement trend analysis logic here
        // For simplicity, let's just calculate the average
        const average = data.reduce((sum, reading) => sum + reading, 0) / data.length;

        return data.map((reading) => reading - average);
    }
}

class AnomalyDetectionProcessor extends DataProcessor {
    async process(data) {
        // Implement anomaly detection using statistical methods (e.g., Z-score)
        const mean = data.reduce((sum, reading) => sum + reading, 0) / data.length;
        const standardDeviation = Math.sqrt(
            data.reduce((sum, reading) => sum + Math.pow(reading - mean, 2), 0) / data.length
        );

        const anomalies = data.map((reading) => {
            const zScore = (reading - mean) / standardDeviation;
            // Define your anomaly threshold (e.g., 3 standard deviations)
            return Math.abs(zScore) > 3 ? 'Anomaly' : 'Normal';
        });

        return anomalies;
    }
}

class SmartGridMonitor {
    constructor() {
        this.sensors = [];
        this.dataProcessingPipeline = [
            new NoiseReductionProcessor(),
            new TrendAnalysisProcessor(),
            new AnomalyDetectionProcessor(),
        ];
    }

    addSensor(sensor) {
        this.sensors.push(sensor);
    }

    async runMonitoring() {
        setInterval(async () => {
            const readings = this.sensors.map(sensor => sensor.readData());
            const processedData = await this.processData(readings);
            console.log(processedData); // Handle processed data accordingly
        }, 1000); // Adjust for real-time requirements
    }

    async processData(data) {
        for (const processor of this.dataProcessingPipeline) {
            data = await processor.process(data);
        }
        return data;
    }
}

const monitor = new SmartGridMonitor();
monitor.addSensor(new Sensor('Sensor1'));
monitor.addSensor(new Sensor('Sensor2'));
monitor.runMonitoring();
