# Quick Start: Terminal Commands

Copy and paste these commands into your terminal in order:

### 1. Install pnpm
Run this first to fix the "command not found" error:
```bash
npm install -g pnpm
```

### 2. Install Dependencies
Once pnpm is installed, run this in the root of your project:
```bash
pnpm install
```

### 3. Start Local Database
Make sure Docker Desktop is running, then run:
```bash
docker-compose up -d
```

### 4. Verify Installation
```bash
pnpm -v
```
You should see a version number (e.g., `8.10.0`).
