//12 - Slider Ranges

/*
    Create JavaScriptMIDI controls
    
    The JavaScriptMIDI Script Editor lets you use a simple shorthand to add
    standard controllers such as sliders and menus for automated or real time
    control of your plug-ins. The only mandatory property to define a new 
    parameter is a name, which will default to a basic slider. In addition, you 
    can add the following properties to change the type and behavior of controls.
    
    Optional properties:
    
    type: 
        //type one of the following strings as the value:
        "lin" //creates a linear fader
        "log" //creates a logarithmic fader
        "menu" //creates a menu
        "valueStrings" //the menu type requires an additional property that is
                         //an array of strings to show in the menu
    
    defaultValue: //type an integer or floating point number to set a default
                  //value. If not value is typed the default is 0.0
    
    minValue: //type an integer or floating point number to set a minimum value.
              //if no value is typed, the default is 0.0
              
    maxValue: //type an integer or floating point number to set a maximum value.
              //if no value is typed, the default is 1.0
*/

//Define MIDI plug-in controls

//This results in a linear slider type, with five possible positions(steps), and
//a range from 0 to 5.
var PluginParameters = [{name:"Octaves", defaultValue:3, minValue:0, maxValue:5,
                        numberOfSteps:5,type:"lin"}];