'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Chart } from 'chart.js/auto';

interface LogEntry {
  timestamp: string;
  message: string;
  status?: number;
  duration?: number;
}

class LogProcessor {
  processLogLine(line: string): LogEntry | null {
    const timestampMatch = line.match(/\[(.*?)\]/);
    if (!timestampMatch) return null;

    const timestamp = timestampMatch[1];
    // Extract just the time portion HH:mm:ss
    const timeOnly = timestamp.split('T')[1]?.split('.')[0] || timestamp;
    const message = line.substring(line.indexOf(']') + 1).trim();

    const statusMatch = message.match(/(\d{3})/);
    const durationMatch = message.match(/in (\d+)ms/);

    return {
      timestamp: timeOnly,
      message: message,
      status: statusMatch ? parseInt(statusMatch[1]) : undefined,
      duration: durationMatch ? parseInt(durationMatch[1]) : undefined
    };
  }

  processLogData(rawData: string): LogEntry[] {
    return rawData
      .split('\n')
      .map(line => this.processLogLine(line))
      .filter((entry): entry is LogEntry => entry !== null);
  }
}

const GraficErori: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);
  const [logData, setLogData] = useState<LogEntry[]>([]);
  const logProcessor = new LogProcessor();

  useEffect(() => {
    const fetchLogData = async () => {
      try {
        const response = await fetch('/api/logs');
        const rawData = await response.text();
        const processedData = logProcessor.processLogData(rawData);
        setLogData(processedData);
      } catch (error) {
        console.error('Error fetching log data:', error);
      }
    };

    fetchLogData();
  }, []);

  useEffect(() => {
    if (logData.length > 0 && canvasRef.current) {
      if (chartRef.current) {
        chartRef.current.destroy();
      }

      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        chartRef.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels: logData.map(entry => entry.timestamp),
            datasets: [{
              label: 'Durata răspuns (ms)',
              data: logData.map(entry => entry.duration || 0),
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1
            }]
          },
          options: {
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: 'Grafic durată răspunsuri în timp'
              }
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Timp (HH:mm:ss)'
                },
                ticks: {
                  maxRotation: 45,
                  minRotation: 45
                }
              },
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Durată (ms)'
                }
              }
            }
          }
        });
      }
    }
  }, [logData]);

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};

export default GraficErori;
