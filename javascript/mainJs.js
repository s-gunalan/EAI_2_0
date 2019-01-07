var local = {};

var remote = {};
var SESSIONID = generateUUID();
var accessToken = "5e156e4132be4615b948184ce2a56a89";

var baseUrl = "https://api.api.ai/v1/";
var Opurl = "https://nwave-output-v1.herokuapp.com/getop/";
var url = Opurl + SESSIONID;

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
    else if (who =="others") {
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
            '<div class="text text-l">' +
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
        framewidth = "150";
        op = "0.1";

    } else {
        framewidth = "370";
        op = "1";

    }
    $(".innerframe").animate({
        height: 'toggle',
        opacity: op
    });
    $('#frame').animate({
        width: framewidth,
        background: "black"
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
            insertChat("remote", data.result.fulfillment.speech);
            var msg = new SpeechSynthesisUtterance(data.result.fulfillment.speech);
            window.speechSynthesis.speak(msg);
        },
        error: function() {
            insertChat("remote", "Sorry Jarvis has faced some issues! Please try again later");
        }
    });
}


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
