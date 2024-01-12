var status = {
  isDBConnected: false,
  startTime: null,
  bootTime: null,
};

function toReadableTime(time) {
  // time is in milliseconds

  var hour = Math.floor(time / 3600000);
  var minutes = Math.floor((time % 3600000) / 60000);
  var seconds = Math.floor((time % 60000) / 1000);

  // Pad leading zeros if necessary
  hour = hour < 10 ? "0" + hour : hour;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  if (hour != 0) {
    return `${hour}hr ${minutes}min ${seconds}sec`;
  } else if (minutes != 0) {
    return `${minutes}min ${seconds}sec`;
  } else {
    return `${seconds}sec`;
  }
}

function getStatus() {
  return status;
}

module.exports = { getStatus, toReadableTime };
