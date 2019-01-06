var local = {};
var remote = {};

var accessToken = "9be02fefb0f34c95ac896fe92c0614ca";
var baseUrl = "https://api.api.ai/v1/";

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
            '</li><br>';
    }
    else if (who =="others") {
        control = '<li style="width:100%;align:right;">' +
            '<div class="msj macro">' +
            '<div class="textdp">' +
            '<p class ="macrodp">' + text + '</p>' +
            '<p><small>' + date + '</small></p>' +
            '</div>' +
            '</div>' +
            '</li><br>';
    }
    else {
        control = '<li style="width:100%;align:right;">' +
            '<div class="msj macro">' +
            '<div class="text text-l">' +
            '<p>' + text + '</p>' +
            '<p><small>' + date + '</small></p>' +
            '</div>' +
            '</div>' +
            '</li><br>';
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
        framewidth = "400";
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
            displayOutput(data.result.fulfillment.displayText);
            insertChat("remote", data.result.fulfillment.speech);
            var msg = new SpeechSynthesisUtterance(data.result.fulfillment.speech);
            window.speechSynthesis.speak(msg);
        },
        error: function() {
            insertChat("remote", "Sorry Jarvis has faced some issues! Please try again later");
        }
    });
}

$(document).ready(function() {
    $("#myHref").click(function(event) {
        document.getElementById("myData").setAttribute('data', url);
        //document.getElementById("myData").setAttribute('data','file:///D:/Guna/POCs/ML/nwave-UI/output.html');
        $("#myData").show();
        $("#myHref").hide();
        $("#closeOp").show();
        return false;
    });
});
$("#closeOp").click(function() {
    $("#loading").hide();
    document.getElementById("myData").setAttribute('data', "");
    $("#closeOp").hide();
    $("#myData").hide();
    $("#myHref").show();
});

function displayOutput(input) {
    if (input === 'LOAD-PAGE') {
        document.getElementById("myData").setAttribute('data', url);
        //document.getElementById("myData").setAttribute('data','https://nwave-ideabot-flask-webhook-p.herokuapp.com/getop/TESTINPUT1');
        $("#myData").show();
        $("#myHref").hide();
        $("#closeOp").show();
    }
}
