$(document).ready(function(){
    $(".slider").bxSlider({
        auto: true,             // 이미지 회전 자동
		speed: 2000,             // 다음 이미지로 넘어가는데 걸리는 시간(ms)
		pause: 4000,            // 이미지가 멈추는 시간(ms)
		mode:'fade',            // 이미지 교체 방식
		autoControls: false,     // 시작 중지 버튼 표시
		pager:false,             // 페이지 바로가기 표시
    });
});

window.addEventListener("wheel", function(e){
e.preventDefault();
},{passive : false});

var $html = $("html");
var page = 1;
var lastPage = $(".content").length;

$html.animate({scrollTop:0},10);

$(window).on("wheel", function(e){
 
	if($html.is(":animated")) return;
 
	if(e.originalEvent.deltaY > 0){
		if(page== lastPage) return;
 
		page++;
	}else if(e.originalEvent.deltaY < 0){
		if(page == 1) return;
 
		page--;
	}
	var posTop = (page-1) * $(window).height();
 
	$html.animate({scrollTop : posTop});
 
});