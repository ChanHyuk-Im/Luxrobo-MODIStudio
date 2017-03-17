define(['console'], function(console) {
	console.log("BASE INIT", "base.js");

	function Base() {
		/**
			Universally Unique id

			* data length : 48 bit
			* data type : hexadecimal
				- default : 0x000000000000
		*/
		this.uuid = 0x000000000000;

		/**
			* data type: integer
		*/
		this.id = 0x00;

		/**
			name that defined by user

			* data type : string
				- default : "none"
		*/
		this.name = "none";

		/**
			title of module

			* data type : string
				-default : "none"
				1. "hardware" : Hardware module
				2. "custom" : Custom module
		*/
		this.title = "none";

		/**
			subtitle of module

			* data type : string
				- default : "none"
				1. "input" : Input module
				2. "output" : Output module
				3. "etc" : ETC module
		*/
		this.subtitle = "none";

		/**
			type of module

			* data type : string
				- default : "none"
				- input :
					1. "ir" : IR module
					2. "mic" : Microphone module
					3. "gyro" : Gyroscope module
					4. "button" : Button module
					5. "joystick" : Joystick module
					6. "temperatue" : Temperature module
					7. "ultrasonic" : Ultrasonic module
					8. "illumination" : Illumination module
				- output :
					1. "dc" : DC motor module
					2. "led" : LED module
					3. "servo" : Servo motor module
					4. "remote" : Remote controller module
					5. "display" : Display module
				- etc :
					1. "network" : Network module
		*/
		this.type = "none";

		/**
			subtype of module

			* data type : string
				- default: "none"
		*/
		this.subtype = "none";

		/**
			source where module created

			* data type : string
				- default : "none"
				1. "modulebox" : Module Box
				2. "auto" : Auto create when module connecting to PC
		*/
		this.from = "none";

		/**
			os version of module

			* data type: integer
		*/
		this.os = 0;

		/**
			status of module that connected or disconnected to PC

			* data type : boolean
				- default : false
				- false : disconnected
				- true : connected to PC
		*/
		this.status = false;

		/**
			moved flag

			* data type: boolean
				- default: false
				- false: not moved
				- true: moved
		*/
		this.moved = false;
	}
	/**
		set and get 'uuid'
	*/
	Base.prototype.setUuid = function(uuid) {
		this.uuid = uuid;
	};
	Base.prototype.getUuid = function() {
		return this.uuid;
	};

	/**
		set and get 'id'
	*/
	Base.prototype.setId = function(id) {
		this.id = id;
	};
	Base.prototype.getId = function() {
		return this.id;
	};

	/**
		set and get 'name'
	*/
	Base.prototype.setName = function(name) {
		this.name = name;
	};
	Base.prototype.getName = function() {
		return this.name;
	};

	/**
		set and get 'title'
	*/
	Base.prototype.setTitle = function(title) {
		this.title = title;
	};
	Base.prototype.getTitle = function() {
		return this.title;
	};

	/**
		set and get 'subtitle'
	*/
	Base.prototype.setSubtitle = function(subtitle) {
		this.subtitle = subtitle;
	};
	Base.prototype.getSubtitle = function() {
		return this.subtitle;
	};

	/**
		set and get 'type'
	*/
	Base.prototype.setType = function(type) {
		this.type = type;
	};
	Base.prototype.getType = function() {
		return this.type;
	};

	/**
		set and get 'subtype'
	*/
	Base.prototype.setSubtype = function(subtype) {
		this.subtype = subtype;
	};
	Base.prototype.getSubtype = function() {
		return this.subtype;
	};

	/**
		set and get 'from'
	*/
	Base.prototype.setFrom = function(from) {
		this.from = from;
	};
	Base.prototype.getFrom = function() {
		return this.from;
	};

	/**
		set and get 'os'
	*/
	Base.prototype.setOs = function(os) {
		this.os = os;
	};
	Base.prototype.getOs = function() {
		return this.os;
	};

	/**
		set and get 'status'
	*/
	Base.prototype.setStatus = function(status) {
		this.status = status;
	};
	Base.prototype.getStatus = function() {
		return this.status;
	};

	/**
		set and get 'moved'
	*/
	Base.prototype.setMoved = function(moved) {
		this.moved = moved;
	};
	Base.prototype.getMoved = function() {
		return this.moved;
	};

	return {
		Base: Base
	};
});