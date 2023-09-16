

// Function to toggle the visibility of the "minutes" input
function fadeBackgroundImage(newImageUrl) {
  var body = document.getElementsByTagName("body")[0];
  var fadeInDuration = 200; // Adjust the duration as needed
  var fadeOutDuration = 200; // Adjust the duration as needed

  var tempDiv = document.createElement("div");
  tempDiv.style.position = "fixed";
  tempDiv.style.top = "0";
  tempDiv.style.left = "0";
  tempDiv.style.width = "100%";
  tempDiv.style.height = "100%";
  tempDiv.style.backgroundImage = "url('" + newImageUrl + "')";
  tempDiv.style.opacity = 0.0;
  tempDiv.style.transition = "opacity " + fadeInDuration + "ms ease-in-out";

  // Add the temporary div to the body
  body.prepend(tempDiv);

  // Force a repaint to ensure the transition is applied
  tempDiv.offsetHeight;

  // Fade in the new image
  tempDiv.style.opacity = 1.0;

  // After the fadeInDuration, remove the old background and the temporary div
  setTimeout(function () {
    body.style.backgroundImage = "url('" + newImageUrl + "')";
    tempDiv.style.opacity = 0;
    setTimeout(function () {
      body.removeChild(tempDiv);
    }, fadeOutDuration);
  }, fadeInDuration);
}

function toggleBackground() {
  var mode = document.getElementById("gameModeRadio");
  if (mode.checked) {
    fadeBackgroundImage("http://localhost:8327/game.jpg");
  } else {
    fadeBackgroundImage("http://localhost:8327/study.jpg");
  }
}

function toggleMinutesInput() {
  toggleBackground();
  var gameModeRadio = document.getElementById("gameModeRadio");
  var minutesInput = document.getElementById("minutesInput");

  // Check if the "Game Mode" radio button is selected
  if (gameModeRadio.checked) {
    minutesInput.style.display = "none"; // Hide the input
  } else {
    minutesInput.style.display = "block"; // Show the input
  }
}

document.addEventListener("DOMContentLoaded", function (event) {
  toggleMinutesInput();
});


function reportStart() {
  var mode = document.getElementById("gameModeRadio");
  var minutes = document.getElementById("minutes");
  var time = minutes.value;
  var request = new XMLHttpRequest();
  request.open("POST", "http://localhost:8327/start", true);
  request.setRequestHeader("Content-Type", "application/json");
  request.send(JSON.stringify({
    mode: mode.checked ? 1 : 0,
    time: time
  }));
  return false;
}

function reportStop() {
  var request = new XMLHttpRequest();
  request.open("POST", "http://localhost:8327/stop", true);
  request.setRequestHeader("Content-Type", "application/json");
  request.send();
  return false;
}

function reportReset() {
  var request = new XMLHttpRequest();
  request.open("POST", "http://localhost:8327/reset", true);
  request.setRequestHeader("Content-Type", "application/json");
  request.send();
  return false;
}
