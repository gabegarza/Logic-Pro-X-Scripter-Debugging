/**
		Drum Kit Designer V-Drum Compatibility 

		This script maps a V-Drum to work with Drum Kit Designer, and is an example
		of how a user can use Scripter to customize their own third party 
		electronic drum kits to work with Drum Kit Designer. Please make sure
		to set the Drum Kit Designer extend parameter "Input Mapping" to GM for this
		script to work correctly. 
*/

//variables to track the current articulation for snare, ride, and hi-hats
var SNARE_POS = 0;
var RIDE_POS = 0;
var HH_OPEN = 0;

function HandleMIDI(event) {
		if (event instanceof ControlChange) {
				// set SNARE_POS variable according to midi CC
				if  (event.number == 16) { 
						if (event.value > 18) {
								SNARE_POS = 1; //offCenter
						} else {
								SNARE_POS = 0; //center
						}
				} 
				// set RIDE_POS variable according to midi CC
				else if (event.number == 17) {
						if (event.value < 90) {
								RIDE_POS = 1; //RideInner
						}	else { 
								RIDE_POS = 0; //normal
						}
				}	
				//set HH_OPEN variable according to midi CC
				else if (event.number == 4) { 
						if (event.value > 114) {
								HH_OPEN = 1;
						} else if (event.value > 94) {
								HH_OPEN = 2;
						} else if (event.value > 74) {
								HH_OPEN = 3
						} else if (event.value > 54) {
								HH_OPEN = 4;
						} else if (event.value > 34) {
								HH_OPEN = 5;
						} else if (event.value > 14) {
								HH_OPEN = 6;
						} else {
								HH_OPEN = 7;
						}
				}
		} else if (event instanceof NoteOn) { 
				switch (event.pitch) {		 		
				case 35: 
						event.pitch = 36; //Kick Rim to Kick 
						break;	 
				case 38: 
						if (SNARE_POS == 1) {
								event.pitch = 34; //Snare OffCenter
						}
						break;	 
				case 22: 
						event.pitch = 46; //HH Rim
						break;	 
				case 26: 
						event.pitch = 46; //HH Edge 
						break;	 
				case 44: 
						event.pitch = 33; //HH foot
						break;
				case 46: 
						event.pitch = 42; //HH top 
						break;
				case 50: 
						event.pitch = 48; //Tom1 Rim 
						break;	 
				case 45: 
						event.pitch = 47; //Tom2 
						break;	 
				case 43: 
						event.pitch = 45; //Tom3 
						break;
				case 58: 
						event.pitch = 45; //Tom3 Rim 
						break;	 
				case 41: 
						event.pitch = 43; //Tom4 
						break;
				case 39: 
						event.pitch = 43; //Tom4 Rim 
						break;	 
				case 59: 
						event.pitch = 52; //Ride Edge 
						break;	 
				case 51: 
						if (RIDE_POS == 1) {
								event.pitch = 59;  //Ride Inner
						}
						break;	
				case 55: 
						event.pitch = 49; //Crash1 
						break;	 
				case 52: 
						event.pitch = 57; //Crash2 Rim 
						break;
				default:
						//do nothing
				}
			
				//set articulation ID for HH opening
				if (event.pitch == 46 || event.pitch == 42) {  
						switch (HH_OPEN) {
						case 1: 
								event.articulationID = 1; 
								break;
						case 2: 
								event.articulationID = 2; 
								break;
						case 3: 
								event.articulationID = 3; 
								break;
						case 4: 
								event.articulationID = 4; 
								break;
						case 5: 
								event.articulationID = 5; 
								break;
						case 6: 
								event.articulationID = 6; 
								break;
						case 7: 
								event.articulationID = 7; 
								break;
						default:
								//do nothing			
						}
				}				

				event.send();
				
				//create and send note off
				var off = new NoteOff(event); 
				off.articulationID = event.articulationID;   
				off.sendAfterMilliseconds(100)	
		}
}