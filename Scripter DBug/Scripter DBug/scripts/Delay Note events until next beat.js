/* 
Delay Note events until next beat
*/

var NeedsTimingInfo = true;

function HandleMIDI(e) {
	var info = GetTimingInfo();
	
	if (e instanceof NoteOn)
		e.sendAtBeat(Math.ceil(info.blockStartBeat));
	else if (e instanceof NoteOff)
		e.sendAtBeat(Math.ceil(info.blockStartBeat) + 1);
	else
		e.send();
}
