import * as opentelemetry from "@opentelemetry/sdk-node";
import { BatchSpanProcessor, ConsoleSpanExporter } from "@opentelemetry/sdk-trace-base";
import { Resource } from "@opentelemetry/resources";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { diag, DiagConsoleLogger, DiagLogLevel, metrics } from "@opentelemetry/api";
import { ConsoleMetricExporter, MeterProvider, PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics";

console.log("---------------------------------------------------------------")
console.log(process.env.OTEL_EXPORTER_OTLP_ENDPOINT, process.env.OTEL_EXPORTER_OTLP_HEADERS)

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

// configure the SDK to export telemetry data to the console
// enable all auto-instrumentations from the meta package
const traceExporter = new ConsoleSpanExporter();

const resource = new Resource({
  [SemanticResourceAttributes.SERVICE_NAME]: "demo-webapp",
  [SemanticResourceAttributes.SERVICE_VERSION]: "0.1.0",
})
const sdk = new opentelemetry.NodeSDK({
  resource,
  traceExporter,
  instrumentations: [getNodeAutoInstrumentations()]
});

// initialize the SDK and register with the OpenTelemetry API
// this enables the API to record telemetry
sdk.start()
  .then(() => console.log('Tracing initialized'))
  .catch((error) => console.log('Error initializing tracing', error));

// gracefully shut down the SDK on process exit
process.on('SIGTERM', () => {
  sdk.shutdown()
    .then(() => console.log('Tracing terminated'))
    .catch((error) => console.log('Error terminating tracing', error))
    .finally(() => process.exit(0));
});

// Configure metrics

const metricReader = new PeriodicExportingMetricReader({
  exporter: new ConsoleMetricExporter(),

  // Default is 60000ms (60 seconds). Set to 3 seconds for demonstrative purposes only.
  exportIntervalMillis: 3000,
});

const myServiceMeterProvider = new MeterProvider({
  resource: resource,
});

myServiceMeterProvider.addMetricReader(metricReader);
metrics.setGlobalMeterProvider(myServiceMeterProvider)


// // Configure tracer
// const provider = new NodeTracerProvider({
//   resource: resource,
// });
// const exporter = new ConsoleSpanExporter();
// const processor = new BatchSpanProcessor(exporter);
// provider.addSpanProcessor(processor);

// provider.register();

export default sdk;