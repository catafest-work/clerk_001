# clerk_001

## simple example with clerk from https://clerk.com


Changes the run command to show the timestamp of running nextjs :
```
  "scripts": {
    "dev": "next dev",
    "dev-time-linux": "cross-env NEXT_LOGGER_TIMESTAMP=1 next dev | while read line; do echo \"[$(date '+%Y-%m-%d %H:%M:%S')] $line\"; done",
    "dev-time-win-cmd": "node -e \"require('child_process').spawn('node', ['./node_modules/next/dist/bin/next', 'dev'], {stdio: 'pipe'}).stdout.on('data', data => console.log(`[${new Date().toISOString()}] ${data.toString().trim()}`))\"",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
```
The result is :
```
clerk_001>npm run dev-time-win-cmd

> clerk_001@0.1.0 dev-time-win-cmd
> node -e "require('child_process').spawn('node', ['./node_modules/next/dist/bin/next', 'dev'], {stdio: 'pipe'}).stdout.on('data', data => console.log(`[${new Date().toISOString()}] ${data.toString().trim()}`))"

[2024-12-18T10:18:57.301Z] ▲ Next.js 15.1.0
[2024-12-18T10:18:57.306Z] - Local:        http://localhost:3000
   - Network:      http://10.13.13.2:3000
   - Environments: .env.local

 ✓ Starting...
[2024-12-18T10:18:59.218Z] ✓ Ready in 2.2s
[2024-12-18T10:19:13.072Z] ○ Compiling /middleware ...
[2024-12-18T10:19:13.093Z] ✓ Compiled /middleware in 530ms (215 modules)
[2024-12-18T10:19:14.061Z] ○ Compiling / ...
[2024-12-18T10:19:15.840Z] ✓ Compiled / in 2.3s (1174 modules)
[2024-12-18T10:19:16.629Z] GET / 200 in 3075ms
[2024-12-18T10:19:17.546Z] ○ Compiling /favicon.ico ...
[2024-12-18T10:19:17.592Z] ✓ Compiled /favicon.ico in 550ms (745 modules)
[2024-12-18T10:19:17.776Z] GET /favicon.ico 200 in 748ms
[2024-12-18T10:19:17.901Z] GET / 200 in 93ms
[2024-12-18T10:19:35.850Z] ✓ Compiled in 252ms (745 modules)
```
