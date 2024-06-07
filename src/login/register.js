function onSubmit(e) {
    let memberId = $('#id').val();
    let password = $('#pw').val();
    let name = $('#name').val();
    let telephone = $('#tel').val();
    // let zipcode = $('#zip-code').val();
    let address = $('#addr').val();
    // let roadaddress = $('#road-addr').val();
    let email = $('#email').val();
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
      url: "localhost:8080/member/register/user",
      type: "POST",
      data: {
        memberId: memberId,
        password: password,
        email: email,
        memberName: name,
        phnoeNumber: telephone,
        address: address
      },
      success: data => {
        location.href = "./login.html"
      },
      error: () => {
        console.error("회원가입 실패")
      }
    })

}

const registerForm = document.querySelector("#signupbtn");
registerForm.addEventListener("click", ()=>{onSubmit()});