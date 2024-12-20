'use client';
// Importarea componentelor necesare
import React, { useEffect, useRef, useState } from 'react';
import { Chart } from 'chart.js/auto';
// Interfața pentru un entry de log
interface LogEntry {
  timestamp: string;
  message: string;
}

// Interfața pentru datele de log sub formă de arbore
interface TreeData {
  [date: string]: {
    [time: string]: string[];
  };
}
// Procesarea datelor de log brute și returnarea unui array de obiecte cu timestamp și logEntries
class LogProcessor {
  processLogLine(line: string): LogEntry[] {
    const logEntries: LogEntry[] = [];
    const regex = /"timestamp":"\[(.*?)\](.*?)"/g;
    let match;
    while ((match = regex.exec(line)) !== null) {
      const timestamp = match[1];
      const message = match[2].trim();
      logEntries.push({ timestamp, message });
    }
    return logEntries;
  }

  processLogData(rawData: string): { timestamp: string, logEntries: LogEntry[] }[] {
    const sections = rawData.split('Starting...');
    return sections.map(section => {
      const logEntries = this.processLogLine(section);
      const timestampMatch = section.match(/\[([^\]]+)\]/);
      const timestamp = timestampMatch ? timestampMatch[1] : 'Unknown';
      return { timestamp, logEntries };
    });
  }
  // Obținerea datelor de log sub formă de arbore
  getTreeData(logData: LogEntry[]): TreeData {
    const treeData: TreeData = {};
    logData.forEach(entry => {
      const parts = entry.timestamp.split('T');
      const date = parts[0];
      const time = parts[1].split('.')[0];
      if (!treeData[date]) {
        treeData[date] = {};
      }
      if (!treeData[date][time]) {
        treeData[date][time] = [];
      }
      treeData[date][time].push(entry.message);
    });
    return treeData;
  }
}

// Funcția principală a graficului de erori
const GraficErori: React.FC = () => {
  // Obținerea referinței la canvas-ul graficului
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Obținerea referinței la graficul Chart.js
  const chartRef = useRef<Chart | null>(null);
  // Starea datelor de log
  const [logData, setLogData] = useState<{ timestamp: string, logEntries: LogEntry[] }[]>([]);
  // Starea datelor de log brute
  const [rawLogData, setRawLogData] = useState<string>('');
  // Starea tab-ului activ
  const [activeTab, setActiveTab] = useState<number>(0);
  // Instanța clasei LogProcessor
  const logProcessor = new LogProcessor();

  // Efect pentru obținerea datelor de log la încărcarea componentei

  useEffect(() => {
    const fetchLogData = async () => {
      try {
        const response = await fetch('/api/logs');
        const rawData = await response.text();
        setRawLogData(rawData);
        const processedData = logProcessor.processLogData(rawData);
        setLogData(processedData);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Error fetching log data:', errorMessage);
      }
    };

    fetchLogData();
  }, []);
 // Efect pentru actualizarea graficului la schimbarea datelor de log
  useEffect(() => {
    if (logData.length > 0 && canvasRef.current) {
      if (chartRef.current) {
        chartRef.current.destroy();
      }

      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        const treeData = logProcessor.getTreeData(logData[activeTab].logEntries);

        console.log('Tree data:', treeData);

        const labels = Object.keys(treeData).flatMap(date => Object.keys(treeData[date]).map(time => `${date} ${time}`));
        const data = labels.map(label => {
          const [date, time] = label.split(' ');
          const messages = treeData[date]?.[time] || [];
          return messages.length;
        });
        const backgroundColors = labels.map(label => {
          const [date, time] = label.split(' ');
          const messages = treeData[date]?.[time] || [];
          return messages.some(msg => msg.includes('GET')) ? 'rgba(255, 99, 132, 0.2)' : 'rgba(75, 192, 192, 0.2)';
        });
        const borderColors = labels.map(label => {
          const [date, time] = label.split(' ');
          const messages = treeData[date]?.[time] || [];
          return messages.some(msg => msg.includes('GET')) ? 'rgba(255, 99, 132, 1)' : 'rgba(75, 192, 192, 1)';
        });
        const messageLabels = labels.map(label => {
          const [date, time] = label.split(' ');
          const messages = treeData[date]?.[time] || [];
          const getMessages = messages.filter(msg => msg.includes('GET'));
          return getMessages.length > 0 ? getMessages.join('\n') : 'Other';
        });

        chartRef.current = new Chart(ctx, {
          type: 'bar',
          data: {
            labels,
            datasets: [
              {
                label: 'Număr mesaje',
                data,
                backgroundColor: backgroundColors,
                borderColor: borderColors,
                borderWidth: 1
              }
            ]
          },
          options: {
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: `Grafic timestamp-uri - ${logData[activeTab].timestamp}`
              },
              tooltip: {
                callbacks: {
                  label: function (context) {
                    return messageLabels[context.dataIndex];
                  }
                }
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
                  text: 'Număr mesaje'
                }
              }
            }
          }
        });
      }
    }
  }, [logData, activeTab]);

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="tabs">
        {logData.map((section, index) => (
          <button
            key={index}
            className={`tab ${activeTab === index ? 'active' : ''}`}
            onClick={() => setActiveTab(index)}
          >
            {section.timestamp}
          </button>
        ))}
      </div>
      <div className="tab-content">
        <canvas ref={canvasRef}></canvas>
      </div>
      <div className="mt-4">
        <h2>Log Data</h2>
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th className="px-4 py-2">Timestamp</th>
              <th className="px-4 py-2">Message</th>
            </tr>
          </thead>
          <tbody>
            {logData.flatMap(section => section.logEntries).map((event, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{event.timestamp}</td>
                <td className="border px-4 py-2">{event.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4">
        <h2>Raw Log Data</h2>
        <pre className="bg-gray-100 p-4 border">{rawLogData}</pre>
      </div>
    </div>
  );
};

export default GraficErori;