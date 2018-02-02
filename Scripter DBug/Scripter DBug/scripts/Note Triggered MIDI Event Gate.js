/*
		Note Triggered MIDI Event Gate.pst
		
		When the corresponding check-box is enabled, the incoming CC, PitchBend, or
		Channel Pressure values are always tracked, but only sent when a NoteOn
		message is received. When the check-box is disabled, the values are sent
		normally. Sustain Pedal (CC 64) may optionally be excluded from the gate
		behavior.
		
		One example would be to place this pst after a Modulator MIDI Plug-In that
		uses an LFO to send MIDI CC 1 (mod wheel) data. If, for instance, the 
		mod wheel was controlling filter cutoff on a synthesizer, you would normally
		hear the filter cut off rise and fall with the LFO shape if this pst was 
		disabled. When enabled, the filter cutoff would change only at the start
		of a NoteOn event, and would not change again until a new NoteOn event 
		was received. The result is discrete value changes for every new note.
*/

//global variables ----------
var CC_VALUES = {};						//dictionary to track all CC numbers and values
var PB_VALUE = 0;						//pitch bend value
var CP_VALUE = 0;						//channel pressure value
var CC_ENABLED = true;				//if MIDI CCs should be gated
var PB_ENABLED = false;				//if PitchBend should be gated
var CP_ENABLED = false;				//if ChannelPressure should be gated
var EXCLUDE_SUSTAIN = true; 	//if Sustain Pedal messages should be excluded from
														//the gate behavior

//------------------------------- HandleMIDI() ---------------------------------
/*
		This function is called once for every incoming MIDI event. 
		
		If the incoming message is a ControlChange, PitchBend, or ChannelPressure
		event, and the corresponding check-box is enabled in the UI, track the 
		value, otherwise, send the message.
		
		When a NoteOn event is received, send all MIDI messages that have been 
		tracked. 
		
		event = the incoming MIDI event
*/
function HandleMIDI(event) {
		//NoteOn ...................................................................
		if (event instanceof NoteOn) {
				if (CC_ENABLED) {
						for (cc in CC_VALUES) {
								var ccMsg = new ControlChange();
								ccMsg.number = cc;
								ccMsg.value = CC_VALUES[cc];
								ccMsg.send();
						}
						CC_VALUES = {};
				}
				
				if (PB_ENABLED) {
						var pb = new PitchBend();
						pb.value = PB_VALUE;
						pb.send();
				}
				
				if (CP_ENABLED) {
						var cp = new ChannelPressure();
						cp.value = CP_VALUE;
						cp.send();
				}
				
				event.send();	
		} 
		//NoteOff ..................................................................
		else if (event instanceof NoteOff) {
				event.send();
		}
		//Sustain Pedal ............................................................ 
		else if (event instanceof ControlChange && event.number === 64) {
				if (EXCLUDE_SUSTAIN) {
						event.send();
				} else {
						CC_VALUES[event.number] = event.value;
				}
		}
		//All Control Changes (except Sustain) .....................................
		else if (event instanceof ControlChange) {
				if (CC_ENABLED) {		
						CC_VALUES[event.number] = event.value;
				} else {
						event.send();
				}
		} 
		//PitchBend ................................................................
		else if (event instanceof PitchBend) {
				if (PB_ENABLED) {
						PB_VALUE = event.value;
				} else {
						event.send();
				}
		} 
		//ChannelPressure ..........................................................
		else if (event instanceof ChannelPressure) {
				if (CP_ENABLED) {
						CP_VALUE = event.value;
				} else {
						event.send();
				}
		} else {
				event.send();
		}
}

//----------------------------- ParameterChanged() -----------------------------
/*
		This function is called whenever value is changed in the Scripter UI. 
		
		Enabled/disable ControlChanges, PitchBend, ChannelPressure, and Sustain
		Pedal gate behavior.
		
		param = the index of the changed UI parameter 
		value = the new value for that parameter
*/
function ParameterChanged(param, value) {
		switch(param) {
				case 0:
						CC_ENABLED = value;
						break
				case 1:
						PB_ENABLED = value;
						break;
				case 2:
						CP_ENABLED = value;
						break;
				case 3:
						EXCLUDE_SUSTAIN = value;
						break;
				default:
						Trace("Unknown parameter index in ParameterChanged()");
		}
}

//create the UI ----------------------
PluginParameters = [{
		name:"Gate All Control Changes",
		type:"checkbox",
		defaultValue:1
}, {
		name:"Gate Pitch Bend",
		type:"checkbox",
		defaultValue:0
}, {
		name:"Gate Channel Pressure",
		type:"checkbox",
		defaultValue:0
}, {
		name:"Exclude Sustain Pedal",
		type:"checkbox",
		defaultValue:1
}];	