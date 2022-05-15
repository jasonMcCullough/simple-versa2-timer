import clock from "clock";
import { display } from "display";
import { vibration } from "haptics";
import * as document from "document";
import { preferences } from "user-settings";
import * as util from "../common/utils";

const myLabel = document.getElementById("myLabel");
const button = document.getElementById("button");
const myTimer = document.getElementById("myTimer");
const startTime = 60

var currentTime = startTime;
var timerStarted = false;

var interval = 1000; // ms
var expected = Date.now() + interval;

setTimeout(step, interval);
function step() {
  var dt = Date.now() - expected; // the drift (positive for overshooting)
  // do what is to be done
  button.onactivate = function(evt) {
    if (button.text == "Pause Timer") {
      timerStarted = false;
      button.text = "Start Timer";
      button.style.fill = "green";
      
    } else if (button.text == "Start Timer") {
      timerStarted = true;
      button.text = "Pause Timer";
      button.style.fill = "orange";
      
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
  
  if(timerStarted && currentTime > 0) {
    currentTime = currentTime - 1;
    myTimer.text = currentTime;
    
  } else if(!timerStarted && currentTime > 0) {
    myTimer.text = currentTime;
    
  } else if(currentTime <= 0) {
    myTimer.text = "";
    myLabel.text = "Times up!";
    vibration.start("alert");
    
    button.text = "Reset Timer"
    button.style.fill = "red"
  }
  
  // https://stackoverflow.com/questions/29971898/how-to-create-an-accurate-timer-in-javascript
  expected += interval;
  setTimeout(step, Math.max(0, interval - dt)); // take into account drift
}
