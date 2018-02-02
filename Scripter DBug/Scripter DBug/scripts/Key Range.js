// limit pitch range of notes

var activeNotes = [];

function HandleMIDI(event)
{
	if (event instanceof NoteOn) {
		if (event.pitch > GetParameter('Maximum Pitch'))
			return undefined;  // don't send if too high
		if (event.pitch < GetParameter('Minimum Pitch'))
			return undefined;  // don't send if too low
		else {
			activeNotes.push(event);
			event.send()
		}
	}
	else if (event instanceof NoteOff) {
		for (i=0; i < activeNotes.length; i++) {
			if (event.pitch == activeNotes[i].pitch) {
				event.send();
				activeNotes.splice(i,1);
				break;
			}
		}
	}
	else { // pass non-note events through
		event.send();
	}
}

var PluginParameters = [
	{	name:'Maximum Pitch', type:'lin', 
		minValue:0, maxValue:127, numberOfSteps:127, defaultValue:115},
	{	name:'Minimum Pitch', type:'lin',
		minValue:0, maxValue:127, numberOfSteps:127, defaultValue:30}
];
