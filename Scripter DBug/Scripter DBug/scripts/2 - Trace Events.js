//2 - Trace Events

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

function HandleMIDI(event) {

    event.trace();//Log events to the plug-in console and do not send them 
                  //anywhere.
}