//************************************************
// Send Delayed Notes
//************************************************

var delayTime, noteLength;

function HandleMIDI(event) {
	if (event instanceof NoteOn) {
		event.sendAfterMilliseconds(delayTime);		
		var off = new NoteOff(event);
		off.sendAfterMilliseconds(delayTime + noteLength);
	}
	else if (event instanceof NoteOff) return;
	else event.send();
}

function ParameterChanged(param, value) {
	var timeInMilliseconds = value * 1000;
	if (param == 0) delayTime = timeInMilliseconds;
	if (param == 1) noteLength = timeInMilliseconds;
}

var PluginParameters = [
	{name:'Delay Time', type:'lin', unit:'sec',
	minValue:0, maxValue:120, defaultValue:1, numberOfSteps:120},	
	{name:'Note Length', type:'lin', unit:'sec',
	minValue:0.1, maxValue:10, defaultValue:1, numberOfSteps:99}
];
