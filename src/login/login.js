const inputs = document.querySelectorAll(".input");


function addcl(){
  let parent = this.parentNode.parentNode;
  parent.classList.add("focus");
}

function remcl(){
  let parent = this.parentNode.parentNode;
  if(this.value == ""){
    parent.classList.remove("focus");
  }
}


inputs.forEach(input => {
  input.addEventListener("focus", addcl);
  input.addEventListener("blur", remcl);
});

//Source :- https://github.com/sefyudem/Responsive-Login-Form/blob/master/img/avatar.svg

function onSubmit(e) {
    let memberId = $('#id').val();
    let password = $('#pw').val();
    if(memberId == ""){
      alert("아이디를 입력하세요.");
      $("#id").focus(); // 입력포커스 이동
      return; // 함수 종료
    }
    else if(password == ""){
        alert("비밀번호를 입력하세요.");
        $("#pw").focus();
        return;
    }
    $.ajax({
      url: "/member/login/user",
      type: "POST",
      data: {
        memberId: memberId,
        password: password
      },
      success: data => {
        // 틀린 경우 전달 뭘로받음?
        if(data == "false")
          alert("잘못된 아이디이거나, 비밀번호가 틀렸습니다.")
        else {
          location.href = "../mainpage/mainpage.html"
          window.localStorage.setItem("memberId", memberId)
        }
      },
      error: () => {
        console.error("로그인 실패")
        location.href = "../mainpage/mainpage.html"
      }
    })

    // localStorage.setItem("memberId", )
}

const loginForm = document.querySelector("#loginbtn");
loginForm.addEventListener("click", ()=>{onSubmit()});