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

module.exports = {
  cmdRun,
  cmdRunAsync,
  isDirExists,
};
