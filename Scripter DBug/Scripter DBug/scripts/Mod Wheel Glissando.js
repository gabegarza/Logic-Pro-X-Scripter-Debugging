//-----------------------------------------------------------------------------
// Mod Wheel Glissando
//-----------------------------------------------------------------------------

function HandleMIDI(e) {
	if (e instanceof ControlChange) {
		if (e.number == 1) {
		  var note = new NoteOn;
      if(e.value == 0)
        e.value = 1;
			note.pitch = e.value;
			note.velocity = GetParameter("Note Velocity");
	    note.send();
	    var off = new NoteOff(note);
			off.sendAfterMilliseconds(GetParameter("Note Length")+0.1);
		}
	}
	e.send();
	e.trace();
}

//-----------------------------------------------------------------------------
var PluginParameters =
[
	{name:"Note Velocity", type:"lin", 
   minValue:1, maxValue:127, numberOfSteps:126, defaultValue:80},
 
	{name:"Note Length", type:"lin", unit:"ms", 
   minValue:0.0, maxValue:500.0, numberOfSteps:100, defaultValue:100.0}
];
