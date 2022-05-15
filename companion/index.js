import { settingsStorage } from "settings";
import * as messaging from "messaging";

settingsStorage.onchange = function(evt) {
  sendValue(evt.key, JSON.parse(evt.newValue).name);
}

function sendValue(key, val) {
  var data = ({key: key,value: val});
  messaging.peerSocket.send(data);
}