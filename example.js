var tts=require("./textToSpeech.js");

function cb()
{
	console.log("finished");
}
tts("你好啊",cb);
