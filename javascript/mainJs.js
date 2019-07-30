var local = {};

var remote = {};
var SESSIONID = generateUUID();
var accessToken = "bb75f2f1492349c686196d714d9dce22";
var muleBotAccessToken = "6ec8e22772604bbcb3d6e420d0e1edfa";
var devopsBotAccessToken = "e9e8ba482ba44deb89fcbbb5dccc6dda";

var baseUrl = "https://api.api.ai/v1/";
var apihost = "";
var basepath = "home";
var url = apihost + basepath;

function formatTime(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}

$(document).ready(function(){
    $("#myHref").click(function(event){
document.getElementById("myData").setAttribute('data',url);
//document.getElementById("myData").setAttribute('data','file:///D:/Guna/POCs/ML/nwave-UI/output.html');
	$("#myData").show();
	$("#myHref").hide();
	$("#closeOp").show();
	return false;
    });
});   
$("#closeOp").click(function(){
	$("#loading").hide();
	document.getElementById("myData").setAttribute('data',"");
	$("#closeOp").hide();	
	$("#myData").hide();
	$("#myHref").show();
});

    var recognition;
    function startRecognition() {
        recognition = new webkitSpeechRecognition();
        recognition.onstart = function(event) {
            updateRec();
        };
        recognition.onresult = function(event) {
            var text = "";
            for (var i = event.resultIndex; i < event.results.length; ++i) {
                text += event.results[i][0].transcript;
            }
            insertChat("local", text);
            queryBot(text);
            stopRecognition();
        };
        recognition.onend = function() {
            stopRecognition();
        };
        recognition.lang = "en-US";
        recognition.start();
    }
    function stopRecognition() {
        if (recognition) {
            recognition.stop();
            recognition = null;
        }
        updateRec();
    }
    function switchRecognition() {
        if (recognition) {
            stopRecognition();
        } else {
            startRecognition();
        }
    }
function updateRec() {
        $("#rec").text(recognition ? "Stop" : "Speak");
    }
function insertChat(who, text) {
    var control = "";
    var date = formatTime(new Date());

    if (who == "local") {

        control = '<li style="width:100%;float:right;">' +
            '<div class="msj-rta macro">' +
            '<div class="text text-r">' +
            '<p>' + text + '</p>' +
            '<p><small>' + date + '</small></p>' +
            '</div>' +
            '</li>';
    }
    else if (who =="jarvis") {
        control = '<li style="width:100%;align:right;">' +
            '<div class="msj macro">' +
            '<div class="textdp">' +
            '<p class ="macrodp">' + text + '</p>' +
            '<p><small>' + date + '</small></p>' +
            '</div>' +
            '</div>' +
            '</li>';
    }
    else {
        control = '<li style="width:100%;align:right;">' +
            '<div class="msj macro">' +
            '<div class="text text-l">' + who +
            '<p>' + text + '</p>' +
            '<p><small>' + date + '</small></p>' +
            '</div>' +
            '</div>' +
            '</li>';
    }
    $("#messages").append(control);
    var objDiv = document.getElementById("messages");
    objDiv.scrollTop = objDiv.scrollHeight;
}



$("#chat-panel").on('click', function() {
    var framewidth = $("#frame").width();
    var op = "";
	if (framewidth > 200) {
        framewidth = "100";
        op = "0.1";
	$(".frame").css('border-radius','100px');
	$(".panel-heading").css('height','100px');
	$(".panel-heading").contents().remove();
    
    } else {
        framewidth = "25vw";
        op = "1";
	
	$(".panel-heading").css('height','100px');
	$(".panel-heading").css('padding-top','30px');
	$(".panel-heading").css('padding-left','180px');
	$(".panel-heading").text('Chat here with JARVIS');
	$(".panel-heading").css('text-align','right');
    $(".frame").css('border-radius','5px');
	}
    $(".innerframe").animate({
        height: 'toggle',
        opacity: op,
	
    });
    $('#frame').animate({
        width: framewidth,
        background: "transparent"
    });
});

function resetChat() {
    $("#messages").empty();
}


$(".mytext").on("keyup", function(e) {
    if (e.which == 13) {
        var text = $(this).val();
        if (text !== "") {
            insertChat("local", text);
            $(this).val('');
            queryBot(text)
        }
    }
    $("#rec").click(function(event) {
            switchRecognition();
        });
     
});

function buttonclick(text){
insertChat("local", text);              
queryBot(text);
}
resetChat();

function queryBot(text) {
    $.ajax({
        type: "POST",
        url: baseUrl + "query?v=20150910",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        headers: {
            "Authorization": "Bearer " + accessToken
        },
        data: JSON.stringify({
            query: text,
            lang: "en",
            sessionId: SESSIONID
        }),

        success: function(data) {
            botToBot(data.result.action,data.result.fulfillment.speech)
            displayOutput(data.result.fulfillment.displayText);
            insertChat("jarvis", data.result.fulfillment.speech);
            var msg = new SpeechSynthesisUtterance(data.result.fulfillment.speech);
            window.speechSynthesis.speak(msg);
        },
        error: function() {
            insertChat("jarvis", "Sorry Jarvis has faced some issues! Please try again later");
        }
    });
}

function botToBot(action,text) {
    if(!(action.startsWith("contact.")))
    {
		var bot=action.split(".")[1]
		botToken = window[bot]
        $.ajax({
        type: "POST",
        url: baseUrl + "query?v=20150910",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        headers: {"Authorization": "Bearer " + botToken},
        data: JSON.stringify({query: text,lang: "en",sessionId: SESSIONID}),
        success: function(data) {
            queryBot(data.result.fulfillment.speech)
            insertChat(bot, data.result.fulfillment.speech);
			},
        error: function() {
            insertChat("Mr Mule", "Sorry Mr Mule Bot has faced some issues! Please try again later");
            setTimeout('', 2000);
			}
		});
}}

function generateUUID() { // Public Domain/MIT
    var d = new Date().getTime();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
        d += performance.now(); //use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}
$(function () {
    var body = $('#logos');
    var backgrounds = ['url(css/logos/Mulesoft.png)','url(css/logos/Apigee.png)','url(css/logos/Software AG.png)','url(css/logos/IBM.png)',
'url(css/logos/Biztalk.png)','url(css/logos/Tibco.png)',];
    var current = 0;

    function nextBackground() {
        body.css(
            'background',
        backgrounds[current = ++current % backgrounds.length]);

        setTimeout(nextBackground, 1500);
    }
    setTimeout(nextBackground, 1500);
    body.css('background', backgrounds[0]);
});
