var tools = {
	/*
	 返回dom对象或者dom集合
	 *@params selector string 选择器
	 *@params [parent] DOMObject 父级对象
	 *@params DOMObject || DOMCollection
	 *
	 * */
	$: function(selector,parent){
		parent = parent || document;
		/*if(selector.charAt(0) === "#"){
			return parent.getElementById(selector.slice(1));
		}*/
		
		switch(selector.charAt(0)){
			case "#":
			return parent.getElementById(selector.slice(1));
			
			case ".":
			return parent.getElementsByClassName(selector.slice(1));
			
			default:
				return parent.getElementsByTagName(selector);
		}
	},
	
	/*
	 获取内部或者外部样式
	 *@params obj DOMObject 获取样式的元素对象
	 *@params attr string 属性名称
	 *@return string 属性值
	 * 
	 * */
	
	getStyle: function(obj,attr){
		/*if(obj.currentStyle){
			return obj.currentStyle[attr];
		}
		return obj.getComputedStyle(obj,false)[attr];*/
		
		try{
			return  getComputedStyle(obj,false)[attr];
		}catch(e){
			return obj.currentStyle[attr];
		}
	},
	
	/*
	 使元素绝对居中
	 *@params obj DOMObject  要居中的元素对象
	 * */
	
	showCenter:function(obj){
//		留住this
		var  _this = this;
		obj.style.display = "block";
		obj.style.Position = "absolute";
//		计算left和top
		function calc(){
			var left = (_this.getBody().width - obj.offsetWidth)/2;
			var top = (_this.getBody().height - obj.offsetHeight)/2;
			obj.style.left = left + "px";
			obj.style.top = top + "px";
		}
		calc();window.onresize = calc();
	},
	
	/*
	 得到浏览器的宽高
	 *@params object {width，height}
	 * */
	
	getBody:function(){
		return {
			width:document.documentElement.clientWidth || document.body.clientWidth,
			height:document.documentElement.clientHeight || document.body.clientHeight
		}
	},
	
	/*
	 事件监听
	 *
	 *@params obj DOMObject   事件监听对象
	 *@params event 事件句柄
	 *@params fn 事件处理函数
	 * */
	on:function(obj,event,fn){
		//IE的兼容
		if(obj.attachEvent){
			obj.attachEvent("on" + event, fn);
		}else{
		//W3C
			obj.addEventListener(event, fn, false);
		}
	},
	
	
	/*
	 移出事件监听
	 *
	 *@params obj DOMObject   事件监听对象
	 *@params event 事件句柄
	 *@params fn 事件处理函数
	 * */
	
	off:function(obj,event,fn){
		//IE
		if(obj.detachEvent){
			obj.detachEvent("on" + event, fn);
		}else{
		//W3C
			obj.removeEventListener(event,fn);
		}
	},
	
	/*
	 实现cookie的创建，删除，获取
	 * @params key string cookie 名称（如果只传这一个参数，执行获取操作）
	 * @params [value] string cookie值
	 * @params [expires] string 定义过期时间和path
	 * */
	
	cookie: function(key,value,expires){
		if(value !== undefined){
			value = encodeURIComponent(value);
			if(expires !== undefined){
				document.cookie = key + "=" + value + ";"+expires;
			}else{
				document.cookie = key + "=" + value;
			}
		}else{
			var str = document.cookie;
			var obj = {};
			var arr = str.split("; ");
			for(var i in arr){
				var item = arr[i].split("=");
				obj[item[0]] = item[1];
			}
			
			if(obj[key]){
				return decodeURIComponent(obj[key]);
			}else{
				return undefined;
			}
		}
	},

	getposition: function(obj){
		var position = {
			left:0,
			top:0
		}
		//判断当前元素是否存在父级
		while(obj.offsetParent){
			//把上面对象里面的属性先赋值为当前元素的坐标，如果有父级就在原来的基础上再加上父级到浏览器边缘的
			//宽度，直到找到body为止，停止计算
			position.left += obj.offsetLeft;
			position.top += obj.offsetTop;
			//层级往上查找，如果有父级就把父级的左边缘加上子元素的左边缘，最终到body停止
			obj = obj.offsetParent;


		}
		return position;
	},


	createDiv: function(className){
		var div = document.createElement("div");
		div.className = className;
		document.body.appendChild(div);
		return div;
	}

	
}
