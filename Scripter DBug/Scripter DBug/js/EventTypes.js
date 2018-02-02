//-----------------------------------------------------------------------------
// EventTypes.js
//-----------------------------------------------------------------------------

// required event class definitions for MIDI events

//-----------------------------------------------------------------------------
//	Event : base class for all events
//-----------------------------------------------------------------------------

function Event() {};

//-----------------------------------------------------------------------------
Event.prototype.send = function () {
  SendMIDIEventNow(this);
};

//-----------------------------------------------------------------------------
Event.prototype.sendAfterMilliseconds = function (ms) {
  SendMIDIEventAfterMilliseconds(this, ms);
};

//-----------------------------------------------------------------------------
Event.prototype.sendAtBeat = function (beat) {
  SendMIDIEventAtBeat(this, beat);
};

//-----------------------------------------------------------------------------
Event.prototype.sendAfterBeats = function (beats) {
  SendMIDIEventAfterBeats(this, beats);
};

//-----------------------------------------------------------------------------
Event.prototype.trace = function () {
	Trace(this);
};

//-----------------------------------------------------------------------------
// Note : base class for notes
//-----------------------------------------------------------------------------
Note.prototype = new Event();
Note.prototype.constructor = Note;
//-----------------------------------------------------------------------------
function Note() {};
//-----------------------------------------------------------------------------
Note.prototype.toString = function() {
	var returnString = '[' + this.constructor.name + 
	' channel:' + this.channel +
	' pitch:' + this.pitch +
  ' [' + MIDI.noteName(this.pitch) + ']' + 
	' velocity:' + this.velocity;
	if (this.articulationID)
		returnString += ' articulationID:' + this.articulationID;
	returnString += ']';
	return returnString;
};

//-----------------------------------------------------------------------------
// NoteOff : { pitch:, velocity: }
//-----------------------------------------------------------------------------
NoteOff.prototype = new Note();
NoteOff.prototype.constructor = NoteOff;
//-----------------------------------------------------------------------------
function NoteOff(e) {
	this.status = 0x80;
	if(e) {
		// clone existing event
		this.channel = (e.channel) ? e.channel : 1;
		this.pitch = (e.pitch) ? e.pitch : 100;
		this.velocity = (e.velocity) ? e.velocity : 0;
		this.articulationID = (e.articulationID) ? e.articulationID : 0;
    this.isRealtime = (e.isRealtime) ? e.isRealtime : false;
    this.beatPos = 0;
	} else {
		// default values
		this.channel = 1;
		this.pitch = 100;
		this.velocity = 0;
		this.beatPos = 0;
		this.articulationID = 0;
    this.isRealtime = false;
	}
};

//-----------------------------------------------------------------------------
// NoteOn : { pitch:, velocity: }
//-----------------------------------------------------------------------------
NoteOn.prototype = new Note();
NoteOn.prototype.constructor = NoteOn;
//-----------------------------------------------------------------------------
function NoteOn(e) { 
	this.status = 0x90;
	if(e) {
		// clone existing event
		this.channel = (e.channel) ? e.channel : 1;
		this.pitch = (e.pitch) ? e.pitch : 100;
		this.velocity = (e.velocity) ? e.velocity : 100;
    this.articulationID = (e.articulationID) ? e.articulationID : 0;
    this.isRealtime = (e.isRealtime) ? e.isRealtime : false;
    this.beatPos = 0;
	} else {
		// default values
		this.channel = 1;
		this.pitch = 100;
		this.velocity = 100;
		this.beatPos = 0;
    this.articulationID = 0;
    this.isRealtime = false;
	}
};

//-----------------------------------------------------------------------------
// PolyPressure : { pitch:, value: }
//-----------------------------------------------------------------------------
PolyPressure.prototype = new Event();
PolyPressure.prototype.constructor = PolyPressure;
//-----------------------------------------------------------------------------
function PolyPressure(e) {
	this.status = 0xA0;
	if(e) {
		// clone existing event
		this.channel = (e.channel) ? e.channel : 1;
		this.pitch = (e.pitch) ? e.pitch : 0;
		this.value = (e.value) ? e.value : 0;
    this.isRealtime = (e.isRealtime) ? e.isRealtime : false;
    this.beatPos = 0;
	} else {
		// default values
		this.channel = 1;
		this.pitch = 100;
		this.value = 100;
		this.beatPos = 0;
    this.isRealtime = false;
	}
};

//-----------------------------------------------------------------------------
PolyPressure.prototype.toString = function() {
	return '[' + this.constructor.name + 
	' channel:' + this.channel +
	' pitch:' + this.pitch + 
  ' [' + MIDI.noteName(this.pitch) + ']' + 
	' value:' + this.value + ']';
};

//-----------------------------------------------------------------------------
// ControlChange : { number:, value: }
//-----------------------------------------------------------------------------
ControlChange.prototype = new Event();
ControlChange.prototype.constructor = ControlChange;
//-----------------------------------------------------------------------------
function ControlChange(e) {
	this.status = 0xB0;
	if(e) {
		// clone existing event
		this.channel = (e.channel) ? e.channel : 1;
		this.number = (e.number) ? e.number : 100;
		this.value = (e.value) ? e.value : 100;
    this.isRealtime = (e.isRealtime) ? e.isRealtime : false;
    this.beatPos = 0;
	} else {
		// default values
		this.channel = 1;
		this.number = 100;
		this.value = 100;
		this.beatPos = 0;
    this.isRealtime = false;
	}
};

//-----------------------------------------------------------------------------
ControlChange.prototype.toString = function() {
	var returnString = '[' + this.constructor.name +
	' channel:' + this.channel +
	' number:' + this.number + ' [' + MIDI.ccName(this.number) + ']' +
  ' value:' + this.value;
  if (this.articulationID)
    returnString += ' articulationID:' + this.articulationID;
  returnString += ']';
  return returnString;
};

//-----------------------------------------------------------------------------
// ProgramChange : { number: }
//-----------------------------------------------------------------------------
ProgramChange.prototype = new Event();
ProgramChange.prototype.constructor = ProgramChange;

function ProgramChange(e) {
	this.status = 0xC0;
	if(e) {
		// clone existing event
		this.channel = (e.channel) ? e.channel : 1;
		this.number = (e.number) ? e.number : 1;
    this.isRealtime = (e.isRealtime) ? e.isRealtime : false;
    this.beatPos = 0;
	} else {
		// default values
		this.channel = 1;
		this.number = 1;
		this.beatPos = 0;
    this.isRealtime = false;
	}
};

//-----------------------------------------------------------------------------
ProgramChange.prototype.toString = function() {
	return '[' + this.constructor.name + 
	' channel:' + this.channel +
	' number:' + this.number +']';
};

//-----------------------------------------------------------------------------
// ChannelPressure : { value: }
//-----------------------------------------------------------------------------
ChannelPressure.prototype = new Event();
ChannelPressure.prototype.constructor = ChannelPressure;

function ChannelPressure(e) {
	this.status = 0xD0;
	if(e) {
		// clone existing event
		this.channel = (e.channel) ? e.channel : 1;
		this.value = (e.value) ? e.value : 0;
    this.isRealtime = (e.isRealtime) ? e.isRealtime : false;
    this.beatPos = 0;
	} else {
		// default values
		this.channel = 1;
		this.value = 0;
		this.beatPos = 0;
    this.isRealtime = false;
	}
};

//-----------------------------------------------------------------------------
ChannelPressure.prototype.toString = function() {
	var returnString = '[' + this.constructor.name +
	' channel:' + this.channel +
  ' value:' + this.value;
  if (this.articulationID)
    returnString += ' articulationID:' + this.articulationID;
  returnString += ']';
  return returnString;
};

//-----------------------------------------------------------------------------
// PitchBend : { value: }
//-----------------------------------------------------------------------------
PitchBend.prototype = new Event();
PitchBend.prototype.constructor = PitchBend;
//-----------------------------------------------------------------------------
function PitchBend(e) { 
	this.status = 0xE0
	if(e) {
		// clone existing event
		this.channel = (e.channel) ? e.channel : 1;
		this.value = (e.value) ? e.value : 0;
    this.isRealtime = (e.isRealtime) ? e.isRealtime : false;
    this.beatPos = 0;
	} else {
		// default values
		this.channel = 1;
		this.value = 0;
		this.beatPos = 0;
    this.isRealtime = false;
	}
};

//-----------------------------------------------------------------------------
PitchBend.prototype.toString = function() {
	var pbPercent = parseInt((this.value / 8192) * 100);
  var pbPercentString = pbPercent.toString() + '%';
  if (pbPercent > 0)
  	pbPercentString = '+' + pbPercentString;
	var returnString = '[' + this.constructor.name +
	' channel:' + this.channel +
	' value:' + this.value + 
	' [' + pbPercentString + ']';
  if (this.articulationID)
    returnString += ' articulationID:' + this.articulationID;
  returnString += ']';
  return returnString;
};


//-----------------------------------------------------------------------------
// TargetEvent : { target:, value: }
//-----------------------------------------------------------------------------
TargetEvent.prototype = new Event();
TargetEvent.prototype.constructor = TargetEvent;
//-----------------------------------------------------------------------------
function TargetEvent(e) {
	this.status = 0x50;
	if(e) {
		// clone existing event
		this.target = (e.target) ? e.target : "";
		this.value = (e.value) ? e.value : 0;
    this.isRealtime = (e.isRealtime) ? e.isRealtime : false;
    this.beatPos = 0;
	} else {
		// default values
		this.target = "";
		this.value = 0;
		this.beatPos = 0;
    this.isRealtime = false;
	}
};

//-----------------------------------------------------------------------------
TargetEvent.prototype.toString = function() {
	return '[' + this.constructor.name + 
	' target:' + this.target +
	' value:' + this.value + ']';
};

//-----------------------------------------------------------------------------
// MIDI object (misc. functionality)
//-----------------------------------------------------------------------------
var MIDI = {};

//-----------------------------------------------------------------------------
MIDI.noteNumber = function(name) { 
	return this._noteNames.indexOf(name.toUpperCase()); 
};

//-----------------------------------------------------------------------------
MIDI.noteName = function(number) { 
	return this._noteNames[number];
};

//-----------------------------------------------------------------------------
MIDI.ccName = function(number) { 
	return this._ccNames[number];
};

//-----------------------------------------------------------------------------
MIDI.allNotesOff = function() {
	var cc = new ControlChange;
	cc.number = 123;
	cc.value = 0;
	this._sendEventOnAllChannels(cc);
}

//-----------------------------------------------------------------------------
MIDI._sendEventOnAllChannels = function(e) {
	for (var i=1; i <= 16; i++) {
		e.channel = i;
		e.send();
	}
}

//-----------------------------------------------------------------------------
MIDI.normalizeStatus = function(value) {
	if (value.constructor == Number) {
		if (value > 239)
			value = 239;
		else if (value < 128)
			value = 128;
		return parseInt(value);
	}
	else
		return 128;
};

//-----------------------------------------------------------------------------
MIDI.normalizeChannel = function(value) {
	if (value.constructor == Number) {
		if (value > 16)
			value = 16;
		else if (value < 1)
			value = 1;
		return parseInt(value);
	}
	else
		return 1;
};

//-----------------------------------------------------------------------------
MIDI.normalizeData = function(value)
{
	if (value.constructor == Number) {
		if (value > 127)
			value = 127;
		else if (value < 0)
			value = 0;
		return parseInt(value);
	}
	else
		return 0;
};

//-----------------------------------------------------------------------------
// Note/CC Enums
//-----------------------------------------------------------------------------
MIDI._makeNoteNames = function() {
  var noteNamesArray = [];
	var rootNames = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
	for (var i=0; i < 128; i++) {
		var octaveName = Math.floor(i / 12) - 2;
		noteNamesArray.push(rootNames[i % 12] + octaveName);
	}
  return noteNamesArray;
}

MIDI._noteNames = Object.freeze(MIDI._makeNoteNames());
//-----------------------------------------------------------------------------
MIDI._ccNames = Object.freeze([
   'Bank MSB',
   'Modulation',
   'Breath',
   'Ctrl 3',
   'Foot Control',
   'Portamento',
   'Data MSB',
   'Volume',
   'Balance',
   'Ctrl 9',
   'Pan',
   'Expression',
   'Effect #1 MSB',
   'Effect #2 MSB',
   'Ctrl 14',
   'Ctrl 15',
   'General #1',
   'General #2',
   'General #3',
   'General #4',
   'Ctrl 20',
   'Ctrl 21',
   'Ctrl 22',
   'Ctrl 23',
   'Ctrl 24',
   'Ctrl 25',
   'Ctrl 26',
   'Ctrl 27',
   'Ctrl 28',
   'Ctrl 29',
   'Ctrl 30',
   'Ctrl 31',
   'Bank LSB',
   '#01 LSB',
   '#02 LSB',
   '#03 LSB',
   '#04 LSB',
   '#05 LSB',
   '#06 LSB',
   '#07 LSB',
   '#08 LSB',
   '#09 LSB',
   '#10 LSB',
   '#11 LSB',
   'Effect #1 LSB',
   'Effect #2 LSB',
   '#14 LSB',
   '#15 LSB',
   '#16 LSB',
   '#17 LSB',
   '#18 LSB',
   '#19 LSB',
   '#20 LSB',
   '#21 LSB',
   '#22 LSB',
   '#23 LSB',
   '#24 LSB',
   '#25 LSB',
   '#26 LSB',
   '#27 LSB',
   '#28 LSB',
   '#29 LSB',
   '#30 LSB',
   '#31 LSB',
   'Sustain',
   'Portamento',
   'Sostenuto',
   'Soft Pedal',
   'Legato',
   'Hold2',
   'Sound Var',
   'Resonance',
   'Release Time',
   'Attack Time',
   'Brightness',
   'Decay Time',
   'Vibrato Rate',
   'Vibrato Depth',
   'Vibrato Delay',
   'Ctrl 79',
   'Decay',
   'HPF Frequ',
   'General #7',
   'General #8',
   'Portamento Ctl',
   'Ctrl 85',
   'Ctrl 86',
   'Ctrl 87',
   'Ctrl 88',
   'Ctrl 89',
   'Ctrl 90',
   'Reverb',
   'Tremolo',
   'Chorus Depth',
   'Detune/Var.',
   'Phaser',
   'Data increm.',
   'Data decrem.',
   'Non-Reg. LSB',
   'Non-Reg. MSB',
   'Reg.Par. LSB',
   'Reg.Par. MSB',
   'Ctrl 102',
   'Ctrl 103',
   'Ctrl 104',
   'Ctrl 105',
   'Ctrl 106',
   'Ctrl 107',
   'Ctrl 108',
   'Ctrl 109',
   'Ctrl 110',
   'Ctrl 111',
   'Ctrl 112',
   'Ctrl 113',
   'Ctrl 114',
   'Ctrl 115',
   'Ctrl 116',
   'Ctrl 117',
   'Ctrl 118',
   'Ctrl 119',
   'All Sound Off',
   'Reset Ctrls.',
   'Local Control',
   'All Notes Off',
   'Omni Mode Off',
   'Omni Mode  On',
   'Mono Mode On',
   'Poly Mode On'
]);
