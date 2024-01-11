const util = require("util");
const fs = require("fs");

function cmdRun(command) {
  const { exec } = require("child_process");
  exec(command, (err, stdout, stderr) => {
    if (err) {
      console.log("error: couldn't execute the command");
      return;
    }
    if (stderr) {
      console.log(`stderr: \n${stderr}\n`);
      return stdout;
    }
    return stdout;
  });
}

async function cmdRunAsync(command) {
  const promisedExec = util.promisify(require("child_process").exec);
  const { stdout, stderr } = await promisedExec(command);
  if (stderr) {
    console.log(`stderr: \n${stderr}\n`);
    return stdout;
  }
  return stdout;
}

function isDirExists(path) {
  if (fs.existsSync(path)) {
    return true;
  }
  return false;
}

async function ls(path) {
  return await fs.readdirSync(path);
}

async function setCommitter() {
  await cmdRunAsync(
    "cd bucket && git config user.name 'unknown' && git config user.email 'noreply@github.com'"
  );
}

async function commitAndPush(message) {
  if (!message) {
    message = "Added new files";
  }
  await cmdRunAsync(`cd bucket && git add -A && git commit -m '${message}'`);
  await cmdRunAsync("cd bucket && git push origin main");
}

module.exports = {
  cmdRun,
  cmdRunAsync,
  isDirExists,
  setCommitter,
  commitAndPush,
  ls,
};
