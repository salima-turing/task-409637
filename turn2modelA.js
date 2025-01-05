// Base sensor component
class Sensor {
    constructor(id) {
        this.id = id;
    }

    readData() {
        // Simulate reading sensor data (dynamic data for example purposes)
        return Math.random() * 100; // Replace with actual sensor reading logic
    }
}

// Base processor class
class DataProcessor {
    constructor(nextProcessor) {
        this.nextProcessor = nextProcessor; // Reference to the next processing stage in the pipeline
    }

    process(data) {
        let processedData = this.processData(data);

        // If a next processor exists, pass the data along
        if (this.nextProcessor) {
            return this.nextProcessor.process(processedData);
        }
        return processedData;
    }

    processData(data) {
        throw new Error("Must be implemented in derived classes");
    }
}

// Noise Reduction via Moving Average
class NoiseReducer extends DataProcessor {
    constructor(windowSize = 3, nextProcessor = null) {
        super(nextProcessor);
        this.windowSize = windowSize;
        this.buffer = [];
    }

    processData(data) {
        this.buffer.push(...data);
        if (this.buffer.length > this.windowSize) {
            this.buffer.splice(0, this.buffer.length - this.windowSize);
        }

        // Apply moving average to reduce noise
        const reducedData = this.buffer.slice().map((val, index) => {
            const start = Math.max(0, index - this.windowSize + 1);
            const window = this.buffer.slice(start, index + 1);
            return window.reduce((sum, v) => sum + v, 0) / window.length;
        });

        return reducedData;
    }
}

// Trend Analysis via Simple Linear Regression
class TrendAnalyzer extends DataProcessor {
    processData(data) {
        // Perform linear regression to identify the trend
        const n = data.length;
        const sumX = Array.from({length: n}, (_, i) => i).reduce((sum, idx) => sum + idx, 0);
        const sumY = data.reduce((sum, val) => sum + val, 0);
        const sumXY = data.reduce((sum, val, idx) => sum + (idx * val), 0);
        const sumXX = data.reduce((sum, _, idx) => sum + (idx * idx), 0);

        // Calculate slope (m) and intercept (b)
        const m = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        const b = (sumY - m * sumX) / n;

        // Generate trend line data
        const trendLine = data.map((_, idx) => m * idx + b);
        return { trendLine, originalData: data };
    }
}

// Anomaly Detection based on Z-Score
class AnomalyDetector extends DataProcessor {
    processData(data) {
        const mean = data.originalData.reduce((sum, val) => sum + val, 0) / data.originalData.length;
        const stdDev = Math.sqrt(data.originalData.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.originalData.length);

        const anomalies = data.originalData.filter((value) => Math.abs((value - mean) / stdDev) > 3); // Z-score threshold
        return { originalData: data.originalData, trend: data.trendLine, anomalies };
    }
}

// Smart Grid Monitor Class
class SmartGridMonitor {
    constructor() {
        this.sensors = [];
        this.pipeline = null;
    }

    addSensor(sensor) {
        this.sensors.push(sensor);
    }

    setPipeline(processor) {
        this.pipeline = processor;
    }

    runMonitoring() {
        setInterval(() => {
            const readings = this.sensors.map(sensor => sensor.readData());

            // Pass the data through the pipeline
            if (this.pipeline) {
                const result = this.pipeline.process(readings);
                console.log(result);
            }
        }, 1000); // Adjust for real-time requirements
    }
}

// Example usage
const monitor = new SmartGridMonitor();
monitor.addSensor(new Sensor('Sensor1'));

// Build the processing pipeline
const pipeline = new NoiseReducer(5, new TrendAnalyzer(new AnomalyDetector()));
monitor.setPipeline(pipeline);
monitor.runMonitoring();
