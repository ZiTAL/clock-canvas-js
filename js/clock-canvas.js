(function()
{
	'use strict';

	var clock = function(element)
	{
		var fps = 1000 / 60;
		var ctx = element.getContext('2d');
		var imgs;

		var cache =
		{
			left: element.width / 2,
			top: element.width / 2,
			animate:
			{
				s: false,
				m: true,
				h: true
			},
			imgs:
			[]
		};

		var _getParams = function(element)
		{
			var params = {};
			var attr = element.attributes;
			var len = attr.length;

			for (var i = 0; i < len; i++)
				params[attr[i]['name']] = attr[i]['value'];

			return params;
		};

		var getTime = function()
		{
			var now = new Date();
			var t =
			{
				'h' : now.getHours() % 12,
				'm' : now.getMinutes(),
				's' : now.getSeconds(),
				'ms' : Number.parseFloat("0." + now.getMilliseconds().toString().match(/[0-9]{3}/))
				//'ms': 0.000
			};
			return t;
		};

		var getAng = function(t, type)
		{
			var ang;
			var tmp;
			if (type === 's')
			{
				if (cache['animate']['s']==='true')
					tmp = t['s'] + t['ms'];
				else
					tmp = t['s'];

				ang = (tmp * Math.PI / 30) + Math.PI;
			}
			else if (type === 'm')
			{
				if (cache['animate']['m']==='true')
					tmp = t['s'];
				else
					tmp = 1;

				ang = (t['m'] * Math.PI / 30) + (tmp * Math.PI / (30 * 60)) + Math.PI;
			}
			else if (type === 'h')
			{
				if (cache['animate']['h']==='true')
					ang = (t['h'] * Math.PI / 6) + (t['m'] * Math.PI / (6 * 60)) + (t['s'] * Math.PI / (360 * 60));
				else
					ang = t['h'] * Math.PI / 6;

				ang = ang + Math.PI;
			}

			return ang;
		};

		var draw = function()
		{
			var time = getTime();

			var h_ang = getAng(time, 'h');
			var m_ang = getAng(time, 'm');
			var s_ang = getAng(time, 's');

			//saves the state of canvas
			ctx.save();
			drawBackground();

			ctx.translate(cache['left'], cache['top']);

			//drawNumbers();
			drawHour(h_ang);
			drawMinute(m_ang);
			drawSecond(s_ang);

			//restore the state of canva
			ctx.restore();
		};

		var drawBackground = function()
		{
			//clear the canvas
			ctx.clearRect(0, 0, element.width, element.height);
			ctx.beginPath();
			ctx.fillStyle = 'rgba(0, 0, 0, 0)';
			ctx.rect(0, 0, element.width, element.height);
			ctx.fill();

			ctx.drawImage(imgs[3], 0, 0);
		};

		var drawHour = function(h_ang)
		{
			ctx.rotate(Math.PI);
			ctx.rotate(h_ang);
			//ctx.translate(-width / 2, -height / 2);
			ctx.translate(-cache['imgs'][0]['width'], -cache['imgs'][0]['height']);

			ctx.drawImage(imgs[0], 0, 0);

			//ctx.translate(width / 2, height / 2);
			ctx.translate(cache['imgs'][0]['width'], cache['imgs'][0]['height']);

			ctx.rotate(-h_ang);
			ctx.rotate(-Math.PI);
		};

		var drawMinute = function(m_ang)
		{
			ctx.rotate(Math.PI);
			ctx.rotate(m_ang);
			//ctx.translate(-width / 2, -height / 2);
			ctx.translate(-cache['imgs'][1]['width'], -cache['imgs'][1]['height']);

			ctx.drawImage(imgs[1], 0, 0);

			//ctx.translate(width / 2, height / 2);
			ctx.translate(cache['imgs'][1]['width'], cache['imgs'][1]['height']);

			ctx.rotate(-m_ang);
			ctx.rotate(-Math.PI);
		};

		var drawSecond = function(s_ang)
		{
			ctx.rotate(-Math.PI);
			ctx.rotate(s_ang);
			//ctx.translate(-width / 2, -height / 2);
			ctx.translate(-cache['imgs'][2]['width'], -cache['imgs'][2]['height']);

			ctx.drawImage(imgs[2], 0, 0);

			//ctx.translate(width / 2, height / 2);
			ctx.translate(cache['imgs'][2]['width'], cache['imgs'][2]['height']);

			ctx.rotate(-s_ang);
			ctx.rotate(Math.PI);
		};

		var drawNumbers = function()
		{
			var _radius = element.width/2;
			var ang;
			ctx.font = _radius*0.15 + "px arial";
			ctx.fillStyle = "#000000";
			ctx.textBaseline="middle";
			ctx.textAlign="center";

			// orduak
			for(var num = 1; num < 13; num++)
			{
				ang = num * Math.PI / 6;
				ctx.rotate(ang);
				ctx.translate(0, -_radius*0.65);
				ctx.rotate(-ang);
				ctx.fillText(num.toString(), 0, 0);
				ctx.rotate(ang);
				ctx.translate(0, _radius*0.65);
				ctx.rotate(-ang);
			}

			ctx.font = _radius*0.05 + "px arial";

			// minutuak / segunduak
			for(var num = 0; num < 60; num++)
			{
				ang = num * Math.PI / 30;
				ctx.rotate(ang);
				ctx.translate(0, -_radius*0.87);
				ctx.rotate(-ang);
				ctx.fillText(num.toString(), 0, 0);
				ctx.rotate(ang);
				ctx.translate(0, _radius*0.87);
				ctx.rotate(-ang);
			}
		};

		var loop = function()
		{
			draw();
			if(typeof window['requestAnimationFrame']==='function')
				window.requestAnimationFrame(loop);
			else
			{
				window.setTimeout(function()
				{
					loop();
				}, fps);
			}
		};

		var setAnimations = function(params)
		{
			if(typeof params['data-seconds-animation']!=undefined)
				cache['animate']['s'] = params['data-seconds-animation'];
			if(typeof params['data-minutes-animation']!=undefined)
				cache['animate']['m'] = params['data-minutes-animation'];
			if(typeof params['data-hours-animation']!=undefined)
				cache['animate']['h'] = params['data-hours-animation'];
		};

		var init = function(element)
		{
			var params = _getParams(element);
			setAnimations(params);

			var images =
			[
				params['data-hours-image'],
				params['data-minutes-image'],
				params['data-seconds-image'],
				params['data-background-image']
			];

			loadImages(images, function(loades_images)
			{
				imgs = loades_images;
				cache['imgs'] =
				[
					{width: imgs[0]['width'] / 2, height: imgs[0]['height'] / 2},
					{width: imgs[1]['width'] / 2, height: imgs[1]['height'] / 2},
					{width: imgs[2]['width'] / 2, height: imgs[2]['height'] / 2}
				];
				loop();
			});
		};
		init(element);
	};

	window['clock'] = clock;
})();

window.onload = function()
{
	var clocks = document.querySelectorAll('.clock');
	var len = clocks.length;
	for (var i = 0; i < len; i++)
		new clock(clocks[i]);
};
