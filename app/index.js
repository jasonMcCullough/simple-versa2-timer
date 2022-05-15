import clock from "clock";
import { display } from "display";
import { vibration } from "haptics";
import * as document from "document";
import { preferences } from "user-settings";
import { me as device } from "device";
import { settingsStorage } from "settings";
import * as messaging from "messaging";

import * as util from "../common/utils";

const myLabel = document.getElementById("myLabel");
const myTimer = document.getElementById("myTimer");

const button = document.getElementById("button");

const pauseBtn = document.getElementById("pause");
const resetBtn = document.getElementById("reset");

// Default to 60 seconds
var startTime = 60;

var currentTime = startTime;
var timerStarted = false;

var interval = 1000; // ms
var expected = Date.now() + interval;

pauseBtn.style.display = "none";
resetBtn.style.display = "none";

// Retrieve the duration value from the companian
messaging.peerSocket.onmessage = function(evt) {
  startTime = parseInt(evt.data.value);
}

console.log(`Model name:       ${device.modelName}`);
console.log(`Firmware version: ${device.firmwareVersion}`);
console.log(`Screen dimensions: ${device.screen.width} x ${device.screen.height}`);

// Display initial timer value on startup 
myTimer.text = startTime;
setTimeout(step, interval);

function step() {
  // The drift
  var dt = Date.now() - expected;
  
  button.onactivate = function(evt) {
    if (button.text == "Start Timer") {
      timerStarted = true;
      button.style.display = "none";
      pauseBtn.style.display = "inline";
      resetBtn.style.display = "inline";
      
    } else if (button.text == "Reset Timer") {
      vibration.stop("alert");
      timerStarted = false;
      currentTime = startTime;
      myTimer.text = currentTime;
      myLabel.text = "";
      button.text = "Start Timer";
      button.style.fill = "green";
    }
  }
  
  pauseBtn.onactivate = function(evt) {
    if (pauseBtn.text != "Cont.") {
      timerStarted = false;
      pauseBtn.text = "Cont.";
      pauseBtn.style.fill = "green";
      
    } else if (pauseBtn.text == "Cont.") {
      timerStarted = true;
      pauseBtn.text = "Pause";
      pauseBtn.style.fill = "orange";
    }
  }
  
  resetBtn.onactivate = function(evt) {
    timerStarted = false;
    currentTime = startTime;
    myTimer.text = currentTime;
    myLabel.text = "";
    
    pauseBtn.text = "Pause";
    pauseBtn.style.fill = "orange";
    
    pauseBtn.style.display = "none";
    resetBtn.style.display = "none";
    button.style.display = "inline";
  }
  
  if(timerStarted && currentTime > 0) {
    currentTime = currentTime - 1;
    myTimer.text = currentTime;
    
  } else if(!timerStarted && currentTime > 0) {
    myTimer.text = currentTime;
    
  } else if(currentTime <= 1) {
    pauseBtn.style.display = "none";
    resetBtn.style.display = "none";
    button.style.display = "inline";
    
    myTimer.text = "";
    myLabel.text = "Times up!";
    vibration.start("alert");
    
    button.text = "Reset Timer"
    button.style.fill = "red"
  }
  
  expected += interval;
  // Take into account drift, reference: https://stackoverflow.com/questions/29971898/how-to-create-an-accurate-timer-in-javascript
  setTimeout(step, Math.max(0, interval - dt)); 
}
