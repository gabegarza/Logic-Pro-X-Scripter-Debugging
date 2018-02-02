//10 - Event Detection

/*
    JavaScript MIDI object
    
    The MIDI object contains a number of convenient and easy to use functions
    that can be used when writing your scripts.
    
    Note: the MIDI object is a property of the global object, which means that 
          you do not instantiate it, but access it's functions much like you
          would the JavaScript math object. An example is calling 
          MIDI.allNotesOff() directly.
          
    MIDI object properties:
    
    noteNumber(string name) //returns the MIDI note number for a given note name.
                            //for example: 'C3' or 'B#2'
                            //note: you cannot use flats in your argument. Use
                                    A#3, not Bb3

    noteName(number pitch) //returns the name (string) for a given MIDI note
                           //number
                           
    ccName(number controller) //returns the controller name (string) for a given
                              //controller number
                              
    allNotesOff() //sends the all notes off message on all MIDI channels
    
    normalizeStatus(number status) //normalizes a value to the safe range of
                                   //MIDI status bytes (128-239)
                                   
    normalizeChannel(number channel) //normalizes a value to the safe range of
                                     //MIDI channels (1-16)
                                     
    normalizeData(number data) //normalizes a value to the safe range of MIDI
                               //data byes (0-127)    
*/

//pass events through and send all notes off message when receiving controller 20
function HandleMIDI(event) {

    //pass through the event
    event.send();
    
    //if the event is a MIDIcc 20 
    if(event instanceof ControlChange && event.number == 20)
        MIDI.allNotesOff(); //send all notes off message
}