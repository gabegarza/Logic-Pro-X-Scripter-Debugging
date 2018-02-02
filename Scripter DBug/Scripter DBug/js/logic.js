// **************************************************************
// ******** START DEFAULT LOGIC PRO X Functions
//
// NEVER PUT THE FOLLOWING IN YOUR LOGIC PRO X SCRIPTER OBJECTS
//
// **************************************************************
function GetParameter(paramName) {
    var plugInParameter = PluginParameters.find(function (o) { return o.name === paramName; });

    // I commented out the following line because if you pass
    // an invalid paramName, you'd want to know about it now
    // when your debugging in Visual Studio.
    // If you don't catch it now and you put your scripter code
    // in Logic Pro X, Logic Pro X doesn't alter you to the fact
    // that a non-existing paramName was sent, so you script
    // won't do what you're excepting it to do.
    //if (plugInParameter === undefined) {
    //    return plugInParameter;
    //}

    return plugInParameter.defaultValue;

    // As a side note...
    // This implemention of GetParamter() isn't close to what
    // Logic Pro X does since the returned values are
    // project based, not system based.
    // I just implemented GetParamter() so you can further
    // test and ebug your script.
    // Nothing is stopping you from entering code to do
    // whatever you need to, just as long as  you keep in 
    // mind that you should mimic what Logic Pro X does.
}
function SetParameter(paramName, paramValue) {
    // Just reset the plugInParameter.defaultValue to 
    // simulate what Logic Pro X would do and to make
    // sure you can test and debug your Logic Pro X
    // script in Visual Studio.
    var plugInParameter = PluginParameters.find(function (o) { return o.name === paramName; });
    plugInParameter.defaultValue = paramValue;

}
//-----------------------------------------------------------------------------
// The Following functions just help to allow you to test
// and debug your application.
// If they didn't exists, Visual Studio would throw
// an exception and not continue.
//-----------------------------------------------------------------------------
function Trace(o) {
    console.debug('----------------------------------');
    console.debug('Trace:' + o);
    console.debug('----------------------------------');
}
//-----------------------------------------------------------------------------
function SendMIDIEventNow(o) {
    console.debug('----------------------------------');
    console.debug('SendMIDIEventNow:' + o);
    console.debug('----------------------------------');
}
//-----------------------------------------------------------------------------
function SendMIDIEventAfterMilliseconds(o, ms) {
    console.debug('----------------------------------');
    console.debug('SendMIDIEventAfterMilliseconds:' + o + ':' + ms);
    console.debug('----------------------------------');
}
//-----------------------------------------------------------------------------
function SendMIDIEventAtBeat(o, beat) {
    console.debug('----------------------------------');
    console.debug('SendMIDIEventAtBeat:' + o + ':' + beat);
    console.debug('----------------------------------');
}
//-----------------------------------------------------------------------------
function SendMIDIEventAfterBeats(o, beats) {
    console.debug('----------------------------------');
    console.debug('SendMIDIEventAfterBeats:' + o + ':' + beats);
    console.debug('----------------------------------');
}
//-----------------------------------------------------------------------------
// This is an implementaion of a global TimingIno.
// You set any of the properties of __TimingInfo.??
// before call functions like HandleMIDI(), etc...
// as an example, set __TimingInfo.blockStartBeat to 1
// then call HandleMIDI(), then set __TimingInfo.blockStartBeat to 2
// and call HandleMIDI() again to tell HandleMIDI() you're
// at beat 2 in your current Logic Pro X project.
//-----------------------------------------------------------------------------
function _base() { };
TimingInfo.prototype = new _base();
TimingInfo.prototype.constructor = TimingInfo;
//-----------------------------------------------------------------------------
function TimingInfo(e) {

// TimingInfo – Contains timing information that describes the state of the 
//    host transport and the current musical tempo and meter
// Set values to help debug your script
    this.playing = true;        //: boolean Value is true when the host transport is running 
    this.blockStartBeat = 1.2;  //: real    Indicates the beat position at the start of the process block 
    this.blockEndBeat = 2.2;    //: real    Indicates the beat position at the end of the process block 
    this.blockLength = 14.1;    //: real    Indicates the length of the process block in beats.
    this.tempo = 120.1;         //: real    Indicates the host tempo.
    this.meterNumerator = 4;    //: integer Indicates the host meter numerator 
    this.meterDemoninator = 4;  //: integer Indicates the host meter denominator.
    this.cycling = false;       //: boolean Value is true when the host transport is cycling 
    this.leftCycleBeat = 1.2;   //: real    Indicates the beat position at the start of the cycle range 
    this.rightCycleBeat = 1.2;  //: real    Indicates the beat position at the end of the cycle range 

};

var __TimingInfo = new TimingInfo();

function ResetTimingInfo() {
    __TimingInfo.playing = true;
    __TimingInfo.blockStartBeat = 0;
    __TimingInfo.blockEndBeat = 0;
    __TimingInfo.blockLength = 0;
    __TimingInfo.tempo = 120;
    __TimingInfo.meterNumerator = 4;
    __TimingInfo.meterDemoninator = 4;
    __TimingInfo.cycling = true;
    __TimingInfo.leftCycleBeat = 0;
    __TimingInfo.rightCycleBeat = 0;
}

// just reset __TimingInfo
ResetTimingInfo();

//-----------------------------------------------------------------------------
// The Following function GetTimingInfo() allows you to test
// and debug your application.
// If it didn't exist, Visual Studio would throw
// an exception and not continue.
//-----------------------------------------------------------------------------
function GetTimingInfo() {
    return __TimingInfo;
}
//-----------------------------------------------------------------------------
// These are dummy place holders, if you have any of the following
// in your Logic Pro X script, they'll be called instead.
//-----------------------------------------------------------------------------
function ParameterChanged(p1, p2) {
    console.debug('----------------------------------');
    console.debug('ParameterChanged:' + p1 + ':' + p2);
    console.debug('----------------------------------');
}
function ProcessMIDI() {
    console.debug('----------------------------------');
    console.debug('ProcessMIDI');
    console.debug('----------------------------------');
}
function HandleMIDI() {
    console.debug('----------------------------------');
    console.debug('HandleMIDI');
    console.debug('----------------------------------');
}
function Reset() {
    console.debug('----------------------------------');
    console.debug('Reset');
    console.debug('----------------------------------');
}
// **************************************************************
// ******** END DEFAULT LOGIC PRO X Functions
// **************************************************************
