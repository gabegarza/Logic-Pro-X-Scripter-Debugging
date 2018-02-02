// Stutter

var NeedsTimingInfo = true;

function HandleMIDI(e) {
	e.send();
	var info = GetTimingInfo();
	var roll = GetParameter("Stutter");
	var rollFactor = GetParameter("Repeats");
	var secondsPerBeat = 1 / (info.tempo / 60);
	var rollBase = secondsPerBeat * 1000;
	var rollTime = rollBase / Math.pow(2, roll) * rollFactor;
	
	if (e instanceof NoteOn)
		// drumroll please...
		if (roll > 0) {
			for (i=0; i < roll; i++) {
				var rollIteration = rollTime + (rollTime * i);
				var rollTotal = rollIteration;
				e.sendAfterMilliseconds(rollTotal);
				var noteOff = new NoteOff(e);
				noteOff.sendAfterMilliseconds(rollTotal + 1);
		}
	}
}

var PluginParameters = [
  {name:"Stutter", type:"linear",
  minValue:0, maxValue:12, numberOfSteps:12, defaultValue:3},
  
  {name:"Repeats", type:"linear",
  minValue:1, maxValue:12, numberOfSteps:11, defaultValue:1}];