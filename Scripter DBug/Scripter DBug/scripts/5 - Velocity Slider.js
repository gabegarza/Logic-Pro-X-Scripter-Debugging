//5 - Velocity Slider

/*
    The GetParameter() function retrieves information from parameters defined 
    with var PluginParameters.
    
    The GetParameter name argument must match the defined PluginParameters name 
    value.
*/

//Open the Mod Wheel Glissando JavaScript in the Script Editor to see how the 
//GetParameter function is used.

function HandleMIDI(event) {

    //retrieves "Note Velocity" information from the defined "Note Velocity" 
    //parameter        
    event.velocity = GetParameter("Note Velocity");  
        
    event.send(); //sends the note event
}

//create a linear parameter called "Note Velocity" with a range of 1 to 127, and 
//a default value of 80
var PluginParameters = [{name:"Note Velocity", type:"lin", minValue:1, 
                        maxValue:127, numberOfSteps:126, defaultValue:80}];