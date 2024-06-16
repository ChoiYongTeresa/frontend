async function onSubmit(e) {
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
    
    const requestData = JSON.stringify({
      memberId: memberId,
      password: password,
      email: email,
      memberName: name,
      phnoeNumber: telephone,
      address: address
    })

    // API 호출
    await fetch("/member/register/user", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: requestData
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(` ${response.status} 요청 실패`);
      }
      return response.json();
    })
    .then(data => {
      console.log('회원가입 성공')
        location.href = "./login.html"
    })
    .catch(error => {
      console.error(`회원가입 실패 : ${error}`);
    });

}

const registerForm = document.querySelector("#signupbtn");
registerForm.addEventListener("click", ()=>{onSubmit()});