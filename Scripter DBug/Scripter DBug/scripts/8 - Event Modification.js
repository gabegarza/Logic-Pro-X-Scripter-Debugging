//8 - Event Modification

/*
    JavaScript Event Object
    
    When the "HandleMIDI function" is called, an Event object represents one MIDI
    event and implements the following methods you can call in your script:
    
    Event.send() //send the event
    
    Event.sendAfterMilliseconds(number ms) //send the event after the specified 
                                           //value has elapsed(can be an integer 
                                           //or floating point number)
                                           
    Event.sendAtBeat(number beat) //as above, but uses the beat value as a delay 
                                  //in beats from the current position
                                  
    Event.trace() //print the event to the plug-in console
    
    Event.toString() //returns a String representation of the event
    
    Event.channel(number) //sets MIDI channel 1 to 16. Note: Event.channel is an
                          //event property, rather than a method
    
    Event.beatPos	//event property, represents the beat position of the event
    							  //Event.send() sends at the beat position set    
    
    Event.articulationID	//property representing the articulation id of the note                  
                          
    The Event object is not instantiated directly, but is a prototype for the 
    following event-specific object types. All of the following types inherit the
    methods described above and the channel property. The event types and their
    properties are passed to HandleMIDI as follows:
    
    Note 	//prototype for NoteOn and NoteOff
    
    NoteOn.pitch(integer number) //pitch from 1-127
    
    NoteOn.velocity(integer number) //velocity from 0-127. A velocity value of 0
                                    //is interpreted as a note off event, not a
                                    //note on.
                                    
    NoteOff.pitch(integer number) //pitch from 0-127
    
    NoteOff.velocity(integer number) //velocity from 0-127
    
    PolyPressure.pitch(integer number) //pitch from 1-127. Polyphonic aftertouch
                                       //is uncommon on synthesizers
                                       
    PolyPressure.value(integer number) //pressure value from 0-127
    
    ControlChange.number(integer number) //controller number from 0-127
    
    ControlChange.value(integer number) //controller value from 0-127
                                        //tip: use MIDI.controllerName(number) to
                                        //look up the name of the controller
                                        
    ProgramChange.number(integer number) //Program change number from 0-127
    
    ChannelPressure.value(integer number) //aftertouch value from 0-127
    
    PitchBend.value(integer number) //14-bit pitch bend value from -8192 to 8191
                                    //a value of 0 is center
                                    
    TargetEvent.target(string)	// Name of target menu entry
    							// - Target events need a corresponding menu entry,
    							// see Tutorial script 15
    
    TargetEvent.value(float)	// Value of set Target from 0.0 to 1.0
*/

//Replace every MIDI event received with a C3 notes on/off
//Tip: you can use the JavaScript "new" keyboard to generate a new instance of an
//Event object of any type.

var NeedsTimingInfo = true; //needed for .sendAfterBeats() to work

function HandleMIDI(event) {
  
    var on = new NoteOn; //make a new note on
    on.pitch = 60; //set it's pitch to C3
    on.send(); //send the note
    
    var off = new NoteOff(on); //make a note off using the note on to initialize 
                               //it's pitch value (to C3)
    off.sendAfterBeats(1); //send a note off one beat later                       
}