//13 - Menu Creation

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

//This creates a menu named "Range" with the options: "Low", "Mid", and "High"
var PluginParameters = [{name:"Range", type:"menu", 
                        valueStrings:["Low", "Medium", "High"],
                        defaultValue:0, numberOfSteps:3}];