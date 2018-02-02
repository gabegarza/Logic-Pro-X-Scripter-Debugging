/**
		Channel Filter:

			This script only allows events on the specified channel to be sent. 
			When changing the Pass Only Channel, the MIDI.allNotesOff() message 
			is sent, to prevent stuck notes that were sent on the previously
			selected channel. 
*/

        
var CHANNEL_TO_PASS = 1;
   
function HandleMIDI(event) {
		if (event.channel == CHANNEL_TO_PASS) {
				event.send();
		}
}

function ParameterChanged (param, value) {
		if (param === 0) {
				CHANNEL_TO_PASS = value;
				MIDI.allNotesOff();
		}
}

var PluginParameters = [{
		name:"Pass Only Channel", 
		type:"linear", 
		minValue:1, 
		maxValue:16, 
		numberOfSteps:15, 
		defaultValue:1
}];
		