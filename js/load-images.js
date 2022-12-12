(function()
{
	'use strict';

	var loadImages = function(arr, callback)
	{
		var count = 0;
		var images = [];

		for (var i in arr)
		{
			if (arr[i] !== '')
			{
				images[i] = new Image();
				images[i].onload = function()
				{
					count++;
				};
				images[i].onerror = function()
				{
					this.setAttribute('data-error', 'true');
					log("error loading " + this.src + " image");
					count++;
				};
				images[i].src = arr[i];
			}
			else
			{
				log("no image");
				count++;
			}
		}

		var loop = function()
		{
			if (count === arr.length)
			{
				var tmp = [];
				for (var i in images)
				{
					if (images[i].hasAttribute('data-error') === false)
						tmp.push(images[i]);
				}
				callback(tmp);
			}
			else
			{
				window.setTimeout(function()
				{
					loop();
				}, 0);
			}
		};

		var log = function(str)
		{
			if(typeof window['console']!='undefined')
				console.error(str);
		};

		loop();
	};
	window['loadImages'] = loadImages;
})();
