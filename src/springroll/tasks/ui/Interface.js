(function(){

	if (APP)
	{
		// Global node modules
		var fs = require('fs');
		var path = require("path");
	}

	// Import classes
	var TerminalWindow = springroll.tasks.TerminalWindow,
		Settings = springroll.tasks.Settings;
	
	/**
	*  The main interface class
	*  @class Interface
	*  @namespace springroll.tasks
	*  @constructor
	*  @param {springroll.tasks.TaskRunner} app The instance of the app
	*/
	var Interface = function(app)
	{
		var body = $('body').on(
			'click',
			'.JS-Sidebar-Item',
			function()
			{
				app.switchProject($(this).data('id').toString());
				return false;
			}
		)
		.on(
			'click',
			'.JS-Project-Remove',
			function()
			{
				app.removeProject($(this).data('id').toString());
				return false;
			}
		)
		.on(
			'dblclick',
			'.JS-Task-Toggle-Info',
			function()
			{
				var button = $(this).find('.JS-Task-Run');
				app.toggleTask(
					button.data('project-id').toString(),
					button.data('task-name').toString()
				);
				return false;
			}
		)
		.on(
			'click',
			'.JS-Task-Run',
			function()
			{
				var button = $(this);
				app.toggleTask(
					button.data('project-id').toString(), 
					button.data('task-name').toString()
				);
				return false;
			}
		)
		.on(
			'click',
			'.JS-Task-Terminal',
			function(e)
			{
				var button = $(this);
				var projectId = button.data('project-id').toString();
				var taskName = button.data('task-name').toString();

				if (!app.terminal)
				{
					app.terminal = new TerminalWindow(projectId, taskName);
				}
				else
				{
					app.terminal.open(projectId, taskName);
				}
				return false;
			}
		)
		.on(
			'click',
			'.JS-Task-Stop',
			function()
			{
				var button = $(this);
				app.toggleTask(
					button.data('project-id').toString(), 
					button.data('task-name').toString()
				);
				return false;
			}
		);

		$('.sidebar-toggle').click(
			function()
			{
				collapsed = body
					.toggleClass(SIDEBAR_CLASS)
					.hasClass(SIDEBAR_CLASS);

				Settings.collapsedSidebar = collapsed;
			}
		);

		if (Settings.collapsedSidebar)
		{
			body.addClass(SIDEBAR_CLASS);
		}

		// Enable sortable list
		$('.sidebar-list').sortable().on('sortupdate', function(){
			var ids = [];
			$(".sidebar-item").each(
				function()
				{
					ids.push($(this).data('id').toString());
				}
			);
			app.projectManager.reorder(ids);
		});

		$(document).on(
			'dragover',
			function handleDragOver(event)
			{
				event.stopPropagation();
				event.preventDefault();
			}
		)
		.on(
			'drop',
			function handleDrop(event)
			{
				event.stopPropagation();
				event.preventDefault();

				var files = event.originalEvent.dataTransfer.files;

				_.each(files, function(file){

					var stats = fs.statSync(file.path);

					if (stats.isDirectory() && path.dirname(file.path) !== file.path)
					{
						app.addProject(file.path);
					}
					else if (stats.isFile() && path.dirname(path.dirname(file.path)) !== path.dirname(file.path))
					{
						app.addProject(path.dirname(file.path));
					}
				});
				return false;
			}
		);
	};

	/**
	*  The class for the sidebar collapsed
	*  @property {String} SIDEBAR_CLASS
	*  @static
	*  @private
	*/
	var SIDEBAR_CLASS = 'collapsed-sidebar';

	// Assign to namespace
	namespace('springroll.tasks').Interface = Interface;

}());