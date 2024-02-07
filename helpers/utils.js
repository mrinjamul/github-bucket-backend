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

// is it a string?
function isString(value) {
  return typeof value === "string" || value instanceof String;
}

// is it a Date?
function isDate(value) {
  return value instanceof Date;
}

// is it the same date? returns boolean
function isSameDay(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  // Compare the year, month, and day of the two dates
  return (
    d1.getUTCFullYear() === d2.getUTCFullYear() &&
    d1.getUTCMonth() === d2.getUTCMonth() &&
    d1.getUTCDate() === d2.getUTCDate()
  );
}

// less than eq for dates
function isDateLessThanOrEqualTo(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  // Convert both dates to UTC
  const d1UTC = new Date(
    Date.UTC(d1.getUTCFullYear(), d1.getUTCMonth(), d1.getUTCDate())
  );

  const d2UTC = new Date(
    Date.UTC(d2.getUTCFullYear(), d2.getUTCMonth(), d2.getUTCDate())
  );

  return d1UTC <= d2UTC;
}

// greater than eq for dates
function isDateGreaterThanOrEqualTo(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  // Convert both dates to UTC
  const d1UTC = new Date(
    Date.UTC(d1.getUTCFullYear(), d1.getUTCMonth(), d1.getUTCDate())
  );

  const d2UTC = new Date(
    Date.UTC(d2.getUTCFullYear(), d2.getUTCMonth(), d2.getUTCDate())
  );

  return d1UTC >= d2UTC;
}

// compare between to date
function isDateRange(from, to, current) {
  return (
    isDateLessThanOrEqualTo(from, current) &&
    isDateGreaterThanOrEqualTo(to, current)
  );
}

// string to base64
function base64encode(string) {
  return Buffer.from(string, "utf-8").toString("base64");
}

// base64 to string
function base64decode(base64String) {
  return Buffer.from(base64String, "base64").toString("utf-8");
}

// getFilter return a filter callback function
function getFilter(filters, dateStart, dateEnd) {
  return (item) => {
    for (const key in filters) {
      const value = filters[key];
      if (key.endsWith("_gte")) {
        const field = key.slice(0, -5); // Remove '_gte'
        if (item[field] < value) {
          return false;
        }
      } else if (key.endsWith("_lte")) {
        const field = key.slice(0, -5); // Remove '_lte'
        if (item[field] > value) {
          return false;
        }
      } else if (key.endsWith("_gt")) {
        const field = key.slice(0, -4); // Remove '_gt'
        if (item[field] <= value) {
          return false;
        }
      } else if (key.endsWith("_lt")) {
        const field = key.slice(0, -4); // Remove '_lt'
        if (item[field] >= value) {
          return false;
        }
      } else if (key === "created_at") {
        if (!isSameDay(new Date(item.created_at), new Date(value))) {
          return false;
        }
      } else if (key === "updated_at") {
        if (!isSameDay(new Date(item.updated_at), new Date(value))) {
          return false;
        }
      } else if (item[key] !== value) {
        return false;
      }
    }

    // Apply date range filtering
    if (dateStart && dateEnd) {
      const itemDate = new Date(item.created_at);
      const filterdateStart = new Date(dateStart);
      const filterdateEnd = new Date(dateEnd);
      if (!isDateRange(filterdateStart, filterdateEnd, itemDate)) {
        return false;
      }
    }

    return true;
  };
}

// getSorter return a sort callback function
function getSorter(sortBy, orderBy) {
  return (a, b) => {
    const fieldA = a[sortBy];
    const fieldB = b[sortBy];
    if (orderBy === "asc") {
      if (isString(fieldA) || isString(fieldB)) {
        return fieldA.localeCompare(fieldB);
      } else if (!isNaN(fieldA) && !isNaN(fieldB)) {
        return fieldA - fieldB;
      } else if (isDate(fieldA) && isDate(fieldB)) {
        return new Date(fieldA) - new Date(fieldB);
      }
    } else {
      if (isString(fieldA) || isString(fieldB)) {
        return fieldB.localeCompare(fieldA);
      } else if (!isNaN(fieldA) && !isNaN(fieldB)) {
        return fieldB - fieldA;
      } else if (isDate(fieldA) && isDate(fieldB)) {
        return new Date(fieldB) - new Date(fieldA);
      }
    }
    return 0;
  };
}

module.exports = {
  cmdRun,
  cmdRunAsync,
  isDirExists,
  setCommitter,
  commitAndPush,
  ls,
  isString,
  isDate,
  isSameDay,
  isDateRange,
  base64encode,
  base64decode,
  getFilter,
  getSorter,
};
