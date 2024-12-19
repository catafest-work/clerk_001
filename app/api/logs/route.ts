import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  try {
    const logPath = path.join(process.cwd(), 'dev-time.log');
    const fileContent = await fs.readFile(logPath, 'utf-8');
    const logs = fileContent
      .split('\n')
      .filter(Boolean)
      .map(line => {
        const [timestamp, errorCount] = line.split(',');
        return {
          timestamp,
          errorCount: parseInt(errorCount, 10)
        };
      });

    return NextResponse.json(logs);
  } catch (error: unknown) {
    console.error('Error reading log file:', error);
    return NextResponse.json({ error: 'Failed to read log file' }, { status: 500 });
  }
}