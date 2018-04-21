(function(){
	var datepicker = {};
	var year,month;
	//需要一个函数来获取一个月的日期，返回一个数组
	datepicker.getMonthData = function(year,month){
		var ret = [];//返回的数组
		if(!year || !month){
			//如果没有传年份和月份则获取当前的年份和月份
			var today = new Date();
			year = today.getFullYear();
			month = today.getMonth()+1;
		}
			//需要知道当前月的第一天是星期几，这样才能知道前面要放几个上一月的数据
			var firstDay = new Date(year,month-1,1);
			var firstDayWeekDay = firstDay.getDay();//获取的是星期
			if(firstDayWeekDay===0) firstDayWeekDay=7;

			year = firstDay.getFullYear();
			month = firstDay.getMonth()+1;

			//获取上个月的最后一天
			var lastDayOfLastMonth = new Date(year,month-1,0);
			var lastDayOfLastMonth = lastDayOfLastMonth.getDate();//获取的是几号

			//前面要显示上个月几天
			var preMonthDayCount = firstDayWeekDay -1;//当我是星期1，那前面就是0个上月的数据

			var lastDay = new Date(year,month,0);//当月的最后一天
			var lastDate = lastDay.getDate();

			for(var i =0;i<42;i++){
				var date = i+1-preMonthDayCount;
				var showDate = date;
				var thisMonth = month;

				if(date<=0){
					//上个月
					thisMonth = month -1;
					showDate = lastDayOfLastMonth +date;//其实就是上个月最后的日期做减法，得到上个月那几天的日期

				}else if(date > lastDate){
					//下个月
					thisMonth = month +1;
					showDate = date - lastDate;
				}

				if(thisMonth === 0) thisMonth = 12;
				if(thisMonth === 13) thisMonth = 1;

				ret.push({
					month:thisMonth,
					date:date,
					showDate:showDate
				});
			}
			return {
						year :year,
						month:month,
						days:ret
			};
	}//getMonthData()结束
	window.datepicker = datepicker;//将datepicker对象暴露出去

})();

(function(){
	var datepicker = window.datepicker;
	var monthDays;
	datepicker.buildUi = function(year,month){
		monthDays = datepicker.getMonthData(year,month);
		if(!year||!month){
			year = monthDays.year;
			month = monthDays.month;
		}
		var html = '<div class="ui-datepicker-header">'+
			'<a href="#" title="" class="ui-datepicker-btn ui-datepicker-pre-btn">&lt;</a>'+
			'<a href="#" title="" class="ui-datepicker-btn ui-datepicker-next-btn">&gt;</a>'+
			'<span class="ui-datepicker-curr-month">'+year+'-'+month+'</span>'+
		'</div>'+

		'<div class="ui-datepicker-body">'+
			'<table>'+
				'<thead>'+
					'<tr>'+
						'<th>一</th>'+
						'<th>二</th>'+
						'<th>三</th>'+
						'<th>四</th>'+
						'<th>五</th>'+
						'<th>六</th>'+
						'<th>日</th>'+
					'</tr>'+
				'</thead>'+
				'<tbody>';
				var size = datepicker.getMonthData(year,month).days.length;
				for(var i = 0;i<size;i++){
					if(i%7===0){
						html= html+'<tr>';
					}
					
					html = html+'<td data-date="'+monthDays.days[i].date+'">'+monthDays.days[i].showDate+'</td>'
					if(i%7===6){
						html= html+'</tr>';
					}
				}
				html = html+'</tbody>'+
			'</table>'+
		'</div>';
		return html;

	}//buildUi结束

	var $wrapper;
	datepicker.render = function(diretion){
		var year,month;
		if(monthDays){
			year = monthDays.year;
			month = monthDays.month;
		}
		if(diretion==='prev') month--;
		if(diretion === 'next') month++;
		// console.log("渲染函数里面的月是："+month);
		var html = datepicker.buildUi(year,month);
		//如果已经存在就不要新起一个div，复用前面存在的div
		$wrapper = document.querySelector(".ui-datepicker-wrapper");
		if(!$wrapper){		
			$wrapper = document.createElement("div");
			$wrapper.className = "ui-datepicker-wrapper";
			document.body.appendChild($wrapper);
		}
		$wrapper.innerHTML = html;
		
	}

	//初始化
	var isOpen
	datepicker.init = function(input){
		this.render();
		var $input = document.querySelector(input);
		isOpen = false;

		$input.addEventListener('click',function(){
			if(isOpen){
				$wrapper.classList.remove("ui-datepicker-wrapper-show");
				isOpen = false;
			}else{
				$wrapper.classList.add("ui-datepicker-wrapper-show");
				var left = $input.offsetLeft;
				var top = $input.offsetTop;
				var height = $input.offsetHeight;
				$wrapper.style.top = top+height+2+'px';
				$wrapper.style.left = left+'px';
				isOpen = true;
			}
		},false);

		//点击上一个月，下一个月绑定事件
		$wrapper.addEventListener('click',function(e){
			var $target = e.target;
			if(!$target.classList.contains('ui-datepicker-btn')){
				return false;
			} 
			//上一月
			if($target.classList.contains('ui-datepicker-pre-btn')){
				datepicker.render('prev');
			}
			if($target.classList.contains('ui-datepicker-next-btn')){
				datepicker.render('next');
			}
		},false);

		//选择一个日期
		$wrapper.addEventListener('click',function(e){
			var $target = e.target;
			if($target.tagName.toLowerCase() !=='td') return;

			var date = new Date(monthDays.year,monthDays.month-1,$target.dataset.date);
			$input.value=format(date);
		},false);
	}
 
 	function format(date){
 		var ret;
 		var padding = function(num){
 			if(num<10){
 				return "0"+num;
 			}else{
 				return num;
 			}
 		}
 		ret = date.getFullYear()+"-";
 		ret +=padding(date.getMonth()+1)+"-";
 		ret +=padding(date.getDate());
 		$wrapper.classList.remove("ui-datepicker-wrapper-show");
		if(isOpen){
			$wrapper.classList.remove("ui-datepicker-wrapper-show");
			isOpen = false;
		}
 		return ret;

 	}


	
})();

