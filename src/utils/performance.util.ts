export interface PerformanceMetrics {
  requestId: string;
  method: string;
  path: string;
  statusCode: number;
  duration: number;
  timestamp: string;
  memoryUsage: NodeJS.MemoryUsage;
}

export class PerformanceTracker {
  private static metrics: PerformanceMetrics[] = [];
  private static readonly MAX_METRICS = 1000;

  static recordMetric(metric: PerformanceMetrics): void {
    this.metrics.push(metric);
    if (this.metrics.length > this.MAX_METRICS) {
      this.metrics.shift();
    }
  }

  static getMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  static getAverageResponseTime(): number {
    if (this.metrics.length === 0) return 0;
    const sum = this.metrics.reduce((acc, m) => acc + m.duration, 0);
    return sum / this.metrics.length;
  }

  static getMetricsByEndpoint(path: string): PerformanceMetrics[] {
    console.log(path, "path", this.metrics)
    return this.metrics.filter(m => m.path === path);
  }

  static clearMetrics(): void {
    this.metrics = [];
  }

  static getSummary() {
    const totalRequests = this.metrics.length;
    const avgDuration = this.getAverageResponseTime();
    const statusCodes = this.metrics.reduce((acc, m) => {
      acc[m.statusCode] = (acc[m.statusCode] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    return {
      totalRequests,
      averageResponseTime: avgDuration,
      statusCodeDistribution: statusCodes,
      memoryUsage: process.memoryUsage(),
    };
  }
}