// ***************************************************
// ******** START SIMULATION OF LOGIC PRO X
//
// Create your objects, then call HandleMIDI() or ??
// which should be in the above Logic Pro X Scripter Object
// which then will be called by Visual Studio so you can
// debug your script.
//
// ***************************************************

// Simulate ParameterChanged()
ParameterChanged(0, 0);

// Seting time signature at 4/4
// When you call GetTimingInfo(),
// you'll see this change.
// Remember, __TimingInfo is just
// simulating what Logic Pro X
// is going to return to you.
__TimingInfo.meterNumerator = 4;
__TimingInfo.meterDemoninator = 4;

var n = new NoteOn();
n.pitch = 48;
HandleMIDI(n);

var no = new NoteOff();
no.pitch = 48;
HandleMIDI(no);

// Seting time signature at 3/4
__TimingInfo.meterNumerator = 3;
__TimingInfo.meterDemoninator = 4;

HandleMIDI(n);
HandleMIDI(no);

// Simulate ProcessMIDI()
ProcessMIDI();

n.pitch = 0;