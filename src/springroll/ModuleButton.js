(function($, undefined){
	
	if (APP)
	{
		var gui = require('nw.gui');
	}

	/**
	*  The module is a sub-section of the app
	*  @class ModuleButton
	*  @namespace springroll
	*  @constructor
	*  @param {Element} dom The DOM element link
	*/
	var ModuleButton = function(dom, parent)
	{
		/**
		*  The reference to the DOM link
		*  @property {Element} dom
		*/
		this.dom = dom;

		this.parent = parent;

		// jquery object
		var link = $(dom).click(this._onOpen.bind(this));

		/**
		*  The default window size
		*  @property {object} defaultSize
		*/
		this.defaultSize = {
			width: link.data('width'),
			height: link.data('height'),
			minWidth: link.data('min-width'),
			minHeight: link.data('min-height')
		};

		/**
		*  The current opened window
		*  @property {nw.gui.Window} main
		*/
		this.main = null;
	};

	// Reference to the prototype
	var p = ModuleButton.prototype;

	/**
	*  When the link is clicked to open the window
	*  @method  _onOpen
	*  @private
	*/
	p._onOpen = function(e)
	{
		e.preventDefault();

		// If the window is opened, focus on it
		if (this.main)
		{
			this.main.focus();
			this._onFocus();
			return;
		}

		// Get the size from saved settings or get the default size
		var size = JSON.parse(localStorage.getItem(this.dom.id) || 'null') || this.defaultSize;

		// The node-webkit window options
		var options = {
			title: this.dom.title,
			resizable: true,
			width: size.width,
			height: size.height,
			toolbar: false,
			frame: true,
			fullscreen: false,
			show: false
		};

		// Move the window if we have coordinates
		if (size.x !== undefined && size.y !== undefined)
		{
			options.x = size.x;
			options.y = size.y;
		}
		else
		{
			options.position = "center";
		}

		// The minimum window size
		if (this.defaultSize.minWidth !== undefined)
		{
			options.min_width = this.defaultSize.minWidth;
		}

		// The maximum window size
		if (this.defaultSize.minHeight !== undefined)
		{
			options.min_height = this.defaultSize.minHeight;
		}

		// Open a new window
		this.main = gui.Window.open(this.dom.href, options);

		// Add a listener when the window closes to save the position
		this.main.on('close', this._onClose.bind(this));
		this.main.on('closed', this._onClosed.bind(this));
		this.main.on('loaded', onLoaded);
		this.main.on('focus', onFocus);
	};

	/**
	*  When the window is finished loading
	*  @method  _onLoaded
	*  @private
	*/
	var onLoaded = function()
	{
		this.show();
		this.focus();
	};

	/**
	*  On focus window event
	*  @method  _onLoaded
	*  @private
	*/
	var onFocus = function()
	{
		this.window.module.focus();
	};

	/**
	*  Upon closing save the window
	*  @method _onClose
	*  @private
	*/
	p._onClose = function()
	{
		localStorage.setItem(this.dom.id, JSON.stringify({
			width : this.main.width,
			height : this.main.height,
			x : this.main.x,
			y : this.main.y
		}));
	};

	/**
	*  When the module's window is closing
	*  @method _onClosed
	*  @private
	*/
	p._onClosed = function()
	{
		this.main = null;
	};

	// Assign to namespace
	namespace('springroll').ModuleButton = ModuleButton;

}(jQuery));