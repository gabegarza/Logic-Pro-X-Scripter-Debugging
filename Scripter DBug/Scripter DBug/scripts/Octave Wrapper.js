/*
		Octave Wrapper.pst
		
		This PST allows you to set a range of active notes. If notes fall outside of
		this range, they will be transposed up or down until they are within the 
		range. If a transposed note falls outside of the defined range, it will be
		filtered out (not sent). Any actives notes that fall outside of this range
		will be canceled (noteOff will be sent). 
		
		The high range can never be less than the low range, and vice versa. 
*/

var ACTIVE_NOTES = {};
var HIGH_RANGE;
var LOW_RANGE;

function HandleMIDI (event) {	
		if (event instanceof NoteOn) {
				var originalNote = event.pitch;
				var newNote = originalNote;
			
				if (newNote > HIGH_RANGE) {
						while (newNote > HIGH_RANGE) {
								newNote -= 12;
						}
				}
				
				if (newNote < LOW_RANGE) {
						while (newNote < LOW_RANGE) {
								newNote += 12;
						}
				}
								
				if(newNote > HIGH_RANGE || newNote < LOW_RANGE) {
						//don't send 		
				} else {
						ACTIVE_NOTES[originalNote] = newNote;
						event.pitch = newNote;
						event.send();
 				} 				
		} else if (event instanceof NoteOff) {
				var temp = event.pitch;
				event.pitch = ACTIVE_NOTES[event.pitch];
				delete ACTIVE_NOTES[temp];
				event.send();
		} else {
				event.send();		
		}
}

function ParameterChanged (param, value) {
		switch (param) {
				case 0:
						HIGH_RANGE = value;
						if (value < LOW_RANGE) {
								SetParameter(1, value);
						} 
						break;
				case 1:
						LOW_RANGE = value;
						if (value > HIGH_RANGE) {
								SetParameter(0, value);
						}
						break;
				default:
						//nothing
		}
		
		for (var key in ACTIVE_NOTES) {				
				if (ACTIVE_NOTES[key] > HIGH_RANGE || ACTIVE_NOTES[key] < LOW_RANGE) {
						var noteOff = new NoteOff();
						noteOff.pitch = ACTIVE_NOTES[key];
						noteOff.send();
						delete ACTIVE_NOTES[key];
				}
		}
}

var PluginParameters = [{
		name:"High Range",
		type:"linear",
		minValue:0,
		maxValue:127,
		numberOfSteps:127,
		defaultValue:71
}, {
		name:"Low Range",
		type:"linear",
		minValue:0,
		maxValue:127,
		numberOfSteps:127,
		defaultValue:60
}];