// 15 - Control Plug-ins
/*

JavaScript TargetEvent Object
	
	With the TargetEvent object you can create user definable MIDI CC messages 
	or control plug-in parameters.
 
	The object reads the parameter to be modified from a menu in which the user can select 
	a destination MIDI CC, or use the Learn Plug-in Parameter command to assign any 
	parameter of a plug-in inserted after (below) Scripter in the same channel strip. 
	The chosen destination is saved with the plug-in setting.
	
	TargetEvent properties:
	
		TargetEvent.target(string)	// Name of target menu entry
	
		TargetEvent.value(float)	// Value of set target from 0.0 to 1.0
		
*/

// example: control any plug-in parameter with the mod wheel
// to test the function of this script, insert any plug-in or software instrument in 
// the same channel strip, run the script and choose "Learn Plug-in Parameter" in the menu,
// then click any plug-in parameter to control it with the mod wheel

// create a menu for the mod wheel target control by giving a name to the menu entry
// and setting the type to "target"
var PluginParameters = [
// parameter 0
{
		name:"Modwheel Target", 
		type:"target"
}];

// HandleMIDI is called every time the Scripter receives a MIDI event.
function HandleMIDI(incomingEvent)
{
	// remap modulation to target selected in menu
	// check for incoming CC event with number 1 (Modwheel)
	if ((incomingEvent instanceof ControlChange) && (incomingEvent.number == 1))
	{
		var newEvent = new TargetEvent();				// create new Target Event
		newEvent.target = "Modwheel Target";		// set menu entry to be used 
													// by this event by its name
		newEvent.value = incomingEvent.value / 127; // rescale from 0..127 to 0.0...1.0
		newEvent.send();							// send the event
	} else
	{	
		// send all other events
		incomingEvent.send();
	};
};