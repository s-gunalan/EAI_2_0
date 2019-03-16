$(function () {
    var body = $('#feed1');
    var backgrounds = [
      "url('css/logos/Mulesoft.png')","url('css/logos/Software Ag.png')","url('css/logos/Apigee.png')"
	  
];
    var current = 0;

    function nextBackground() {
        body.css(
            'background',
        backgrounds[current = ++current % backgrounds.length]);
		body.css('background-repeat','no-repeat');
		body.css('background-size','100% 100%');
        setTimeout(nextBackground, 3000);
    }
    setTimeout(nextBackground, 3000);
    body.css('background', backgrounds[0]);
	body.css('background-repeat','no-repeat');
	body.css('background-size','100% 100%');
});

	  
$(function () {
    var body = $('#feed2');
    var backgrounds = [
"url('css/logos/Appain.png')","url('css/logos/IBM.png')","url('css/logos/Oracle.png')","url('css/logos/Pega.png')"
	  
];
    var current = 0;

    function nextBackground() {
        body.css(
            'background',
        backgrounds[current = ++current % backgrounds.length]);
		body.css('background-repeat','no-repeat');
		body.css('background-size','100% 100%');
        setTimeout(nextBackground, 3000);
    }
    setTimeout(nextBackground, 500);
    body.css('background', backgrounds[0]);
	body.css('background-repeat','no-repeat');
	body.css('background-size','100% 100%');
});
$(function () {
    var body = $('#feed3');
    var backgrounds = [
      "url('css/logos/Tibco.png')","url('css/logos/Software Ag.png')","url('css/logos/Biztalk.png')","url('css/logos/Redhat.png')"
	  
];
    var current = 0;

    function nextBackground() {
        body.css(
            'background',
        backgrounds[current = ++current % backgrounds.length]);
		body.css('background-repeat','no-repeat');
		body.css('background-size','100% 100%');
        setTimeout(nextBackground, 3000);
    }
    setTimeout(nextBackground, 2200);
    body.css('background', backgrounds[0]);
	body.css('background-repeat','no-repeat');
	body.css('background-size','100% 100%');
});
$(function () {
    var body = $('#feed4');
    var backgrounds = [	  "url('css/logos/Redhat.png')","url('css/logos/Biztalk.png')","url('css/logos/WSO2.png')","url('css/logos/Springboot.png')"];
    var current = 0;
    function nextBackground() {
        body.css('background',backgrounds[current = ++current % backgrounds.length]);
		body.css('background-repeat','no-repeat');
		body.css('background-size','100% 100%');
        setTimeout(nextBackground, 3000);
    }
    setTimeout(nextBackground, 1500);
    body.css('background', backgrounds[0]);
	body.css('background-repeat','no-repeat');
	body.css('background-size','100% 100%');
});
