$(document).ready(function(){
    $(".slider-ul").bxSlider({
        auto: true,             // 이미지 회전 자동
		speed: 2000,             // 다음 이미지로 넘어가는데 걸리는 시간(ms)
		pause: 4000,            // 이미지가 멈추는 시간(ms)
		mode:'fade',            // 이미지 교체 방식
		autoControls: false,     // 시작 중지 버튼 표시
		pager:false,             // 페이지 바로가기 표시
		controls: false,		// 화살표 표시
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


// 더미 데이터
const dummyData = { items:"햇반(1개),<br> 곰표밀가루(1kg)<br>외 4개" };
const subContentDiv = document.querySelector('.sub-content p');

const memberid = "";
// main 최근 기부내역 불러오기
document.addEventListener('DOMContentLoaded', function() {
	if (memberid == "") {
		subContentDiv.innerHTML = "로그인해주세요.";
		return;
	}
    // API 호출 함수
	fetch("/donations/"+memberid)
	.then(resp=>resp.json())
	.then(data => {
		subContentDiv.innerHTML = data.items;
		// API 필드 이름으로 수정해야함.
	})
	.catch(error => {
		console.error('Error fetching data:', error)
		console.log(dummyData)
		subContentDiv.innerHTML = dummyData.items;
	});
});