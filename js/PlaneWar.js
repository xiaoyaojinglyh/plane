window.onload = function(){
	new Engine();
}
//定义一个构造函数，并调用它里面的init方法 
//this指向的就是Engine本身
function Engine(){
	this.init();
}
//在构造函数的原型上面添加他的方法，这样他的子级也可以使用相应的方法
Engine.prototype.init = function(){
	//this指向随时都会改变，所以在定义另外的函数或者绑定事件的时候this都会改变
	//所以在之前把Engine这个函数的this先定义一个变量把他存下来
	var _this = this;
	//找到外面那个div
	this.bodyMain = tools.$("#body_main");
	//找到ul
	this.options = tools.$("#options");
	//要给li绑定点击事件，用事件委派来给ul绑定事件
	this.options.onclick = function(e){
		e = e || event;
		var target = e.target || e.srcElement;
		if(target.nodeName === "LI"){
			_this.diff = target.value;
			_this.bodyMain.removeChild(_this.options);
			_this.startAnimation();
		}
	}
}

Engine.prototype.startAnimation = function(){
	var top = 0;
	setInterval(function(){
		top += 10;
		this.bodyMain.style.backgroundPositionY = top + "px";
	}.bind(this),30);
	//创建logo
	var logo = tools.createDiv("logo");
	//创建有烟雾的小飞机
	var loading = tools.createDiv("loading");
	//默认把第一张小飞机设为刚加载页面就出现
	var n = 0;
	var timer = setInterval(function(){
		n++;
		loading.style.background = "url(img/loading"+ (n%3+1) +".png)";
		if(n > 4){
			clearInterval(timer);
			document.body.removeChild(loading);
			document.body.removeChild(logo);
			this.starGame();
		}
	}.bind(this),500);
}
Engine.prototype.starGame = function(){
	//创建敌机和战机
	myPlane.init(this.bodyMain).fire(this.diff);//链式操作
	//创建敌机
	//出现小敌机的概率  40%
	//出现中敌机的概率是  20%
	//出现大敌机的概率是  5%
	//剩下的 35% 是不出现敌机的概率  以免敌机会重复出现
	setInterval(() =>{
		var rand = Math.random().toFixed(2);
		//每隔500毫秒添加一张小敌机
		if(rand < 0.4) new Enemy(1,this.bodyMain);
		//每隔500毫秒添加一张中敌机
		else if(rand < 0.6) new Enemy(2,this.bodyMain);
		//每隔500毫秒添加一张大敌机
		else if(rand < 0.65) new Enemy(3,this.bodyMain);
	},500);
}
//我方战机
var myPlane = {
	aBulltes:[],
	init : function(bodyMain){
		//从Engine对象中国传过来的bodyMain
		this.bodyMain = bodyMain;
		//创建自己的战机DOM元素
		this.ele = tools.createDiv("my-warplain");
		//左右居中
		//战机的横坐标等于body的宽度减去自己本身的的宽度的一半
		this.ele.style.left = (tools.getBody().width - this.ele.offsetWidth)/2 + "px";
		//垂直居底
		//战机的top值等于body的高度减去战机的自身高度，这样战机就是在body的最底部位置
		this.ele.style.top = tools.getBody().height - this.ele.offsetHeight + "px";
		//调用下面方法，让战机跟随鼠标的移动来移动
		this.move();
		//返回this是为了实现链式的调用
		return this;
	},

	move: function(){
		//飞机跟随鼠标移动，把事件来委托给父级body来实现
		tools.on(document.body,"mousemove",function(e){
			e = e || event;
			//让飞机的中心点跟随鼠标移动
			//鼠标的坐标减去飞机自身的高度的一半
			this.ele.style.top = e.clientY - this.ele.offsetHeight/2 + "px";
			//定义一个变量来接收战机离左边的坐标
			var _left = e.clientX - this.ele.offsetWidth/2;
			//判断战机左右的边界
			//如果如果战机的左边左边小于bodyMain离左边缘时，说明飞机已经跑出了div的范围
			//然后就让飞机就等于div离左边缘的位置
			if(_left < this.bodyMain.offsetLeft)
				_left = this.bodyMain.offsetLeft;
			//如果战机的左边缘大于div离左边缘的距离加上div的宽度时，说明飞机超出了右边缘，
			//然后就让飞机就等于div的左边缘加上div自身的宽度的位置
			if(_left > this.bodyMain.offsetLeft + this.bodyMain.offsetWidth - this.ele.offsetWidth)
				_left = this.bodyMain.offsetLeft + this.bodyMain.offsetWidth - this.ele.offsetWidth;
			//得到战机的横坐标
			this.ele.style.left = _left + "px";
			//bind是把this的指向改为当前要操作的这个对象
		}.bind(this),false);
	},
	//创建子弹
	//创建子弹的时间间隔根据子弹的难度来决定子弹发出的快慢
	//值越小，速度越快，难度越简单
	fire: function(diff){
		this.duration = 500/diff;
		setInterval(()=>{
			//每隔this.duration毫秒添加一颗子弹
			this.aBulltes.push(new Bullet().init(this.ele));
			//console.log(aBulltes);
		},this.duration);
	}
}

function Bullet(){

}
Bullet.prototype = {
	//改变整个原型指向的时候，要把constructor指回构造函数
	constructor:Bullet,
	init:function(plane){
		//创建子弹元素
		this.ele = tools.createDiv("bullet");
		//给子弹初始位置
		this.ele.style.top = plane.offsetTop - this.ele.offsetHeight + "px";
		this.ele.style.left = plane.offsetLeft + plane.offsetWidth/2 - this.ele.offsetWidth/2 + "px";
		this.move();
		return this;
	},
	move:function(){
		this.timer = setInterval(() =>{
			//每隔30毫秒让子弹向上移动8像素
			this.ele.style.top = this.ele.offsetTop - 8 +"px";
			//判断是否超出边界
			if(this.ele.offsetTop < -40) this.die();
		},30);
	},

	die:function(){
		//每当子弹超出边界就清除定时器
		clearInterval(this.timer);
		//执行爆炸动画
		this.ele.className = "bullet_die";
		setTimeout(() =>{
			//每隔100毫秒换为第二张爆炸的图片
			this.ele.className = "bullet_die2";
			setTimeout(() =>{
				//出现第二张爆炸的图片的时候，在隔100毫秒在让父级把超出的子弹移出
				document.body.removeChild(this.ele);
			},100)
		},100);
		for(var i = 0; i < myPlane.aBulltes.length; i++){
			//console.log(aBulltes);
			if(this === myPlane.aBulltes[i]){
				myPlane.aBulltes.splice(i,1);
			}
		}
	}
}

class Enemy{
	constructor(type,bodyMain){
		this.type = type;
		this.bodyMain = bodyMain;
		this.init();
	}
	init(){
		switch(this.type){
			//type = 1 小敌机  速度 speed = 5
			//type = 2 中敌机  速度 speed = 3
			//type = 1 大敌机  速度 speed = 1
			case 1:
				this.ele = tools.createDiv("enemy_samll");
				this.speed = 5;
				this.blood = 2;
			break;
			case 2:
				this.ele = tools.createDiv("enemy_middle");
				this.speed = 3;
				this.blood = 5;
			break;
			case 3:
				this.ele = tools.createDiv("enemy_large");
				this.speed = 1;
				this.blood = 10;
			break;
		}
		//计算敌机出现的初始left值，在游戏区范围内随机生成大，中，小战机
		//最小的位置就是div离浏览器左边缘的位置
		var min = this.bodyMain.offsetLeft;
		//最大值就是div离浏览器左边加上div自身的宽度在减去敌机自身的宽度，要是不减敌机的宽度的话 这样敌机的左边就恰恰在div的右边了
		var max = this.bodyMain.offsetLeft + this.bodyMain.offsetWidth - this.ele.offsetWidth;
		var _left = parseInt(Math.random()*(max - min)) + min;
		//top值就是敌机自身高度的负值，让他从外面慢慢的进入
		//刚好隐藏
		var _top = -this.ele.offsetHeight;
		this.ele.style.top = _top + "px";
		this.ele.style.left = _left + "px";
		this.move();
	}
	move(){
		this.timer = setInterval(() =>{
			//每个敌机根据自己的速度来移动
			this.ele.style.top = this.ele.offsetTop + this.speed + "px";
			//判断移动边界
			if(this.ele.offsetTop > this.bodyMain.offsetHeight) this.die();
			//算出战机的上下左右四边的坐标
			var mTop = myPlane.ele.offsetTop,
				mBottom = mTop + myPlane.ele.offsetHeight,
				mLeft = myPlane.ele.offsetLeft,
				mRight = mLeft + myPlane.ele.offsetWidth;
				//console.log(mRight);
			//算出敌机的上下左右四边的坐标
			var eTop = this.ele.offsetTop,
				eBottom = eTop + this.ele.offsetHeight,
				eLeft = this.ele.offsetLeft,
				eRight = eLeft + this.ele.offsetWidth;
				//console.log(eRight);
				if(!(mTop > eBottom || mBottom < eTop || mLeft > eRight || mRight < eLeft)){
					if(confirm("游戏结束！是否重新开始")){
						window.location.reload(true);
					}
				}
				for(var i = 0; i < myPlane.aBulltes.length; i++){
				var bTop = myPlane.aBulltes[i].ele.offsetTop;
				//console.log(bTop);
				var	bBottom = bTop + myPlane.aBulltes[i].ele.offsetHeight;
				var	bLeft = myPlane.aBulltes[i].ele.offsetLeft;
				var bRight = bLeft + myPlane.aBulltes[i].ele.offsetWdith;
					
					if(!(bTop > eBottom || bLeft > eRight || eLeft > bRight || eTop > bBottom)){
						myPlane.aBulltes[i].die();
						if(--this.blood === 0){
							this.die();
					}
				}
			}
		},30);
	}
	die(){
		document.body.removeChild(this.ele);
		clearInterval(this.timer);
	}
}