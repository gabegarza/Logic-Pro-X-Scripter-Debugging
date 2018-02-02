//3 - Transpose and Delay

/* 
    The HandleMIDI() function lets you process MIDI events that the plug-in 
    receives. 

    HandleMIDI is called each time a MIDI event is received by the plug-in and is 
    required to process incoming MIDI events. If you do not implement the 
    HandleMIDI function, events pass through the plug-in unaffected.

    HandleMIDI is called with one argument which is a JavaScript object that 
    represents the incoming MIDI event. HandleMIDI and JavaScript Event object 
    use is shown in the examples.
*/

//Repeat notes up one octave with 100ms delay and pass all other events through.
function HandleMIDI(event) {

    event.send(); // send original event

    // if it's a note 
    if (event instanceof Note) { 
    
        event.pitch += 12; // transpose up one octave 
        event.sendAfterMilliseconds(100); // send after delay
    }
}