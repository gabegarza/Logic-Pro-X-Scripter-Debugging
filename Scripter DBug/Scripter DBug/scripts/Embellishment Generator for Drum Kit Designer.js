/*

Embellishment Generator for Drum Kit Designer

*/


// constants _____________________________________________________________________________
// - define constants first because the interpreter does not allow 
// forward definitions for constants

// note names without octave number, used for menu generation
const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

// list of preset embellishments
const embellishments = 
[ 
	"Snare Flam 1 soft",
	"Snare Flam 2 cresc.",
	"Snare Flam 3 hard",
	"Snare Drag 1 soft",
	"Snare Drag 2 cresc.",
	"Snare Buzz 1 soft",
	"Snare Buzz 2 medium",
	"Snare Roll 1",
	"Snare Roll 2",
	"Snare Roll 3 cresc.",
	"Snare Roll 4 cresc.",
	"Crash 1 cresc.",
	"Crash 2 cresc.",	
	"Tom High Roll",
	"Tom Mid Roll",
	"Tom Low Roll",	
];
	

// global variables ______________________________________________________________________

// input here the MIDI octave where you want to start the additional keys
var OCTAVE = 3;

// we internally calculate it to MIDI note number 
OCTAVE = (OCTAVE +2) * 12; 


// setup menu ____________________________________________________________________________
var PluginParameters = [];

PluginParameters.push({name:"Octave", type:"menu", valueStrings:["-2", "-1", "0", "+1", "+2", "+3", "+4", "+5", "+6", "+7"], numberOfSteps:0, defaultValue:5});

for (i = 0; i < noteNames.length; i++)
{
	PluginParameters.push({name:noteNames[i], type:"menu", valueStrings: embellishments, numberOfSteps:0, defaultValue: i });
}


/* __________________ */ function ParameterChanged(param, value) /* __________________ */ 
{

	switch (param)
	{
		case 0: OCTAVE = value * 12; break; // calculate MIDI note number for octave
	}
	
	// since all other parameters are not mirrored in global variables there is 
	// no action required when they are being changed
	
} // /ParameterChanged



/* __________________ */ function createRoll(pitch1, pitch2, count, speed, vel_start, vel_end, variation) /* __________________ */ 
/*
Creates a customizable roll, with the following parameters:
pitch1, 
pitch2: 		alternates between those two
count: 			number of strokes
speed:			strokes per second
vel_start:		the starting velocity
vel_end:		the final velocity
variation:		randomizes velocity and timing [0 .. 1]
*/


{
	var pitch = pitch1;
	
	// duration of a stroke in ms (float)
	var duration_ms = 1000 / speed; 
	
	// Stepsize for velocity
	var vel_step = (vel_end - vel_start) / count;
	
	// helper
	var vel_current = vel_start;

	// create and send roll
	for (i = 0; i < count; i++)
	{
		// calculate next delay time with variation
		var time_ms = i * duration_ms + variation * 5.0 * (0.5 - Math.random());
		
		// init new note events
		var note_on = new NoteOn;
		var note_off = new NoteOff;
	
		// assign pitch and velocity with variation
		note_on.pitch = pitch;
 		note_on.velocity = MIDI.normalizeData(vel_current + variation * 20.0 * (0.5 - Math.random()) + 1 );
 		
		// calculate next velocity step
 		vel_current += vel_step;

		// send the note on
		note_on.sendAfterMilliseconds(time_ms);
		
		// generate noteOff with note_on as prototype
		var note_off = new NoteOff(note_on);
			
		// and send the note off 10ms later
		note_off.sendAfterMilliseconds(time_ms + 10);
		
		// swap pitch for alternating strokes
		if (pitch == pitch1)
			pitch = pitch2;
		else pitch == pitch1;
		
	} // / for (0..count)

} // /createRoll


/* __________________ */  function HandleMIDI(event) /* _______________________________ */ 
{	
	// if the incoming event is a note on
	if (event instanceof NoteOn)
	{		
		// incoming pitch inside menu keyrange?
		if ((event.pitch >= OCTAVE) && (event.pitch < (OCTAVE + noteNames.length)))
		{				
			// create roll depending on set type in menu
			switch (GetParameter(noteNames[event.pitch-OCTAVE]))
			{
				// Snare
				case embellishments.indexOf("Snare Flam 1 soft")	: createRoll(38, 34, 2, 15, event.velocity / 3 +5, event.velocity / 4, 0.3); break; // flam 1 soft
				case embellishments.indexOf("Snare Flam 2 cresc.")	: createRoll(34, 34, 2, 18, event.velocity / 4, event.velocity / 2, 0.2); break; // flam 2 cresc
				case embellishments.indexOf("Snare Flam 3 hard") 	: createRoll(34, 40, 2, 26, event.velocity, event.velocity / 1.3, 1); break; // flam 3 hard
				case embellishments.indexOf("Snare Drag 1 soft")  	: createRoll(34, 34, 3, 19, event.velocity / 3 + 10, event.velocity / 4, 0.3); break; // drag 1 soft
				case embellishments.indexOf("Snare Drag 2 cresc.") 	: createRoll(38, 34, 3, 20, 1, event.velocity / 2, 0.3); break; // drag 2 cresc
				case embellishments.indexOf("Snare Buzz 1 soft") 	: createRoll(34, 38, 5, 19, event.velocity / 1.5, 1, 0.5); break; // buzz 1 soft
				case embellishments.indexOf("Snare Buzz 2 medium") 	: createRoll(34, 38, 7, 20, event.velocity, 1, 0.5); break; // buzz 2 medium
				case embellishments.indexOf("Snare Roll 1")  		: createRoll(34, 38, 6, 26, event.velocity, event.velocity / 1.3, 1); break; // roll 1
				case embellishments.indexOf("Snare Roll 2") 		: createRoll(34, 38, 10, 26, event.velocity, event.velocity / 1.3, 1); break; // roll 2
				case embellishments.indexOf("Snare Roll 3 cresc.") 	: createRoll(34, 34, 7, 25, 1, event.velocity, 0.2); break; // roll 3 cresc
				case embellishments.indexOf("Snare Roll 4 cresc.")	: createRoll(34, 38, 5, 25, 1, event.velocity, 0.4); break; // roll 4 cresc
				
				// Crashes
				case embellishments.indexOf("Crash 1 cresc.")		: createRoll(49, 49, 40, 30, 1, event.velocity, 0.2); break; // roll 6 cresc long
				case embellishments.indexOf("Crash 2 cresc.")		: createRoll(57, 57, 30, 30, 1, event.velocity, 0.2); break; // roll 7 cresc long
				
				// Toms
				case embellishments.indexOf("Tom High Roll")		: createRoll(50, 50, 4, 25, 1, event.velocity, 0.4); break;	
				case embellishments.indexOf("Tom Mid Roll")			: createRoll(45, 45, 4, 25, 1, event.velocity, 0.4); break;
				case embellishments.indexOf("Tom Low Roll")			: createRoll(41, 41, 4, 25, 1, event.velocity, 0.4); break; // roll 5 short			
				
			} // /switch
			
		} // send everything else
		else 
		{
			event.send();
		} // if event.pitch...
					
	} // /if noteOn
		
	// send all other events
	else {
		event.send();
	}
} // /HandleMIDI