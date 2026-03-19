const { execSync } = require("child_process");

const rawPort = process.argv[2] || "3001";
const port = Number(rawPort);

if (!Number.isInteger(port) || port <= 0 || port > 65535) {
  console.error(`Invalid port: ${rawPort}`);
  process.exit(1);
}

function run(command) {
  return execSync(command, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
}

function parsePidsFromWindowsNetstat(output) {
  return [...new Set(
    output
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => line.split(/\s+/).pop())
      .filter((pid) => /^\d+$/.test(pid)),
  )];
}

function findPidsOnWindows(targetPort) {
  try {
    const output = run(
      `cmd /c "netstat -ano | findstr :${targetPort} | findstr LISTENING"`,
    );
    return parsePidsFromWindowsNetstat(output);
  } catch {
    return [];
  }
}

function killPidOnWindows(pid) {
  try {
    run(`cmd /c "taskkill /F /PID ${pid}"`);
    return true;
  } catch {
    return false;
  }
}

function findPidsOnUnix(targetPort) {
  try {
    const output = run(`lsof -t -iTCP:${targetPort} -sTCP:LISTEN`);
    return [...new Set(output.split(/\r?\n/).map((x) => x.trim()).filter(Boolean))];
  } catch {
    return [];
  }
}

function killPidOnUnix(pid) {
  try {
    process.kill(Number(pid), "SIGKILL");
    return true;
  } catch {
    return false;
  }
}

function main() {
  const isWin = process.platform === "win32";
  const pids = isWin ? findPidsOnWindows(port) : findPidsOnUnix(port);

  if (pids.length === 0) {
    console.log(`Port ${port} is free.`);
    return;
  }

  const ownPid = String(process.pid);
  const targets = pids.filter((pid) => pid !== ownPid);

  if (targets.length === 0) {
    console.log(`Port ${port} appears to be held by current process only.`);
    return;
  }

  console.log(`Port ${port} is in use by PID(s): ${targets.join(", ")}. Releasing...`);

  for (const pid of targets) {
    const killed = isWin ? killPidOnWindows(pid) : killPidOnUnix(pid);
    if (killed) {
      console.log(`Killed PID ${pid}`);
    } else {
      console.warn(`Failed to kill PID ${pid}`);
    }
  }
}

main();
