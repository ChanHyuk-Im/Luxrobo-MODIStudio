define(["jquery", "console", "colorpicker", "cordova", "guiblockM", "electron", "mapmoduleboxM", "displayText"], function($, console, colorpicker, cordova, guiblockM, electron, mapmoduleboxM, displayText) {
	console.log("GUI BLOCK INIT");

	var arrPickedColor = [
		"rgb(255, 255, 255)",
		"rgb(255, 255, 255)",
		"rgb(255, 255, 255)",
		"rgb(255, 255, 255)",
		"rgb(255, 255, 255)",
		"rgb(255, 255, 255)",
		"rgb(255, 255, 255)",
		"rgb(255, 255, 255)",
		"rgb(255, 255, 255)",
		"rgb(255, 255, 255)"
	];

	var countPickedColor = 0;
	var labelPickedColor = 0;

	var displayDrawingPx = "";
	var displayDrawingPxClone = "";

	Object.size = function(obj) {
		var size = 0, key;
	    for (key in obj) {
	        if (obj.hasOwnProperty(key)) size++;
	    }
	    return size;
	};

	function setColorpicker() {
		$(".colorpicker").wheelColorPicker({layout: "block"});

		$(".jQWCP-wWidget.jQWCP-block").css({"width": 333});
		
		$(".jQWCP-wWidget.jQWCP-block input").css({
			"display": "none"
		});

		$(".jQWCP-wVal.jQWCP-slider-wrapper").css({
			"display": "block",
			"width": "18px",
			"height": "190px",
			"position": "absolute",
			"right": "0",
			"top": "0"
		});

		$(function() {
			$(".colorpicker").on("sliderup slidermove", colorpickerSliderHandler);

			$(".blockConditionBox .arr.rgb .textBox").on("keyup", colorpickerKeyupHandler);

			function colorpickerSliderHandler(event) {
				var blockConditionbox = $(this).parents(".blockConditionBox");
				blockConditionbox.find(".arr.red .textBox").val(parseInt($(this).wheelColorPicker('getColor').r*100));
				blockConditionbox.find(".arr.green .textBox").val(parseInt($(this).wheelColorPicker('getColor').g*100));
				blockConditionbox.find(".arr.blue .textBox").val(parseInt($(this).wheelColorPicker('getColor').b*100));

				blockConditionbox.attr("data-red", blockConditionbox.find(".arr.red input").val());
				blockConditionbox.attr("data-green", blockConditionbox.find(".arr.green input").val());
				blockConditionbox.attr("data-blue", blockConditionbox.find(".arr.blue input").val());
			}

			function colorpickerKeyupHandler(event) {
				var blockConditionbox = $(this).parents(".blockConditionBox");
				var thisColorpicker = blockConditionbox.find(".colorpicker");
				var arrRed = parseInt(blockConditionbox.find(".red .textBox").val());
				var arrGreen = parseInt(blockConditionbox.find(".green .textBox").val());
				var arrBlue = parseInt(blockConditionbox.find(".blue .textBox").val());

				blockConditionbox.attr("data-red", arrRed);
				blockConditionbox.attr("data-green", arrGreen);
				blockConditionbox.attr("data-blue", arrBlue);

				arrRed = arrRed/100;
				arrGreen = arrGreen/100;
				arrBlue = arrBlue/100;
				var value = Math.max(arrRed, arrGreen, arrBlue);

				// $(this).val()의 값이 1보다 작을 때 if 입력
				if(value <= 1) {
					blockConditionbox.find(".jQWCP-wValCursor").css("top", ((1 - value) * 172) + "px");
					thisColorpicker.wheelColorPicker('setColor', {r : arrRed, g : arrGreen, b : arrBlue});
					thisColorpicker.wheelColorPicker('setValue', value);
				}

				thisColorpicker.wheelColorPicker('updateSliders');
			}
			
		});
	}

	var vlineImagePath = "image/bolck/vline.png";
	var arrSignImagePath = "image";

	if(cordova.isCordova()){
		arrSignImagePath = "image_mobile";
		vlineImagePath = "image_mobile/block/vline.svg";
	}

	var propertyTable = {
		button: [
			{
				imagePath: "image/icon20/prop.svg",
				name: "Click",
				helpMessage: '<div class="body buttonClick"> <div class="text" data-langNum="159"> Set a condition by clicking Button module. </div> <div class="range"> </div> </div></div>'
			},
			{
				imagePath: "image/icon20/prop.svg",
				name: "Double Click",
				helpMessage: '<div class="body buttonDouble"> <div class="text" data-langNum="160"> Set a condition double clicking Button module. </div> <div class="range"> </div></div></div>'
			},
			{
				imagePath: "image/icon20/prop.svg",
				name: "Press Status",
				helpMessage: '<div class="body buttonPress"> <div class="text" data-langNum="161"> Set a condition by pressing Button module. </div> <div class="range"> </div></div></div>'
			},
			{
				imagePath: "image/icon20/prop.svg",
				name: "Toggle",
				helpMessage: '<div class="body buttonToggle"> <div class="text" data-langNum="162"> Set a condition by toggling Button module. </div> <div class="range"> </div> </div></div>'
			}
		],
		mic: [
			{
				imagePath: "image/icon20/prop.svg",
				name: "Volume",
				helpMessage: '<div class="body micVolume"> <div class="text" data-langNum="163"> Set a condition by decibel Microphone module measures. </div> <div class="range"> </div> <div class="noteText" data-langNum="192"> Enter negative value will turn in reverse direction. </div> <div class="noteImage"> </div></div></div>'
			},
			{
				imagePath: "image/icon20/prop.svg",
				name: "Frequency",
				helpMessage: '<div class="body micFrequency"> <div class="text" data-langNum="164"> Set a condition by frequency Microphone module measures. </div> <div class="range"> </div> <div class="noteText" data-langNum="233"> Percentage in unit(Hz) 50 ~ 400Hz </div> <div class="noteImage" style="background: url(\'image/help/note.svg\') no-repeat;"> </div></div></div>'
			}
		],
		dial: [
			{
				imagePath: "image/icon20/prop.svg",
				name: "Turn",
				helpMessage: '<div class="body dialTurn"> <div class="text" data-langNum="165"> Set a condition by turning Dial module. </div> <div class="range"> </div> <div class="noteText" data-langNum="226"> Percentage in unit(°) - 0 ~ 270° </div> <div class="noteImage"> </div></div></div>'
			}
		],
		ir: [
			{
				imagePath: "image/icon20/prop.svg",
				name: "Distance",
				helpMessage: '<div class="body irDistance"> <div class="text" data-langNum="166"> Set a condition by distance Infrared module measures. </div> <div class="range"> </div> <div class="noteText" data-langNum="228"> Percentage in unit(cm) - 0 ~ 50cm </div> <div class="noteImage"> </div></div></div>'
			}
		],
		environment: [
			{
				imagePath: "image/icon20/prop.svg",
				name: "Temperature",
				helpMessage: '<div class="body environmentTemperature"> <div class="text" data-langNum="167"> Set a condition by temperature Environment module measures. </div> <div class="range"> </div><div class="noteText" data-langNum="234"> Percentage in unit(℃) - -40 ~ 100℃ </div> <div class="noteImage"> </div></div></div>'
			},
			{
				imagePath: "image/icon20/prop.svg",
				name: "Humidity",
				helpMessage: '<div class="body environmentHumidity"> <div class="text" data-langNum="168"> Set a condition by humidity Environment module measures. </div> <div class="range"> </div> <div class="noteText" data-langNum="225"> Percentage in unit(%RH) - 0 ~ 100%RH </div> <div class="noteImage"> </div></div></div>'
			},
			{
				imagePath: "image/icon20/prop.svg",
				name: "Illuminance",
				helpMessage: '<div class="body environmentIlluminance"> <div class="text" data-langNum="169"> Set a condition by illuminance Environment module measures. </div> <div class="range"> </div> <div class="noteText" data-langNum="229"> Percentage in unit(%) - 0 ~ 100% </div> <div class="noteImage"> </div></div></div>'
			},
			{
				imagePath: "image/icon20/prop.svg",
				name: "Red",
				helpMessage: '<div class="body environmentRed"> <div class="text" data-langNum="170">Set a condition by red color illuminance Environment module measures. </div> <div class="range"> </div> <div class="noteText" data-langNum="230"> Percentage in unit(lux) 0 ~ 4000lux </div> <div class="noteImage"> </div></div></div>'
			},
			{
				imagePath: "image/icon20/prop.svg",
				name: "Green",
				helpMessage: '<div class="body environmentGreen"> <div class="text" data-langNum="171">Set a condition by green color illuminance Environment module measures. </div> <div class="range"> </div> <div class="noteText" data-langNum="230"> Percentage in unit(lux) 0 ~ 4000lux</div> <div class="noteImage"> </div></div></div>'
			},
			{
				imagePath: "image/icon20/prop.svg",
				name: "Blue",
				helpMessage: '<div class="body environmentBlue"> <div class="text" data-langNum="172">Set a condition by blue color illuminance Environment module measures. </div> <div class="range"> </div> <div class="noteText" data-langNum="230">Percentage in unit(lux) 0 ~ 4000lux</div> <div class="noteImage"> </div></div></div>'
			},
		],
		gyro: [
			{
				imagePath: "image/icon20/prop.svg",
				name: "Roll",
				helpMessage: '<div class="body gyroRoll"> <div class="text" data-langNum="173"> Set a condition by change of X-axis of Gyroscope module. </div> <div class="range"> </div> <div class="noteText" data-langNum="231"> Percentage in unit(°) - -90 ~ 90° </div> <div class="noteImage"> </div></div></div>'
			},
			{
				imagePath: "image/icon20/prop.svg",
				name: "Pitch",
				helpMessage: '<div class="body gyroPitch"> <div class="text" data-langNum="174"> Set a condition by change of Y-axis of Gyroscope module. </div> <div class="range"> </div> <div class="noteText"class="noteText" data-langNum="231"> Percentage in unit(°) - -90 ~ 90° </div> <div class="noteImage"> </div></div></div>'
			},
			{
				imagePath: "image/icon20/prop.svg",
				name: "Yaw",
				helpMessage: '<div class="body gyroYaw"> <div class="text" data-langNum="175"> Set a condition by change of Z-axis of Gyroscope module. </div> <div class="range"> </div><div class="noteText" data-langNum="231"> Percentage in unit(°) - -90 ~ 90° </div> <div class="noteImage"> </div></div></div>'
			},
			{
				imagePath: "image/icon20/prop.svg",
				name: "X Acceleration",
				helpMessage: '<div class="body gyroXAcceleration"> <div class="text" data-langNum="176"> Set a condition by change of X-axis acceleration of Gyroscope module. </div> <div class="range"> </div> <div class="noteText" data-langNum="232"> Percentage in unit(m/s) - -19.6 ~ 19.6m/s </div> <div class="noteImage"> </div></div></div>'
			},
			{
				imagePath: "image/icon20/prop.svg",
				name: "Y Acceleration",
				helpMessage: '<div class="body gyroYAcceleration"> <div class="text" data-langNum="177"> Set a condition by change of Y-axis acceleration of Gyroscope module. </div> <div class="range"> </div> <div class="noteText" data-langNum="232"> Percentage in unit(m/s) - -19.6 ~ 19.6m/s </div> <div class="noteImage"> </div></div></div>'
			},
			{
				imagePath: "image/icon20/prop.svg",
				name: "Z Acceleration",
				helpMessage: '<div class="body gyroZAcceleration"> <div class="text" data-langNum="178"> Set a condition by change of Z-axis acceleration of Gyroscope module. </div> <div class="range"> </div> <div class="noteText" data-langNum="232"> Percentage in unit(m/s) - -19.6 ~ 19.6m/s </div> <div class="noteImage"> </div></div></div>'
			},
			{
				imagePath: "image/icon20/prop.svg",
				name: "X Angular velocity",
				helpMessage: '<div class="body gyroXAngularvelocity"> <div class="text" data-langNum="179"> Set a condition by change of X-axis of Gyroscope module. </div> <div class="range"> </div><div class="noteText" style="display: none" data-langNum="232"> Percentage in unit(m/s) - -19.6 ~ 19.6m/s	</div> </div></div>'
			},
			{
				imagePath: "image/icon20/prop.svg",
				name: "Y Angular velocity",
				helpMessage: '<div class="body gyroYAngularvelocity"> <div class="text" data-langNum="180"> Set a condition by change of Y-axis of Gyroscope module. </div> <div class="range"> </div> </div></div>'
			},
			{
				imagePath: "image/icon20/prop.svg",
				name: "Z Angular velocity",
				helpMessage: '<div class="body gyroZAngularvelocity"> <div class="text" data-langNum="181"> Set a condition by change of Z-axis of Gyroscope module. </div> <div class="range"> </div></div>'
			},
			{
				imagePath: "image/icon20/prop.svg",
				name: "Vibration",
				helpMessage: '<div class="body gyroVibration"> <div class="text" data-langNum="182"> Set a condition by change of vibration of Gyroscope module. </div> <div class="range"> </div> </div></div>'
			}
		],
		ultrasonic: [
			{
				imagePath: "image/icon20/prop.svg",
				name: "Distance",
				helpMessage: '<div class="body ultrasonicDistance"> <div class="text" data-langNum="183"> Set a condition by distance Ultrasonic module measures. </div> <div class="range"> </div> <div class="noteText" data-langNum="227"> Percentage in unit(cm) - 0 ~ 500cm </div> <div class="noteImage"> </div></div></div>'
			}
		],
		led: [
			{
				imagePath: "image/icon20/prop.svg",
				name: "Basic Color",
				helpMessage: '<div class="body ledBasiccolor"> <div class="text" data-langNum="185"> Select a color from left column. LED module emit selected color(Red, Green, Blue, White) light. </div> <div class="noteText" data-langNum="186"> Use \'Custom Color\' to use various color and brightness. </div> <div class="tipImage"> </div></div></div>'
			},
			{
				imagePath: "image/icon20/prop.svg",
				name: "Custom Color",
				helpMessage: '<div class="body ledCustomcolor"> <div class="text" data-langNum="187"> Choose a color on the color picker below. LED module emit the customized color light. </div> <div class="noteText" data-langNum="188"> LED module emits color by combining three color (RGB). </div> <div class="tipImage"> </div></div></div>'
			}
		],
		motor: [
			{
				imagePath: "image/icon20/prop.svg",
				name: "Angle",
				helpMessage: '<div class="body motorAngle"> <div class="text" data-langNum="189"> Enter an angle of Motor module on the blank above. Motor shaft turns as much as the angle entered. </div> <div class="range"> </div><div class="noteText" data-langNum="190"> Motor shaft turns as much as the angle entered. </div> <div class="tipImage"> </div></div></div>'
			},
			{
				imagePath: "image/icon20/prop.svg",
				name: "Speed",
				helpMessage: '<div class="body motorSpeed"> <div class="text" data-langNum="191"> Enter a speed of motor module on the blank above. Motor shaft turns as much as the speed entered. </div> <div class="range""> </div><div class="noteText" data-langNum="192"> Enter negative value will turn in reverse direction. </div> <div class="tipImage"> </div></div></div>'
			},
			{
				imagePath: "image/icon20/prop.svg",
				name: "Torque",
				helpMessage: '<div class="body motorTorque"> <div class="text" data-langNum="193"> Enter a torque of motor module on the blank above. Motor shaft turns as much as the torque entered. </div> <div class="range"> </div><div class="noteText" data-langNum="194"> Torque means motor\'s power. </div> <div class="tipImage"> </div></div></div>'
			}
		],
		servo: [
			{
				imagePath: "image/icon20/prop.svg",
				name: "Speed",
				helpMessage: "This is Help for Speed."
			},
			{
				imagePath: "image/icon20/prop.svg",
				name: "Torque",
				helpMessage: "This is Help for Torque."
			},
			{
				imagePath: "image/icon20/prop.svg",
				name: "Degree",
				helpMessage: "This is Help for Degree."
			}
		],
		speaker: [
			{
				imagePath: "image/icon20/prop.svg",
				name: "Basic tune",
				helpMessage: '<div class="body speakerBasictune"> <div class="text" data-langNum="195"> Select a syllable from piano below. Speaker module makes the selected syllable sound. </div> <div class="range"> </div> <div class="noteText" data-langNum="196"> Speaker module makes sound by selected pitch. </div> <div class="tipImage"> </div> </div></div>'
			},
			{
				imagePath: "image/icon20/prop.svg",
				name: "Custom tune",
				helpMessage: '<div class="body speakerCustomtune"> <div class="text" data-langNum="197"> Adjust frecuency and volume of speaker module. </div> <div class="range"> </div> <div class="noteText" data-langNum="198"> Frequency means Speaker module\'s pitch. </div> <div class="tipImage"> </div> </div></div>'
			}
		],
		display: [
			{
				imagePath: "image/icon20/display.svg",
				name: "Drawing",
				helpMessage: '<div class="body displayDrawing"> <div class="text" data-langNum="199"> Draw a picture to be shown on the Display module. </div> <div class="noteText" data-langNum="200"> Try drawing your favorite picture. </div> <div class="tipImage"> </div> </div></div>'
			},
			{
				imagePath: "image/icon20/display.svg",
				name: "Text",
				helpMessage: '<div class="body displayText"> <div class="text" data-langNum="201"> Enter text to be shown on the Display. </div> <div class="noteText" data-langNum="202"> You can also show function values. </div> <div class="tipImage"> </div> </div></div>'
			// },
			// {
			// 	imagePath: "image/icon20/display.svg",
			// 	name: "Data display",
			// 	helpMessage: '\
			// 	<div class="body" style="background: url(\'image/help/helpDatadisplay.svg\') no-repeat center;"> \
			// 		<div class="text">\
			// 			Displays the measured values of the modules directly attached to the Display module \
			// 		</div> \
			// 		<div class="noteText"> \
			// 			Only for modules directly connected \
			// 		</div> \
			// 		<div class="tipImage"> \
			// 		</div>\
			// 	</div>\
			// 	</div>'
			}
		],
		network: [
			{
				imagePath: "image/icon20/prop.svg",
				name: "Receive Data",
				type: "input",
				helpMessage: '<div class="body networkReceivedata"> <div class="text" data-langNum="251"> </div> <div class="noteText" style="display: none"> </div> <div class="tipImage" style="display: none"> </div> </div></div>'
			},
			{
				imagePath: "image/icon20/prop.svg",
				name: "Mobile Event",
				type: "input",
				helpMessage: '<div class="body networkMobileevent"> <div class="text" data-langNum="252"> </div> <div class="noteText" style="display: none"> </div> <div class="tipImage" style="display: none"> </div> </div></div>'
			}
		],
		network_output: [
			{
				imagePath: "image/icon20/prop.svg",
				name: "Send Data",
				type: "output",
				helpMessage: '<div class="body networkOutputSenddata"> <div class="text" data-langNum="203"> Please enter function on the blank above manually or choose from lists on left column. </div> <div class="noteText" style="display: none"> </div> <div class="tipImage" style="display: none"> </div> </div></div>'
			}
		],
		usb: [
			{
				imagePath: "image/icon20/prop.svg",
				name: "Receive Data",
				helpMessage: '<div class="body usbReceivedata"> <div class="text" style="display: none;"> </div> <div class="noteText" style="display: none"> </div> <div class="tipImage" style="display: none"> </div> </div></div>'
			},
			{
				imagePath: "image/icon20/prop.svg",
				name: "Mobile Event",
				helpMessage: '<div class="body usbMobileevent"> <div class="text" style="display: none;"> </div> <div class="noteText" style="display: none"> </div> <div class="tipImage" style="display: none"> </div> </div></div>'
			}
		]
	};

	var focusBoxhelpTable = [
		{
			beforeInput: "Basic Color",
			helpMessage: '<div class="body beforeBasiccolor"> <div class="text" data-langNum="204"> Choose a color. </div> <div class="basicBackground red"> <div class="basic basicRed"> </div> </div> <div class="basicBackground green"> <div class="basic basicGreen"> </div> </div> <div class="basicBackground blue"> <div class="basic basicBlue"> </div> </div> <div class="basicText red" data-langNum="205"> Red </div> <div class="basicText green" data-langNum="206"> Green </div> <div class="basicText blue" data-langNum="207"> Blue </div> <div class="basicText white" data-langNum="208"> White </div> <div class="basicText off" data-langNum="209"> Off </div> </div></div>'
		},
		{
			beforeInput: "Custom Color",
			helpMessage: '<div class="ledCustomImage"> </div> <input class="colorpicker" type="text" data-wheelcolorpicker data-wcp-layout="block" /> <div class="colorSelect"> <div class="picker"> </div> <div class="picked"> </div> <div class="picker"> </div> <div class="picked"> </div> <div class="picker"> </div> <div class="picked"> </div> <div class="picker"> </div> <div class="picked"> </div> <div class="picker"> </div> <div class="picked"> </div> <div class="erase"> </div> </div></div>'
		},
		{
			beforeInput: "Angle",
			helpMessage: '<div class="body beforeAngle"> <div class="text" data-langNum="210"> Select the blank above and enter angle. </div> <div class="angleUpper upperbox"> </div> <div class="angleBottom bottombox"> </div> </div> </div>'
		},
		{
			beforeInput: "Speed",
			helpMessage: ' <div class="body beforeSpeed"> <div class="text" data-langNum="211"> Select the blank above and enter speed. </div> <div class="speedUpper upperbox"> </div> <div class="speedBottom bottombox"> </div> </div> </div>'
		},
		{
			beforeInput: "Torque",
			helpMessage: '<div class="body beforeTorque"> <div class="text" data-langNum="212"> Select the blank above and enter torque. </div> <div class="torqueUpper upperbox"> </div> <div class="torqueBottom bottombox"> </div> </div></div>'
		},
		{
			beforeInput: "Basic tune",
			helpMessage: '<div class="body beforeBasictune"> <div class="text"> Select a pitch of speaker module from piano below. </div> <div class="piano"> <div class="keyboard pa_4"> </div> <div class="keyboard sol_4"> </div> <div class="keyboard ra_4"> </div> <div class="keyboard si_4"> </div> <div class="keyboard keyboardS pa_S_4"> </div> <div class="keyboard keyboardS sol_S_4"> </div> <div class="keyboard keyboardS ra_S_4"> </div> <div class="keyboard do_5"> </div> <div class="keyboard re_5"> </div> <div class="keyboard mi_5"> </div> <div class="keyboard pa_5"> </div> <div class="keyboard sol_5"> </div> <div class="keyboard ra_5"> </div> <div class="keyboard si_5"> </div> <div class="keyboard keyboardS do_S_5"> </div> <div class="keyboard keyboardS re_S_5"> </div> <div class="keyboard keyboardS pa_S_5"> </div> <div class="keyboard keyboardS sol_S_5"> </div> <div class="keyboard keyboardS ra_S_5"> </div> <div class="keyboard do_6"> </div> <div class="keyboard re_6"> </div> <div class="keyboard mi_6"> </div> <div class="keyboard keyboardS do_S_6"> </div> <div class="keyboard keyboardS re_S_6"> </div> </div> </div></div>'
		},
		{
			beforeInput: "Custom tune",
			helpMessage: '<div class="customtuneBackground body beforeCustomtune"><div class="text" data-langNum="213"> Enter a frequency of Speaker module on the blank above. </div></div></div>'
		},
		{
			beforeInput: "Drawing",
			helpMessage: '<div class="body beforeDrawing"> <div class="drawingboard"> <div class="pxboard"> </div> <div class="cloneForText"> </div> </div> <div class="tools"> <div class="pen"> </div> <input type="range" class="penSize" min="1" max="5" step="1"/> <div class="text"> </div> <div class="erase"> </div> <input type="range" class="eraseSize" min="1" max="5" step="1"/> <div class="save"> </div> </div> </div></div>'
		},
		{
			beforeInput: "Text",
			helpMessage: '<div class="body beforeText"> <div class="text" data-langNum="214"> Enter text into the field above to be shown on the display. </div> <div class="screen"> </div> <div class="noteText" data-langNum="215"> Red line is a character that cannot be displayed. </br>Enter backslash(\\) before quotation mark("). </div> <div class="tipImage"> </div> </div></div>'
		}
	];

	var wholeModuleTable = [
		{
			name: "button",
			helpMessage: '<div class="body wholeModuleButton"> <div class="text" data-langNum="236"> Set a condition by using Button module. </div> </div></div>'
		},
		{
			name: "mic",
			helpMessage: '<div class="body wholeModuleMic"> <div class="text" data-langNum="237"> Set a condition by using Mic module. </div> </div></div>'
		},
		{
			name: "dial",
			helpMessage: '<div class="body wholeModuleDial"> <div class="text" data-langNum="238"> Set a condition by using Dial module. </div> </div></div>'
		},
		{
			name: "ir",
			helpMessage: '<div class="body wholeModuleInfrared"> <div class="text" data-langNum="239"> Set a condition by using Infrared module. </div> </div></div>'
		},
		{
			name: "environment",
			helpMessage: '<div class="body wholeModuleEnvironment"> <div class="text" data-langNum="240"> Set a condition by using Environment module. </div> </div></div>'
		},
		{
			name: "gyro",
			helpMessage: '<div class="body wholeModuleGyroscope"> <div class="text" data-langNum="241"> Set a condition by using Gyroscope module. </div> </div></div>'
		},
		{
			name: "ultrasonic",
			helpMessage: '<div class="body wholeModuleUltrasonic"> <div class="text" data-langNum="242"> Set a condition by using Ultrasonic module. </div> </div></div>'
		},
		{
			name: "motor",
			helpMessage: '<div class="body wholeModuleMotor"> <div class="text" data-langNum="243"> Set a condition by using Motor module. </div> </div></div>'
		},
		{
			name: "led",
			helpMessage: '<div class="body wholeModuleLed"> <div class="text" data-langNum="244"> Set a condition by using Led module. </div> </div></div>'
		},
		{
			name: "display",
			helpMessage: '<div class="body wholeModuleDisplay"> <div class="text" data-langNum="245"> Set a condition by using Display module. </div> </div></div>'
		},
		{
			name: "speaker",
			helpMessage: '<div class="body wholeModuleSpeaker"> <div class="text" data-langNum="246"> Set a condition by using Speaker module. </div> </div></div>'
		},
		{
			name: "number",
			helpMessage: '<div class="body wholeModuleNumber"> <div class="text" data-langNum="247">  </div> </div></div>'
		},
		{
			name: "random",
			helpMessage: '<div class="body" style="background: url(\'image/help/helpBasic.svg\') no-repeat center;"> <div class="text" data-langNum="249">  </div> </div></div>'
		},
		{
			name: "network",
			helpMessage: '<div class="body" style="background: url(\'image/help/helpBasic.svg\') no-repeat center;"> <div class="text" data-langNum="248"> Set a condition by using Network module </div> </div></div>'
		}
	];

	var wholePropTable = [
		".Click",
		".Double Click",
		".Press Status",
		".Toggle",
		".Turn",
		".Distance",
		".Temperature",
		".Humidity",
		".Illuminance",
		".Red",
		".Green",
		".Blue",
		".Roll",
		".Pitch",
		".Yaw",
		".X Acceleration",
		".Y Acceleration",
		".Z Acceleration",
		".X Angular velocity",
		".Y Angular velocity",
		".Z Angular velocity",
		".Vibration",
		".Volume",
		".Frequency",
		".Receive Data",
		".Mobile Event"
	];

	var colorTable = {
		red: {
			imagePath: "image/icon20/prop.svg",
			name: "Red",
			helpMessage: "This is Help for Red."
		},
		blue: {
			imagePath: "image/icon20/prop.svg",
			name: "Blue",
			helpMessage: "This is Help for Blue."
		},
		green: {
			imagePath: "image/icon20/prop.svg",
			name: "Green",
			helpMessage: "This is Help for Green."
		}
	};

	var brightTable = {
		1: {
			imagePath: "image/icon20/prop.svg",
			name: "100%",
			helpMessage: "This is Help for 100%."
		},
		0.5: {
			imagePath: "image/icon20/prop.svg",
			name: "50%",
			helpMessage: "This is Help for 50%."
		},
		0: {
			imagePath: "image/icon20/prop.svg",
			name: "0%",
			helpMessage: "This is Help for 0%."
		}
	};

	// arr1_1은 모듈을 선택할 수 있다.
	// 객체를 담고 있는 배열이며 담고 있는 객체의 형태는 다음과 같다.
	// imagePath : 이미지 경로
	// name : 모듈, 변수 이름
	// isModule : 모듈인지 식별할 수 있는 변수. true일 경우 모듈이므로 arr1_2를 화면에 보여준다.

	/**
	* arrFocus는 현재 선택된 input이 어떤 것인지 input에 대한 focus 이벤트가 발생할 때 설정됩니다.
	* 그 값은 int형으로 1, 2, 3을 가질 수 있으며 문자열로는 "1_1", "3_1"이 저장됩니다.
	* 
	* @property arrFocus
	* @type {String}
	* @default null
	*/
	var arrFocus = null;	// arr1인지 arr3인지 구분할 때도 사용(스테이트 변환)

	var focused = null;

	/**
	* targetBox는 현재 선택된 input이 어떤 box의 것인지 input에 대한 focus 이벤트가 발생할 때 설정됩니다.
	* 그 값은 DOM형으로 선택된 input이 속한 box의 DOM을 반환합니다.
	* 
	* @property targetBox
	* @type {Object}
	* @default null
	*/
	var targetBox = null;

	var arrWhat = [
		// {
		// 	imagePath: "",
		// 	name: "",
		// 	type: "",		// mic, ultrasonic ...
		// 	isModule: false,
		// 	helpMessage: ""
		// }
		{
			imagePath: "image/icon20/var.svg",
			name: "TRUE",
			type: "variable",
			isModule: false,
			helpMessage: '<div class="body arrwhatTrue"> <div class="text"> </div></div></div>'
		},
		{
			imagePath: "image/icon20/var.svg",
			name: "FALSE",
			type: "variable",
			isModule: false,
			helpMessage: '<div class="body arrwhatFalse"> <div class="text"> </div></div></div>'
		}
	];

	var arrSubWhat = [];

	var arrTrueFalse = [
		{
			imagePath: "image/icon20/var.svg",
			name: "TRUE",
			type: "variable",
			isModule: false,
			helpMessage: '<div class="body" style="background: url(\'image/help/helpBasic.svg\') no-repeat; background-position-x: center;"><div class="text">	</div></div></div>'
		},
		{
			imagePath: "image/icon20/var.svg",
			name: "FALSE",
			type: "variable",
			isModule: false,
			helpMessage: '<div class="body" style="background: url(\'image/help/helpBasic.svg\') no-repeat; background-position-x: center;"><div class="text">	</div></div></div>'
		}
	];

	var arrInput = [];

	var arrOutput = [];

	var arrNetwork = [];

	var arrNumber = [];

	var arrRandom = [];

	var arrSign = [
		{
			imagePath: arrSignImagePath+"/block/equal.svg",
			name: "Equal",
			form: "==",
			helpMessage: '<div class="body" style="background: url(\'image/help/helpBasic.svg\') no-repeat; background-position-x: center;"><div class="text" data-langNum="152"></div></div></div>'
		},
		{
			imagePath: arrSignImagePath+"/block/greaterThanOrEqual.svg",
			name: "Greater or equal",
			form: ">=",
			helpMessage: '<div class="body" style="background: url(\'image/help/helpBasic.svg\') no-repeat; background-position-x: center;"><div class="text" data-langNum="153"></div></div></div>'
		},
		{
			imagePath: arrSignImagePath+"/block/lessThanOrEqual.svg",
			name: "Less or equal",
			form: "<=",
			helpMessage: '<div class="body" style="background: url(\'image/help/helpBasic.svg\') no-repeat; background-position-x: center;"><div class="text" data-langNum="154"></div></div></div>'
		},
		{
			imagePath: arrSignImagePath+"/block/notEqual.svg",
			name: "Not equal",
			form: "!=",
			helpMessage: '<div class="body" style="background: url(\'image/help/helpBasic.svg\') no-repeat; background-position-x: center;"><div class="text" data-langNum="155"></div></div></div>'
		},
		{
			imagePath: arrSignImagePath+"/block/greaterThan.svg",
			name: "Greater than",
			form: ">",
			helpMessage: '<div class="body" style="background: url(\'image/help/helpBasic.svg\') no-repeat; background-position-x: center;"><div class="text" data-langNum="156"></div></div></div>'
		},
		{
			imagePath: arrSignImagePath+"/block/lessThan.svg",
			name: "Less than",
			form: "<",
			helpMessage: '<div class="body" style="background: url(\'image/help/helpBasic.svg\') no-repeat; background-position-x: center;"><div class="text" data-langNum="157"></div></div></div>'
		}
	];

	var arrProp = [];

	var arrColor = [
		{
			imagePath: "image/icon20/prop.svg",
			name: "White",
			helpMessage: "This is Help for White."
		},
		{
			imagePath: "image/icon20/prop.svg",
			name: "Red",
			helpMessage: "This is Help for Red."
		},
		{
			imagePath: "image/icon20/prop.svg",
			name: "Blue",
			helpMessage: "This is Help for Blue."
		},
		{
			imagePath: "image/icon20/prop.svg",
			name: "Green",
			helpMessage: "This is Help for Green."
		}
	];

	var arrBright = [];

	var arrMath = [];

	function drawArr(listBox) {
		$(listBox).empty();

		var i;
		for(i = 1; i < arguments.length; i++) {
			arguments[i].forEach(function(item) {
				$(listBox).append("<div class='listElement'> <div class='icon' style=\"background-image: url('" + item.imagePath + "')\"></div><div class='name'>" + item.name + "</div></div><div class='subList'></div>");
			});
		}
	}

	function drawArrWhat(listBox) {
		$(listBox).empty();

		arrWhat.forEach(function(item) {
			$(listBox).append("<div class='listElement'>" + "<div class='icon' style=\"background-image: url('" + item.imagePath + "')\"></div><div class='name'>" + item.name + "</div></div><div class='subList'></div>");
		});
	}

	function drawArrSubProp(subListBox) {
		$(subListBox).empty();

		arrSubWhat.forEach(function(item) {
			$(subListBox).append("<div class='listElement'>" + "<div class='icon' style=\"background-image: url('" + item.imagePath + "')\"></div><div class='name'>" + item.name + "</div></div><div class='subList'></div>");
		});
	}

	function drawArrNumber(listBox) {
		$(listBox).empty();

		arrNumber.forEach(function(item) {
			$(listBox).append("<div class='listElement'>" + "<div class='icon' style=\"background-image: url('" + item.imagePath + "')\"></div><div class='name'>" + item.name + "</div></div><div class='subList'></div>");
		});
	}

	function drawArrRandom(listBox) {
		$(listBox).empty();

		arrRandom.forEach(function(item) {
			$(listBox).append("<div class='listElement'>" + "<div class='icon' style=\"background-image: url('" + item.imagePath + "')\"></div><div class='name'>" + item.name + "</div></div><div class='subList'></div>");
		});
	}

	function drawArrSign(listBox) {
		$(listBox).empty();

		arrSign.forEach(function(item) {
			$(listBox).append("<div class='listElement'>" + "<div class='icon' style=\"background-image: url('" + item.imagePath + "')\"></div><div class='name'>" + item.name + "</div></div><div class='subList'></div>");
		});
	}

	function drawArrColor(listBox) {
		$(listBox).empty();

		arrColor.forEach(function(item) {
			$(listBox).append("<div class='listElement'>" + "<div class='icon' style=\"background-image: url('" + item.imagePath + "')\"></div><div class='name'>" + item.name + "</div></div><div class='subList'></div>");
		});
	}

	function drawArrBright(listBox) {
		$(listBox).empty();

		arrBright.forEach(function(item) {
			$(listBox).append("<div class='listElement'>" + "<div class='icon' style=\"background-image: url('" + item.imagePath + "')\"></div><div class='name'>" + item.name + "</div></div><div class='subList'></div>");
		});
	}

	function drawArrProp(listBox, module) {
		$(listBox).empty();

		propertyTable[module].forEach(function(item) {
			if(electron.isElectron() || ( cordova.isCordova() &&  item.name != "Drawing")){
				$(listBox).append("<div class='listElement'>" + "<div class='icon' style=\"background-image: url('" + item.imagePath + "')\"></div><div class='name'>" + item.name + "</div></div><div class='subList'></div>");
			}
		});
	}

	function drawOutputProp(listBox, module) {
		$(listBox).empty();

		propertyTable[module].forEach(function(item) {
			$(listBox).append("<div class='listElement'>" + "<div class='icon' style=\"background-image: url('" + item.imagePath + "')\"></div><div class='name'>" + item.name + "</div></div><div class='subList'></div>");
		});
	}

	function drawArrMath(listBox) {
		$(listBox).empty();

		arrMath.forEach(function(item) {
			$(listBox).append("<div class='listElement'>" + "<div class='icon' style=\"background-image: url('" + item.imagePath + "')\"></div><div class='name'>" + item.name + "</div></div><div class='subList'></div>");
		});
	}

	function removeArrInputData(name) {
		var i;
		for(i = 0; i < arrWhat.length; i++) {
			if(arrWhat[i].name == name) {
				arrWhat.delete(arrWhat[i]);
				break;
			}
		}
		for(i = 0; i < arrInput.length; i++) {
			if(arrInput[i].name == name) {
				arrInput.delete(arrInput[i]);
				break;
			}
		}
	}

	function removeArrOutputData(name) {
		var i;
		for(i = 0; i < arrWhat.length; i++) {
			if(arrWhat[i].name == name) {
				arrWhat.delete(arrWhat[i]);
				break;
			}
		}
		for(i = 0; i < arrOutput.length; i++) {
			if(arrOutput[i].name == name) {
				arrOutput.delete(arrOutput[i]);
				break;
			}
		}
	}

	function removeArrNetworkData(name) {
		var i;
		for(i = 0; i < arrWhat.length; i++) {
			if(arrWhat[i].name == name) {
				arrWhat.delete(arrWhat[i]);
				break;
			}
		}
		for(i = 0; i < arrNetwork.length; i++) {
			if(arrNetwork[i].name == name) {
				arrNetwork.delete(arrNetwork[i]);
				break;
			}
		}
	}

	function removeArrNumberData(name) {
		var i;
		for(i = 0; i < arrWhat.length; i++) {
			if(arrWhat[i].name == name) {
				arrWhat.delete(arrWhat[i]);
				break;
			}
		}
		for(i = 0; i < arrNumber.length; i++) {
			if(arrNumber[i].name == name) {
				arrNumber.delete(arrNumber[i]);
				break;
			}
		}
	}

	function removeArrRandomData(name) {
		var i;
		for(i = 0; i < arrWhat.length; i++) {
			if(arrWhat[i].name == name) {
				arrWhat.delete(arrWhat[i]);
				break;
			}
		}
		for(i = 0; i < arrRandom.length; i++) {
			if(arrRandom[i].name == name) {
				arrRandom.delete(arrRandom[i]);
				break;
			}
		}
	}

	var arrPiano = [
		{
			value: "pa_4",
			defineVal: "F_PA_4"
		},
		{
			value: "pa_S_4",
			defineVal: "F_PA_S_4"
		},
		{
			value: "sol_4",
			defineVal: "F_SOL_4"
		},
		{
			value: "sol_S_4",
			defineVal: "F_SOL_S_4"
		},
		{
			value: "ra_4",
			defineVal: "F_RA_4"
		},
		{
			value: "ra_S_4",
			defineVal: "F_RA_S_4"
		},
		{
			value: "si_4",
			defineVal: "F_SI_4"
		},
		{
			value: "do_5",
			defineVal: "F_DO_5"
		},
		{
			value: "do_S_5",
			defineVal: "F_DO_S_5"
		},
		{
			value: "re_5",
			defineVal: "F_RE_5"
		},
		{
			value: "re_S_5",
			defineVal: "F_RE_S_5"
		},
		{
			value: "mi_5",
			defineVal: "F_MI_5"
		},
		{
			value: "pa_5",
			defineVal: "F_PA_5"
		},
		{
			value: "pa_S_5",
			defineVal: "F_PA_S_5"
		},
		{
			value: "sol_5",
			defineVal: "F_SOL_5"
		},
		{
			value: "sol_S_5",
			defineVal: "F_SOL_S_5"
		},
		{
			value: "ra_5",
			defineVal: "F_RA_5"
		},
		{
			value: "ra_S_5",
			defineVal: "F_RA_S_5"
		},
		{
			value: "si_5",
			defineVal: "F_SI_5"
		},
		{
			value: "do_6",
			defineVal: "F_DO_6"
		},
		{
			value: "do_S_6",
			defineVal: "F_DO_S_6"
		},
		{
			value: "re_6",
			defineVal: "F_RE_6"
		},
		{
			value: "re_S_6",
			defineVal: "F_RE_S_6"
		},
		{
			value: "mi_6",
			defineVal: "F_MI_6"
		}
	];

	var arrNetworkMobileEvent = [
		{
			imagePath: "image/icon20/prop.svg",
			name: "Button Unpressed",
			helpMessage: '<div class="body" style="background: url(\'image/help/helpBasic.svg\') no-repeat; background-position-x: center;"><div class="text"> This is Help for button unpressed. </div></div></div>'
		},
		{
			imagePath: "image/icon20/prop.svg",
			name: "Button Pressed",
			helpMessage: '<div class="body" style="background: url(\'image/help/helpBasic.svg\') no-repeat; background-position-x: center;"><div class="text"> This is Help for button pressed. </div></div></div>'
		},
		{
			imagePath: "image/icon20/prop.svg",
			name: "Joystick Up",
			helpMessage: '<div class="body" style="background: url(\'image/help/helpBasic.svg\') no-repeat; background-position-x: center;"><div class="text"> This is Help for joystick up. </div></div></div>'
		},
		{
			imagePath: "image/icon20/prop.svg",
			name: "Joystick Down",
			helpMessage: '<div class="body" style="background: url(\'image/help/helpBasic.svg\') no-repeat; background-position-x: center;"><div class="text"> This is Help for joystick down. </div></div></div>'
		},
		{
			imagePath: "image/icon20/prop.svg",
			name: "Joystick Left",
			helpMessage: '<div class="body" style="background: url(\'image/help/helpBasic.svg\') no-repeat; background-position-x: center;"><div class="text"> This is Help for joystick left. </div></div></div>'
		},
		{
			imagePath: "image/icon20/prop.svg",
			name: "Joystick Right",
			helpMessage: '<div class="body" style="background: url(\'image/help/helpBasic.svg\') no-repeat; background-position-x: center;"><div class="text"> This is Help for joystick right. </div></div></div>'
		},
		{
			imagePath: "image/icon20/prop.svg",
			name: "Joystick Unpressed",
			helpMessage: '<div class="body" style="background: url(\'image/help/helpBasic.svg\') no-repeat; background-position-x: center;"><div class="text"> This is Help for joystick unpressed. </div></div></div>'
		},
	];

	/**
	* block이 눌렸을때 ConditionBox를 열거나 닫는다.
	*
	* @method blockToggleHandler
	* @param {Object} event 이벤트 객체를 인자로 넘겨준다.
	*/
	function blockToggleHandler(event) {
		// 변경될 타겟 설정
		console.log("(guiblock.js)blockToggleHandler");
		
		var hideall = require('hideall');
		hideall.hideMenubox();

		$(event.target).closest(".dd-item").find(".boxList").empty();
		$(event.target).closest(".dd-item:not(.ledBlock)").find(".boxHelp").empty();

		if(cordova.isCordova()){
            var targetBorder = $(event.target).css("border-top-width");
            if(targetBorder === "2px"){
            	event.stopPropagation();
            	return;
            }
			mapmoduleboxM.removeLongClickStyle();
		}

		if($(event.target).hasClass("block")) {
			if($(event.target).next().css("display") == "none") {
				var blockConditionbox = $(event.target).next();
				var boxhelp = $(event.target).next().find(".boxHelp");

				hideAllConditionBox();
				$(event.target).next().css({
					"display": "block"
				});

				if(cordova.isCordova()){
					$(".list > .action").scrollTop(0);
					$(".list > .action").scrollLeft(0);
					$(".list > .action").css({
						"overflow": "hidden"
					});
					if($(event.target).attr("class").split(" ")[1] != "breakBlock"){//breakBlock은 conditionbox가 없어서 제외
						$(".main > .body").css({
							"top": 0,
							"height": $(".main").outerHeight(true)
						});
						$(".main > .menu").hide();
					}
				}

				setInputbox();

				boxhelp.empty();

				setBasicHelp($(event.target).next().find(".boxHelp"), $(event.target));
			}
			else {
				$(event.target).next().css({
					"display": "none"
				});

				$(".main > .menu").show();
			}
		}
		setEditorScroll();

		event.stopPropagation();
	}

	function setBasicHelp(helpbox, dditem) {
		helpbox.empty();

		helpbox.append('<div class="body" style="background: url(\'image/help/helpBasic.svg\') no-repeat; background-position-x: center;"> <div class="text" data-langNum="250"> Please enter function on the blank above manually or choose from lists on left column. </div> </div></div>');


		if(dditem.hasClass("ifBlock")) {
			setHelpbox("380px", "340px", "268");
		} else if(dditem.hasClass("whileBlock")) {
			setHelpbox("380px", "340px", "267");
		} else if(dditem.hasClass("motorBlock")) {
			setHelpbox("350px", "310px", "266");
		} else if(dditem.hasClass("speakerBlock")) {
			setHelpbox("350px", "310px", "264");
		} else if(dditem.hasClass("ledBlock")) {
			setHelpbox("430px", "390px", "265");
		}  else if(dditem.hasClass("displayBlock")) {
			setHelpbox("320px", "280px", "263");
			
			helpbox.find(".body").css({"height": "192px"});
			helpbox.parent().css({"height": "192px"});
		} else {
			setHelpbox("350px", "310px", "250");
		}
		
		setLanguage();


		function setHelpbox(bodyW, textW, num) {
			helpbox.find(".body").css({"width": bodyW});
			helpbox.find(".text").css({"width": textW});

			helpbox.find(".text").attr("data-langNum", num);
		}
	}

	/**
	* Block을 삭제한다. 오른쪽 위 X Button을 클릭하면 호출된다.
	*
	* @method blockExitOnClickHandler
	* @param {Object} event 이벤트 객체를 인자로 넘겨준다.
	*/
	function blockExitOnClickHandler(event) {
		var block = $(event.target).closest(".dd-item");

		pushUndo();
		blockRemove($(block));
		setRootNodeBackground();
		
		bindConnections();

		event.stopPropagation();
	}

	/**
	* Block을 삭제한다. blockExitOnClickHandler에 의해 호출된다.
	*
	* @method blockRemove
	* @param {DOM} 삭제할 Block의 DOM을 넘겨준다.
	*/
	function blockRemove(block) {
		$(block).remove();
	}

	function clickElemClickHandler(event) {
		event.stopPropagation();
	}

	/**
	* boxWrapper 포커스 이벤트 핸들러. (목적 : 어떤 boxWrapper인지 등록한다.)
	*
	* @method inputTextFocusHandler
	* @param {Object} event 이벤트 객체를 인자로 넘겨준다.
	*/
	function inputTextFocusHandler(event) {
		console.log("(guiblock.js) input Text Focus handler");
		targetBox = $(event.target).parentsUntil($(".boxWrapper"));
		targetBox = $(targetBox).parent(".boxWrapper");

		$(".upperbox").removeClass("animationUpper");
		$(".bottombox").removeClass("animationUpper");

		$(event.target).on("keyup", function() {
			$(event.target).closest(".blockConditionBox").attr("data-num", $(event.target).val());
		});
	}

	function inputTextEnterHandler(event) {
		if(event.keyCode == 13) {
			var parent = $(event.target).parent();
			if(parent.is(".arr3")) {
				parent.closest(".boxWrapper").find(".then div").trigger("click");
			}
			else if(parent.is(".loopAndDelayArr1, .formular, .numberArr1, .randomMax, .bottom, .blue, .volume")) {
				parent.closest(".boxWrapper").find(".ok div").trigger("click");
			}
		}
	}

	/**
	* arr1 포커스 이벤트 핸들러.
	* drawArr1And3List를 호출하여 boxList를 그려주고, 여기에 HelpText를 보여주는 이벤트를 등록한다.
	*
	* @method arr1FocusHandler
	* @param {Object} event 이벤트 객체를 인자로 넘겨준다.
	*/
	function arr1FocusHandler(event) {
		arrFocus = 1;	// 어떤 텍스트 상자에서 선택되었는지 저장
		focused = $(":focus");

		// drawArr1And3List($(event.target).closest(".blockConditionBox").find(".boxList"));
		drawArr($(event.target).closest(".blockConditionBox").find(".boxList"), arrInput, /*arrOutput, */arrNetwork, arrNumber, arrRandom);

		setBasicHelp($(event.target).closest(".blockConditionBox").find(".boxHelp"), $(event.target).closest(".dd-item"));
	}

	/**
	* arr2 포커스 이벤트 핸들러.
	* drawArr2List를 호출하여 boxList를 그려주고, 여기에 HelpText를 보여주는 이벤트를 등록한다.
	*
	* @method arr2FocusHandler
	* @param {Object} event 이벤트 객체를 인자로 넘겨준다.
	*/
	function arr2FocusHandler(event) {
		arrFocus = 2;	// 어떤 텍스트 상자에서 선택되었는지 저장
		focused = $(":focus");

		if(electron.isElectron()){
			drawArr($(event.target).closest(".blockConditionBox").find(".boxList"), arrSign);
		} else if(cordova.isCordova()){
			drawArr($(event.target).closest(".blockConditionBox").find(".boxList"), guiblockM.arrSign);
		}

		setBasicHelp($(event.target).closest(".blockConditionBox").find(".boxHelp"), $(event.target).closest(".dd-item"));
	}
	/**
	* arr2 포커스 아웃 이벤트 핸들러.
	* 값이 없다면 Placeholder를 다시 그려준다. 만약 있다면 boxWrapper의 Data를 설정해준다.
	*
	* @method arr2FocusOutHandler
	* @param {Object} event 이벤트 객체를 인자로 넘겨준다.
	*/
	function arr2FocusOutHandler(event) {
		setData($($(event.target).closest(".boxWrapper")), "arr2", $(event.target).val().split(".")[0]);

		$(targetBox).next().find(".boxList").empty();
		$(targetBox).next().find(".boxHelp").empty();
	}

	/**
	* arr3 포커스 이벤트 핸들러. (arr1과 동일)
	* drawArr1And3List를 호출하여 boxList를 그려주고, 여기에 HelpText를 보여주는 이벤트를 등록한다.
	*
	* @method arr3FocusHandler
	* @param {Object} event 이벤트 객체를 인자로 넘겨준다.
	*/
	function arr3FocusHandler (event) {
		arrFocus = 3;	// 어떤 텍스트 상자에서 선택되었는지 저장
		focused = $(":focus");
		var selectedType = focused.closest(".boxWrapper").attr("data-selectedtype");

		if(selectedType !== undefined) {
			if(selectedType == "button") {
				drawArr($(event.target).closest(".blockConditionBox").find(".boxList"), arrTrueFalse);
			} else if(selectedType == "network") {
				drawArr($(event.target).closest(".blockConditionBox").find(".boxList"), arrNetworkMobileEvent);
			} else if(selectedType == "usb") {
				drawArr($(event.target).closest(".blockConditionBox").find(".boxList"), arrNetworkMobileEvent);
			} else {
				drawArr($(event.target).closest(".blockConditionBox").find(".boxList"), arrInput, /*arrOutput, */arrNumber, arrRandom);
			}
		} else {
			drawArr($(event.target).closest(".blockConditionBox").find(".boxList"), arrInput, /*arrOutput, */arrNumber, arrRandom);
		}

		setBasicHelp($(event.target).closest(".blockConditionBox").find(".boxHelp"), $(event.target).closest(".dd-item"));
	}

	/**
	* And Or 토글 핸들러
	* And라면 Or로, Or라면 And로 변경되며 이를 boxWrapper의 Data에 저장.
	*
	* @method andOrToggleButtonHandler
	* @param {Object} event 이벤트 객체를 인자로 넘겨준다.
	*/
	function andOrToggleButtonHandler(event) {
		if($(event.target).val() == "And") {
			$(event.target).val("Or");
			setData($(event.target).closest(".boxWrapper"), "andor", "Or");
		}
		else if($(event.target).val() == "Or") {
			$(event.target).val("And");
			setData($(event.target).closest(".boxWrapper"), "andor", "And");
		}
		
	}

	/**
	* plus 이벤트 핸들러
	* 가장 마지막 Box를 복사해서 마지막에 붙여넣도록 되어있음.
	*
	* @method plusButtonHandler
	* @param {Object} event 이벤트 객체를 인자로 넘겨준다.
	*/
	function plusButtonHandler(event) {
		var box = $(event.target).parent().parent();
		insertTarget = $(box).siblings("div.boxBottomWrapper").prev();
		box = $(insertTarget).clone();
		var boxIdNumber = parseInt($(box).attr("data-id").split("box")[1]);

		//모바일 hover기능을 위한 소스
		if(cordova.isCordova()){
			if(event.type == "touchstart"){
				$(event.currentTarget).addClass("clickPluse");
				return;
			}
			else if(event.type == "touchend"){
				$(event.currentTarget).removeClass("clickPluse");
				event.preventDefault();
			}	
		}
		
		$(box).attr("id", "box" + (boxIdNumber + 1));
		setData($(box), "id", "box" + (boxIdNumber + 1));
		var andOr = $($(box).find(".boxType"));
		andOr.attr("class", "arr andOr");
		andOr.empty();
		var andOrButton = $("<input>", {
		type: "button",
			class: "toggle",
			value: "And"
		});
		var triangleDiv = $("<div>", {
			class: "triangle"
		});

		andOr.append(andOrButton);
		andOr.append(triangleDiv);
		
		if(electron.isElectron()){
			$($(box).find(".then")).remove();
		}

		var minus = $($(box).find(".plus")).clone();

		if($(box).find(".minus").length === 0) {	// minus가 없다면..
			$(minus).attr("class", "arr minus");

			if(electron.isElectron()){
				$(minus).appendTo($(box));
			} else if(cordova.isCordova()){
				$($(box).find(".plus")).after(minus);
				$($(box).find(".plus")).remove();
			}
		}
		$(insertTarget).after(box);	//현재의 if 뒤에 

		if(cordova.isCordova()){
			guiblockM.resizeConditionBox($(insertTarget).parent().parent());
		}
	}

	/**
	* minus 이벤트 핸들러
	* minus가 눌린 boxWrapper가 삭제된다.
	*
	* @method minusButtonHandler
	* @param {Object} event 이벤트 객체를 인자로 넘겨준다.
	*/
	function minusButtonHandler(event) {
		var box = $(event.target).parent().parent();
		var parentBox = $(event.target).parent().parent().closest("li");
		
		$(box).remove();

		if(cordova.isCordova()){
			guiblockM.resizeConditionBox(parentBox);

			//모바일 hover기능을 위한 소스
			if(event.type == "touchstart"){
				$(event.currentTarget).addClass("clickMinus");
				return;
			}
			else if(event.type == "touchend"){
				$(event.currentTarget).removeClass("clickMinus");
				event.preventDefault();
			}	
		}
	}

	/**
	* 
	* drawArr1And3List에서 그려준 ListElement에 이벤트를 추가한다.
	* arr1, 3은 모듈이냐 아니냐에 따라 state를 변화시키기 때문에 이와 관련된 코드도 들어있음.
	*
	* @method listElementEventHandler
	*/

	function listElementEventHandler(event) {
		console.log("listElementEventHandler");
		
		$(targetBox).data("arr1ismodule");
		
		if(cordova.isCordova()){		
			if($(event.target).attr("class").split(" ")[0] == "name"){
				event.target = event.currentTarget;
			}
		}

		$(targetBox).data("arr1ismodule");
		var name = $(event.target).children(".name").text();
		var blockConditionbox = $(event.target).closest(".blockConditionBox");
		var boxWrapper = $(event.target).closest(".blockConditionBox").find(".boxWrapper");
		var boxList = $(event.target).closest(".blockConditionBox").find(".boxList");
		var boxHelp = $(event.target).parents(".boxBottomWrapper").find(".boxHelp");
		var isOutput = $(event.target).closest(".dd-item").hasClass("output");
		var subList;

		renewBoxContents(name);
		
		event.stopPropagation();

		function renewBoxContents(name) {
			var type;
			var parentName;
			var textArea;
			var formular;
			var value;

			if(isModule(name, arrWhat)) {
				type = getType(name, arrWhat);
				focused.closest(".boxWrapper").attr("data-selectedtype", type);
				arrSubWhat = propertyTable[type];
				setData(targetBox, "arr1ismodule", true);
				console.log("toggle subList");
				subList = $(event.target).next();

				if(subList.height() === 0) {
					$(".editor .subList").css({
						"height": 0
					});
					subList.css({
						"width": $(event.target).width(),
						"height": $(event.target).outerHeight(true) * arrSubWhat.length
					});
					drawArrSubProp(subList);
				}
				else {
					subList.css({
						"height": 0
					});
				}
			}
			else {
				parentName = $(event.currentTarget).parent().prev().find(".name").text();
				
				if(focused.parent().hasClass("mathBoxVariable")) {
					focused.val($(event.target).find(".name").text());

					blockConditionbox.attr("data-variable", focused.val());

					focused.parent().next().next().find("input").focus();
				}
				else if(focused.parent().hasClass("formular")) {
					textArea = $(event.target).parents(".mathBlock").find(".formular input");
					formular = textArea.val();
					if(parentName !== ""){
						formular +=  parentName + "." + name;
					}
					else {
						formular += name;
					}
					textArea.val(formular);

					var strLength= textArea.val().length;
					textArea.focus();
					textArea[0].setSelectionRange(strLength, strLength);

					blockConditionbox.attr("data-formular", textArea.val());
				}
				else if(focused.parent().is(".color, .rgb, .property, .upper, .bottom, .what, .frequency, .volume, .data")) {
					if(parentName !== ""){
						value =  parentName + "." + name;
					}
					else {
						value = name;
					}
					focused.val(value);
					if(focused.parent().is(".color")) {					//led
						setData(blockConditionbox, "color", value);
					} else if(focused.parent().is(".rgb.red")) {
						setData(blockConditionbox, "red", value);
					} else if(focused.parent().is(".rgb.green")) {
						setData(blockConditionbox, "green", value);
					} else if(focused.parent().is(".rgb.blue")) {
						setData(blockConditionbox, "blue", value);
					} else if(focused.parent().is(".property")) {		//motor
						setData(blockConditionbox, "property", value);
					} else if(focused.parent().is(".upper")) {
						setData(blockConditionbox, "upper", value);
					} else if(focused.parent().is(".bottom")) {
						setData(blockConditionbox, "bottom", value);
					} else if(focused.parent().is(".what")) {
						setData(blockConditionbox, "what", value);

						// //speaker
						// if(blockConditionbox.attr("data-state") == "speaker") {
						// 	setData(blockConditionbox, "what", value);
						// }
						// //display
						// if(blockConditionbox.attr("data-state") == "display") {
						// 	setData(blockConditionbox, "what", value);
						// } 
					} else if(focused.parent().is(".frequency")) {		//speaker
						setData(blockConditionbox, "frequency", value);
					} else if(focused.parent().is(".volume")) {
						setData(blockConditionbox, "volume", value);
					}
					focused.trigger("blur");
					setTimeout(function() {
						// focused.parent().next().find("input").val("");
						focused.parent().next().find("input").focus();
					}, 0);
				}
				else if(focused.parent().is(".arr1, .arr3")) {
					if(parentName !== ""){
						if(focused.parent().hasClass("arr1")) {
							setData($(targetBox), "arr1ismodule", true);
							setData($(targetBox), "arr1", parentName);
							setData($(targetBox), "arr1type", getType(parentName, arrWhat));
							setData($(targetBox), "arr1_1", name);
						}
						else if(focused.parent().hasClass("arr3")) {
							setData($(targetBox), "arr3ismodule", true);
							setData($(targetBox), "arr3", parentName);
							setData($(targetBox), "arr3type", getType(parentName, arrWhat));
							setData($(targetBox), "arr3_1", name);
						}
						value =  parentName + "." + name;
					}
					else {
						if(focused.parent().hasClass("arr1")) {
							setData($(targetBox), "arr1ismodule", false);
							setData($(targetBox), "arr1", name);
						}
						else if(focused.parent().hasClass("arr3")) {
							setData($(targetBox), "arr3ismodule", false);
							setData($(targetBox), "arr3", name);
						}
						value = name;
						// selectedType = undefined;
					}


					focused.val(value);
					focused.trigger("blur");
					setTimeout(function() {
						focused.parent().next().next().find("input").focus();
					}, 0);
				}
				else if(focused.parent().is(".arr2")) {
					if(name == "Equal") {
						name = "==";
					}
					else if(name == "Greater or equal") {
						name = ">=";
					}
					else if(name == "Less or equal") {
						name = "<=";
					}
					else if(name == "Not equal") {
						name = "!=";
					}
					else if(name == "Greater than") {
						name = ">";
					}
					else if(name == "Less than") {
						name = "<";
					}
					setData($(targetBox), "arr2", name);

					focused.val(name);
					focused.trigger("blur");
					setTimeout(function() {
						focused.parent().next().find("input").focus();
					}, 0);
				}
				else {
					console.log("else");
				}

				if(!focused.parent().hasClass("formular")) {
					$(event.target).closest(".boxList").empty();

					if( value == "Custom Color") {
						// $(event.target).closest(".boxList")
					}
				}

				if(value == "Basic Color") {
					console.log("value is Basic Color ");

					// readonly 설정, highlighting 비활성화
					boxWrapper.find(".arr.red .textBox").attr("readonly",true).attr("disabled",true);
					boxWrapper.find(".arr.green .textBox").attr("readonly",true).attr("disabled",true);
					boxWrapper.find(".arr.blue .textBox").attr("readonly",true).attr("disabled",true);


					$(targetBox).next().find(".boxHelp").empty();

					// drawArrColor(boxList);

					boxHelp.append(' <div class="body" style="width: 430px;"> <div class="text"> Choose a color. </div> <div class="basicBackground" style="left: 20px; top: 70px;"> <div class="basic basicRed" style="left: 0px; top: 0px;"> </div> </div> <div class="basicBackground" style="left: 100px; top: 70px;"> <div class="basic basicGreen" style="left: 0px; top: 0px;"> </div> </div> <div class="basicBackground" style="left: 180px; top: 70px;"> <div class="basic basicBlue" style="left: 0px; top: 0px;"> </div> </div> <div class="basicBackground" style="left: 260px; top: 70px;"> <div class="basic basicWhite" style="left: 0px; top: 0px;"> </div> </div> <div class="basicBackground" style="left: 340px; top: 70px;"> <div class="basic basicOff" style="left: 0px; top: 0px;"> </div> </div> <div class="basicText" style="left: 20px" data-langNum="205"> Red </div> <div class="basicText" style="left: 100px" data-langNum="206"> Green </div> <div class="basicText" style="left: 180px" data-langNum="207"> Blue </div> <div class="basicText" style="left: 260px" data-langNum="208"> White </div> <div class="basicText" style="left: 340px" data-langNum="209"> Off </div> </div></div>');

					toggleLedClassClick(".basic");
				} else if(value == "Custom Color") {

					// readonly 설정 없앰, highlighting 활성화
					boxWrapper.find(".arr.red .textBox").attr("readonly",false).attr("disabled",false);
					boxWrapper.find(".arr.green .textBox").attr("readonly",false).attr("disabled",false);
					boxWrapper.find(".arr.blue .textBox").attr("readonly",false).attr("disabled",false);

					$(targetBox).next().find(".boxHelp").empty();

					boxHelp.append(' <div style="width: 70px; height: 70px; position: absolute; left: 170px; top: 125px; background: url(\'image/block/ledCustom.svg\');"> </div> <input class="colorpicker" type="text" data-wheelcolorpicker data-wcp-layout="block"/> <div class="colorSelect" style=""> <div class="picker"> </div> <div class="picked"> </div> <div class="erase"> </div> </div></div>');

					setLedPicker(boxHelp);

					setColorpicker();
				} else if(value == "Angle") {
					$(targetBox).next().find(".boxHelp").empty();
				} else if(value == "Speed") {
					$(targetBox).next().find(".boxHelp").empty();
				} else if(value == "Torque") {
					$(targetBox).next().find(".boxHelp").empty();
				} else if(value == "Basic tune") {
					$(targetBox).next().find(".boxHelp").empty();

					// boxWrapper.find(".arr.frequency .textBox").attr("readonly",true).attr("disabled",true);
					toggleSpeakerClassClick(".keyboard");
				} else if(value == "Custom tune") {
					$(targetBox).next().find(".boxHelp").empty();

					// boxWrapper.find(".arr.frequency .textBox").attr("readonly",false).attr("disabled",false);
					setSpeakerFrequency(boxWrapper.find(".frequency input"));
				} else if (value == "Drawing") {
					boxWrapper.find(".arr.data input").attr("readonly", true);
					boxWrapper.find(".arr.data input").css({
						"background": "rgb(230, 230, 230)"
					});
				} else if(value == "Text") {
					boxWrapper.find(".arr.data input").attr("readonly", false);
					boxWrapper.find(".arr.data input").css({
						"background": "rgb(255, 255, 255)"
					});
				} 

				if(value == "Basic Color") {
					boxWrapper.find(".arr.rgb .textBox").css({
						"color": "rgb(188, 188, 188)",
						"background": "rgb(230, 230, 230)"
					});
				} else {
					boxWrapper.find(".arr.rgb .textBox").css({
						"color": "rgb(0, 0, 0)",
						"background": "rgb(255, 255, 255)"
					});
				}

				if(value == "Basic tune") {
					boxWrapper.find(".arr.frequency .textBox").css({
						"background": "rgb(230, 230, 230)",
						"color": "rgb(188, 188, 188)"
					});
				} else {
					boxWrapper.find(".arr.frequency .textBox").css({
						"background": "rgb(255, 255, 255)",
						"color": "rgb(0, 0, 0)"
					});
				}


				// output아에 있는 애면 empty안하도록 변경하기
				if(name !== "Basic Color") {
				// 	$(targetBox).next().find(".boxHelp").empty();
				// }

				// if(!isOutput) {	
					$(targetBox).next().find(".boxHelp").empty();
				}



				pushUndo();
				
			}
		}
		event.preventDefault();
	}

	function setSpeakerFrequency(frequency) {
		$(function() {
			customtuneBackground(frequency);
			$(frequency).on("keyup", function() {
				var blockConditionbox = $(event.target).closest(".blockConditionBox");
				customtuneBackground(frequency);
				setData(blockConditionbox, "frequency", $(frequency).val());
			});
		});

		function customtuneBackground(frequency) {
			if($(frequency).val() <= 0) {
				$(frequency).parents(".blockConditionBox").find(".customtuneBackground").css({
					"background" : "url('image/help/helpCustomTune2_0OrVolme.svg') no-repeat"
				});
			} else if(0 < $(frequency).val() && $(frequency).val() <= 33) {
				$(frequency).parents(".blockConditionBox").find(".customtuneBackground").css({
					"background" : "url('image/help/helpCustomTune2_33.svg') no-repeat"
				});
			} else if(33 < $(frequency).val() && $(frequency).val() <= 66) {
				$(frequency).parents(".blockConditionBox").find(".customtuneBackground").css({
					"background" : "url('image/help/helpCustomTune2_66.svg') no-repeat"
				});
			} else if(66 < $(frequency).val() && $(frequency).val() <= 100) {
				$(frequency).parents(".blockConditionBox").find(".customtuneBackground").css({
					"background" : "url('image/help/helpCustomTune2_100.svg') no-repeat"
				});
			}
		}
	}

	/**
	* led conditionbox의 basic color에서 click된 객체의 background를 설정한다.
	*/
	function toggleLedClassClick(ledBackground) {
		$(ledBackground).on("click", function() {
			$(this).parent().toggleClass("basicBackgroundClick");
			$(this).parents(".blockConditionBox").find(".basicBackground").not($(this).parent()).removeClass("basicBackgroundClick");

			if($(this).hasClass("basicRed")){
				setColor(this, "100", "0", "0");
			} else if($(this).hasClass("basicGreen")){
				setColor(this, "0", "100", "0");
			} else if($(this).hasClass("basicBlue")){
				setColor(this, "0", "0", "100");
			} else if($(this).hasClass("basicWhite")){
				setColor(this, "100", "100", "100");
			} else if($(this).hasClass("basicOff")){
				setColor(this, "0", "0", "0");
			}

			function setColor(element, red, green, blue) {
				var blockConditionbox = $(element).parents(".blockConditionBox");
				blockConditionbox.find(".arr.red .textBox").val(red);
				blockConditionbox.find(".arr.green .textBox").val(green);
				blockConditionbox.find(".arr.blue .textBox").val(blue);

				blockConditionbox.attr("data-red", red);
				blockConditionbox.attr("data-green", green);
				blockConditionbox.attr("data-blue", blue);
			}
		});
	}

	function toggleSpeakerClassClick(speakerBackground) {
		var blockConditionbox = $(speakerBackground).parents(".blockConditionBox");
		var frequency = blockConditionbox.find(".frequency input");

		$(speakerBackground).on("click", pianoClickHandler);
		
		function pianoClickHandler(event) {
			$(event.target).toggleClass("basicBackgroundClick");
			$(event.target).parent().find(".keyboard").not(event.target).removeClass("basicBackgroundClick");
			var thisClass = $(event.target);

			arrPiano.forEach(function(item) {
				if(thisClass.hasClass(item.value)) {
					frequency.val(item.defineVal);
					setData(blockConditionbox, "frequency", item.defineVal);
				}
			});
			
			setTimeout(function() {
				// focused.parent().next().find("input").val("");
				$(event.target).closest(".blockConditionBox").find(".volume input").focus();
				// focused.parent().next().find("input").focus();
			}, 0);
		}
	}


	/**
	* then 이벤트 핸들러
	* 지금까지 Box에 기록된 내용을 Block에 반영한다.
	*
	* @method thenButtonHandler
	* @param {Object} event 이벤트 객체를 인자로 넘겨준다.
	*/
	function thenButtonHandler(event) {
		var blockConditionbox = $(event.target).closest(".blockConditionBox");
		var firstblockWrapperClone = $($(event.target).closest(".dd-item").children(".block").children(".blockWrapper")[0]).clone();
		var boxes = $(event.target).closest(".blockConditionBox").children(".boxWrapper");
		var blockWrappers = [];
		var content = $(event.target).closest(".dd-item").children(".block").find(".content");

		if(electron.isElectron()){
			$(event.target).closest(".blockConditionBox").css("display", "none");
		} else if(cordova.isCordova()){
			hideAllConditionBox();

			//모바일 hover기능을 위한 소스
			if(event.type == "touchstart"){
				$(event.currentTarget).parent().addClass("clickThen");
				return;
			}
			else if(event.type == "touchend"){
				$(event.currentTarget).parent().removeClass("clickThen");
				event.preventDefault();
			}	
		}	

		if(event.originalEvent)	pushUndo();

		$(content).empty();
		$(firstblockWrapperClone).attr("style", "");	// 이전에 적용됬던 css 무효화 첫번쨰 block Wrapper를 복사하니까.

		var block = $(event.target).closest(".dd-item");
		var code = "";

		code += block.data("logic");
		code += "(";

		for(var i = 0, len = boxes.length; i < len; i++) {
			var box = boxes[i];
			var boxDataObject;

			var module1HTML = '<div class="arr module"><div class="icon"></div><div class="iconName"></div></div>';
			var prop1HTML = '<div class="arr prop"></div>';
			var module3HTML = '<div class="arr module"><div class="icon"></div><div class="iconName"></div></div>';
			var prop3HTML = '<div class="arr prop"></div>';
			var signHTML = '<div class="arr sign"></div>';
			var andorHTML = '<div class="arr andor"></div>';

			var arr1Name;
			var arr1Prop;
			var arr1Str = $(box).find(".arr1 input").val();

			var arr3Name;
			var arr3Prop;
			var arr3Str = $(box).find(".arr3 input").val();

			var mathFlag;

			setData($(box), "andor", $(box).find(".andOr input").val());

			if(arr1Str.indexOf(".") !== -1) {
				arr1Name = arr1Str.split(".")[0];
				arr1Prop = arr1Str.split(".")[1];
				if(isModule(arr1Name, arrWhat)) {
					setData($(box), "arr1ismodule", true);
					setData($(box), "arr1", arr1Name);
					setData($(box), "arr1_1", arr1Prop);
					setData($(box), "arr1type", getType(arr1Name, arrWhat));
				}
				else {
					setData($(box), "arr1ismodule", false);
					setData($(box), "arr1", "null");
					setData($(box), "arr1_1", arr1Prop);
					setData($(box), "arr1type", "null");
				}
			}
			else {
				arr1Prop = arr1Str;
				setData($(box), "arr1ismodule", false);
				setData($(box), "arr1", "null");
				setData($(box), "arr1_1", arr1Prop);
				setData($(box), "arr1type", "null");
			}
			
			setData($(box), "arr2", $(box).find(".arr2 input").val());

			if(arr3Str.indexOf(".") !== -1) {
				arr3Name = arr3Str.split(".")[0];
				arr3Prop = arr3Str.split(".")[1];
				if(isModule(arr3Name, arrWhat)) {
					setData($(box), "arr3ismodule", true);
					setData($(box), "arr3", arr3Name);
					setData($(box), "arr3_1", arr3Prop);
					setData($(box), "arr3type", getType(arr3Name, arrWhat));
				}
				else {
					setData($(box), "arr3ismodule", false);
					setData($(box), "arr3", "null");
					setData($(box), "arr3_1", arr3Prop);
					setData($(box), "arr3type", "null");
				}
			}
			else {
				arr3Prop = arr3Str;
				setData($(box), "arr3ismodule", false);
				setData($(box), "arr3", "null");
				setData($(box), "arr3_1", arr3Prop);
				setData($(box), "arr3type", "null");
			}

			boxDataObject = $(box).data();

			var backgroundImage = "";
			if(i !== 0) {
				if(boxDataObject.andor == "And") {
					code += " && ";
					$(andorHTML).addClass("and").appendTo(content);
				}
				else if(boxDataObject.andor == "Or") {
					code += " || ";
					$(andorHTML).addClass("or").appendTo(content);
				}
			}

			if(boxDataObject.arr1ismodule === true) {
				code += boxDataObject.arr1;
				code += ".";
				module1HTML = $(module1HTML).find(".icon").attr("class", "icon "+boxDataObject.arr1type+"Icon").parent();
				module1HTML = $(module1HTML).find(".iconName").text(boxDataObject.arr1).parent();
				$(module1HTML).appendTo(content);
			}
			code += convertProp2Method(boxDataObject.arr1_1);
			$(prop1HTML).text(boxDataObject.arr1_1).appendTo(content);
			code += boxDataObject.arr2;
			$(signHTML).css({
				"background-image": 'url('+getImagePathByName(boxDataObject.arr2, arrSign)+')'
			}).appendTo(content);

			if(boxDataObject.arr3ismodule === true) {
				code += boxDataObject.arr3;
				code += ".";
				module3HTML = $(module3HTML).find(".icon").attr("class", "icon "+boxDataObject.arr3type+"Icon").parent();
				module3HTML = $(module3HTML).find(".iconName").text(boxDataObject.arr3).parent();
				$(module3HTML).appendTo(content);
			}
			if(convertProp2Method(boxDataObject.arr3_1) == "TRUE") {
				code += "100";
			}
			else if(convertProp2Method(boxDataObject.arr3_1) == "FALSE") {
				code += "0";
			}
			else if(convertProp2Method(boxDataObject.arr3_1) == "Button Unpressed") {
				code += "0";
			}
			else if(convertProp2Method(boxDataObject.arr3_1) == "Button Pressed") {
				code += "1";
			}
			else if(convertProp2Method(boxDataObject.arr3_1) == "Joystick Up") {
				code += "2";
			}
			else if(convertProp2Method(boxDataObject.arr3_1) == "Joystick Down") {
				code += "3";
			}
			else if(convertProp2Method(boxDataObject.arr3_1) == "Joystick Left") {
				code += "4";
			}
			else if(convertProp2Method(boxDataObject.arr3_1) == "Joystick Right") {
				code += "5";
			}
			else if(convertProp2Method(boxDataObject.arr3_1) == "Joystick Unpressed") {
				code += "0";
			}
			else {
				code += convertProp2Method(boxDataObject.arr3_1);
			}

			$(prop3HTML).text(boxDataObject.arr3_1).appendTo(content);
		}

		code += ")";
		setData(block, "code", code);

		var dataWhat = "";
		var dataArr2 = "";
		var dataData = "";
		
		for(var i = 0; i < blockConditionbox.find(".boxWrapper").length; i++) {
			dataWhat = dataWhat + $(blockConditionbox.find(".boxWrapper .arr1 input")[i]).val() + ",";
			dataArr2 = dataArr2 + $(blockConditionbox.find(".boxWrapper .arr2 input")[i]).val() + ",";
			dataData = dataData + $(blockConditionbox.find(".boxWrapper .arr3 input")[i]).val() + ",";
		}

		setData(blockConditionbox, "save-what", dataWhat);
		setData(blockConditionbox, "save-arr2", dataArr2);
		setData(blockConditionbox, "save-data", dataData);

		// if(electron.isElectron()){
		// 	$(event.target).closest(".blockConditionBox").css("display", "none");
		// } else if(cordova.isCordova()){
		// 	hideAllConditionBox();
		// }	
		hideBlockBackgroundImage(event.target);

		var contentWidth = 0;
		$(content).children("div").each(function(itr) {
			contentWidth += $(this).outerWidth(true);
		});
		contentWidth += 10;
		
		$(content).css({
			"width": contentWidth+"px"
		});

		$(content).closest(".block").css({
			"width": contentWidth+60+"px"
		});
		
		setEditorScroll();

	}

	/**
	* Loop & Delay Block ConditionBox에서 OK 버튼을 눌렀을 때 그 내용을 Block에 출력한다.
	* 두 블럭은 같은 동작을 하기 때문에 같은 이벤트 핸들러로 묶었다..
	*
	* @method loopAndDelayOkButtonHandler
	* @param {event} 이벤트 객체를 인자로 받는다.
	*/
	function loopAndDelayOkButtonHandler(event) {
		console.log("loopAndDelayOkButtonHandler");
		var boxWrapper = $(event.target).closest(".boxWrapper");
		var textBox = $(boxWrapper).children(".loopAndDelayArr1").children(".textBox");
		var blockConditionbox = $(event.target).closest(".blockConditionBox");
		var blockLi = $(boxWrapper).closest("li");
		var content = $(blockLi.find(".content")[0]);
		var blockWrapper = $(blockLi).children(".block").find(".blockWrapper").find(".loopAndDelayArr1");

		if(electron.isElectron()){
			$(".blockConditionBox").css("display", "none");
		} else if(cordova.isCordova()){
			content.css({
				width: blockWrapper.width() + 44
			});
			$(blockLi.find(".blockWrapper")[0]).css({
				width: content.width() + 60
			});
			$(blockLi.find(".block")[0]).css({
				width: $(blockLi.find(".blockWrapper")[0]).width() + 6
			});
			hideAllConditionBox();

			//모바일 hover기능을 위한 소스
			if(event.type == "touchstart"){
				$(event.currentTarget).parent().addClass("clickOk");
				return;
			}
			else if(event.type == "touchend"){
				$(event.currentTarget).parent().removeClass("clickOk");
				event.preventDefault();
			}	
		}

		if(event.originalEvent)	pushUndo();

		setData(blockLi, "times", $(textBox).val());
		$(blockWrapper).text($(textBox).val());
		var code = "";
		if(blockLi.data("logic") == "delay") {
			code += "Sleep";
		}
		else {
			code += blockLi.data("logic");
		}
		code += "(";
		code += $(blockLi.find(".content div")[0]).text();
		code += ")";
		if(blockLi.data("logic") == "delay") {
			code += ";";
		}
		
		setData(blockLi, "code", code);
		setData(blockConditionbox, "save-num", textBox.val());

		content.css({
			width: content.find(".loopAndDelayArr1").outerWidth(true) + content.find(".loopAndDelayArr2").outerWidth(true) + 1
		});
		$(blockLi.find(".blockWrapper")[0]).css({
			width: content.width() + 70
		});
		$(blockLi.find(".block")[0]).css({
			width: $(blockLi.find(".blockWrapper")[0]).width() + 10
		});

		setEditorScroll();
	}


	/**
	* Random Block ConditionBox에서 OK 버튼을 눌렀을 때 그 내용을 Min <= 변수명 <= Max로 끊어 Block에 출력한다.
	* *********************************************************************
	* 추구 TODO 부분 반드시 추가할것.
	* *********************************************************************
	*
	* @method randomOkButtonHandler
	* @param {event} 이벤트 객체를 인자로 받는다.
	*/
	function randomOkButtonHandler(event) {
		console.log("randomOkButtonHandler");

		var blockLi = $(event.target).closest(".randomBlock");
		var blockConditionbox = $(event.target).closest(".blockConditionBox");
		var content = $(blockLi).find(".content");
		var blockWrapper = $(blockLi).find(".blockWrapper");
		var boxWrapper = $(blockLi).find(".boxWrapper");
		var randomMin = $(blockWrapper).find(".randomMin");
		var randomMax = $(blockWrapper).find(".randomMax");

		$(blockLi).find(".randomVariable").text($(boxWrapper).find(".textVariableBox").val());

		if($(boxWrapper).find(".randomMin input").val() !== "") {
			randomMin.css({"background" : "none"});
			randomMin.text($(boxWrapper).find(".randomMin input").val());
		} else {
			randomMin.css({"background" : "url('image/block/min.svg') center no-repeat"});
			randomMin.text("");
		}

		if($(boxWrapper).find(".randomMax input").val() !== "") {
			randomMax.css({"background" : "none"});
			randomMax.text($(boxWrapper).find(".randomMax input").val());
		} else {
			randomMax.css({"background" : "url('image/block/min.svg') center no-repeat"});
			randomMax.text("");
		}

		if(cordova.isCordova()){
			//모바일 hover기능을 위한 소스
			if(event.type == "touchstart"){
				$(event.currentTarget).parent().addClass("clickOk");
				return;
			}
			else if(event.type == "touchend"){
				$(event.currentTarget).parent().removeClass("clickOk");
				event.preventDefault();
			}	
		}

		//TODO (Block에 Data를 기록하는 것이 반드시 필요함.)

		var code = "";
		code += blockLi.find(".randomVariable").text();
		code += "=random(";
		code += $(randomMin).text();
		code += ", ";
		code += $(randomMax).text();
		code += ");";

		setData(blockLi, "code", code);

		setData(blockConditionbox, "save-min", boxWrapper.find(".randomMin input").val());
		setData(blockConditionbox, "save-max", boxWrapper.find(".randomMax input").val());

		content.css({
			width: content.find(".randomMin").outerWidth(true) + content.find(".randomBelow").outerWidth(true) + content.find(".randomVariable").outerWidth(true) + content.find(".randomBelow").outerWidth(true) + content.find(".randomMax").outerWidth(true) + 5
		});
		$(blockLi.find(".blockWrapper")[0]).css({
			width: content.width() + 55
		});
		$(blockLi.find(".block")[0]).css({
			width: $(blockLi.find(".blockWrapper")[0]).width() + 10
		});

		if(cordova.isCordova()){
			content.css({
				width:  content.find(".randomMin").outerWidth(true) + content.find(".randomBelow").outerWidth(true) + content.find(".randomVariable").outerWidth(true) + content.find(".randomBelow").outerWidth(true) + content.find(".randomMax").outerWidth(true) + 6
			});
			$(blockLi.find(".blockWrapper")[0]).css({
				width: content.width() + 60
			});
			$(blockLi.find(".block")[0]).css({
				width: $(blockLi.find(".blockWrapper")[0]).width() + 9
			});
		}

		hideAllConditionBox();

		for(i = 0; i < arrWhat.length; i++) {
			if($(content).text().includes(arrWhat[i].name)) {
				arrWhat[i].name = blockLi.find(".randomBoxVariable").text();
				arrWhat[i].helpMessage = code.replace('float ', '').replace(';', '');
				return;
			}
		}
		setEditorScroll();

		event.stopPropagation();
	}

	/**
		Math Block의 variable input element에 focus in이 될 때의 handler.
	*/
	function mathBoxVariableFocusHandler(event) {
		console.log("math");
		arrFocus = ("math");
		focused = $(":focus");

		drawArr($(event.target).closest(".blockConditionBox").find(".boxList"), /*arrInput, arrOutput, */arrNumber/*, arrRandom*/);

		$(event.target).on("keyup", mathVariableKeyupHandler);

		event.stopPropagation();

		function mathVariableKeyupHandler(event) {
			$(event.target).closest(".blockConditionBox").attr("data-variable", $(event.target).val());
		}
	}

	/**
		Math Block의 array list에 focus in이 될 떄의 handler.
	*/
	function mathFormularFocusHandler(event) {
		console.log("formular");
		arrFocus = "formular";
		focused = $(":focus");

		drawArr($(event.target).closest(".blockConditionBox").find(".boxList"), arrInput, /*arrOutput, */arrNumber, arrRandom);

		$(event.target).on("keyup", mathFormularKeyupHandler);

		event.stopPropagation();

		function mathFormularKeyupHandler(event) {
			$(event.target).closest(".blockConditionBox").attr("data-formular", $(event.target).val());
		}
	}

	function mathNumButtonHandler(event) {
		var textArea = $(event.target).parents(".mathBlock").find(".formular input");
		var formular = textArea.val();
		var chara = $(event.currentTarget).data("val");
		if(chara !== undefined) {
			if(chara !== "b") {
				formular += chara;
			}
			else {
				formular = formular.slice(0, -1);
			}
		}
		textArea.val(formular);

		$(event.target).closest(".blockConditionBox").attr("data-formular", textArea.val());

		var strLength= textArea.val().length;
		textArea.focus();
		textArea[0].setSelectionRange(strLength, strLength);

		event.stopPropagation();
	}

	/**
	* Math Block ConditionBox에서 OK 버튼을 눌렀을 때 그 내용을 Block에 출력한다.
	*
	* @method mathOkButtonHandler
	* @param {event} 이벤트 객체를 인자로 받는다.
	*/
	function mathOkButtonHandler(event) {
		var blockConditionbox = $(event.target).closest(".blockConditionBox");
		var target = $(event.target).closest(".mathBlock");
		var blockLi = target.closest("li");
		var content = $(blockLi.find(".content")[0]);
		var formular = "";
		var code = "";

		if(electron.isElectron()){
			$(event.target).closest(".blockConditionBox").hide();
		} else if(cordova.isCordova()){
			$(blockLi.find(".blockWrapper")[0]).css({
				width: content.width() + 60
			});
			$(blockLi.find(".block")[0]).css({
				width: $(blockLi.find(".blockWrapper")[0]).width() + 6
			});
			hideAllConditionBox();

			//모바일 hover기능을 위한 소스
			if(event.type == "touchstart"){
				$(event.currentTarget).parent().addClass("clickOk");
				return;
			}
			else if(event.type == "touchend"){
				$(event.currentTarget).parent().removeClass("clickOk");
				event.preventDefault();
			}	
		}

		if(event.originalEvent)	pushUndo();

		if(target.find(".mathBoxVariable input").val() !== "" || target.find(".formular input").val() !== "") {
			formular += target.find(".mathBoxVariable input").val();
			formular += " = ";
			formular += target.find(".formular input").val();
		} else {
			formular = "";
		}

		target.find(".content").text(formular);

		var i, j;
		if(target.find(".content").text() === "") {
			code += " = ;";
			showBlockBackgroundImage(target);
		} else {
			code = convertStr2Code(target.find(".content").text())+";";
			hideBlockBackgroundImage(target);
		}


		setData(blockLi, "code", code);

		$(blockLi.find(".blockWrapper")[0]).css({
			width: content.width() + 70
		});
		$(blockLi.find(".block")[0]).css({
			width: $(blockLi.find(".blockWrapper")[0]).width() + 10
		});

		for(i = 0; i < arrWhat.length; i++) {
			if(arrWhat[i].name == $(content).text().split(" ")[0]) {
				arrWhat[i].name = target.find(".mathBoxVariable input").val();
				arrWhat[i].helpMessage = code.replace('float ', '').replace(';', '');
				for(j = 0; j < arrMath.length; j++) {
					if(arrMath[j].name == $(content).text().split(" ")[0]) {
						arrMath[j].name = target.find(".mathBoxVariable input").val();
						arrMath[j].helpMessage = code.replace('float ', '').replace(';', '');
						return;
					}
				}
			}
		}

		setData(blockConditionbox, "save-variable", blockConditionbox.find(".mathBoxVariable input").val());
		setData(blockConditionbox, "save-formular", blockConditionbox.find(".formular input").val());

		arrMath.push(
			{
				imagePath: "image/icon20/var.svg",
				name: "" + target.find(".mathBoxVariable input").val(),
				helpMessage: code.replace('float ', '')
			}
		);
		setEditorScroll();
	}

	/**
	* Number Block ConditionBox에서 OK 버튼을 눌렀을 때 그 내용을 Block에 출력한다.
	*
	* @method numberOKButtonHandler
	* @param {event} 이벤트 객체를 인자로 받는다.
	*/
	function numberOKButtonHandler(event) {
		console.log("numberOkButtonHandler");
		var target = $(event.target).closest(".numberBlock");
		var blockConditionbox = $(event.target).parents(".blockConditionBox");
		var boxWrapper = $(event.target).closest(".boxWrapper");
		var textBox = $(boxWrapper).children(".numberArr1").children(".textBox");
		var boxType = $(boxWrapper).children(".boxType");

		var blockLi = $(boxWrapper).closest("li");
		var content = $(blockLi.find(".content")[0]);
	
		setData(blockConditionbox, "save-number", textBox.val());

		if(electron.isElectron()){
			$(".blockConditionBox").css("display", "none");
		} else if(cordova.isCordova()){
			$(blockLi.find(".blockWrapper")[0]).css({
				width: content.width() + 60
			});
			$(blockLi.find(".block")[0]).css({
				width: $(blockLi.find(".blockWrapper")[0]).width() + 6
			});
			hideAllConditionBox();

			//모바일 hover기능을 위한 소스
			if(event.type == "touchstart"){
				$(event.currentTarget).parent().addClass("clickOk");
				return;
			}
			else if(event.type == "touchend"){
				$(event.currentTarget).parent().removeClass("clickOk");
				event.preventDefault();
			}
		} 

		if(event.originalEvent)	pushUndo();

		content.find(".numberId").text($(boxType).text());
		content.find(".numberText").text($(textBox).val());
		var code = "";
		if(content.find(".numberText").text() !== "") {
			code += content.find(".numberId").text();
			code += " = ";
			code += content.find(".numberText").text();
			code += ";";
		}
		
		setData(blockLi, "code", code);
		setData(blockLi, "value", $(textBox).val());

		$(blockLi.find(".blockWrapper")[0]).css({
			width: content.width() + 70
		});
		$(blockLi.find(".block")[0]).css({
			width: $(blockLi.find(".blockWrapper")[0]).width() + 10
		});
		setEditorScroll();


		event.stopPropagation();
	}

	/**
		Motor Block의 property input element에 focus in이 될 때의 handler.
	*/
	function motorPropFocusHandler(event) {
		console.log("prop");
		arrFocus = "prop";
		focused = $(":focus");

		drawArrProp($(event.target).closest(".blockConditionBox").find(".boxList"), "motor");

		setBasicHelp($(event.target).closest(".blockConditionBox").find(".boxHelp"), $(event.target).closest(".dd-item"));

		event.stopPropagation();
	}

	/**
		Motor Block의 upper input element에 focus in이 될 때의 handler.
	*/
	function motorUpperFocusHandler(event) {
		console.log("(guiblock.js) motorUpperFocusHandler");
		// arrFocus = "value";
		focused = $(":focus");

		var boxHelp = $(this).parents(".blockConditionBox").find(".boxHelp");
		var boxWhat = $(this).parents(".blockConditionBox").find(".property input").val();
		var boxList = $(this).closest(".blockConditionBox").find(".boxList");

		boxList.empty();

		focusBoxhelpTable.forEach(function(item) {
			if(item.beforeInput == boxWhat) {
				boxHelp.append(item.helpMessage);
			}

			$(".upperbox").addClass("animationUpper");
			$(".bottombox").removeClass("animationUpper");
		});

		drawArr($(event.target).closest(".blockConditionBox").find(".boxList"), arrInput, /*arrOutput, */arrNumber, arrRandom);

		$(event.target).on("keyup", motorUpperKeyupHandler);
	}

	function motorUpperKeyupHandler(event) {
		$(event.target).closest(".blockConditionBox").attr("data-upper", $(event.target).val());
	}

	/**
		Motor Block의 bottom input element에 focus in이 될 때의 handler.
	*/
	function motorBottomFocusHandler(event) {
		console.log("(guiblock.js) motorBottomFocusHandler");
		// arrFocus = "value";
		focused = $(":focus");

		var blockConditionbox = $(event.target).closest(".blockConditionBox");
		var boxHelp = blockConditionbox.find(".boxHelp");
		var boxWhat = blockConditionbox.find(".property input").val();
		var boxList = blockConditionbox.find(".boxList");

		boxList.empty();

		focusBoxhelpTable.forEach(function(item) {
			if(item.beforeInput == boxWhat) {
				boxHelp.append(item.helpMessage);
			}

			$(".upperbox").removeClass("animationUpper");
			$(".bottombox").addClass("animationUpper");
		});

		drawArr($(event.target).closest(".blockConditionBox").find(".boxList"), arrInput, /*arrOutput, */arrNumber, arrRandom);

		$(event.target).on("keyup", motorBottomKeyupHandler);
	}

	function motorBottomKeyupHandler(event) {
		$(event.target).closest(".blockConditionBox").attr("data-bottom", $(event.target).val());
	}

	/**
	* Motor Block ConditionBox에서 OK 버튼을 눌렀을 때 그 내용을 Block에 출력한다.
	*
	* @method motorOKButtonHandler
	* @param {event} 이벤트 객체를 인자로 받는다.
	*/
	function motorOKButtonHandler(event) {
		var blockLi = $(event.target).closest("li");
		var blockConditionbox = $(event.target).closest(".blockConditionBox");
		var content = "";
		var code = "";

		blockConditionbox.hide();

		if(event.originalEvent)	pushUndo();

		if(cordova.isCordova()){
			//모바일 hover기능을 위한 소스
			if(event.type == "touchstart"){
				$(event.currentTarget).parent().addClass("clickOk");
				return;
			}
			else if(event.type == "touchend"){
				$(event.currentTarget).parent().removeClass("clickOk");
				event.preventDefault();
			}	
		}

		content += blockConditionbox.find(".property input").val();
		content += ", ";
		content += blockConditionbox.find(".upper input").val();
		content += ", ";
		content += blockConditionbox.find(".bottom input").val();

		blockConditionbox.parent().find(".content").text(content);

		code += blockConditionbox.find(".name").text().split(" 's")[0];
		code += ".";
		code += "set_";
		code += blockConditionbox.find(".property input").val().toLowerCase().replace(/ /g, '_');
		code += "(";
		// if(convertStr2Code(blockConditionbox.find(".upper input").val()) == "TRUE") {
		// 	code += "1";
		// }
		// else if(convertStr2Code(blockConditionbox.find(".upper input").val()) == "FALSE") {
		// 	code += "2";
		// }
		// else {
			if(parseInt(convertStr2Code(blockConditionbox.find(".upper input").val())) >= 0) {
				code += (parseInt(convertStr2Code(blockConditionbox.find(".upper input").val()))).toString();
			}
			else {
				code += convertStr2Code(blockConditionbox.find(".upper input").val());
			}
			code += ",";
			if(parseInt(convertStr2Code(blockConditionbox.find(".bottom input").val())) >= 0) {
				code += (parseInt(convertStr2Code(blockConditionbox.find(".bottom input").val()))).toString();
			}
			else {
				code += convertStr2Code(blockConditionbox.find(".bottom input").val());
			}
		// }
		code += ");";
		setData(blockLi, "code", code);

		setData(blockConditionbox, "save-property", blockConditionbox.find(".property input").val());
		setData(blockConditionbox, "save-upper", blockConditionbox.find(".upper input").val());
		setData(blockConditionbox, "save-bottom", blockConditionbox.find(".bottom input").val());
		
		$(blockLi.find(".blockWrapper")[0]).css({
			width: blockLi.find(".content").width() + 70
		});
		$(blockLi.find(".block")[0]).css({
			width: $(blockLi.find(".blockWrapper")[0]).width() + 10
		});
		bindConnections();

		if(cordova.isCordova()){
			hideAllConditionBox();
			$(blockLi.find(".blockWrapper")[0]).css({
				width: blockLi.find(".content").width() + 60
			});
			$(blockLi.find(".block")[0]).css({
				width: $(blockLi.find(".blockWrapper")[0]).width() + 6
			});
		}
		setEditorScroll();

		event.stopPropagation();
	}

	/**
		Led Block의 color input element에 focus in이 될 때의 handler.
	*/
	function ledColorFocusHandler(event) {
		console.log("color focusin handler");
		arrFocus = "color";
		focused = $(":focus");

		drawArrProp($(event.target).closest(".blockConditionBox").find(".boxList"), "led");

		setBasicHelp($(event.target).closest(".blockConditionBox").find(".boxHelp"), $(event.target).closest(".dd-item"));

		event.stopPropagation();
	}

	/**
		Led Block의 rgb input element에 focus in이 될 때의 handler.
	*/
	function ledRGBFocusHandler(event) {
		console.log("rgb focusin handler");
		arrFocus = "rgb";
		focused = $(":focus");

		drawArr($(event.target).closest(".blockConditionBox").find(".boxList"), arrInput, /*arrOutput, */arrNumber, arrRandom);

		var boxHelp = $(event.target).closest(".blockConditionBox").find(".boxHelp");
		boxHelp.empty();

		boxHelp.append('<div style="width: 70px; height: 70px; position: absolute; left: 170px; top: 125px; background: url(\'image/block/ledCustom.svg\');"> </div> <input class="colorpicker" type="text" data-wheelcolorpicker data-wcp-layout="block" /> <div class="colorSelect" style=""> <div class="picker"> </div> <div class="picked"> </div> <div class="erase"> </div> </div></div>');

		// 전체 ledBlock에 있는 boxHelp가 변해야 하기 때문에 
		// $(".ledBlock .boxHelp")부분 변경하지 않기
		setLedPicker($(".ledBlock .boxHelp"));

		setColorpicker();

		initializationColorpicker(event.target);

		event.stopPropagation();
	}
	
	function pickColorHandler(event) {
		console.log("(guiblock.js) pick color handler");
		console.log("countPickedColor : labelPickedColor = "+countPickedColor+" : "+labelPickedColor);


		blockConditionbox = $(event.target).closest(".blockConditionBox");

		var colorR = (blockConditionbox.find(".red input").val()/100*255).toFixed(0);
		var colorG = (blockConditionbox.find(".green input").val()/100*255).toFixed(0);
		var colorB = (blockConditionbox.find(".blue input").val()/100*255).toFixed(0);

		var color = "rgb("+colorR+","+colorG+","+colorB+")";

		arrPickedColor[labelPickedColor] = color;
		countPickedColor++;

		labelPickedColor++;

		if(countPickedColor >= 10) {
			countPickedColor = 9;
		}

		if(labelPickedColor >= 10) {
			labelPickedColor = 0;
		}

		setLedPicker($(event.target).parent());
	}

	function setLedPicker(helpbox) {
		console.log("(guiblock.js) set led picker");

		var i;

		helpbox.find(".picked").empty();

		for(i = 0; i < 10; i++) {
			helpbox.find(".picked").append('<div class="pickedColor"></div>');
		}

		var pickerLength = $(".pickedColor").length/10;
		for(i = 0; i < 10; i++) {
			for(var t = 0; t < pickerLength; t++) {
				$($(".pickedColor")[t*10 + i]).css({"background": arrPickedColor[i]});
			}
		}
	}

	function clickPickColor(event) {
		console.log("(guiblock.js) click pick color");

		var blockConditionbox = $(event.target).parents(".blockConditionBox");
		var thisColorpicker = blockConditionbox.find(".colorpicker");
		var arrRed = $(event.target).attr("background");
		var arrGreen = parseInt(blockConditionbox.find(".green .textBox").val());
		var arrBlue = parseInt(blockConditionbox.find(".blue .textBox").val());
		var value = Math.max((arrRed/100), (arrGreen/100), (arrBlue/100));

		$(event.target).parent().find(".pickedColor").removeClass("clicked");
		$(event.target).addClass("clicked");

		thisColorpicker.val($(event.target).css("background-color"));

		thisColorpicker.keyup();

		$(event.target).parents(".blockConditionBox").find(".arr.red .textBox").val(parseInt(thisColorpicker.wheelColorPicker('getColor').r*100));
		$(event.target).parents(".blockConditionBox").find(".arr.green .textBox").val(parseInt(thisColorpicker.wheelColorPicker('getColor').g*100));
		$(event.target).parents(".blockConditionBox").find(".arr.blue .textBox").val(parseInt(thisColorpicker.wheelColorPicker('getColor').b*100));

		event.stopPropagation();
	}

	function erasePickColor(event) {
		console.log("(guiblock.js) erase pick color");

		pickedColor = $(event.target).parent().find(".pickedColor");
		clickedColor = $(event.target).parent().find(".pickedColor.clicked");

		for(var i = 0; i < 10; i++) {
			if($(pickedColor[i]).attr("class") === $(clickedColor).attr("class")) {
				console.log("countPickedColor : labelPickedColor = "+countPickedColor+" : "+labelPickedColor);
				for(var j = i; j < 10; j++) {
					if(j < 9) {
						arrPickedColor[j] = arrPickedColor[j+1];
					}
				}
				arrPickedColor[9] = "rgb(255, 255, 255)";

				for(var t = 0; t < 10; t++) {
					$($(".pickedColor")[t]).css({"background": arrPickedColor[t]});
				}

				if(countPickedColor >= i) {
					countPickedColor--;
					if(countPickedColor < 0) {
						countPickedColor = 0;
					}
				}

				if(countPickedColor == 8) {
					labelPickedColor = countPickedColor + 1;
				} else {
					labelPickedColor--;
				}
			}
		}
	}

	function initializationColorpicker(target) {

		var blockConditionbox = $(target).closest(".blockConditionBox");
		var thisColorpicker = blockConditionbox.find(".colorpicker");
		var arrRed = parseInt(blockConditionbox.find(".red .textBox").val())/100;
		var arrGreen = parseInt(blockConditionbox.find(".green .textBox").val())/100;
		var arrBlue = parseInt(blockConditionbox.find(".blue .textBox").val())/100;

		var value = Math.max(arrRed, arrGreen, arrBlue);
		
		// $(this).val()의 값이 1보다 작을 때 if 입력
		if(value <= 1) {
			blockConditionbox.find(".jQWCP-wValCursor").css("top", ((1 - value) * 172) + "px");

			thisColorpicker.wheelColorPicker('setColor', {r : arrRed, g : arrGreen, b : arrBlue});
			thisColorpicker.wheelColorPicker('setValue', value);
		}

		thisColorpicker.wheelColorPicker('updateSliders');
	}

	function drawRGB(listBox, rgb) {
		$(listBox).empty();

		arrColor.forEach(function(item) {
			$(listBox).append("<div class='listElement'>" + "<div class='icon' style=\"background-image: url('" + item.imagePath + "')\"></div><div class='name'>" + item.name + "</div></div><div class='subList'></div>");
		});
	}

	/**
	* Led Block ConditionBox에서 OK 버튼을 눌렀을 때 그 내용을 Block에 출력한다.
	*
	* @method ledOKButtonHandler
	* @param {event} 이벤트 객체를 인자로 받는다.
	*/
	function ledOKButtonHandler(event) {
		var plumb = require('plumb');
		var blockLi = $(event.target).closest("li");
		var blockConditionbox = $(event.target).closest(".blockConditionBox");
		var contentDiv = blockLi.find(".content");
		var content = "";
		var code = "";
		var srcID = "";
		var dstID = "";

		var ledHtml = '<div class="arr previewColor" style="width: 20px; height: 20px; margin-top: 17px; margin-right: 5px; border: 1px solid rgb(188, 188, 188); box-sizing: border-box;"> </div>';

		var colorRed = (blockConditionbox.find(".red input").val()/100*255).toFixed(0);
		var colorGreen = (blockConditionbox.find(".green input").val()/100*255).toFixed(0);
		var colorBlue = (blockConditionbox.find(".blue input").val()/100*255).toFixed(0);

		var color = "rgb("+colorRed+","+colorGreen+","+colorBlue+")";

		blockConditionbox.hide();

		if(event.originalEvent)	pushUndo();

		if(cordova.isCordova()){
			ledHtml = '<div class="arr previewColor" style="width: 20px; height: 20px; margin-top: 12px; margin-right: 5px;"> </div>';			
			//모바일 hover기능을 위한 소스
			if(event.type == "touchstart"){
				$(event.currentTarget).parent().addClass("clickOk");
				return;
			}
			else if(event.type == "touchend"){
				$(event.currentTarget).parent().removeClass("clickOk");
				event.preventDefault();
			}	
		}

		blockConditionbox.parent().find(".content").empty();

		content += "R : ";
		if(isNaN(blockConditionbox.find(".red input").val())) {
			content += blockConditionbox.find(".red input").val();
		} else if (blockConditionbox.find(".red input").val() === "") {
			content += "";	
		} else {
			content += parseInt(blockConditionbox.find(".red input").val());
		}
		content += ", G : ";
		if(isNaN(blockConditionbox.find(".green input").val())) {
			content += blockConditionbox.find(".green input").val();
		} else if (blockConditionbox.find(".green input").val() === "") {
			content += "";	
		} else {
			content += parseInt(blockConditionbox.find(".green input").val());
		}
		content += ", B : ";
		if(isNaN(blockConditionbox.find(".blue input").val())) {
			content += blockConditionbox.find(".blue input").val();
		} else if (blockConditionbox.find(".blue input").val() === "") {
			content += "";	
		} else {
			content += parseInt(blockConditionbox.find(".blue input").val());
		}

		code += blockConditionbox.find(".name").text().split(" 's")[0];
		code += ".set_rgb(";
		if(isNaN(blockConditionbox.find(".red input").val())) {
			code += convertStr2Code(blockConditionbox.find(".red input").val());
		} else {
			code += parseInt(convertStr2Code(blockConditionbox.find(".red input").val()));
		}
		code += ",";
		if(isNaN(blockConditionbox.find(".green input").val())) {
			code += convertStr2Code(blockConditionbox.find(".green input").val());
		} else {
			code += parseInt(convertStr2Code(blockConditionbox.find(".green input").val()));
		}
		code += ",";
		if(isNaN(blockConditionbox.find(".blue input").val())) {
			code += convertStr2Code(blockConditionbox.find(".blue input").val());
		} else {
			code += parseInt(convertStr2Code(blockConditionbox.find(".blue input").val()));
		}
		code += ");";

		console.log(code);

		$(ledHtml).appendTo(contentDiv);
		contentDiv.find(".previewColor").css({"background": color});
		setData(blockLi, "code", code);

		setData(blockConditionbox, "save-what", blockConditionbox.find(".color input").val());
		setData(blockConditionbox, "save-red", blockConditionbox.find(".red input").val());
		setData(blockConditionbox, "save-green", blockConditionbox.find(".green input").val());
		setData(blockConditionbox, "save-blue", blockConditionbox.find(".blue input").val());

		blockConditionbox.parent().find(".content").append(content);

		bindConnections();

		$(blockLi.find(".blockWrapper")[0]).css({
			width: contentDiv.width() + 70 + 22
		});
		$(blockLi.find(".block")[0]).css({
			width: $(blockLi.find(".blockWrapper")[0]).width() + 10
		});

		if(cordova.isCordova()){
			hideAllConditionBox();
			$(blockLi.find(".blockWrapper")[0]).css({
				width: contentDiv.width() + 60 + 10
			});
			$(blockLi.find(".block")[0]).css({
				width: $(blockLi.find(".blockWrapper")[0]).width() + 6
			});
		}
		setEditorScroll();

		event.stopPropagation();
	}

	/**
		Speaker Block의 what input element에 focus in이 될 때의 handler.
	*/
	function speakerWhatFocusHandler(event) {
		console.log("speaker what focusin handler");
		arrFocus = "speakerWhat";
		focused = $(":focus");

		drawArrProp($(event.target).closest(".blockConditionBox").find(".boxList"), "speaker");

		setBasicHelp($(event.target).closest(".blockConditionBox").find(".boxHelp"), $(event.target).closest(".dd-item"));

		event.stopPropagation();
	}

	/**
		Speaker Block의 frequency input element에 focus in이 될 때의 handler.
	*/
	function speakerFrequencyFocusHandler(event) {
		console.log("speaker frequency focusin handler");
		// arrFocus = "speakerData";
		focused = $(":focus");

		var blockConditionbox = $(event.target).parents(".blockConditionBox");
		var boxHelp = $(event.target).parents(".blockConditionBox").find(".boxHelp");
		var boxWhat = $(event.target).parents(".blockConditionBox").find(".what input").val();
		var boxList = $(event.target).closest(".blockConditionBox").find(".boxList");
		var helpText;
		var thisClass = $(event.target);
		if(cordova.isCordova()){
			boxWhat = "Custom tune";
		}

		boxList.empty();

		if(boxWhat == "Basic tune") {
			$(targetBox).next().find(".boxHelp").empty();
			console.log("(guiblock.js) (speaker frequency focus handler) Basic tune");

			$(event.target).css({"color": "rgb(0, 0, 0)"});

			// Basic 클릭했을 때 frequency에 들어있는 값이 피아노 값이 아니면 비우기
			arrPiano.forEach(function(item) {
				if(thisClass.val() !== item.defineVal) {
					thisClass.val("");
				}
			});
			
			focusBoxhelpTable.forEach(function(item) {
				if(item.beforeInput == boxWhat) {
					boxHelp.append(item.helpMessage);
				}
			});

			// $(".frequency input").val()에 들어있는 값에 따라 piano에 addClass("basicBackgroundClick")
			arrPiano.forEach(function(item) {
				if(blockConditionbox.attr("data-frequency") == item.defineVal) {
					blockConditionbox.find(".frequency input").val(blockConditionbox.attr("data-frequency"));
				}
				if(thisClass.val() == item.defineVal) {
					blockConditionbox.find("."+item.value).addClass("basicBackgroundClick");
				}
			});

			// keyboard 누를 때 $(".frequency input")에 keyboard값 입력
			toggleSpeakerClassClick(".keyboard");

		} else if(boxWhat == "Custom tune") {
			$(targetBox).next().find(".boxHelp").empty();
			console.log("(guiblock.js) (speaker frequency focus handler) Custom tune");

			focusBoxhelpTable.forEach(function(item) {
				if(item.beforeInput == boxWhat) {
					boxHelp.append(item.helpMessage);
				}
			});

			setSpeakerFrequency(".frequency input");

			drawArr($(event.target).closest(".blockConditionBox").find(".boxList"), arrInput, /*arrOutput, */arrNumber, arrRandom);

		} else {
			$(event.target).css({"color": "rgb(188, 188, 188)"});
		}

		event.stopPropagation();
	}

	/**
		Speaker Block의 volume input element에 focus in이 될 때의 handler.
	*/
	function speakerVolumeFocusHandler(event) {
		console.log("volume focusin handler");
		// arrFocus = "speakerData";
		focused = $(":focus");

		var blockConditionbox = $(event.target).closest(".blockConditionBox");
		var boxHelp = $(event.target).closest(".blockConditionBox").find(".boxHelp");
		var helpText;

		boxHelp.empty();

		helpText = '<div class="volumeBackground" style="width: 70px; height: 78px; position: absolute; left: 251px; bottom: 50px; background: rgb(38, 202, 211);"></div><div class="body" style="width: 349px; height: 210px; background: url(\'image/help/helpCustomTune2_0OrVolme.svg\');"><div class="text">Enter a volume of Speaker module on the blank above. </div></div></div>'; 

		boxHelp.html(helpText);

		setVolumeBackground($(event.target), boxHelp);

		$(event.target).on("keyup", speakerVolumeKeyupHandler);

		drawArr($(event.target).closest(".blockConditionBox").find(".boxList"), arrInput, /*arrOutput, */arrNumber, arrRandom);

		event.stopPropagation();
	}

	function speakerVolumeKeyupHandler(event) {
		var blockConditionbox = $(event.target).closest(".blockConditionBox");
		var helpbox = blockConditionbox.find(".boxHelp");
		
		setVolumeBackground($(event.target), helpbox);

		setData(blockConditionbox, "volume", $(event.target).val());
	}

	function setVolumeBackground(where, target) {
		if(where.val() >= 100) {
			target.find(".volumeBackground").css({
				"height": 78
			});
		} else {
			target.find(".volumeBackground").css({
				"height": where.val() / 100 * 78
			});
		}
	}

	/**
	* Speaker Block ConditionBox에서 OK 버튼을 눌렀을 때 그 내용을 Block에 출력한다.
	*
	* @method speakerOKButtonHandler
	* @param {event} 이벤트 객체를 인자로 받는다.
	*/
	function speakerOKButtonHandler(event) {
		var plumb = require('plumb');
		var blockLi = $(event.target).closest("li");
		var blockConditionbox = $(event.target).closest(".blockConditionBox");
		var content = "";
		var code = "";
		var srcID = "";
		var dstID = "";

		blockConditionbox.hide();

		if(event.originalEvent)	pushUndo();

		if(cordova.isCordova()){
			//모바일 hover기능을 위한 소스
			if(event.type == "touchstart"){
				$(event.currentTarget).parent().addClass("clickOk");
				return;
			}
			else if(event.type == "touchend"){
				$(event.currentTarget).parent().removeClass("clickOk");
				event.preventDefault();
			}	
		}

		content += blockConditionbox.find(".frequency input").val();
		content += ", ";
		content += blockConditionbox.find(".volume input").val();

		code += blockConditionbox.find(".name").text().split(" 's")[0];
		code += ".";
		code += "set_tune(";
		// code += convertStr2Code(blockConditionbox.find(".what input").val());
		// if(convertStr2Code(blockConditionbox.find(".data input").val()) == "TRUE") {
		// 	code += "1";
		// }
		// else if(convertStr2Code(blockConditionbox.find(".data input").val()) == "FALSE") {
		// 	code += "2";
		// }
		// else {
			if(parseInt(convertStr2Code(blockConditionbox.find(".frequency input").val())) >= 0) {
				// code += (parseInt(convertStr2Code(blockConditionbox.find(".frequency input").val()))/100*1000).toString();
				code += convertStr2Code(blockConditionbox.find(".frequency input").val());
			}
			else {
				code += convertStr2Code(blockConditionbox.find(".frequency input").val());
			}

			code += ",";
			code += convertStr2Code(blockConditionbox.find(".volume input").val());
		// }
		code += ");";

		setData(blockLi, "code", code);

		setData(blockConditionbox, "save-what", blockConditionbox.find(".what input").val());
		setData(blockConditionbox, "save-frequency", blockConditionbox.find(".frequency input").val());
		setData(blockConditionbox, "save-volume", blockConditionbox.find(".volume input").val());
		setData(blockConditionbox, "frequency", blockConditionbox.find(".frequency input").val());
		setData(blockConditionbox, "volume", blockConditionbox.find(".volume input").val());

		bindConnections();

		blockConditionbox.parent().find(".content").text(content);

		$(blockLi.find(".blockWrapper")[0]).css({
			width: blockLi.find(".content").width() + 70
		});
		$(blockLi.find(".block")[0]).css({
			width: $(blockLi.find(".blockWrapper")[0]).width() + 10
		});
		if(cordova.isCordova()){
			hideAllConditionBox();
			$(blockLi.find(".blockWrapper")[0]).css({
				width: blockLi.find(".content").width() + 60
			});
			$(blockLi.find(".block")[0]).css({
				width: $(blockLi.find(".blockWrapper")[0]).width() + 6
			});
		}
		setEditorScroll();

		event.stopPropagation();
	}

	/**
		Display Block의 what input element에 focus in이 될 때의 handler.
	*/
	function displayWhatFocusHandler(event) {
		console.log("display what focusin handler");
		arrFocus = "displayWhat";
		focused = $(":focus");

		var blockConditionbox = $(event.target).closest(".blockConditionBox");
		var boxBottomWrapper = blockConditionbox.find(".boxBottomWrapper");
		var helpbox = blockConditionbox.find(".boxHelp");
		var boxList = blockConditionbox.find(".boxList");

		boxBottomWrapper.css({"height" : "192px"});
		boxList.css({"height" : "192px"});
		helpbox.css({"height" : "192px"});

		drawArrProp(boxList, "display");

		setBasicHelp(helpbox, $(event.target).closest(".dd-item"));

		event.stopPropagation();
	}

	/**
		Display Block의 data input element에 focus in이 될 때의 handler.
	*/
	function displayDataFocusHandler(event) {
		console.log("display data focusin handler");
		// arrFocus = "speakerData";
		focused = $(":focus");

		var blockConditionbox = $(event.target).closest(".blockConditionBox");
		var boxBottomWrapper = blockConditionbox.find(".boxBottomWrapper");
		var helpbox = blockConditionbox.find(".boxHelp");
		var boxWhat = blockConditionbox.find(".what input").val();
		var boxList = blockConditionbox.find(".boxList");
		var helpText;

		boxList.empty();

		boxBottomWrapper.css({"height" : "192px"});
		boxList.css({"height" : "192px"});
		helpbox.css({"height" : "192px"});

		if(boxWhat == "Drawing") {
			$(event.target).val("Picture");
			$(event.target).css({"background": "rgb(209, 209, 209)"});
			
			focusBoxhelpTable.forEach(function(item) {
				if(item.beforeInput == boxWhat) {
					helpbox.html(item.helpMessage);
				}
			});

			if(blockConditionbox.attr("data-drawing") == "null") {
				helpbox.find(".pxboard").html(displayDrawingPx);
			} else {
				helpbox.find(".pxboard").html(blockConditionbox.attr("data-drawing"));
			}

			setDrawing(helpbox);
			setDrawingText(helpbox);

			helpbox.find(".pen").click();

			helpbox.find(".tools .penSize").val(helpbox.attr("data-pen-size"));
			helpbox.find(".tools .eraseSize").val(helpbox.attr("data-erase-size"));
		} else if(boxWhat == "Text") {
			$(event.target).css({"background": "rgb(255, 255, 255)"});

			boxBottomWrapper.css({"height" : "208px"});
			boxList.css({"height" : "208px"});
			helpbox.css({"height" : "208px"});

			$(targetBox).next().find(".boxHelp").empty();
			focusBoxhelpTable.forEach(function(item) {
				if(item.beforeInput == boxWhat) {
					helpbox.append(item.helpMessage);
				}
			});

			$(event.target).val(blockConditionbox.attr("data-text"));

			//.data input의 값을 한 글자씩 쪼개서 넣은 것이 icon
			var icon = $(event.target).val().split("");

			setText(icon, helpbox);

			$(event.target).on("keyup", function() {
				var icon = $(event.target).val().split("");

				helpbox.find(".screen").empty();
				setData(blockConditionbox, "text", $(event.target).val());

				setText(icon, helpbox);
			});
		} else if(boxWhat == "Data display") {
			$(targetBox).next().find(".boxHelp").empty();
			console.log("Data display Data display Data display Data display Data display");
			
			drawArr($(event.target).closest(".blockConditionBox").find(".boxList"), arrInput, /*arrOutput, */arrNumber, arrRandom);
		} else {
			$(event.target).css({"color": "rgb(188, 188, 188)"});
		}

		event.stopPropagation();

		function setText(icon, helpbox) {
			for(var j = 0; j < icon.length; j++) {
				helpbox.find(".screen").append('<div class="icon icon'+j+'"></div>');

				helpbox.find(".screen .icon"+j).css({
					"background": "url('image/help/7x14_bmp/char"+displayText.arrDisplayIconSymbol[icon[j]].hexcode+".bmp') no-repeat center",
					"width" : displayText.arrDisplayIconSymbol[icon[j]].width+"px"
				});
			}
		}
	}


	var clicking = false;
	function setDrawing(helpbox) {
		var blockConditionbox = helpbox.closest(".blockConditionBox");
		var drawingboard = helpbox.find(".drawingboard");
		var pxboard = helpbox.find(".pxboard");

		helpbox.find(".tools .pen").on("click", penClickHandler);
		helpbox.find(".tools .erase").on("click", eraseClickHandler);
		helpbox.find(".tools .text").on("click", textClickHandler);
		helpbox.find(".tools .penSize").on("click", setPenSizeHandler);
		helpbox.find(".tools .eraseSize").on("click", setEraseSizeHandler);

		pxboard.on("mousedown", mousedownHandler);
		pxboard.on("mousemove", mousemoveHandler);
		$(document).on("mouseup", mouseupHandler);
		pxboard.on("click", mouseclickHandler);

		function penClickHandler(event) {
			var tools = $(event.target).parent();
			var pen = $(event.target).parent().find(".pen");
			var erase = $(event.target).parent().find(".erase");
			var text = $(event.target).parent().find(".text");

			if($(event.target).hasClass("penOn")) {
				if($(event.target).parent().find(".penSize").hasClass("displayInitial")) {
					$(event.target).parent().find(".penSize").removeClass("displayInitial");
					$(event.target).parent().find(".eraseSize").removeClass("displayInitial");

					$(event.target).parent().find(".erase").removeClass("displayNone");
					$(event.target).parent().find(".text").removeClass("displayNone");
					$(event.target).parent().find(".save").removeClass("displayNone");
				} else if(!$(event.target).parent().find(".penSize").hasClass("displayInitial")) {
					$(event.target).parent().find(".penSize").addClass("displayInitial");
					$(event.target).parent().find(".eraseSize").removeClass("displayInitial");

					$(event.target).parent().find(".erase").addClass("displayNone");
					$(event.target).parent().find(".text").addClass("displayNone");
					$(event.target).parent().find(".save").addClass("displayNone");
				}
			} else if(!$(event.target).hasClass("penOn")) {
				$(event.target).addClass("penOn");
				erase.removeClass("eraseOn");
				text.removeClass("textOn");

				removeCloneBoard(helpbox);
			}

			helpbox.find(".px").css({"cursor": "url('image/penMouse.svg'), auto"});
		}

		function eraseClickHandler(event) {
			if($(event.target).hasClass("eraseOn")) {
				if($(event.target).parent().find(".eraseSize").hasClass("displayInitial")) {
					$(event.target).parent().find(".penSize").removeClass("displayInitial");
					$(event.target).parent().find(".eraseSize").removeClass("displayInitial");

					$(event.target).parent().find(".pen").removeClass("displayNone");
					$(event.target).parent().find(".text").removeClass("displayNone");
					$(event.target).parent().find(".save").removeClass("displayNone");
				} else if(!$(event.target).parent().find(".eraseSize").hasClass("displayInitial")) {
					$(event.target).parent().find(".penSize").removeClass("displayInitial");
					$(event.target).parent().find(".eraseSize").addClass("displayInitial");

					$(event.target).parent().find(".pen").addClass("displayNone");
					$(event.target).parent().find(".text").addClass("displayNone");
					$(event.target).parent().find(".save").addClass("displayNone");
				}
			} else if(!$(event.target).hasClass("eraseOn")) {
				$(event.target).addClass("eraseOn");
				$(event.target).parent().find(".pen").removeClass("penOn");
				$(event.target).parent().find(".text").removeClass("textOn");

				removeCloneBoard(helpbox);
			}

			helpbox.find(".px").css({
				"cursor": "url('image/eraserMouse.svg') 0 7, auto"
			});
		}

		function textClickHandler(event) {
			$(event.target).addClass("textOn");
			$(event.target).parent().find(".pen").removeClass("penOn");
			$(event.target).parent().find(".erase").removeClass("eraseOn");

			helpbox.find(".cloneForText").css({"display": "initial"});
			helpbox.find(".cloneForText").html(displayDrawingPxClone);

			helpbox.find(".px").css({"cursor": "url('image/textMouse.svg'), auto"});
		}

		function mousedownHandler(event) {
			clicking = true;
			pushUndo();
			addDrawed(helpbox.attr("data-pen-size"));
			eraseDrawed(helpbox.attr("data-erase-size"));
		}

		function mousemoveHandler(event) {
			if(clicking === false) return;

			addDrawed(helpbox.attr("data-pen-size"));
			eraseDrawed(helpbox.attr("data-erase-size"));
			
			setData(blockConditionbox, "drawing", pxboard.html());
		}

		function mouseupHandler(event) {
			if(clicking) {
				clicking = false;
				// pushUndo();
			}
		}

		function mouseclickHandler(event) {
			addDrawed(helpbox.attr("data-pen-size"));
			eraseDrawed(helpbox.attr("data-erase-size"));

			setData(blockConditionbox, "drawing", pxboard.html());
		}

		function addDrawed(size) {
			if(helpbox.find(".tools .pen").hasClass("penOn")) {
				var clickedPx = parseInt($(event.target).attr("class").split(" ")[1].split("px")[1]);

				helpbox.find(".drawingboard .px"+clickedPx).addClass("drawed");

				for(var i = 0; i < size; i++) {
					for(var j = 0; j < size; j++) {
						var plusPlus = i+64*j;
						var plusMinus = i-64*j;

						if(size <= 3) {
							if( !((j==size-1) && (i==size-1)) ) {
								if(clickedPx%64+i < 64) {
									helpbox.find(".drawingboard .px"+(clickedPx+plusPlus)).addClass("drawed");
									helpbox.find(".drawingboard .px"+(clickedPx+plusMinus)).addClass("drawed");
								}
								if(clickedPx%64-i >= 0) {
									helpbox.find(".drawingboard .px"+(clickedPx-plusPlus)).addClass("drawed");
									helpbox.find(".drawingboard .px"+(clickedPx-plusMinus)).addClass("drawed");
								}
							}
						} else if(3 < size) {
							if( !((j==size-1) && (i==size-1)) && !((j==size-1) && (i==size-2)) && !((j==size-2) && (i==size-1)) ) {
								if(clickedPx%64+i < 64) {
									helpbox.find(".drawingboard .px"+(clickedPx+plusPlus)).addClass("drawed");
									helpbox.find(".drawingboard .px"+(clickedPx+plusMinus)).addClass("drawed");
								}
								if(clickedPx%64-i >= 0) {
									helpbox.find(".drawingboard .px"+(clickedPx-plusPlus)).addClass("drawed");
									helpbox.find(".drawingboard .px"+(clickedPx-plusMinus)).addClass("drawed");
								}
							}
						}
					}
				}
			}
		}

		function eraseDrawed(size) {
			if(helpbox.find(".tools .erase").hasClass("eraseOn")) {
				var clickedPx = parseInt($(event.target).attr("class").split(" ")[1].split("px")[1]);

				helpbox.find(".drawingboard .px"+clickedPx).removeClass("drawed");
				
				for(var i = 0; i < size; i++) {
					for(var j = 0; j < size; j++) {
						var plusPlus = i+64*j;
						var plusMinus = i-64*j;

						if(size <= 3) {
							if( !((j==size-1) && (i==size-1)) ) {
								if(clickedPx%64+i < 64) {
									helpbox.find(".drawingboard .px"+(clickedPx+plusPlus)).removeClass("drawed");
									helpbox.find(".drawingboard .px"+(clickedPx+plusMinus)).removeClass("drawed");
								}
								if(clickedPx%64-i >= 0) {
									helpbox.find(".drawingboard .px"+(clickedPx-plusPlus)).removeClass("drawed");
									helpbox.find(".drawingboard .px"+(clickedPx-plusMinus)).removeClass("drawed");
								}
							}
						} else if(3 < size) {
							if( !((j==size-1) && (i==size-1)) && !((j==size-1) && (i==size-2)) && !((j==size-2) && (i==size-1)) ) {
								if(clickedPx%64+i < 64) {
									helpbox.find(".drawingboard .px"+(clickedPx+plusPlus)).removeClass("drawed");
									helpbox.find(".drawingboard .px"+(clickedPx+plusMinus)).removeClass("drawed");
								}
								if(clickedPx%64-i >= 0) {
									helpbox.find(".drawingboard .px"+(clickedPx-plusPlus)).removeClass("drawed");
									helpbox.find(".drawingboard .px"+(clickedPx-plusMinus)).removeClass("drawed");
								}
							}
						}
					}
				}
			}
		}

	}

	function setPenSizeHandler(event) {
		$(event.target).closest(".boxHelp").attr("data-pen-size", $(event.target).val());
	}

	function setEraseSizeHandler(event) {
		$(event.target).closest(".boxHelp").attr("data-erase-size", $(event.target).val());
	}

	var firstClick;
	var movingClick;
	function setDrawingText(helpbox) {
		var blockConditionbox = helpbox.closest(".blockConditionBox");
		var drawingboard = helpbox.find(".drawingboard");
		var cloneboard = helpbox.find(".cloneForText");

		cloneboard.on("click", clickFocusHandler);

		$(document).on("keyup", keyupHandler);

		function clickFocusHandler(event) {
			if(helpbox.find(".tools .text").hasClass("textOn") && $(event.target).hasClass("px")) {
				firstClick = parseInt($(event.target).attr("class").split("px")[2]);

				movingClick = firstClick;

				setFocus(movingClick);
			}
		}

		function setFocus(focus) {
			removeCursor(helpbox);

			if(focus !== "") {
				for(var i = 0; i < 14; i++) {
					helpbox.find("#px"+(focus+64*i)).addClass("textFocus");
				}
			}
		}

		function keyupHandler(event) {
			if(cloneboard.find(".px").hasClass("textFocus")) {
				var textLength;
				var hexToBin = [];
				
				movingClick = firstClick;

				cloneboard.find(".px").removeClass("drawed");

				if(event.key == "Backspace") {
					setData(blockConditionbox, "drawing-text", blockConditionbox.attr("data-drawing-text").slice(0, blockConditionbox.attr("data-drawing-text").length-1));
				} else if(event.key !== "Backspace" && displayText.arrDisplayIconSymbol[event.key] !== undefined){
					setData(blockConditionbox, "drawing-text", blockConditionbox.attr("data-drawing-text")+event.key);
				}
				textLength = blockConditionbox.attr("data-drawing-text").length;



				for(var t = 0; t < textLength; t++) {
					console.log("icon : "+blockConditionbox.attr("data-drawing-text").split("")[t]);
					var iconWidth = displayText.arrDisplayIconSymbol[blockConditionbox.attr("data-drawing-text").split("")[t]].width;
					var iconDot = displayText.arrDisplayIconSymbol[blockConditionbox.attr("data-drawing-text").split("")[t]].dot;

					for(var i = 0; i < 14; i++) {
						for(var j = 0; j < 2; j++) {
							hexToBin[i*2+j] = iconDot[i].split("")[j];

							hexToBin[i*2+j] = parseInt(hexToBin[i*2+j], 16).toString(2);

							if(hexToBin[i*2+j].length == 1) {
								hexToBin[i*2+j] = "000" + hexToBin[i*2+j];
							} else if(hexToBin[i*2+j].length == 2) {
								hexToBin[i*2+j] = "00" + hexToBin[i*2+j];
							} else if(hexToBin[i*2+j].length == 3) {
								hexToBin[i*2+j] = "0" + hexToBin[i*2+j];
							} 
						}

						hexToBin[i] = hexToBin[0+2*i] + hexToBin[1+2*i];

						for(var k = 0; k < iconWidth; k++) {
							if(hexToBin[i].split("")[k] == 1) {
								if((movingClick+k+64*i)%64 > iconWidth || (movingClick%64+iconWidth < 64)) {
									cloneboard.find("#px"+(movingClick+k+i*64)).addClass("drawed");
								}
							}
						}
					}

					movingClick = movingClick + iconWidth;

					if(movingClick%64 < iconWidth ) {
						movingClick = "";
					}

					helpbox.find(".px").removeClass("textFocus");
					if(movingClick !== "") {
						for(var l = 0; l < 14; l++) {
							helpbox.find("#px"+(movingClick+64*l)).addClass("textFocus");
						}
					} else {
						removeCursor(helpbox);
					}
				}
			}
		}
	}

	function removeCursor(helpbox) {
		var blockConditionbox = helpbox.closest(".blockConditionBox");
		helpbox.find(".px").removeClass("textFocus");

		for(var i = 0; i < 3072; i++) {
			if(helpbox.find(".pxboard .px"+i).hasClass("drawed") || helpbox.find(".cloneForText .px"+i).hasClass("drawed")) {
				helpbox.find(".pxboard .px"+i).addClass("drawed");
			}
		}
		setData(blockConditionbox, "drawing", helpbox.find(".pxboard").html());
		setData(blockConditionbox, "drawing-text", "");
	}

	function removeCloneBoard(helpbox) {
		removeCursor(helpbox);

		helpbox.find(".cloneForText").empty();
		helpbox.find(".cloneForText").css({"display": "none"});
	}


	/**
	* Display Block ConditionBox에서 OK 버튼을 눌렀을 때 그 내용을 Block에 출력한다.
	*
	* @method displayOKButtonHandler
	* @param {event} 이벤트 객체를 인자로 받는다.
	*/
	function displayOKButtonHandler(event) {
		var plumb = require('plumb');
		var blockLi = $(event.target).closest("li");
		var blockConditionbox = $(event.target).closest(".blockConditionBox");
		var boxWhat = blockConditionbox.find(".what input").val();
		var content = "";
		var code = "";
		var text = "";

		blockConditionbox.hide();

		if(event.originalEvent)	pushUndo();

		if(cordova.isCordova()){
			//모바일 hover기능을 위한 소스
			if(event.type == "touchstart"){
				$(event.currentTarget).parent().addClass("clickOk");
				return;
			}
			else if(event.type == "touchend"){
				$(event.currentTarget).parent().removeClass("clickOk");
				event.preventDefault();
			}	
		}

		blockConditionbox.parent().find(".content").empty();

		code += blockConditionbox.find(".name").text().split(" 's")[0];
		code += ".";
		code += "set_display_";

		if(boxWhat == "Drawing") {
			removeCursor(blockConditionbox.find(".boxHelp"));

            content += '<div style="width: 28px; height: 20px; margin: auto; margin-top: 17px; background: url(\'image/help/picture.svg\');"></div>';

            code += "dot(\n";
            code += convertBinaryToCode(blockConditionbox);
			code += ");";

			setData(blockConditionbox, "save-drawing", blockConditionbox.attr("data-drawing"));
		} else if(boxWhat == "Text") {
			content = "Text, " + blockConditionbox.find(".data input").val();

			code += "text(\"";
			code += blockConditionbox.find(".data input").val();
			code += "\");";

			setData(blockConditionbox, "save-text", blockConditionbox.find(".data input").val());
		} else if(boxWhat == "Data display") {
			content = "Data display";
		} else {
			code += "();";
		}

		setData(blockLi, "code", code);
		setData(blockConditionbox, "save-what", blockConditionbox.find(".what input").val());
		
		bindConnections();
		blockConditionbox.parent().find(".content").append(content);

		$(blockLi.find(".blockWrapper")[0]).css({
			width: blockLi.find(".content").width() + 70
		});
		$(blockLi.find(".block")[0]).css({
			width: $(blockLi.find(".blockWrapper")[0]).width() + 10
		});


		if(cordova.isCordova()){
			$(blockLi.find(".blockWrapper")[0]).css({
				width: blockLi.find(".content").width() + 60
			});
			$(blockLi.find(".block")[0]).css({
				width: $(blockLi.find(".blockWrapper")[0]).width() + 6
			});
			hideAllConditionBox();
		}
		setEditorScroll();

		event.stopPropagation();
	}

	/**
		Usb Block의 what input element에 focus in이 될 때의 handler.
	*/
	function usbWhatFocusHandler(event) {
		console.log("usb what focusin handler");
		arrFocus = "usbWhat";
		focused = $(":focus");

		drawArrProp($(event.target).closest(".blockConditionBox").find(".boxList"), "network_output");

		setBasicHelp($(event.target).closest(".blockConditionBox").find(".boxHelp"), $(event.target).closest(".dd-item"));

		event.stopPropagation();
	}

	/**
		Usb Block의 data input element에 focus in이 될 때의 handler.
	*/
	function usbDataFocusHandler(event) {
		event.stopPropagation();
	}

	/**
	* Usb Block ConditionBox에서 OK 버튼을 눌렀을 때 그 내용을 Block에 출력한다.
	*
	* @method usbOKButtonHandler
	* @param {event} 이벤트 객체를 인자로 받는다.
	*/
	function usbOKButtonHandler(event) {
		var blockLi = $(event.target).closest("li");
		var blockConditionbox = $(event.target).closest(".blockConditionBox");
		var content = "";
		var code = "";
		
		blockConditionbox.hide();

		if(event.originalEvent)	pushUndo();

		if(cordova.isCordova()){
			//모바일 hover기능을 위한 소스
			if(event.type == "touchstart"){
				$(event.currentTarget).parent().addClass("clickOk");
				return;
			}
			else if(event.type == "touchend"){
				$(event.currentTarget).parent().removeClass("clickOk");
				event.preventDefault();
			}	
		}

		// content += blockConditionbox.find(".what input").val();
		// content += ", ";
		content += blockConditionbox.find(".usbdata input").val();

		code += blockConditionbox.find(".name").text().split(" 's")[0];
		code += ".";
		code += "set_send_data(";
		// code += convertStr2Code(blockConditionbox.find(".what input").val());
		// if(convertStr2Code(blockConditionbox.find(".data input").val()) == "TRUE") {
		// 	code += "1";
		// }
		// else if(convertStr2Code(blockConditionbox.find(".data input").val()) == "FALSE") {
		// 	code += "2";
		// }
		// else {
			code += convertStr2Code(blockConditionbox.find(".usbdata input").val());
		// }
		code += ");";

		setData(blockLi, "code", code);

		setData(blockConditionbox, "save-what", blockConditionbox.find(".what input").val());
		setData(blockConditionbox, "save-usbdata", blockConditionbox.find(".usbdata input").val());

		blockConditionbox.parent().find(".content").text(content);

		$(blockLi.find(".blockWrapper")[0]).css({
			width: blockLi.find(".content").width() + 70
		});
		$(blockLi.find(".block")[0]).css({
			width: $(blockLi.find(".blockWrapper")[0]).width() + 10
		});

		if(cordova.isCordova()){
			hideAllConditionBox();
			$(blockLi.find(".blockWrapper")[0]).css({
				width: blockLi.find(".content").width() + 60
			});
			$(blockLi.find(".block")[0]).css({
				width: $(blockLi.find(".blockWrapper")[0]).width() + 6
			});
		}
		setEditorScroll();

		event.stopPropagation();
	}

	function convertBinaryToCode(blockConditionbox) {
		var helpbox = blockConditionbox.find(".boxHelp");
		var pxboard = helpbox.find(".pxboard");
		var binToHex = [];
		var code = "    ";

		for(var i = 0; i < 3072; i++) {
			var quotient4 = (i-i%4)/4;
			var quotient8 = (i-i%8)/8;


			if(binToHex[quotient4] === undefined) {
				binToHex[quotient4] = "";
			}
			if(pxboard.find(".px"+i).hasClass("drawed")) {
				binToHex[quotient4] += "1";
			} else if(!pxboard.find(".px"+i).hasClass("drawed")) {
				binToHex[quotient4] += "0";
			}

			if(i%4 == 3) {
				binToHex[quotient4] = parseInt(binToHex[quotient4], 2).toString(16);
			}

			if(i%8 == 7) {
				binToHex[quotient8] = "0x" + binToHex[quotient4-1] + binToHex[quotient4];

				if(quotient8 < 383) {
					binToHex[quotient8] = binToHex[quotient8] + ", ";
				}

				if(quotient8 !== 383 && i%64 == 63) {
					binToHex[quotient8] = binToHex[quotient8] + "\n    ";
				}


				code += binToHex[quotient8];
			}
		}
		return code;
	}

	function bindConnections() {
		var plumb = require('plumb');
		var i, j;
		var blocks = $(".editor .onEditor .blockConditionBox");
		var modules = $(".map .module");

		plumb.mapInstance.detachEveryConnection();

		for(i = 0; i < blocks.length; i++) {
			var dstName = $(blocks[i]).find(".name").text().split(" 's")[0];
			var srcNameA = "";
			var srcNameB = "";
			var srcNameC = "";
			if($(blocks[i]).closest(".onEditor").hasClass("ledBlock")) {
				console.log("ledBlockledBlockledBlockledBlockledBlock");
				srcNameA = $(blocks[i]).find(".red input").val().split(".")[0];
				srcNameB = $(blocks[i]).find(".green input").val().split(".")[0];
				srcNameC = $(blocks[i]).find(".blue input").val().split(".")[0];

				if(srcNameA == srcNameB) {
					srcNameB = "";
				}
				if(srcNameB == srcNameC) {
					srcNameC = "";
				}
				if(srcNameC == srcNameA) {
					srcNameA = "";
				}

				console.log("srcNameA : "+srcNameA+", srcNameB : "+srcNameB+", srcNameC : "+srcNameC);
			}
			else if($(blocks[i]).closest(".onEditor").hasClass("motorBlock")) {
				console.log("motorBlockmotorBlockmotorBlockmotorBlockmotorBlock");
				srcNameA = $(blocks[i]).find(".upper input").val().split(".")[0];
				srcNameB = $(blocks[i]).find(".bottom input").val().split(".")[0];

				if(srcNameA == srcNameB) {
					srcNameB = "";
				}
			}
			else if($(blocks[i]).closest(".onEditor").hasClass("speakerBlock")) {
				console.log("speakerBlockspeakerBlockspeakerBlockspeakerBlockspeakerBlock");
				srcNameA = $(blocks[i]).find(".frequency input").val().split(".")[0];
				srcNameB = $(blocks[i]).find(".volume input").val().split(".")[0];

				if(srcNameA == srcNameB) {
					srcNameB = "";
				}
			}

			for(j = 0; j < modules.length; j++) {
				if($(modules[j]).data("name") == dstName) {
					dstID = $(modules[j]).attr("id");
					break;
				}
			}

			for(j = 0; j < modules.length; j++) {
				if($(modules[j]).data("name") == srcNameA) {
					srcID = $(modules[j]).attr("id");
					if(srcID !== dstID) {
						plumb.connectMapmodules(plumb.mapInstance, srcID, dstID);
						// break;
					}
				}
				if($(modules[j]).data("name") == srcNameB) {
					srcID = $(modules[j]).attr("id");
					if(srcID !== dstID) {
						plumb.connectMapmodules(plumb.mapInstance, srcID, dstID);
						// break;
					}
				}
				if($(modules[j]).data("name") == srcNameC) {
					srcID = $(modules[j]).attr("id");
					if(srcID !== dstID) {
						plumb.connectMapmodules(plumb.mapInstance, srcID, dstID);
						// break;
					}
				}
			}
		}
	}

	function getHelpText(property, type) {
		var key;
		var itr;

		// if(property == " TRUE") {
		// 	property = "TRUE";
		// } else if(property == " FALSE") {
		// 	property = "FALSE";
		// }

		if(propertyTable[type]) {
			for(itr = 0; itr < propertyTable[type].length; itr++) {
				if(propertyTable[type][itr].name == property) {
					return propertyTable[type][itr].helpMessage;
				}
			}
		}

		for(key in propertyTable) {
			for(itr = 0; itr < propertyTable[key].length; itr++) {
				if(propertyTable[key][itr].name == property) {
					return propertyTable[key][itr].helpMessage;
				}
			}
		}

		for(itr = 0; itr < arrWhat.length; itr++) {
			if(arrWhat[itr].name == property) {
				return arrWhat[itr].helpMessage;
			}
		}

		for(itr = 0; itr < arrMath.length; itr++) {
			if(arrMath[itr].name == property) {
				return arrMath[itr].helpMessage;
			}
		}

		for(itr = 0; itr < arrSign.length; itr++) {
			if(arrSign[itr].name == property) {
				return arrSign[itr].helpMessage;
			}
		}

		for(itr = 0; itr < arrNetworkMobileEvent.length; itr++) {
			if(arrNetworkMobileEvent[itr].name == property) {
				return arrNetworkMobileEvent[itr].helpMessage;
			}
		}

		if(property.substr(0,7) == " number") {
			type = "number";
		} else if(property.substr(0, 7) == " random") {
			type = "random";
		} 

		for(itr = 0; itr < wholeModuleTable.length; itr++) {
			if(wholeModuleTable[itr].name == type) {
				return wholeModuleTable[itr].helpMessage;
			}
		}

		return null;
	}

	// 리턴벨류 : 	true >> 모듈임.
	//				false >> 모듈아님. variable임.
	//				null >> 목록에 없음.

	//	ex)
	// 	console.log("variable1 is " + isModule("variable1", arr1And3));
	//	console.log("motor2 is " + isModule("motor2", arr1And3));
	//	console.log("abcd is " + isModule("abcd", arr1And3));


	/**
	* 모듈이라면 true, 아니면 false, 배열에 없다면 null을 반환해준다.
	*
	* @method isModule
	* @param {String} input 문자열을 입력 받아서 arr 배열에서 모듈인지 아닌지 확인한다.
	* @param {Array} arr 모듈인지 아닌지 비교할 배열이다.
	* @return {Boolean} Returns true input is module, but not found => false
	*/
	function isModule(input, arr) {
		for(var i = 0, len = arr.length; i < len; i++) {
			if(input.toLowerCase() === arr[i].name.toLowerCase()) 
				return arr[i].isModule;
		}
		return false;
	}

	/**
	* 배열을 찾아서 input(name)이 어떤 타입인지 알려준다.
	* 만약 Ultrasonic1이라면 ultrasonic를 찾아준다.
	*
	* @method getType
	* @param {String} input 문자열을 입력 받아서 arr 배열에서 타입을 찾아준다.
	* @param {Array} arr 타입을 가져올 배열이다.
	* @return {Boolean} Returns type of input
	*/
	function getType(input, arr) {
		for(var i = 0, len = arr.length; i < len; i++) {
			if(input.toLowerCase() === arr[i].name.toLowerCase())
				return arr[i].type;
		}
		return null;
	}

	/**
	* arr2(부호 배열)에서 input(name)이 어떤 이미지 경로를 가지고 있는지 반환해준다.
	*
	* @method getImagePathByName
	* @param {String} input 문자열을 입력 받아서 arr2 배열에서 타입을 찾아준다.
	* @param {Array} arr 타입을 가져올 배열이다. (현재 arr2만 사용됨.)
	* @return {String} arr2에서 input에 해당하는 이미지 경로를 반환한다.
	*/
	function getImagePathByName(input, arr) {
		for(var i = 0, len = arr.length; i< len; i++) {
			if(input === arr[i].form)
				return arr[i].imagePath;
		}
	}

	/**
	* DOM에도 적용해주고, 실제 문서에도 반영해주기 위해 setData 메소드를 호출하면된다.
	*
	* @method isModule
	* @param {DOM} selector Data를 설정하고 싶은 DOM
	* @param {String} key Data로 설정할 키값
	* @param {Object} value key값에 매칭될 Value값 어떤 타입도 될 수있다.
	*/
	function setData(selector, key, value) {
		if((value === true) || (value === false)) {
			$(selector).data(key, value);
			$(selector).attr("data-" + key, "" + value);
		} else {
			$(selector).data(key, value);
			$(selector).attr("data-" + key, value);
		}
	}

	/**
	* If, While 블럭은 처음에 Condition, Root If Block이라면 Always 혹은 Condition 같은 Background-Image를 가지게 된다.
	* 이 Background-Image를 보여주는 상태로 변경할 때 호출하면된다.
	*
	* @method showBlockBackgroundImage
	* @param {DOM} Background-Image를 "보여주기"로 전환할 Block의 내부 DOM 중 하나를 인자로 넘겨주면 된다.
	*/
	function showBlockBackgroundImage(targetElement) {
		$(targetElement).closest(".dd-item").children(".block").children(".blockBackground").css("display", "");
	}

	/**
	* If, While 블럭은 처음에 Condition, Root If Block이라면 Always 혹은 Condition 같은 Background-Image를 가지게 된다.
	* 이 Background-Image를 보여주는 상태로 변경할 때 호출하면된다.
	*
	* @method hideBlockBackgroundImage
	* @param {DOM} Background-Image를 "감추기"로 전환할 Block의 내부 DOM 중 하나를 인자로 넘겨주면 된다.
	*/
	function hideBlockBackgroundImage(targetElement) {
		$(targetElement).closest(".dd-item").children(".block").find(".blockBackground").css("display", "none");
	}

	/**
	* If, While, Delay 등 break를 제외한 여러 블록들은 설정을 위한 ConditionBox를 가지고 있다.
	* hideAllConditionBox()를 호출하게 되면 모든 ConditionBox들이 "감추기" 상태로 들어간다.
	* 
	* @method hideAllConditionBox
	*/
	function hideAllConditionBox() {
		$(".blockConditionBox").css("display", "none");

		$(".blockConditionBox .px").removeClass("textFocus");

		if(cordova.isCordova()){
			$(".list > .action").css("overflow", "");
			$(".main > .menu").show();
			$(".main > .body").css({
				"top": "44px",
				"height": $(".main").height()-$(".main > .title").outerHeight(true)-$(".menu").outerHeight(true)
			});
		}
	}

	function setLanguage() {

		var multiLanguage = require('multiLanguage');
		var lang = $(".modal .setting .selected").attr("data-lang");

		multiLanguage.setLanguage(lang); 
	}

	/**
		module과 property, variable 등의 help 메세지를 mouse over 되면 보여준다.
	*/
	function registerHelpMsgEvent() {
		$(".body .list").on("mouseover", ".listElement", listElementMouseoverHandler);
		$(".body .list").on("mouseout", ".listElement", listElementMouseoutHandler);

		function listElementMouseoverHandler(event) {
			var conditionbox = $(event.target).closest(".blockConditionBox");
			var ddItem = conditionbox.closest(".dd-item");
			var helpbox = $(event.target).closest(".boxBottomWrapper").children(".boxHelp");
			var helpText;
			var name = $(event.target).children(".name").text();

			var boxWhat;
			
			var type;

			if(isModule(name, arrWhat)) {
				type = getType(name, arrWhat);
				// selectedType = type;
			} else {
				// type = selectedType;
				type = conditionbox.find(".boxWrapper").attr("data-selectedtype");
			}

			helpText = getHelpText(name, type);

			helpbox.html(helpText);
			
			if(ddItem.hasClass("ifBlock") || ddItem.hasClass("whileBlock")) {
				helpbox.find(".body").css({"width": "380px"});
				helpbox.find(".text").css({"width": "340px"});
			} else if(ddItem.hasClass("ledBlock")) {
				helpbox.find(".body").css({"width": "430px"});
				helpbox.find(".text").css({"width": "390px"});
			} else if(ddItem.hasClass("displayBlock")) {
				helpbox.find(".body").css({
					"width": "320px",
					"height": "192px"
				});
				helpbox.find(".text").css({"width": "280px"});
				helpbox.parent().css({"height": "192px"});
			} else {
				helpbox.find(".body").css({"width": "350px"});
				helpbox.find(".text").css({"width": "310px"});
			}


			setLanguage();

		}


		function listElementMouseoutHandler(event) {
			var conditionbox = $(event.target).closest(".blockConditionBox");
			var ddItem = conditionbox.parents(".dd-item");
			var helpbox = $(this).parents(".blockConditionBox").find(".boxHelp");

			$(targetBox).next().find(".boxHelp").empty();

			if(focused.parent().is(".frequency")) {
				boxWhat = conditionbox.find(".what input").val();

				focusBoxhelpTable.forEach(function(item) {
					if(item.beforeInput == boxWhat) {
						helpbox.append(item.helpMessage);
					}
				});

				setSpeakerFrequency(".frequency input");
			} else if (focused.parent().is(".volume")) {
				boxWhat = conditionbox.find(".what input").val();

				var helpText = '<div class="volumeBackground" style="width: 70px; height: 78px; position: absolute; left: 251px; bottom: 50px; background: rgb(38, 202, 211);"></div><div class="body" style="width: 349px; height: 209px; background: url(\'image/help/helpCustomTune2_0OrVolme.svg\');"><div class="text"> Enter a volume of Speaker module on the blank above. </div></div></div>'; 

				helpbox.append(helpText);

				setVolumeBackground(conditionbox.find(".volume input"), helpbox);

				$(this).on("keyup", function() {
					setVolumeBackground($(this), helpbox);
				});
			} else if (focused.parent().is(".upper")) {
				boxWhat = conditionbox.find(".property input").val();

				focusBoxhelpTable.forEach(function(item) {
					if(item.beforeInput == boxWhat) {
						helpbox.append(item.helpMessage);
					}

					$(".upperbox").addClass("animationUpper");
					$(".bottombox").removeClass("animationUpper");
				});
			} else if (focused.parent().is(".bottom")) {
				boxWhat = conditionbox.find(".property input").val();

				focusBoxhelpTable.forEach(function(item) {
					if(item.beforeInput == boxWhat) {
						helpbox.append(item.helpMessage);
					}

					$(".upperbox").removeClass("animationUpper");
					$(".bottombox").addClass("animationUpper");
				});
			} else if (focused.parent().is(".rgb")) {
				helpbox.append('<div style="width: 70px; height: 70px; position: absolute; left: 170px; top: 125px; background: url(\'image/block/ledCustom.svg\');"> </div> <input class="colorpicker" type="text" data-wheelcolorpicker data-wcp-layout="block"/> <div class="colorSelect" style=""> <div class="picker"> </div> <div class="picked"> </div> <div class="erase"> </div> </div></div>');

				setLedPicker(helpbox);

				setColorpicker();

				initializationColorpicker(helpbox);
			} else {
				setBasicHelp(helpbox, ddItem);
			}
		}
	}

	/**
		root block의 child 개수에 따라 node background 변경
	*/
	function setRootNodeBackground() {
		if($(".editor .dd-active:not(.off) .root .dd-item").length == 1) {
			$(".editor .dd-active:not(.off) .root").css({
				"background-image": ""
			});
			$(".editor .dd-active:not(.off) .root .tempList").css({
				"display": "block"
			});
		}
		else {
			/*$(".editor .dd-active:not(.off) .root").css({
				"background-image": "url('"+vlineImagePath+"')"
			});
			$(".editor .dd-active:not(.off) .root .tempList").css({
				"display": "none"
			});*/
		}
		if(cordova.isCordova()){
			$(".main > .body").css({
				"top": "44px",
				"height": $(".main").height()-$(".main > .title").outerHeight(true)-$(".menu").outerHeight(true)
			});
		}
	}

	/**
		math block 등등의 content 부분의 text를 받아와서 code로 변환해주는 function
	*/
	function convertStr2Code(string) {
		var itrPropTable;
		var itrStrSplit;
		var tempStr = string;

		for(itrPropTable = 0; itrPropTable < wholePropTable.length; itrPropTable++){
			if(tempStr.indexOf(wholePropTable[itrPropTable]) != -1) {
				splitedStr = tempStr.split(wholePropTable[itrPropTable]);
				tempStr = "";

				for(itrStrSplit = 0; itrStrSplit < splitedStr.length-1; itrStrSplit++) {
					tempStr += splitedStr[itrStrSplit];
					tempStr += ".";
					tempStr += convertProp2Method(wholePropTable[itrPropTable].split(".")[1]);
				}
				tempStr += splitedStr[splitedStr.length-1];
			}
		}

		return tempStr;
	}

	function convertProp2Method(property) {
		var method = property;

		if(property == "Click") {
			method = "get_click()";
		}
		else if(property == "Double Click") {
			method = "get_double_click()";
		}
		else if(property == "Press Status") {
			method = "get_press_status()";
		}
		else if(property == "Toggle") {
			method = "get_toggle()";
		}
		else if(property == "Volume") {
			method = "get_volume()";
		}
		else if(property == "Frequency") {
			method = "get_frequency()";
		}
		else if(property == "Turn") {
			method = "get_turn()";
		}
		else if(property == "Distance") {
			method = "get_distance()";
		}
		else if(property == "Temperature") {
			method = "get_temperature()";
		}
		else if(property == "Humidity") {
			method = "get_humidity()";
		}
		else if(property == "Illuminance") {
			method = "get_illuminance()";
		}
		else if(property == "Red") {
			method = "get_red()";
		}
		else if(property == "Green") {
			method = "get_green()";
		}
		else if(property == "Blue") {
			method = "get_blue()";
		}
		else if(property == "Roll") {
			method = "get_roll()";
		}
		else if(property == "Pitch") {
			method = "get_pitch()";
		}
		else if(property == "Yaw") {
			method = "get_yaw()";
		}
		else if(property == "X Acceleration") {
			method = "get_x_acceleration()";
		}
		else if(property == "Y Acceleration") {
			method = "get_y_acceleration()";
		}
		else if(property == "Z Acceleration") {
			method = "get_z_acceleration()";
		}
		else if(property == "X Angular velocity") {
			method = "get_x_angular_velocity()";
		}
		else if(property == "Y Angular velocity") {
			method = "get_y_angular_velocity()";
		}
		else if(property == "Z Angular velocity") {
			method = "get_z_angular_velocity()";
		}
		else if(property == "Vibration") {
			method = "get_vibration()";
		}
		else if(property == "Receive Data") {
			method = "get_receive_data()";
		}
		else if(property == "Mobile Event") {
			method = "get_mobile_event()";
		}

		return method;
	}

	function setEditorScroll() {
		$(".editor .list > .action").css({"overflow": "auto"});
		$(".editor .list > .action").on("mouseout", function() {
			$(this).css({"overflow" : "hidden"});
		});
		$(".editor .list > .action").on("mouseover", function() {
			$(this).css({"overflow" : "auto"});
		});
	}

	function commentKeyupHandler(event) {
		setData($(event.target), "text", $(event.target).val());
	}

	function editorEventBind() {
		$(".main .editor .body > .list").on("click", ".block .exit", blockExitOnClickHandler);
		$(".main .editor .body > .list").on("click", ".comment .exit", blockExitOnClickHandler);
		$(".main .editor .body > .list").on("click", ".block", blockToggleHandler);
		$(".main .editor .body > .list").on("click", ".boxWrapper .arr > *", clickElemClickHandler);
		$(".main .editor .body > .list").on("click", ".boxHelp > *", clickElemClickHandler);
		$(".main .editor .body > .list").on("focus", ".boxWrapper .arr input", inputTextFocusHandler);
		$(".main .editor .body > .list").on("keypress", ".boxWrapper .arr input", inputTextEnterHandler);
		$(".main .editor .body > .list").on("focus", ".boxWrapper .arr1 input", arr1FocusHandler);
		$(".main .editor .body > .list").on("focus", ".boxWrapper .arr2 input", arr2FocusHandler);
		$(".main .editor .body > .list").on("focus", ".boxWrapper .arr3 input", arr3FocusHandler);

		$(".main .editor .body > .list").on("click", ".blockConditionBox .listElement", listElementEventHandler);

		$(".main .editor .body > .list").on("click", ".boxWrapper .andOr .toggle", andOrToggleButtonHandler);
		
		$(".main .editor .body > .list").on("click touchstart touchend", ".boxWrapper .plus .image", plusButtonHandler);
		$(".main .editor .body > .list").on("click touchstart touchend", ".boxWrapper .minus .image", minusButtonHandler);
		$(".main .editor .body > .list").on("click touchstart touchend", ".boxWrapper .then div", thenButtonHandler);	

		$(".main .editor .body > .list").on("click touchstart touchend", ".boxWrapper .randomOk div", randomOkButtonHandler);
		$(".main .editor .body > .list").on("click touchstart touchend", ".boxWrapper .loopAndDelayOk div", loopAndDelayOkButtonHandler);

		$(".main .editor .body > .list").on("focus", ".boxWrapper .mathBoxVariable input", mathBoxVariableFocusHandler);
		$(".main .editor .body > .list").on("focus", ".boxWrapper .formular input", mathFormularFocusHandler);
		$(".main .editor .body > .list").on("click", ".mathBlock td", mathNumButtonHandler);
		$(".main .editor .body > .list").on("click touchstart touchend", ".mathBlock .ok div", mathOkButtonHandler);

		registerHelpMsgEvent();

		// number block event
		$(".main .editor .body > .list").on("click touchstart touchend", "li.numberBlock .boxWrapper .ok div", numberOKButtonHandler);

		// motor block event
		$(".main .editor .body > .list").on("focus", "li.motorBlock .boxWrapper .property input", motorPropFocusHandler);
		$(".main .editor .body > .list").on("focus", "li.motorBlock .boxWrapper .upper input", motorUpperFocusHandler);
		$(".main .editor .body > .list").on("focus", "li.motorBlock .boxWrapper .bottom input", motorBottomFocusHandler);
		$(".main .editor .body > .list").on("click touchstart touchend", "li.motorBlock .boxWrapper .ok div", motorOKButtonHandler);

		// led block event
		$(".main .editor .body > .list").on("focus", "li.ledBlock .boxWrapper .color input", ledColorFocusHandler);
		$(".main .editor .body > .list").on("focus", "li.ledBlock .boxWrapper .rgb input", ledRGBFocusHandler);
		$(".main .editor .body > .list").on("click touchstart touchend", "li.ledBlock .boxWrapper .ok div", ledOKButtonHandler);
		// speaekr block event
		$(".main .editor .body > .list").on("focus", "li.speakerBlock .boxWrapper .what input", speakerWhatFocusHandler);
		$(".main .editor .body > .list").on("focus", "li.speakerBlock .boxWrapper .frequency input", speakerFrequencyFocusHandler);
		$(".main .editor .body > .list").on("focus", "li.speakerBlock .boxWrapper .volume input", speakerVolumeFocusHandler);
		$(".main .editor .body > .list").on("click", "li.speakerBlock .boxWrapper .ok div", speakerOKButtonHandler);
		$(".main .editor .body > .list").on("click touchstart touchend", "li.speakerBlock .boxWrapper .ok div", speakerOKButtonHandler);
		// display block event
		$(".main .editor .body > .list").on("focus", "li.displayBlock .boxWrapper .what input", displayWhatFocusHandler);
		$(".main .editor .body > .list").on("focus", "li.displayBlock .boxWrapper .data input", displayDataFocusHandler);
		$(".main .editor .body > .list").on("click touchstart touchend", "li.displayBlock .boxWrapper .ok div", displayOKButtonHandler);
		// usb block event
		$(".main .editor .body > .list").on("focus", "li.usbBlock .boxWrapper .what input", usbWhatFocusHandler);
		$(".main .editor .body > .list").on("focus", "li.usbBlock .boxWrapper .usbdata input", usbDataFocusHandler);
		$(".main .editor .body > .list").on("click", "li.usbBlock .boxWrapper .ok div", usbOKButtonHandler);

		$(".main .editor .body > .list").on("click", "li.ledBlock .colorSelect .picker", pickColorHandler);
		$(".main .editor .body > .list").on("click", "li.ledBlock .colorSelect .pickedColor", clickPickColor);
		$(".main .editor .body > .list").on("click", "li.ledBlock .colorSelect .erase", erasePickColor);

		$(".main .editor .body > .list").on("keyup", ".comment .commentText", commentKeyupHandler);
	}

	$(document).ready(function() {
		editorEventBind();
		
		for(var i = 0; i < 3072; i ++) {
			displayDrawingPx += '<div class="px px'+i+'"></div>';
			displayDrawingPxClone += '<div class="px px'+i+'" id="px'+i+'"></div>';
		}
	});

	function pushArrWhat(obj) {
		arrWhat.unshift(obj);
	}

	function pushArrNumber(obj) {
		if(!arrNumber.includes(obj)) {
			arrNumber.push(obj);
			pushArrWhat(obj);
		}
	}

	function pushArrRandom(obj) {
		if(!arrRandom.includes(obj)) {
			arrRandom.push(obj);
			pushArrWhat(obj);
		}
	}

	function pushArrInput(obj) {
		if(!arrInput.includes(obj)) {
			arrInput.push(obj);
			pushArrWhat(obj);
		}
	}

	function pushArrOutput(obj) {
		if(!arrOutput.includes(obj)) {
			arrOutput.push(obj);
			pushArrWhat(obj);
		}
	}

	function pushArrNetwork(obj) {
		if(!arrNetwork.includes(obj)) {
			arrNetwork.push(obj);
			pushArrWhat(obj);
		}
	}

	function getArrPickedColor() {
		return arrPickedColor;
	}

	function setArrPickedColor(array) {
		arrPickedColor = array;
	}

	function getArrWhat() {
		return arrWhat;
	}

	function setArrWhat(array) {
		arrWhat = array;
	}

	function getArrInput() {
		return arrInput;
	}

	function setArrInput(array) {
		arrInput = array;
	}

	function getArrOutput() {
		return arrOutput;
	}

	function setArrOutput(array) {
		arrOutput = array;
	}

	function getArrNetwork() {
		return arrNetwork;
	}

	function setArrNetwork(array) {
		arrNetwork = array;
	}

	function getArrNumber() {
		return arrNumber;
	}

	function setArrNumber(array) {
		arrNumber = array;
	}

	function getArrRandom() {
		return arrRandom;
	}

	function setArrRandom(array) {
		arrRandom = array;
	}

	function changeInputName(srcName, name) {
		arrWhat.forEach(function(elem) {
			if(elem.name == srcName) {
				elem.name = name;
			}
		});
		arrInput.forEach(function(elem) {
			if(elem.name == srcName) {
				elem.name = name;
			}
		});
		$("#"+srcName).data("name", name);
	}

	function changeOutputName(srcName, name) {
		arrWhat.forEach(function(elem) {
			if(elem.name == srcName) {
				elem.name = name;
			}
		});
		arrOutput.forEach(function(elem) {
			if(elem.name == srcName) {
				elem.name = name;
			}
		});
		$("#"+srcName).data("name", name);
	}

	function changeNetworkName(srcName, name) {
		arrWhat.forEach(function(elem) {
			if(elem.name == srcName) {
				elem.name = name;
			}
		});
		arrNetwork.forEach(function(elem) {
			if(elem.name == srcName) {
				elem.name = name;
			}
		});
		$("#"+srcName).data("name", name);
	}

	function changeNumberName(srcName, name) {
		arrWhat.forEach(function(elem) {
			if(elem.name == srcName) {
				elem.name = name;
			}
		});
		arrNumber.forEach(function(elem) {
			if(elem.name == srcName) {
				elem.name = name;
			}
		});
		$("#"+srcName).data("name", name);
	}

	function changeRandomName(srcName, name) {
		arrWhat.forEach(function(elem) {
			if(elem.name == srcName) {
				elem.name = name;
			}
		});
		arrRandom.forEach(function(elem) {
			if(elem.name == srcName) {
				elem.name = name;
			}
		});
		$("#"+srcName).data("name", name);
	}

	function initArr() {
		setArrWhat([{
			imagePath: "image/icon20/var.svg",
			name: "TRUE",
			type: "variable",
			isModule: false,
			helpMessage: '<div class="body" style="background: url(\'image/help/helpBasic.svg\') no-repeat; background-position-x: center;"><div class="text"></div></div>'
		},
		{
			imagePath: "image/icon20/var.svg",
			name: "FALSE",
			type: "variable",
			isModule: false,
			helpMessage: '<div class="body" style="background: url(\'image/help/helpBasic.svg\') no-repeat; background-position-x: center;"><div class="text"> </div></div></div>'
		}]);
		setArrInput([]);
		setArrOutput([]);
		setArrNetwork([]);
		setArrNumber([]);
		setArrRandom([]);
	}

	function pushUndo() {
		var main = require('main');
		var editorHTML = $(".editor .gui").html();

		main.pushUndo(1, "editor", editorHTML);

	}


	function setInputbox() {
		var blockConditionbox = $(".block").next();
		var boxhelp = $(".block").next().find(".boxHelp");

		if($(".block").hasClass("motorBlock")) {
			console.log("motor block clicked");
			blockConditionbox.find(".property input").val(blockConditionbox.attr("data-property"));
			blockConditionbox.find(".upper input").val(blockConditionbox.attr("data-upper"));
			blockConditionbox.find(".bottom input").val(blockConditionbox.attr("data-bottom"));
		} else if($(".block").hasClass("ledBlock")) {
			console.log("led block clicked");
			blockConditionbox.find(".color input").val(blockConditionbox.attr("data-color"));
			blockConditionbox.find(".red input").val(blockConditionbox.attr("data-red"));
			blockConditionbox.find(".green input").val(blockConditionbox.attr("data-green"));
			blockConditionbox.find(".blue input").val(blockConditionbox.attr("data-blue"));
		} else if($(".block").hasClass("displayBlock")) {
			console.log("display block clicked");
		} else if($(".block").hasClass("speakerBlock")) {
			console.log("speaker block clicked");
			blockConditionbox.find(".what input").val(blockConditionbox.attr("data-what"));
			blockConditionbox.find(".frequency input").val(blockConditionbox.attr("data-frequency"));
			blockConditionbox.find(".volume input").val(blockConditionbox.attr("data-volume"));
		} else if($(".block").hasClass("ifBlock") || $(".block").hasClass("whileBlock")) {
			var i;
			var dataArr1 = "";
			var dataArr3 = "";
			var arr1;
			var arr2;
			var arr3;
			var boxWrapper;

			for(i = 0; i < blockConditionbox.find(".boxWrapper").length; i++) {
				dataArr1 = "";
				dataArr3 = "";
				arr1 = $(blockConditionbox.find(".arr1")[i]);
				arr2 = $(blockConditionbox.find(".arr2")[i]);
				arr3 = $(blockConditionbox.find(".arr3")[i]);
				boxWrapper = arr1.closest(".boxWrapper");

				if(boxWrapper.attr("data-arr1") !== "null" && boxWrapper.attr("data-arr1") !== "") {
					dataArr1 += boxWrapper.attr("data-arr1");
					dataArr1 += ".";
					dataArr1 += boxWrapper.attr("data-arr1_1");
					
					arr1.find("input").val(dataArr1);
				} else {
					if(boxWrapper.attr("data-arr1_1") !== "null") {
						dataArr1 += boxWrapper.attr("data-arr1_1");
					} else if(boxWrapper.attr("data-arr1_1") == "null") {
						dataArr1 += "";
					}
					arr1.find("input").val(dataArr1);
				}

				if(boxWrapper.attr("data-arr2") !== "null" && boxWrapper.attr("data-arr2") !== "") {
					arr2.find("input").val(boxWrapper.attr("data-arr2"));
				} else {
					arr2.find("input").val("");
				}

				if(boxWrapper.attr("data-arr3") !== "null" && boxWrapper.attr("data-arr3") !== "") {
					dataArr3 += boxWrapper.attr("data-arr3");
					if(boxWrapper.attr("data-arr3_1") !== "null") {
						dataArr3 += ".";
						dataArr3 += boxWrapper.attr("data-arr3_1");
					}

					arr3.find("input").val(dataArr3);
				} else {
					if(boxWrapper.attr("data-arr3_1") !== "null") {
						dataArr3 += boxWrapper.attr("data-arr3_1");
					} else if (boxWrapper.attr("data-arr3_1") == "null") {
						dataArr3 += "";
					}
					arr3.find("input").val(dataArr3);
				}
			}
		} else if($(".block").hasClass("loopAndDelayBlock")) {
			blockConditionbox.find(".loopAndDelayArr1 input").val(blockConditionbox.attr("data-num"));
		} else if($(".block").hasClass("mathBlock")) {
			blockConditionbox.find("mathBoxVariable input").val(blockConditionbox.attr("data-variable"));
			blockConditionbox.find("formular input").val(blockConditionbox.attr("data-formular"));
		}
	}

	return {
		pushArrWhat: pushArrWhat,
		pushArrNumber: pushArrNumber,
		pushArrRandom: pushArrRandom,
		pushArrInput: pushArrInput,
		pushArrOutput: pushArrOutput,
		pushArrNetwork: pushArrNetwork,
		drawArrProp: drawArrProp,
		removeArrInputData: removeArrInputData,
		removeArrOutputData: removeArrOutputData,
		removeArrNetworkData: removeArrNetworkData,
		removeArrNumberData: removeArrNumberData,
		removeArrRandomData: removeArrRandomData,
		setRootNodeBackground: setRootNodeBackground,
		getArrPickedColor: getArrPickedColor,
		setArrPickedColor: setArrPickedColor,
		setDrawing: setDrawing,
		setDrawingText: setDrawingText,
		getArrWhat: getArrWhat,
		setArrWhat: setArrWhat,
		getArrInput: getArrInput,
		setArrInput: setArrInput,
		getArrOutput: getArrOutput,
		setArrOutput: setArrOutput,
		getArrNetwork: getArrNetwork,
		setArrNetwork: setArrNetwork,
		getArrNumber: getArrNumber,
		setArrNumber: setArrNumber,
		getArrRandom: getArrRandom,
		setArrRandom: setArrRandom,
		changeInputName: changeInputName,
		changeOutputName: changeOutputName,
		changeNetworkName: changeNetworkName,
		changeNumberName: changeNumberName,
		changeRandomName: changeRandomName,
		initArr: initArr,
		hideAllConditionBox: hideAllConditionBox,
		setEditorScroll: setEditorScroll,
		editorEventBind: editorEventBind,
		bindConnections: bindConnections,
		setLanguage: setLanguage,
		setInputbox: setInputbox
	};
});
