//4 - ProcessMIDI Callback

/*
    The ProcessMIDI() function lets you perform periodic (generally 
    timing-related) tasks. This can be used when scripting a sequencer, 
    arpeggiator, or other tempo-driven MIDI effect. ProcessMIDI is generally not 
    required for applications that do not make use of musical timing information 
    from the host. ProcessMIDI is called once per “process block,” which is 
    determined by the host’s audio settings (sample rate and buffer size).
    
    ProcessMIDI is called with no arguments.  

    This function will often be used in combination with the "JavaScript 
    TimingInfo object" to make use of timing information from the host 
    application.  The use of ProcessMIDI and the TimingInfo object is shown in 
    the example.
    
    Note: To enable the GetTimingInfo feature, you need to add 
          var NeedsTimingInfo = true; at the global script level (outside of any 
          functions).
*/    
    
// Define NeedsTimingInfo as true at the global scope to enable GetTimingInfo()
var NeedsTimingInfo = true;

function ProcessMIDI() {

    var info = GetTimingInfo(); // get a TimingInfo object from the host

    //if the transport is running
    if (info.playing) { 
 
        Trace(info.tempo); // print the tempo in the plugin console
    }
}