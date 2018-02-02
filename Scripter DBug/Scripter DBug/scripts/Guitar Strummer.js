/* 
		Guitar Strummer.pst

		Note: The transport must be playing for this effect to work.

		This script mimics the strumming and arpeggiating of a guitar, using actual
		guitar voicings.

		Chords can be mapped to a single note type, so that playing that single note
		will trigger the strumming or arpeggiating of the assigned chord.

		Playing a new chord before the previous chord has finished, will cancel the
		previous chord.

		Use the sustain pedal to let the chord sustain.

		Use the "Type" selector to switch between strumming and arpeggiating 
		settings.

	
		"Direction" determines the strumming direction: 
				Up = always play up strokes
				Down = always play down strokes
				Alternate : Always = alternate between down and up for every trigger
				Alternate : Down On New Chord = alternate between down and up, unless 
										you trigger a new chord, in which case, play down
				Follow Beats : 1/8 = Use the time line to determine when to play down 
										and up beats, at 1/8 note resolution. Down beats will
										trigger down strokes, and up beats will trigger up strokes
				Follow Beats : 1/16 = Use 1/16 note resolution to determine the stroke.
		Division: The time between each string on the guitar being played, (in ms 
				for strums and beats for arpeggios)
		Division Curve: (strum only) negative values speed up the stroke as it 
				plays, positive values slow down the stroke as it plays.
		Random Division: apply randomness to the division value
		Velocity Curve: negative values decrease each strings played velocity as the 
				stroke plays, positive values increase the velocity as the stroke plays.
		Random Velocity: apply randomness to the velocity values

		Keyboard Split Point : Notes <= this value trigger chords, notes above
				trigger single notes, so that you can play melodies over the chords.
		
		Chord menus: assign what chord the note will trigger
*/


//global variables -------------------------------------------------------------
var NeedsTimingInfo = true;    //global scripter variable for accessing timing info
var ResetParameterDefaults = true; //return controls to default values when running
																//script
var PREVIOUS_STRUM = 0;			//variable to track the last strum direction
var TIMING_ARRAY = [];			//array of times to trigger each string
var VELOCITY_ARRAY = [];		//array of velocities for each string
var CURRENT_CHORD = [];			//array of notes of the chord
var START_BEAT = 0;					//the beat when the chord was first triggered
var CURRENT_BEAT = 0;				//current beat
var PREVIOUS_BEAT = 0;			//last beat
var STRUM_STOPPED = false;	//if the strum was stopped
var SENT_NOTES = [];				//array to track which strings have already played
var LAST_NOTE_PLAYED;				//last note on the keyboard that was played
var PREVIOUS_CHORD = [];		//previous chord
var ACTIVE_NOTES = [];			//currently pressed keys on the keyboard
var DIVISION;								//division
var IS_DOWN_BEAT;						//tracks if current beat is down or up beat
var SUSTAIN_ENABLED;				//track sustain pedal state
var TEMPO;
var DEBUG = false;						//display debug messages in console

//global variables for each PluginParameter 
//these will all be initialized in ParameterChanged() when the Script is run
var TYPE;

var STRUM_DIRECTION;
var STRUM_DIVISION;
var STRUM_DIVISION_CURVE;
var STRUM_RANDOM_DIVISION;
var STRUM_VELOCITY_CURVE;
var STRUM_RANDOM_VELOCITY;

var ARP_DIRECTION;
var ARP_DIVISION;
var ARP_RANDOM_DIVISION;
var ARP_VELOCITY_CURVE;
var ARP_RANDOM_VELOCITY;

var KEYBOARD_SPLIT_POINT;

//tracks the assigned chord for base note
var C_CHORD;
var C_SHARP_CHORD;
var D_CHORD;
var D_SHARP_CHORD;
var E_CHORD;
var F_CHORD;
var F_SHARP_CHORD;
var G_CHORD;
var G_SHARP_CHORD;
var A_CHORD;
var A_SHARP_CHORD;
var B_CHORD;

//values for "Strum Division (beats)" menu 
var TIME_DIVISIONS = [
		"1/16 T", 
		"1/16", 
		"1/8 T", 
		"1/8", 
		"1/4 T", 
		"1/4", 
];
//values for direction
var DIRECTION_TYPES = [
		"Down",
		"Up",
		"Alternate : Always", 
		"Alternate : Down On New Chord", 
		"Follow Beats 1/8", 
		"Follow Beats 1/16"
];

//array to hold all chords
var ARRAY_OF_CHORDS = [];

//define chord names and notes ..........................
//low E = 40

//C
ARRAY_OF_CHORDS.push(new Chord("C Major", [48, 55, 60, 64, 67]));
ARRAY_OF_CHORDS.push(new Chord("C Minor", [48, 55, 60, 63, 67]));
ARRAY_OF_CHORDS.push(new Chord("C Diminished", [48, 54, 57, 63, 69]));
ARRAY_OF_CHORDS.push(new Chord("C Power Chord", [48, 55]));
//C#
ARRAY_OF_CHORDS.push(new Chord("C# Major", [49, 56, 61, 65, 68]));
ARRAY_OF_CHORDS.push(new Chord("C# Minor", [49, 56, 61, 64, 68]));
ARRAY_OF_CHORDS.push(new Chord("C# Diminished", [49, 55, 58, 64, 70]));
ARRAY_OF_CHORDS.push(new Chord("C# Power Chord", [49, 56]));
//D
ARRAY_OF_CHORDS.push(new Chord("D Major", [50, 57, 62, 66, 69]));
ARRAY_OF_CHORDS.push(new Chord("D Minor", [50, 57, 62, 65, 69]));
ARRAY_OF_CHORDS.push(new Chord("D Diminished", [50, 56, 59, 65, 71]));
ARRAY_OF_CHORDS.push(new Chord("D Power Chord", [50, 57]));
//D#
ARRAY_OF_CHORDS.push(new Chord("D# Major", [51, 58, 63, 67, 70]));
ARRAY_OF_CHORDS.push(new Chord("D# Minor", [51, 58, 63, 66, 70]));
ARRAY_OF_CHORDS.push(new Chord("D# Diminished", [51, 57, 60, 66, 72]));
ARRAY_OF_CHORDS.push(new Chord("D# Power Chord", [51, 58]));
//E
ARRAY_OF_CHORDS.push(new Chord("E Major", [40, 47, 52, 56, 59, 64]));
ARRAY_OF_CHORDS.push(new Chord("E Minor", [40, 47, 52, 55, 59, 64]));
ARRAY_OF_CHORDS.push(new Chord("E Diminished", [40, 46, 52, 55, 61, 67]));
ARRAY_OF_CHORDS.push(new Chord("E Power Chord", [40, 47]));
//F
ARRAY_OF_CHORDS.push(new Chord("F Major", [41, 48, 53, 57, 60, 65]));
ARRAY_OF_CHORDS.push(new Chord("F Minor", [41, 48, 53, 56, 60, 65]));
ARRAY_OF_CHORDS.push(new Chord("F Diminished", [41, 47, 53, 56, 62, 68]));
ARRAY_OF_CHORDS.push(new Chord("F Power Chord", [41, 48]));
//F#
ARRAY_OF_CHORDS.push(new Chord("F# Major", [42, 49, 54, 58, 61, 66]));
ARRAY_OF_CHORDS.push(new Chord("F# Minor", [42, 49, 54, 57, 61, 66]));
ARRAY_OF_CHORDS.push(new Chord("F# Diminished", [42, 48, 54, 57, 63, 69]));
ARRAY_OF_CHORDS.push(new Chord("F# Power Chord", [42, 49]));
//G
ARRAY_OF_CHORDS.push(new Chord("G Major", [43, 50, 55, 59, 62, 67]));
ARRAY_OF_CHORDS.push(new Chord("G Minor", [43, 50, 55, 58, 62, 67]));
ARRAY_OF_CHORDS.push(new Chord("G Diminished", [43, 49, 55, 58, 64, 70]));
ARRAY_OF_CHORDS.push(new Chord("G Power Chord", [43,50]));
//G#
ARRAY_OF_CHORDS.push(new Chord("G# Major", [44, 51, 56, 60, 63, 68]));
ARRAY_OF_CHORDS.push(new Chord("G# Minor", [44, 51, 56, 59, 63, 68]));
ARRAY_OF_CHORDS.push(new Chord("G# Diminished", [44, 50, 56, 59, 65, 71]));
ARRAY_OF_CHORDS.push(new Chord("G# Power Chord", [44, 51]));
//A
ARRAY_OF_CHORDS.push(new Chord("A Major", [45, 52, 57, 61, 64]));
ARRAY_OF_CHORDS.push(new Chord("A Minor", [45, 52, 57, 60, 64]));
ARRAY_OF_CHORDS.push(new Chord("A Diminished", [45, 51, 57, 60, 66, 72]));
ARRAY_OF_CHORDS.push(new Chord("A Power Chord", [45, 52]));
//A#
ARRAY_OF_CHORDS.push(new Chord("A# Major", [46, 53, 58, 62, 65]));
ARRAY_OF_CHORDS.push(new Chord("A# Minor", [41, 46, 53, 58, 61, 65]));
ARRAY_OF_CHORDS.push(new Chord("A# Diminished", [46, 52, 58, 61, 67, 73]));
ARRAY_OF_CHORDS.push(new Chord("A# Power Chord", [46, 53]));
//B
ARRAY_OF_CHORDS.push(new Chord("B Major", [47, 54, 59, 63, 66]));
ARRAY_OF_CHORDS.push(new Chord("B Minor", [47, 54, 59, 62, 66]));
ARRAY_OF_CHORDS.push(new Chord("B Diminished", [47, 53, 59, 62, 68, 74]));
ARRAY_OF_CHORDS.push(new Chord("B Power Chord", [47, 54]));

//PUSH YOUR OWN CHORD DEFINITIONS HERE!!! Just re-run the script, and the chords
//will be available via the Chord drop down menus. 

//array to access chord names via the Chord menus: go through all chords and 
//store their names
var CHORD_NAMES = [];
for (i = 0; i < ARRAY_OF_CHORDS.length; i++) {
		CHORD_NAMES.push(ARRAY_OF_CHORDS[i].name);
}

//Scripter Functions -----------------------------------------------------------

//_______________________________ HandleMIDI() _________________________________
/*
		Trigger Chords or Single notes, and track the Sustain Pedal state. Pass all
		other event types.	

		@param event is the incoming MIDI event
*/		
function HandleMIDI (event) {
		//NoteOn ...................................................................
		if(event instanceof NoteOn) {	
				//strum/arpeggio 
				if(event.pitch <= KEYBOARD_SPLIT_POINT) {
						triggerStrum(event);
				}
				//single notes
				else {
						event.send();
				}
		}
		//NoteOff ..................................................................
		else if (event instanceof NoteOff) {
				//cancel strum if the note is in the chord range, or if that note 
				//already triggered a chord (ie if splitpoint was changed while playing)
				if (event.pitch <= KEYBOARD_SPLIT_POINT 
				|| ACTIVE_NOTES.indexOf(event.pitch) !== -1) { 
						cancelStrum(event);												
				} else {
						event.send();  //single notes
				}
		}
		//Sustain Pedal ............................................................
		else if (event instanceof ControlChange && event.number === 64) {
				if (event.value <= 64) {
						SUSTAIN_ENABLED = false;
				}
				else {
						SUSTAIN_ENABLED = true;
				}
				event.send();
		}
		//All other events .........................................................
		else {
				event.send();
		}
}

//___________________________ ParameterChanged () ______________________________
/*
		Update variables when the corresponding UI element is changed.

		@param param is the index of the parameter that changed
		@param value is the new value of the param
*/		
function ParameterChanged (param, value) {
		switch (param) {
				case 1:
						TYPE = value;
						break;
				case 3:
						STRUM_DIRECTION = value;
						break;
				case 4:
						STRUM_DIVISION = value;
						break;
				case 5:
						STRUM_DIVISION_CURVE = value;
						break;
				case 6:
						STRUM_RANDOM_DIVISION = value;
						break;
				case 7:
						STRUM_VELOCITY_CURVE = value;
						break;
				case 8:
						STRUM_RANDOM_VELOCITY = value;
						break;
				case 10:
						ARP_DIRECTION = value;
						break;
				case 11:
						ARP_DIVISION = value;
						break;
				case 12:
						ARP_RANDOM_DIVISION = value;
						break;
				case 13:
						ARP_VELOCITY_CURVE = value;
						break;
				case 14:
						ARP_RANDOM_VELOCITY = value;
						break;
				case 16:
						KEYBOARD_SPLIT_POINT = value; 
						break;
				case 18:
						C_CHORD = value;
						break;
				case 19:
						C_SHARP_CHORD = value;
						break;
				case 20:
						D_CHORD = value;
						break;
				case 21:
						D_SHARP_CHORD = value;
						break;
				case 22:
						E_CHORD = value;
						break;
				case 23:
						F_CHORD = value;
						break;
				case 24:
						F_SHARP_CHORD = value;
						break;
				case 25:
						G_CHORD = value;
						break;
				case 26:
						G_SHARP_CHORD = value;
						break;
				case 27:
						A_CHORD = value;
						break;
				case 28:
						A_SHARP_CHORD = value;
						break;
				case 29:
						B_CHORD = value;
						break;
				default:
						if (DEBUG) {
								Trace("ParameterChanged(): error: unknown parameter index");
						}
		}
}

//______________________________ ProcessMIDI () ________________________________
/*
		Trigger scheduled events that fall within this process block
*/	
function ProcessMIDI () {
		var musicInfo = GetTimingInfo();
		TEMPO = musicInfo.tempo;

 		var strumTime = TYPE;	//check if strum is in ms or beats
    switch (strumTime) {		
    		//ms
     		case 0:
        		DIVISION = musicInfo.meterNumerator * 128;
 						break;
     		//beats
     		case 1:
     				DIVISION = 2 * getDivisionTime(ARP_DIVISION);
     				break;
     		default:
     				if (DEBUG) {
     						Trace("Error in strumTime");
     				}
    }

		//calculate the current beat, and lookahead time
    var lookAheadEnd = musicInfo.blockEndBeat;
    var beatToSchedule = 
    						Math.ceil(musicInfo.blockStartBeat * DIVISION) / DIVISION;
		//track the current beat in a global variable
		CURRENT_BEAT = beatToSchedule;
				
		//calculate if current beat is a downbeat or an upbeat
		var divisionLength = 1/(DIVISION/128);
		var deviation = beatToSchedule - Math.floor(beatToSchedule);
		var direction = 0;
		
		if (TYPE === 0) {
				direction = STRUM_DIRECTION;
		} else {
				direction = ARP_DIRECTION;
		}
				
		if (direction == 4) {        //follow beats 1/8
				divisionLength *= 2;
		} else if(direction == 5) {  //follow beats 1/16
				if(deviation >= .5) {   
						deviation -= .5;
				}
		} else {
				//do nothing
		}
				
		var downRange = divisionLength - divisionLength / 2;
					
		//IS_DOWN_BEAT is accessed in getStrum()
		if ((deviation <= downRange ) || (deviation >= downRange * 3 )) {
				IS_DOWN_BEAT = true;
		} else {
				IS_DOWN_BEAT = false;
		}
	 		     			
   	//for each note in the chord (excluding the first one, which is sent 
   	//immediately)
		for (var i = 1; i < CURRENT_CHORD.length; i++) {
				//if STRUM_STOPPED is flagged
				if (STRUM_STOPPED) {
						if (DEBUG) {
								Trace("stopping loop");
						}
								
						//reset CURRENT_CHORD
						CURRENT_CHORD = [];
						break;
				}
            		            		
				//check if the current chord note is scheduled to be played in this 
				//block and the note has not already been played       
				if (TIMING_ARRAY[i] >= musicInfo.blockStartBeat
				&& TIMING_ARRAY[i] <= musicInfo.blockEndBeat
				&& SENT_NOTES.indexOf(CURRENT_CHORD[i]) === -1) {         
						//create the note event with pitch velocity and timing from the 
						//respective arrays   		
						var noteOn = new NoteOn();
						noteOn.pitch = CURRENT_CHORD[i];
						noteOn.velocity = VELOCITY_ARRAY[i];
						noteOn.sendAtBeat(TIMING_ARRAY[i]);
            				
         		//track that this note has been played 
						SENT_NOTES.push(CURRENT_CHORD[i]);
				} 
				//if the scheduled time has already passed, but the note wasn't sent
				//yet, send the note immediately
				else if (TIMING_ARRAY[i] < musicInfo.blockStartBeat 
				&& SENT_NOTES.indexOf(CURRENT_CHORD[i]) === -1) {
						var noteOn = new NoteOn();
						noteOn.pitch = CURRENT_CHORD[i];
						noteOn.velocity = VELOCITY_ARRAY[i];
						noteOn.sendAfterMilliseconds(i);
								
						SENT_NOTES.push(CURRENT_CHORD[i]);
				}
		} 
}

//custom functions -------------------------------------------------------------

//____________________________ calculateStrum() ________________________________
/*
		This function calculates the note order, velocity, and time for all notes in
		the chord. These calculated values are read in ProcessMIDI() and played at 
		the specifed time
		
		It also immediately sends the first note of the chord as it is played.

		@param chord is the chord to strum
		@param velocity is the played velocity of a key
		@param direction is the calculated direction of the strum
*/	
function calculateStrum (chord, velocity, direction) {
	  SENT_NOTES = [];		//reset the sentNote tracking
		
		switch (direction) {		
				//DOWN 
				case 0:
						//do nothing
						if (DEBUG) { 
								Trace("Down");
						}
						break;
				//UP
				case 1:
						if (DEBUG) { 
								Trace("Up");
						}

						//invert array 
						var reversedChord = [];
						for (var i = chord.length - 1; i >= 0; i--) {
								reversedChord.push(chord[i]);
						}
						
						//replace original chord with reversed chord
						CURRENT_CHORD = reversedChord;
						break;
				default:
						if (DEBUG) {
								Trace("Error calculating strum!");
						}
		}
		
		var divisionLength = STRUM_DIVISION;
		var previousDivision = divisionLength;  //to track incremental offset
		var curve = 1 + STRUM_DIVISION_CURVE; //make positive
		
		//for all notes in the chord
		for (var i = 0; i < CURRENT_CHORD.length; i++) {
				//play the first note immediately ----------------------------------
				if (i === 0) {		
						var firstNote = new NoteOn();
						firstNote.pitch = CURRENT_CHORD[0];
						firstNote.velocity = velocity;
						firstNote.send();
										
						//track when the strum started
						START_BEAT = CURRENT_BEAT;
						
						//check what division the start beat is on
						var deviation = Math.abs(START_BEAT - Math.round(START_BEAT));
						
						//if the deviation is not on beat
						if(deviation > 0 && deviation < 1/(DIVISION/2)) {
								//remove the deviation from the start beat 
								//(so that all following beats are not pushed back in time)
								START_BEAT = START_BEAT - deviation;
						}
				}
						
				var maxRandomVelocity = 0;		
								
				//calculate time ---------------------------------------------------
				//if calculating milliseconds
				if (TYPE == 0) {		
						var timeOffset;
				
						if (i === 0) {
								timeOffset = 0;
						} else if (i === 1) {
								timeOffset = divisionLength;
						} else {
								timeOffset = divisionLength + (curve * previousDivision);	
						}		
						
						previousDivision = timeOffset;
												
						//generate a random time offset						
						var maxRandom = Math.random() * STRUM_RANDOM_DIVISION;
						var minRandom = maxRandom - (maxRandom * 2);
						var totalOffset = timeOffset + randomInRange(minRandom,maxRandom);

						//convert the total offset from ms to beat and add to current beat
						var beatToPlay = START_BEAT + convertToBeat(totalOffset);
						
						//prevent timing to happen before the previous string's time
						while (beatToPlay < TIMING_ARRAY[i - 1]) {
								//generate a random time offset						
								var maxRandom = Math.random() * STRUM_RANDOM_DIVISION;
								var minRandom = maxRandom - (maxRandom * 2)
								var totalOffset = timeOffset 
																		+ randomInRange(minRandom,maxRandom);
								
								beatToPlay = START_BEAT + convertToBeat(totalOffset);
						}
								
						//add the beat to the timing array
						TIMING_ARRAY.push(beatToPlay);					
						
						//scale the velocity so that velocity either increases or decreases 
						//as the strum advances
						velocity = velocity + (i * STRUM_VELOCITY_CURVE);	
						maxRandomVelocity = STRUM_RANDOM_VELOCITY;
				}
				//if calculating beats
				else if (TYPE === 1) {						
						var divisionLength = 1 / getDivisionTime(ARP_DIVISION);
						var maxRandom = Math.random() * ARP_RANDOM_DIVISION;
						var minRandom = maxRandom - (maxRandom * 2)
						var randomPercentage = randomInRange(minRandom,maxRandom);
						var offset = divisionLength / 100 * randomPercentage;		
						var timeToSchedule = START_BEAT 
																		+ ((1 / (DIVISION / 2)) * i) + offset;
						
						while (timeToSchedule < TIMING_ARRAY[i - 1] 
						|| timeToSchedule < START_BEAT) {
								var maxRandom = Math.random() * ARP_RANDOM_DIVISION;
								var minRandom = maxRandom - (maxRandom * 2);
								var randomPercentage = randomInRange(minRandom,maxRandom);
								var offset = divisionLength / 100 * randomPercentage;
								
								timeToSchedule = START_BEAT 
																		+ ((1 / (DIVISION / 2)) * i) + offset;
						}
						
						//add the time to the TIMING_ARRAY
						TIMING_ARRAY.push(timeToSchedule);
						
						//scale the velocity so that velocity either increases or decreases 
						//as the strum advances
						velocity = velocity + (i * ARP_VELOCITY_CURVE);
						maxRandomVelocity = ARP_RANDOM_VELOCITY;
				}		
				else {
						if (DEBUG) {
								Trace("Error in calculating beats");
						}
				}	
				
				//calculate velocity -----------------------------------------------
				//add randomness to velocity				
				var minRandomVelocity = maxRandomVelocity - (maxRandomVelocity * 2);
				
				velocity += randomInRange(minRandomVelocity, maxRandomVelocity);
																
				//keep velocity in range
				if(velocity > 127) {
						velocity = 127;
				}

				if(velocity < 1) {
						velocity = 1;
				}
								
				//add velocity to array
				VELOCITY_ARRAY.push(MIDI.normalizeData(velocity));
		}
}

//______________________________ cancelStrum () ________________________________
/*
		This function cancels the previous strum, by stopping all of the notes in
		the currently playing chord. Only stop a chord, if all octaves of that chord
		are released. Remove this note from ACTIVE_NOTES

		@param event is the incoming note off event, whose pitch to check against	
*/		
function cancelStrum (event) {
		if (DEBUG) {
				Trace("Cancel Strum");
		}
						
		//remove the note from ACTIVE_NOTES
		var noteIndex = ACTIVE_NOTES.indexOf(event.pitch);
		ACTIVE_NOTES.splice(noteIndex, 1);

		var octaveIsDown = false; //same note is being triggered in another octave
		for (i = 0; i < ACTIVE_NOTES.length; i++) {
				if (event.pitch % 12 === ACTIVE_NOTES[i] % 12) {
						octaveIsDown = true;
						break;
				}
		}
						
		if (! octaveIsDown) {
				stopChord(getChord(event.pitch));
		}
						
		//if there are no active notes, reset the chord, timing, and velocity arrays
		//set STRUM_STOPPED to true
		if (ACTIVE_NOTES.length === 0) {
				STRUM_STOPPED = true;
				CURRENT_CHORD = [];
				TIMING_ARRAY = [];
				VELOCITY_ARRAY = [];
		}
}

//_________________________________ Chord () ___________________________________
/**
		This is a Chord object, which contains the name and notes of a chord. The 
		object must be instantiated with a name and notes. 

		var chord = new Chord(<string>, <array>);

		@param name is a string name of the chord
		@param notes is an array of pitches that make up the chord
 */
function Chord (name, notes) {
		this.name = name;
		this.notes = notes;
}

//_______________________________ convertToBeat() ______________________________
/*
		This function converts a time in milliseconds to a beat length.

		@param ms is the millisecond value to convert
		@return the converted beat value
*/	
function convertToBeat (ms) {
		var quarterNote = 60000 / TEMPO;	
		var convertedBeat = ms / quarterNote;
		return convertedBeat;
}

//_________________________________ getChord() _________________________________
/*
		This function returns a copy of the chord that is assigned to the incoming 
		note.

		@param note is the note that was triggered
		@return a copy of the associated chord to play
*/	
function getChord (note) {
		//get the note that is triggered, regardless of octave
		var baseNote = note % 12;
		var chordToPlay;
				
		switch (baseNote) {
				case 0:
						chordToPlay = ARRAY_OF_CHORDS[C_CHORD].notes.slice(0);
						break;
				case 1:
						chordToPlay = ARRAY_OF_CHORDS[C_SHARP_CHORD].notes.slice(0);
						break;
				case 2:
						chordToPlay = ARRAY_OF_CHORDS[D_CHORD].notes.slice(0);
						break;					
				case 3:
						chordToPlay = ARRAY_OF_CHORDS[D_SHARP_CHORD].notes.slice(0);
						break;
				case 4:
						chordToPlay = ARRAY_OF_CHORDS[E_CHORD].notes.slice(0);
						break;
				case 5:
						chordToPlay = ARRAY_OF_CHORDS[F_CHORD].notes.slice(0);
						break;				
				case 6:
						chordToPlay = ARRAY_OF_CHORDS[F_SHARP_CHORD].notes.slice(0);
						break;
				case 7:
						chordToPlay = ARRAY_OF_CHORDS[G_CHORD].notes.slice(0);
						break;				
				case 8:
						chordToPlay = ARRAY_OF_CHORDS[G_SHARP_CHORD].notes.slice(0);
						break;
				case 9:
						chordToPlay = ARRAY_OF_CHORDS[A_CHORD].notes.slice(0);
						break;				
				case 10:
						chordToPlay = ARRAY_OF_CHORDS[A_SHARP_CHORD].notes.slice(0);
						break;
				case 11:
						chordToPlay = ARRAY_OF_CHORDS[B_CHORD].notes.slice(0);
						break;
				default:
						chordToPlay = ARRAY_OF_CHORDS[0].notes.slice(0);
						if (DEBUG) {
								Trace("error in chord select");
						}
		}
		
		return chordToPlay;
}

//_____________________________ getDivisionTime() ______________________________
/*
		This function returns the division for the corresponding menu index

		@param index is the index of the division menu item
		@return the beat division as a division of a quarter note
*/	
function getDivisionTime (index) {
		//value to return
    var convertedValue;
	
		switch (index) {
				case 0:
						convertedValue = 6; //1/16T
						break;
				case 1:
						convertedValue = 4;  //1/16
						break;
				case 2: 
						convertedValue = 3; //1/8T
						break;
				case 3: 
						convertedValue = 2;  //1/8
						break;
				case 4: 
						convertedValue = 1.5; //1/4T
						break;
				case 5:
						convertedValue = 1; //1/4
						break;
				default:
						if (DEBUG) {
		            Trace("error in getDivisionTime()");
    					}
    }
    
    return convertedValue;
}

//_________________________________ getStrum() _________________________________
/*
		This function returns an int representing an up or down strum
		0 = down
		1 = up

		@param pitch is the triggering note, and is used for reseting the down
		       strum when TYPE = Alternate: Down On New Note
		@return 0 or 1 as the direction of the strum
*/	
function getStrum (pitch) {
		var strumToPlay;
		var direction = 0;
		
		if(TYPE === 0) {
				direction = STRUM_DIRECTION;
		} else {
				direction = ARP_DIRECTION;
		}
								
		switch (direction) {
				//down
				case 0:
						strumToPlay = 0;
						break;
				//up						
				case 1:
						strumToPlay = 1;
						break;		
				//alternate		
				case 2:
						if (PREVIOUS_STRUM === 0) {
								strumToPlay = 1;
						} else {
								strumToPlay = 0
						}	
						break;
				//down on new note						
				case 3:
						//if a new chord is triggered, reset to down
						if (LAST_NOTE_PLAYED != pitch % 12) {
								strumToPlay = 0;
						}
						//if the same chord is triggered, alternate
						else {
								if (PREVIOUS_STRUM === 0) {
										strumToPlay = 1;
								} else {
										strumToPlay = 0
								}
						}
						break;		
				//follow beats	1/8 and 1/16	
				case 4:
				case 5:
						if (IS_DOWN_BEAT) {
								strumToPlay = 0;
						} else {
								strumToPlay = 1;
						}
						break;
				default:
						if (DEBUG) {
								Trace("error in strum direction");
						}
			}
			
			//track the last strum direction
			PREVIOUS_STRUM = strumToPlay;

			return strumToPlay;
}

//______________________________ randomInRange() _______________________________
/*
		This function returns a random number in the given range

		@param min is the minimum range of the random number
		@param max is the maximum range of the random number
		@return a random numnber in the given range
*/	
function randomInRange (min, max) {
		return Math.random() * (max - min) + min;
}

//________________________________ stopChord() _________________________________
/*
		This function sends noteOffs for all notes in the given chord

		@param chord is the chord array containing the notes to stop
*/	
function stopChord (chord) {		
		//send noteOffs for all notes in the chord
		for (i = 0; i < chord.length; i++) {
				var noteOff = new NoteOff();
				noteOff.pitch = chord[i];
				noteOff.send();
		}
}

//_____________________________ triggerStrum () ________________________________
/*
		This function updates all required variables to trigger a new strum. 

		@param event is the incoming MIDI note on event
*/	
function triggerStrum (event) {

		stopChord(PREVIOUS_CHORD);			//prevent overlapping chords
		
		//quickly turn sustain off and on again, to prevent sustained notes from the
		//previous chord
		if (SUSTAIN_ENABLED) {
				var sustainPedal = new ControlChange;
				sustainPedal.number=64;
				sustainPedal.value=0;
				sustainPedal.send();		
								
				sustainPedal.value= 64;
				sustainPedal.sendAfterMilliseconds(5);
		}

		STRUM_STOPPED = false;		//set flag to false (strum IS playing)
				
		ACTIVE_NOTES.push(event.pitch);		//add this pitch to list of active notes

		var chordToPlay = getChord(event.pitch);		//get the chord for this pitch	
	
		//reset the chord, timing, and velocity arrays
		CURRENT_CHORD = [];
		TIMING_ARRAY = [];
		VELOCITY_ARRAY = [];
						
		//make a COPY of the chord and store it in a global variable
		CURRENT_CHORD = chordToPlay.slice(0);
						
		//caclulate the strum time, and velocity of the chord to play
		calculateStrum(chordToPlay, event.velocity, getStrum(event.pitch));
						
		//make a COPY of the current chord to track the last chord that was played
		PREVIOUS_CHORD = CURRENT_CHORD.slice(0);
						
		//track the last note that was played
		LAST_NOTE_PLAYED = event.pitch % 12;		
}


//Create UI --------------------------------------------------------------------
var PluginParameters = [{
		name:"------ Select ------",
		type:"text",
}, {
		name:"Type",
		type:"menu",
		valueStrings:["Strum","Arpeggio"],
		numberOfSteps:2,
		defaultValue:0
}, {
		name:"------ Strum Controls ------",
		type:"text"
}, {
		name:"Direction (Strum)",
		type:"menu",
		valueStrings:DIRECTION_TYPES,
		numberOfSteps:DIRECTION_TYPES.length - 1,
		defaultValue:4
}, {
		name:"Division (Strum)",
		type:"linear",
		minValue:1,
		maxValue:500,
		numberOfSteps:499,
		defaultValue:4,
		unit:"ms"
}, {
		name:"Division Curve (Strum)",
		type:"linear",
		minValue:-.5,
		maxValue:.5,
		defaultValue:-.1,
		numberOfSteps:100
}, {
		name:"Random Division (Strum)",
		type:"linear",
		minValue:0,
		maxValue:100,
		numberOfSteps:100,
		defaultValue:10,
		unit:"%"
}, {
		name:"Velocity Curve (Strum)",
		type:"linear",
		minValue:-10,
		maxValue:10,
		numberOfSteps:200,
		defaultValue:-4
}, {
		name:"Random Velocity (Strum)",
		type:"linear",
		minValue:0,
		maxValue:50,
		numberOfSteps:50,
		defaultValue:10,
		unit:"%"
}, {
		name:"------ Arpeggio Controls ------",
		type:"text"
}, {
		name:"Direction (Arpeggio)",
		type:"menu",
		valueStrings:DIRECTION_TYPES,
		numberOfSteps:DIRECTION_TYPES.length - 1,
		defaultValue:3
}, {
		name:"Division (Arpeggio)",
		type:"menu",
		valueStrings:TIME_DIVISIONS,
		defaultValue:3,
		numberOfSteps:6		
}, {
		name:"Random Division (Arpeggio)",
		type:"linear",
		minValue:0,
		maxValue:100,
		numberOfSteps:100,
		defaultValue:10,
		unit:"%"
}, {
		name:"Velocity Curve (Arpeggio)",
		type:"linear",
		minValue:-10,
		maxValue:10,
		numberOfSteps:200,
		defaultValue:-2
}, {
		name:"Random Velocity (Arpeggio)",
		type:"linear",
		minValue:0,
		maxValue:50,
		numberOfSteps:50,
		defaultValue:10,
		unit:"%"
}, {
		name:"------ Chord Assignments ------",
		type:"text"
}, {
		name:"Keyboard Split Point",
		type:"menu",
		valueStrings:MIDI._noteNames,
		numberOfSteps:MIDI._noteNames.length - 1,
		defaultValue:59
}, {
		name:"",
		type:"text"
}, {
		name:"C Chord",
		type:"menu",
		valueStrings:CHORD_NAMES,
		numberOfSteps:CHORD_NAMES.length - 1,
		defaultValue:0
}, {
		name:"C# Chord",
		type:"menu",
		valueStrings:CHORD_NAMES,
		numberOfSteps:CHORD_NAMES.length - 1,
		defaultValue:36
}, {
		name:"D Chord",
		type:"menu",
		valueStrings:CHORD_NAMES,
		numberOfSteps:CHORD_NAMES.length - 1,
		defaultValue:9
}, {
		name:"D# Chord",
		type:"menu",
		valueStrings:CHORD_NAMES,
		numberOfSteps:CHORD_NAMES.length - 1,
		defaultValue:1
}, {
		name:"E Chord",
		type:"menu",
		valueStrings:CHORD_NAMES,
		numberOfSteps:CHORD_NAMES.length - 1,
		defaultValue:17
}, {
		name:"F Chord",
		type:"menu",
		valueStrings:CHORD_NAMES,
		numberOfSteps:CHORD_NAMES.length - 1,
		defaultValue:20
}, {
		name:"F# Chord",
		type:"menu",
		valueStrings:CHORD_NAMES,
		numberOfSteps:CHORD_NAMES.length - 1,
		defaultValue:8
}, {
		name:"G Chord",
		type:"menu",
		valueStrings:CHORD_NAMES,
		numberOfSteps:CHORD_NAMES.length - 1,
		defaultValue:28
}, {
		name:"G# Chord",
		type:"menu",
		valueStrings:CHORD_NAMES,
		numberOfSteps:CHORD_NAMES.length - 1,
		defaultValue:16
}, {
		name:"A Chord",
		type:"menu",
		valueStrings:CHORD_NAMES,
		numberOfSteps:CHORD_NAMES.length - 1,
		defaultValue:37
}, {
		name:"A# Chord",
		type:"menu",
		valueStrings:CHORD_NAMES,
		numberOfSteps:CHORD_NAMES.length - 1,
		defaultValue:40
}, {
		name:"B Chord",
		type:"menu",
		valueStrings:CHORD_NAMES,
		numberOfSteps:CHORD_NAMES.length - 1,
		defaultValue:46
}]; 