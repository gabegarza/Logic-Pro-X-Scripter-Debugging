//6 - ParameterChanged Callback

/*
    The ParameterChanged() function lets you perform tasks triggered by changes 
    to plug-in parameters. ParameterChanged is called each time one of the 
    plug-in’s parameters is set to a new value. ParameterChanged is also called 
    once for each parameter when you load a plug-in setting.
    
    ParameterChanged is called with two arguments, first the parameter index (an
    integer number starting from 0), then the parameter value (a number).
*/


//Print parameter changes to the plug-in console. This example also creates a 
//slider in the plug-in window and assigns the ParameterChanged function to it.

//create a slider (default range 0.0 - 1.0)
var PluginParameters = [{name:"Slider", type:"lin", minValue:0, maxValue:1, numberOfSteps:100, defaultValue:0}]; 

function ParameterChanged(param, value) {

    // if it's the slider you just created
    if (param == 0) {
    
        Trace(value); // print the value to the console
    }
}

