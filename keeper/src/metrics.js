import http from "http";

export class MetricsServer {
  constructor(gasMonitor, logger) {
    this.gasMonitor = gasMonitor;
    this.logger = logger;
    this.port = parseInt(process.env.METRICS_PORT, 10) || 3000;
    this.server = null;
  }

  start() {
    this.server = http.createServer((req, res) => {
      if (req.url === "/metrics" || req.url === "/metrics/") {
        this.handleMetrics(res);
      } else {
        res.writeHead(404);
        res.end("Not Found");
      }
    });

    this.server.listen(this.port, () => {
      this.logger.info(`Metrics server running on port ${this.port}`);
    });
  }

  handleMetrics(res) {
    res.setHeader("Content-Type", "text/plain; version=0.0.4");

    const config = this.gasMonitor.getConfig();

    const metrics = [
      "# HELP soro_task_low_gas_count Number of tasks with low gas balance",
      "# TYPE soro_task_low_gas_count gauge",
      `soro_task_low_gas_count ${this.gasMonitor.getLowGasCount()}`,

      "# HELP soro_task_gas_warn_threshold Gas warning threshold",
      "# TYPE soro_task_gas_warn_threshold gauge",
      `soro_task_gas_warn_threshold ${config.gasWarnThreshold}`,

      "# HELP soro_task_alert_debounce_ms Alert debounce period",
      "# TYPE soro_task_alert_debounce_ms gauge",
      `soro_task_alert_debounce_ms ${config.alertDebounceMs}`,

      "# HELP soro_task_alert_webhook_enabled Webhook enabled",
      "# TYPE soro_task_alert_webhook_enabled gauge",
      `soro_task_alert_webhook_enabled ${config.alertWebhookEnabled ? 1 : 0}`,
    ];

    res.end(metrics.join("\n") + "\n");
  }

  stop() {
    if (this.server) {
      this.server.close();
    }
  }
}
