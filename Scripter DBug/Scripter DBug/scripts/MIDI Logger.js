//-----------------------------------------------------------------------------
// Logger
//-----------------------------------------------------------------------------

function HandleMIDI(e) {
  // pass through
  e.send();
  
  // Event Objects
	if (displayMode == 0) {
		Trace(e);
  }
  // MIDI Bytes
  else if (displayMode == 1) {
		Trace((e.status + e.channel-1) + 
          '\t' + e.data1 + 
          '\t' + e.data2);
	}
  // Hex
	else if (displayMode == 2) {
    var hex = function(num) { return num.toString(16) };
		Trace('0x' + hex((e.status + e.channel-1)) + 
          '  0x' + hex(e.data1) + 
          '\t0x' + hex(e.data2));
	}
}

//-----------------------------------------------------------------------------
var PluginParameters = 
[
  {name:"Display Mode", 
  type:"menu", valueStrings:["Event Objects", 
                             "MIDI Bytes", 
                             "Hex"],
   numberOfSteps: 3, defaultValue: 0}
];

var displayMode = 0;

function ParameterChanged(param, value) {
	displayMode = value;
}