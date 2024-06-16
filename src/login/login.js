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

async function onSubmit(e) {
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

    const requestData = JSON.stringify({
      memberId: memberId,
      password: password
    })
    let userData = {
      memberId: memberId,
      foodMarketId: 0,
        status: 0
    }
    // API 호출
    await fetch("/member/login", {
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
      userData.foodMarketId = data.foodMarketId
        userData.status = data.status
    })
    .catch(error => {
        console.log(`로그인 실패 : ${error}`);
    });
  
    if(userData.status == -1) {
      alert("잘못된 아이디이거나, 비밀번호가 틀렸습니다.");
      return
    }
    else {
        checkAdmin(userData);
    }
    
    // if (userData.foodMarketId == -1) {
    //   console.log("기부자 로그인")
    // } else {
    //   console.log("관리자 로그인")
    //     console.log(userData.foodMarketId)
    // }
    // window.localStorage.setItem("foodMarketId", userData.foodMarketId)

}

const loginForm = document.querySelector("#loginbtn");
loginForm.addEventListener("click", ()=>{onSubmit()});

function checkAdmin(userData) {
    if(userData.foodMarketId === -1) {
        console.log("기부자 로그인");
        window.localStorage.setItem("memberId", userData.memberId);
        location.href = "../mainpage/mainpage.html";
    } else {
        console.log("관리자 로그인");
        console.log(userData.foodMarketId);
        window.localStorage.setItem("memberId", userData.memberId);
        window.localStorage.setItem("foodMarketId", userData.foodMarketId);
        location.href = "../admin/admin-main.html";
    }
}