(function(){

	/**
	*  For storing and retrieving data
	*  @class Settings
	*  @namespace springroll.tasks
	*/
	var Settings = {};

	/**
	*  Get the current active project
	*  @property {String} activeProject
	*  @static
	*/
	Object.defineProperty(Settings, "activeProject", {
		get : function()
		{
			return localStorage.TasksDataActive || null;
		},
		set : function(projectId)
		{
			localStorage.TasksDataActive = projectId;
		}
	});

	/**
	*  If the sidebar is collapsed or not
	*  @property {Boolean} collapsedSidebar
	*  @static
	*/
	Object.defineProperty(Settings, "collapsedSidebar", {
		get : function()
		{
			return JSON.parse(localStorage.TasksDataSidebar || "false");
		},
		set : function(collapsed)
		{
			localStorage.TasksDataSidebar = JSON.stringify(collapsed);
		}
	});

	/**
	*  Save the collection of projects
	*  @method setProjects
	*  @static
	*  @param {Array} project The projects to set
	*/
	Settings.setProjects = function(projects)
	{
		localStorage.TasksData = JSON.stringify(projects);
	};

	/**
	*  Get the projects
	*  @method getProjects
	*  @static
	*  @return {Array} The collection of projects
	*/
	Settings.getProjects = function()
	{
		var projects;
		try
		{
			projects = JSON.parse(localStorage.TasksData || '[]');
		}
		catch(e)
		{
			alert('Error Reading Tasks! Reverting to defaults.');
		}
		return projects || [];
	};

	/**
	*  Save the window settings
	*  @method saveWindow
	*  @static
	*  @param {String} alias The alias for the window
	*  @param {Window} win Node webkit window object
	*  @param {Boolean} [isTerminal=false] If we're setting the terminal window 
	*/
	Settings.saveWindow = function(alias, win)
	{
		localStorage[alias] = JSON.stringify({
			width : win.width,
			height : win.height,
			x : win.x,
			y : win.y
		});
	};

	/**
	*  Load the window to the saved size
	*  @method loadWIndow
	*  @static
	*  @param {String} alias The alias for the window
	*  @param {Window} win The GUI window object
	*/
	Settings.loadWindow = function(alias, win)
	{
		var rect;
		try
		{
			rect = JSON.parse(localStorage[alias] || 'null');
		}
		catch(e)
		{
			alert('Error Reading Spock Window! Reverting to defaults.');
		}
		if (rect)
		{
			win.width = rect.width;
			win.height = rect.height;
			win.x = rect.x;
			win.y = rect.y;
		}
	};

	// Assign to global space
	namespace('springroll.tasks').Settings = Settings;
	
})();