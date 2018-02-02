/*
    Drum Probability Sequencer: 
    
        This script generates a probability sequencer that  
        allows you to set the probability of a step being triggered.
    
        A value of 100% will always play, a value of 50% will 
        play half of the time, a value of 0% will never play, etc.
                                
        You can choose the MIDI Note to send, and you can either 
        use a fixed velocity for all steps, or you can have the 
        velocity follow the step level (less probable steps will 
        have lower velocities). 
        
        By default, this script loads with a basic pattern that
        sequences Kick, Snare, Closed HH, and Open HH. You can
        also load a flat pattern (all values at 0), or a random
        pattern. To do this, change the variable "configuration"
        to 0, 1, or 2
        
        You may also change the number of tracks to sequence
        (numberOfTracks), and the number of steps in the
        pattern (numberOfSteps).
        
        A step is always equal to a 16th note, so 16 steps is 
        equal to 1 bar, 32 steps is equal to 2 bars, etc.    
        
        The swing slider is global for all voices.             
*/

//sequencer configuration (you can modify this, and re-run the script)
// 0 = default pattern (always 4 tracks, 16 steps)
// 1 = all sliders set to 0
// 2 = random values for all sliders
var configuration = 0;

//the number of tracks to sequence (you can modify this, and re-run the script)
var numberOfTracks = 4;

//the number of steps to sequence (you can modify this, and re-run the script)
var numberOfSteps = 16;

//define default pattern values for each track
var patternMatrix = 
[
    [ 100,  0,  0, 0, 100, 15,  0,  0, 100,  0,  0,  0, 100,  0, 50,  0],
    [   0,  0,  0, 0, 100,  0,  0, 25,   0, 25,  0,  0, 100, 15,  0, 50],
    [  25, 50,  0, 0,  25, 50,  0, 25,  25, 50,  0,  0,  25, 50,  0,  0],
    [   0,  0, 75, 0,   0,  0, 75,  0,   0,  0, 75, 25,   0,  0, 75,  0]
];

//define default pattern notes
var defaultNotes = [36, 38, 42, 46];

//define default pattern velocities
var defaultVelocity = [127, 100, 100, 100] 

//define default pattern "Velocity Follow" mode
var defaultVelocityFollow = [0, 1, 0, 0];

//needed to call GetTimingInfo()
var NeedsTimingInfo = true;
ResetParameterDefaults = true;

function ProcessMIDI() {

    var musicInfo = GetTimingInfo();
    
	  if (musicInfo.playing) {
		
        // calculate beat to schedule
		    var division = 4;
		    var lookAheadEnd = musicInfo.blockEndBeat;
		    var beatToSchedule = Math.ceil(musicInfo.blockStartBeat * division) / division;
		
		    // when cycling, find the beats that wrap around the last buffer
		    if (musicInfo.cycling && lookAheadEnd >= musicInfo.rightCycleBeat) {
		    
			      if (lookAheadEnd >= musicInfo.rightCycleBeat) {
				        var cycleBeats = musicInfo.rightCycleBeat - musicInfo.leftCycleBeat;
				        var cycleEnd = lookAheadEnd - cycleBeats;
			      }
		    }
		    
				var swing = GetParameter("Swing");
		    	var isSwinging = false;
		    	
		    	//only calculate swing if it is active
				if (swing > 50) {
						var divisionPercent = 1 / division;
						var swingPercent = (swing * 2) / 100;
						
						//calculate swing offset
						var swingOffset = (divisionPercent * swingPercent) - divisionPercent;

						if ((beatToSchedule / divisionPercent) % 2 === 0) {
								isSwinging = false;
						} else {
								isSwinging = true;
						}
				}		
				
        // loop through the beats that fall within this buffer
        while ((beatToSchedule >= musicInfo.blockStartBeat && beatToSchedule < lookAheadEnd)
        // including beats that wrap around the cycle point
        || (musicInfo.cycling && beatToSchedule < cycleEnd))
        {
            // adjust for cycle
            if (musicInfo.cycling && beatToSchedule >= musicInfo.rightCycleBeat) {
                beatToSchedule -= cycleBeats;
            }
			     
            var currentStep = ((beatToSchedule * 4) - 4) % numberOfSteps;
            
            //for each track, get the current step and check if it should be triggered
            for(var currentTrack = 1; currentTrack <= numberOfTracks; currentTrack++) {
                     
                //calculate the base index offset for this track      
                //1 is the offset for the Swing parameter  
                var indexOffset =  1 + (4 + numberOfSteps) * (currentTrack-1);       
                     
                //get the index of the current step        
                var stepIndex = (currentStep + 4) + indexOffset;
                
                probability = GetParameter(stepIndex); 
                                
                if(stepShouldPlay(probability) && GetParameter(indexOffset) == 0) {
                
                    var on = new NoteOn;
                    on.pitch = GetParameter(indexOffset + 1);
                 
                    var velocityLevel;
                    
                    //Velocity Follows: Step Level
                    if(GetParameter(3 + indexOffset) == 1) {
                        //scale range of 0 - 100, to 0 - 127
                        velocityLevel = Math.ceil(probability * 1.27);
                    }
                    //Velocity Follows: Slider
                    else {
                        velocityLevel = GetParameter(2 + indexOffset)
                    }
                            
                    if (isSwinging) {
                    		beatToSchedule += swingOffset;
                    }
                                        
                    on.velocity = velocityLevel;
                    on.sendAtBeat(beatToSchedule);
                
                    var off = new NoteOff(on);
                    off.sendAtBeat(beatToSchedule+ 0.1);      
                }
            }
                       			
			      // advance to next beat
			      beatToSchedule += 0.001;
			      beatToSchedule = Math.ceil(beatToSchedule * division) / division;
		    }
	  }
}

//returns true if a random number is less than or equal to the step probability 
function stepShouldPlay(stepValue) {

   var randomNumber = Math.ceil(Math.random()*100);
   
   if(randomNumber <= stepValue) {
       return true;
   }
   else {
       return false;
   }
}

//define the UI -----------------------------------------------------------------

//initialize PluginParameters
var PluginParameters = [];

//if the configuration is the default pattern
if(configuration == 0) {
    //always use 4 tracks and 16 steps 
    numberOfTracks = 4;
    numberOfSteps = 16;
}

//add a global Swing control
PluginParameters.push({
		name:"Swing",
		type:"linear",
		minValue:50,
		maxValue:99,
		numberOfSteps:49,
		defaultValue:50,
		unit:"%"
});

//create all controls for each track
for(var trackNum = 1; trackNum <= numberOfTracks; trackNum++) {

	//start at C1, and increment by a half step for each new track   
    var defaultNoteValue = 36 + (trackNum-1);
    
    var defaultVelocityValue = 100;
    var defaultVelocityMode = 0;
    
    //default pattern
    if(configuration == 0) {
        //use the default notes
        defaultNoteValue = defaultNotes[trackNum-1];
        defaultVelocityValue = defaultVelocity[trackNum-1];
        defaultVelocityMode = defaultVelocityFollow[trackNum-1];
    }
    //random pattern
    else if(configuration == 2) {
        defaultVelocityMode = 1; 
    }
    //flat values
    else {
        //keep original values
    }
    
    PluginParameters.push({name:"Voice " + trackNum + ": On/Off", 
                           type:"menu", valueStrings:["On", "Off"],
                           numberOfSteps:2,
                           minValue:0,
                           maxValue:1,
                           defaultValue:0,});
    
    //Note menu
    PluginParameters.push({name:"Voice " + trackNum + ": Note", 
                           type:"menu", valueStrings: MIDI._noteNames, 
                           defaultValue:defaultNoteValue, 
                           numberOfSteps:127,});
        
    //Velocity slider                     
    PluginParameters.push({name:"Voice " + trackNum + ": Velocity", 
                           minValue:1, maxValue:127, 
                           numberOfSteps:126, 
                           defaultValue:defaultVelocityValue, 
                           type:"linear",});
         
    //Velocity Follows menu                     
    PluginParameters.push({name:"Voice " + trackNum + ": Velocity Follows:", 
                           type:"menu", valueStrings:["Slider", "Step Level"], 
                           numberOfSteps: 2, 
                           minValue:0,
                           maxValue:1,
                           defaultValue:defaultVelocityMode,});
                         
    //create 16 steps for each track                     
    for(var stepNum = 1; stepNum <= numberOfSteps; stepNum++) {
        
        //probability amount for the current track
        var sliderValue;
        
        //default pattern
        if(configuration == 0) {
            sliderValue = patternMatrix[trackNum -1][stepNum - 1];
        }
        //random pattern
        else if(configuration == 2) {
            sliderValue = Math.ceil(Math.random()*100);
        }
        //flat values
        else {
            sliderValue = 0;
        }
    
        //Step Probability slider
        PluginParameters.push({name:"Voice " + trackNum + ": Step " 
                                  + stepNum + " Probability",
                               minValue:0, maxValue:100, 
                               numberOfSteps:100, 
                               defaultValue:sliderValue, 
                               type:"linear",
                               unit:"%"});
    }
};