//14 - Convert Events with Parameter

/*
    Retrieve plug-in parameter values
    
    Call GetParameter() with the parameter name to return a value (number object)
    with the parameter's current value. GetParameter() is typically used inside
    the "HandleMIDI function" or "ProcessMIDI function"
*/

//This example converts modulation events into note events and provides a slider
//to determine note lengths

var NeedsTimingInfo = true;

//create a slider (default range 0 - 100)
var PluginParameters = [{	name:"Note Length", type:"lin", minValue:0, maxValue: 100, 
												numberOfSteps:100, defaultValue:0, unit:"%"}]; 
												                                              
function HandleMIDI(event) {

    //if event is MIDI cc1 (modwheel)
    if(event instanceof ControlChange && event.number == 1) {
    
        var note = new NoteOn; //create a NoteOn object
        
        //since modwheel's range is 0-127, and pitch range is 1-127
        //convert a modwheel value of 0 to 1
        if(event.value == 0)
            event.value = 1;
            
        note.pitch = event.value; //use cc value as note pitch
        note.velocity = 100; //use velocity 100
        note.send(); //send note on
        
        var off = new NoteOff(note); //create a NoteOff object that inherits the
                                     //NoteOn's pitch and velocity
        
        //retrieve the parameter value of the slider you created (add 0.1 to
        //guarantee note on and off are not simultaneous
        var delayInBeats = GetParameter("Note Length")/100 + 0.1; 
                                                 
        off.sendAfterBeats(delayInBeats); //send note off after the length in
                                          //beats is set via the slider
    }
}