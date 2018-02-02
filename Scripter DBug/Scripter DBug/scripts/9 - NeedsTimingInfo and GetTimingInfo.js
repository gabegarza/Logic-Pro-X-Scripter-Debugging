//9 - NeedsTimingInfo and GetTimingInfo

/*
    JavaScript TimingInfo object
    
    The TimingInfo object contains timing information that describes the state of
    the host transport and the current musical tempo and meter. A TimingInfo
    object can be retrieved by calling GetTimingInfo()
    
    TimingInfo properties:
    
    TimingInfo.playing //uses boolean logic where "true" means the host
                       //transport is running.
    
    TimingInfo.blockStartBeat //a floating point number indicates the beat
                              //position at the start of the process block
                              
    TimingInfo.blockEndBeat //a floating point number indicates the beat position
                            //at the end of the process block
                            
    TimingInfo.blockSize //a floating point number indicates the length of the
                         //process block in beats
                         
    TimingInfo.tempo //a floating point number indicates the host tempo
    
    TimingInfo.meterNumerator //an integer indicates the host meter numerator
    
    TimingInfo.meterDenominator //an integer number indicates the host meter
                                //denominator
                                
    TimingInfo.cycling //uses boolean logic where "true" means the host transport
                       //is cycling
                       
    TimingInfo.leftCycleBeat //a floating point number indicates the beat position
                             //at the start of the cycle range
                             
    TimingInfo.rightCycleBeat //a floating point number indicates the beat
                              //position at the end of the cycle range
                              
    *note: The length of a beat is determined by the host application time
           signature and tempo.                    
*/

//print the beat position while the transport is running

var NeedsTimingInfo = true; //needed for GetTimingInfo() to work

function ProcessMIDI() {

    var info = GetTimingInfo(); //get the timing info from the host
	
    	//if the transport is playing
	  if (info.playing)
		    Trace(info.blockStartBeat); //print the beat position
}