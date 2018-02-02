/*
		Probability Gate.pst
		
		This script uses probability to determine if an incoming NoteOn event 
		should be sent. The probability can be set via the "Probability" PluginParameter.
*/

var PROBABILITY = 50;

function HandleMIDI(event) {
    if(event instanceof NoteOn) {
        if(eventShouldSend()){
            event.send();
        } 
    } else {
		    event.send();
    }
}

function ParameterChanged(param, value) {
    if (param === 0) {
        PROBABILITY = value;
    }
}

function eventShouldSend() {
   return (Math.ceil(Math.random() * 100) <= PROBABILITY) ? true : false;
}

var PluginParameters = [{
    name:"Probability", 
    type:"linear",
    minValue:0,
    maxValue:100, 
    numberOfSteps:100, 
    defaultValue:50,
    unit:"%"
}];