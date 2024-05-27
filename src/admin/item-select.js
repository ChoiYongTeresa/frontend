// 문서가 로드될 때 실행되는 함수
window.onload = function() {
    // 모든 select 및 cancel 버튼에 이벤트 리스너를 추가합니다.
    document.querySelectorAll('.button').forEach(button => {
        button.addEventListener('click', toggleButton);
    });
}

// 버튼 상태를 전환하는 함수
function toggleButton(event) {
    const button = event.target;
    if (button.classList.contains('select')) {
        button.classList.remove('select');
        button.classList.add('cancel');
        button.textContent = '취소하기';
    } else if (button.classList.contains('cancel')) {
        button.classList.remove('cancel');
        button.classList.add('select');
        button.textContent = '선택하기';
    }
}
