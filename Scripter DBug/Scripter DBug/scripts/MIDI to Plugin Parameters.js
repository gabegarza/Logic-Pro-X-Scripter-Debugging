//_________________________________________________________________
/*   MIDI to Plugin Parameters

This script allows an incoming MIDI message to control multiple plugin parameters. It has a few notable features:
   - Use "Learn MIDI Input" to easy assign the next incoming MIDI message as your MIDI control source. This could
     be a Continous Controller, Pitchbend, Velocity, or even Note value.
   - Select the dropdown menu for a target and choose "Learn plugin parameter", then move a control on your 
     plugin. This will assign the output target to that control.
   - Set the Target Min and Max sliders to set the range of control over the plugin parameter. You can even
     set the min value higher than the max value as a way of inverting the mapping.

*/

/*------------------------------------------------------------------------------------------------
  *
  *   GLOBALS
  *
  *------------------------------------------------------------------------------------------------*/

// -------- SETTINGS

// Change this to change how many targets are created.
var TOTAL_TARGETS = 4;


// -------- CONTROL GATES

// True if learn mode activated for input signal
var LEARN_MODE_ACTIVE = false;

// -------- COUNTERS

// Used when building Target Groups
var NUMBER_OF_TARGET_CONTROLS = 3;


/*------------------------------------------------------------------------------------------------
  *
  *   UI HANDLING
  *
  *------------------------------------------------------------------------------------------------*/



// -------- INPUT SELECTION MENU

/*
* Build set of Non-CC MIDI types
*/
const MIDI_TYPES = {
	off:0,
	note:1,
	velocity:2,
	pitchbend: 3,
	pressure: 4,
	controller: 5,
};

// get CC names from CC #0 to CC#127 and store in array
var INPUT_MENU_NAMES = MIDI._ccNames.slice();

// add CC numbers in front of names
for (var i = 0; i < 128; i++ ) 
{
		INPUT_MENU_NAMES[i] = i + " - " +  INPUT_MENU_NAMES[i];
}

// add Aftertouch to the Menu
INPUT_MENU_NAMES.unshift("Channel Pressure");

// add Pitch to the Menu
INPUT_MENU_NAMES.unshift("Pitchbend");

// add Velocity
INPUT_MENU_NAMES.unshift("Velocity");

// add MIDI Pitch to the Menu
INPUT_MENU_NAMES.unshift("Note");

// add OFF to the menu
INPUT_MENU_NAMES.unshift("-- OFF --");



// -------- SETUP INITIAL UI

var PluginParameters = [{
		name:"------- Input Signal -------",
		type:"text"
},	{
		name:"Learn MIDI Input",
		type:"checkbox", defaultValue:0
},	{	
		name:"Input Type",
		type:"menu",
		valueStrings:INPUT_MENU_NAMES,
		defaultValue:6
},	{		
		name:"----- Output Targets -----",
		type:"text"
}];		

// Create Target groups for the total number of requested targets
for (var i = 1; i <= TOTAL_TARGETS; i++){
	CreateNewTargetGroup(i);
}

//_______________________________ CreateNewTargetGroup () ________________________________
/**
* CreateNewTargetGroup() adds a new UI mapping for a target target, including
* all needed parameters at their default values.
*/
function CreateNewTargetGroup(targetNumber){

	PluginParameters.push({name:"Target " + targetNumber,type:"target"});	
	PluginParameters.push({name:"Min " + targetNumber,type:"lin",minValue:0,maxValue:100,defaultValue:0,unit:"%",numberOfSteps:100});
	PluginParameters.push({name:"Max " + targetNumber,type:"lin",minValue:0,maxValue:100,defaultValue:100,unit:"%",numberOfSteps:100});
}

//----------------------------- ParameterChanged() ------------------------------
/*
		ParameterChanged() is called whenever a UI element is changed.
*/

function ParameterChanged(param, value) {

	var paramName = PluginParameters[param].name;

	if (paramName == "Learn MIDI Input" && value == 1) {
		LEARN_MODE_ACTIVE = true;
	}
}

/*------------------------------------------------------------------------------------------------
  *
  *    DUPLICATING AND SENDING THE VALUE TO MULTIPLE TARGETS
  *
  *------------------------------------------------------------------------------------------------*/


//_______________________________ HandleMIDI () ________________________________
/**
* HandleMIDI()  is a predefined Scripter function that is called once for every
* incoming  MIDI event. Use if/else statements to handle the different types of
* MIDI  events
*
* @param event is the incoming MIDI event
*/

function HandleMIDI (event){

	// Handle valid learn assignments
	if (LEARN_MODE_ACTIVE){
		
		var learnSuccessful = false;

		if (event instanceof NoteOn){
			SetParameter("Input Type",MIDI_TYPES.velocity)
			learnSuccessful = true;
		}

		if (event instanceof ChannelPressure){
			SetParameter("Input Type",MIDI_TYPES.pressure)
			learnSuccessful = true;
		}

		if (event instanceof PitchBend){
			SetParameter("Input Type",MIDI_TYPES.pitchbend)
			learnSuccessful = true;
		}

		if (event instanceof ControlChange){
			SetParameter("Input Type",MIDI_TYPES.controller + event.number);
			learnSuccessful = true;
		}
		
		if (learnSuccessful){
			// Learn mode completed so reset flag and UI
			LEARN_MODE_ACTIVE = false;
			SetParameter("Learn MIDI Input",0);
		}	
	}	

	// If the incoming MIDI event matches our Input Type, send to targets

	var currentInputType = GetParameter("Input Type");

	if (event instanceof NoteOn && currentInputType == MIDI_TYPES.note){
		
		SendValueToAllTargets(event.pitch, MIDI_TYPES.note);
	}

	if (event instanceof NoteOn && currentInputType == MIDI_TYPES.velocity){
		
		SendValueToAllTargets(event.velocity, MIDI_TYPES.velocity);
	}

	if ((event instanceof ChannelPressure && currentInputType == MIDI_TYPES.pressure) ||
		(event instanceof ControlChange && currentInputType == MIDI_TYPES.controller + event.number)){
		
		SendValueToAllTargets(event.value, MIDI_TYPES.controller);
	}

	if (event instanceof PitchBend && currentInputType == MIDI_TYPES.pitchbend){
		
		SendValueToAllTargets(event.value, MIDI_TYPES.pitchbend);
	}

	// also pass through the original event and all non-matching events.
	event.send();
}

//_______________________________ SendValueToAllTargets ( value, midiType ) ________________________________
/**
* SendValueToAllTargets forwards the incoming MIDI value to all currently active
* targets, adjusting the math for either 8bit or 14bit messages.
* 
* @value is the value to be sent
* @midiType is the value's MIDI message type, needed in the case of pitchbend, which is 14bit.
*/

function SendValueToAllTargets(value, midiType){

	// setup input min/max values based on whether this is 8bit or 14bit message
	var minInput = 0;
	var maxInput = 127;
	if (midiType == MIDI_TYPES.pitchbend){
		minInput = -8192;
		maxInput = 8191;
	}

	// Cycle through all targets and send the scaled value
	for (var i = 1; i <= TOTAL_TARGETS; i++){
		var minOutput = GetParameter("Min " + i);
		var maxOutput = GetParameter("Max " + i);
		minOutput /= 100.0;					//Divide by 100 convert from % to 0.0-1.0 scale
		maxOutput /= 100.0;
		
		var scaledValue = ScaleValue(value, minInput, maxInput, minOutput, maxOutput);
		var thisTargetName = "Target " + i;
		var event = new TargetEvent();
		event.target = thisTargetName;
		event.value = scaledValue;
		event.send();
	}
}

/*------------------------------------------------------------------------------------------------
  *
  *    HELPER & MATH FUNCTIONS
  *
  *------------------------------------------------------------------------------------------------*/

//_______________________________ ScaleValue() ________________________________
/**
* ScaleValue() takes a value with known minimum and maximum values and scales
* it to the desired output minimum and maximum.
*
* Returns the scaled value as a float.
*
* @inputValue is the value to be scaled
* @inputMin is the minimum expected value of the input signal
* @inputMax is the maximum expected value of the input signal
* @outputMin is the bottom of the scaled range
* @outputMax is the top of the scaled range
*/
function ScaleValue (inputValue, inputMin, inputMax, outputMin, outputMax) {
	return (((outputMax - outputMin) * (inputValue - inputMin)) / (inputMax - inputMin)) + outputMin;
}
