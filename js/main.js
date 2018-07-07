//自己的JS脚本

'use strict';




// 入口函数的两种写法：
// $(document).ready(function(){})
// $(function(){})



$(function() {
/**
* 轮播图自适应脚本
*/
    function suitImage() {
        
        // 获取屏幕的宽度

        var windowWidth = $(window).width();

        //判断屏幕是大还是小(小于768px为手机屏幕)

        var isSmallScreen = windowWidth < 768;

        //根据大小为轮播图设置背景

        // $('#main_ad > .carousel-inner > .item')  获取到的是一个DOM数组
        $('#main_ad > .carousel-inner > .item').each(function(i, item) {
            var $item = $(item); //因为拿到的是DOM对象，需要转换成JQuery对象
            var imgSrc = isSmallScreen ? $item.data("image-xs") : $item.data("image-lg");
            var imgAlt = $item.data("image-alt");

            // $element.data()
            // 是一个函数，专门用于取元素上的自定义属性（data-abc）
            // 函数的参数是我们要取的属性名称（abc）

            // 设置背景图片
            // $item.css('backgroundImage', 'url("' + imgSrc + '")');  
            // 这里注释掉的原因是：小图时我们需要图片随着手机端屏幕宽度的改变进行等比例的缩放，所以小图时我们需要用img标签来呈现图片。
      		$item.css('backgroundImage','url("'+ imgSrc +'")');
            
      		if(isSmallScreen) {
      			$item.html('<img src="'+ imgSrc +'" alt="'+ imgAlt +'" />');
      		}else {
      			// $item.html(''); 让item的内容为空，两种方法均可
      			$item.empty();
      		};
        });


    };
    //发生屏幕大小发生改变事件时，执行suitImage函数。注册事件之后，如果想让事件直接触发一次的话，可以用trigger。如果不触发的话，在一开始屏幕未发生大小上的变化时，因为没有执行添加背景图片的js操作，轮播图不会显示
    $(window).on('resize',suitImage).trigger('resize');
    // 链式编程，等价于
    // $(window).on('resize',suitImage);
    // $(window).trigger('resize');  让window对象立即触发一个resize事件
 



 



    
/**
 * 提示框效果  
 */
      // 产品介绍里面的悬浮的 京 和 实 两个字，在hover的时候出现的提示框效果。
      // 这个组件比较特殊，除了css中的样式，还必须在JS里面写下面这行代码来初始化这个组件
      // [] 是jquery的属性选择器
  	$('[data-toggle="tooltip"]').tooltip();






/**
 * 控制标签页的标签容器宽度
 */
function suitOptions(){
	// 将选项标题栏ul获取过来，转化成jquery对象
	var $ulContainer = $('.nav-tabs');
	// 获取所有子元素的宽度和
	// bootstrap默认设置了 box-sizing: border-box; ，改变了css默认的设置box-sizing: content-box;
	
	// box-sizing: border-box:
	// 元素的宽度和高度包含了内边距和边框，通过从已设定的宽度和高度分别减去边框和内边距才能得到内容的宽度和高度。
	
	// box-sizing: content-box;
	// 元素的宽度和高度就是内容的宽度和高度
	
	// 因为我们自己在main.css中设置了选项卡标题栏ul有一个 padding-left: 20px; 这个20要算到ul的初始宽度里面去
	// 所以我们设置ul宽度初始的值为超过20px，保证ul能在一行装的下所有的li元素。
	// 
	var ulWidth = 50;
	//遍历子元素
	$ulContainer.children().each(function(index,element){
		//jQuery获取屏幕宽度
		// console.log($(element).width());
		// 原生JS获取屏幕宽度,更高效
		// element.clientWidth 
		
		ulWidth += element.clientWidth
	});
	// 此时ulWidth等于初始的ul的padding值20，加上，ul中所有li的宽度（包括最后一个“更多”）的总和
	// 判断当前ul的宽度是否超出屏幕，如果超出就显示横向滚动条
	// 因为$(window).width()是根据页面的宽度变化而动态变化的，所以放在suitOption函数里面，监控到屏幕大小改变的时候就触发
	if(ulWidth > $(window).width()) {
		$ulContainer
			.css('width',ulWidth)
			.parent().css('overflow-x','scroll');
	}else{
		$ulContainer
			.css('width','')
			.parent().css('overflow-x','')
	};
};
	$(window).on('resize',suitOptions).trigger('resize');
	


/**
 * 新闻点击切换标题
 */

$('.news-nav a').click(function(e) {
	$('.news-title').text($(this).data('title'));
})



/**
 * 实现手机端手指在轮播图上滑动时，能实现上下翻页
 */

// 1. 获取手指在轮播图元素上的一个滑动方向（左右）



  // 获取界面上的轮播图容器
  var $carousels = $('.carousel');
  var startX, endX;
  // 设置误触精度为50px，手指移动距离大于50px才会实现翻页
  var offset = 50;
  // 注册滑动事件
  $carousels.on('touchstart', function(e) {
    // 手指触摸开始时记录一下手指所在的坐标X
    startX = e.originalEvent.touches[0].clientX;
    // console.log(startX);
  });

  $carousels.on('touchmove', function(e) {
    // 变量重复赋值
    endX = e.originalEvent.touches[0].clientX;
    // console.log(endX);
  });
  $carousels.on('touchend', function(e) {
    // console.log(e);
    // 无法通过touchend获取结束触摸一瞬间记录最后的手指所在坐标X，因为结束一瞬间不会再记录坐标X，只能通过touchmove的最后松开时的那个值来确定最后结束坐标x
    // 比大小
    // console.log(endX);
    // 控制精度，避免过小幅度的手指误触仍引发翻页
    // 获取每次运动的距离，当距离大于一定值时认为是有方向变化
    var distance = Math.abs(startX - endX);
    if (distance > offset) {
      // 有方向变化
      console.log(startX > endX ? '←' : '→');
      // 2. 根据获得到的方向选择上一张或者下一张
      //     - 原生的carousel方法实现 http://v3.bootcss.com/javascript/#carousel-methods
          
      // 使用$(this)直接指向用户正在操作的那个轮播图，这样更精确。如果使用$carousels,而且页面中有不只一个轮播图，就会导致用户触动一个轮播图，所有的轮播图都会一起动。
      $(this).carousel(startX > endX ? 'next' : 'prev');
    }
  });




	
});