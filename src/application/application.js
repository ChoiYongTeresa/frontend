let userInfo = {name:"김실패", phone:"공일공-실실실실-패패패패", email:"실패@실패.com"};
let img = {};
let items = [];
let totalItemCount = []
let centerlist = [
  {id:1, foodMarketName:"실패뱅크", phoneNumber:"042-123-2134", address:"실패구 실패동 실패로", detailAddress:"실패디테일주소"},
];
let selectedcenter = [];
const memberId = localStorage.getItem("memberId");

/*
물품 사진 입력
*/
document.getElementById('upload-icon').addEventListener('click', function() {
  document.getElementById('file-input').click();
});

let STATIC_IMG = {};

document.getElementById('file-input').addEventListener('change', function(event) {
  const files = event.target.files;
  const container = document.getElementById('gallery-container');

  for (const file of files) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const imgElement = document.createElement('img');
      const src = e.target.result;
      STATIC_IMG = {name: file.name, src: file, productId: 11};
      imgElement.src = src;
      imgElement.className = 'uploaded-img';
      container.appendChild(imgElement);
    };
    reader.readAsDataURL(file);
  }
});

/*
내 정보 불러오기
*/
document.querySelector('#load').addEventListener("click", async () => {
  // Fetch API 호출
	await fetch("/member/summary/"+memberId, {
    method: "GET",
    headers: { "Content-Type": "application/json; charset=utf-8" },
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(` ${response.status} 요청 실패`);
    }
    return response.json();
  })
	.then(data => {
    userInfo.name = data.summary.memberName;
    userInfo.phone = data.summary.phoneNumber;
    userInfo.email = data.summary.email;
	})
	.catch(error => {
    console.error(error)
    alert("로그인해주세요.")
  });

  console.log(userInfo)
  document.querySelector('#username').value = userInfo.name;
  document.querySelector('#userphone').value = userInfo.phone;
  document.querySelector('#useremail').value = userInfo.email;
});

/*
물품 등록하기
*/
document.querySelector("#putbtn").addEventListener("click", () => {

  const curitem = {category:"가공식품", itemname:"햇반", itemcount:"1개", expire:"2025-1-1", howtokeep:[], img:[]};
  
  curitem.category = $('select[name="category"] > option:checked').text();
  
  if ($('#itemname').val() != "") {
    curitem.itemname = $('#itemname').val();
  }
  if ($('#itemcount').val() != "") {
    curitem.itemcount = $('#itemcount').val();
  }
  if ($('#expire').val() != null) {
    curitem.expire = $('#expire').val();
  }
  const howtokeepEls = document.querySelectorAll('input[name="howtokeep"]:checked')
  if (howtokeepEls.length != 0) {
    howtokeepEls.forEach((el) => {
      curitem.howtokeep.push(el.value)
    });
  }
  curitem.img = img;
  const itemdiv = document.createElement('div');
  itemdiv.className = "submitted-item";
  const text = curitem.itemname + " (" + curitem.category + ") | " + curitem.expire + " | "
              + curitem.howtokeep + " | " + curitem.itemcount;
  itemdiv.innerHTML = text;

  const putdiv = document.querySelector('#submitted');
  const childp = document.querySelector('#not-submit');
  if (childp != null) {
    childp.style.display = "none";
  }
  items.push(curitem);

  let flag = 1;
  for (let i of totalItemCount) {
    if (i.category == curitem.category) {
      i.count += parseInt($('#itemcount').val());
      flag = 2;
      break;
    }
  }
  if (flag == 1)
    totalItemCount.push({category: curitem.category, count:parseInt($('#itemcount').val())})

  putdiv.appendChild(itemdiv);
  img = {};

})

/*
푸드마켓 정렬
*/
const centerSort = document.querySelector('#centerSort');
centerSort.addEventListener("change", async () => {

  // 정렬 기준 선택하는 드롭박스
  const centerSortType = $('select[name="centerSort"] > option:checked').value;
  // 클라이언트의 현재 위치
  let address = { latitude: 0, longitude:0 };
  navigator.geolocation.getCurrentPosition(position => {
    address = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    };
  });

  const requestData = JSON.stringify({
    sortType: centerSortType,
    latitude: address.latitude,
    longitude: address.longitude,
    foodList: totalItemCount
  })

  // Fetch API 호출
  // Response API
  // {
  //   id : long 
  //   rank : int 
  //   foodMarketName : str
  //   phoneNumber : str
  //   address : str
  //   detailAddress : str
  // }
  centerlist = await fetch("/donations/center/readAll", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: requestData
  })
  // fetch는 요청 자체가 실패한 경우를 제외하고선 catch로 error가 넘어가지 않음
  // => 꼭 response를 받아오는 첫번째 요청에서 response.ok로 error를 확인 및 넘긴 후
  // catch에서 잡아오도록
  .then(response => {
    if (!response.ok) {
      throw new Error(` ${response.status} 요청 실패`);
    }
    return response.json();
  })
  .then(data => data)
  .catch(error => {
    console.error(`기부 신청서 API 연결 실패 : ${error}`);
    return centerlist;
  });
  
  const centerListdiv = $('.center-list');
  centerListdiv.empty();
  for (let center of centerlist) {
    const centerDiv = $('<div>', {
      "class": 'center',
      style: "background-color: white"
    })
    const nameP = $('<p>', {
      text: center.foodMarketName
    });
    const addrP = $('<p>', {
      text: center.address
    });
    centerDiv.append(nameP, addrP)
    centerDiv.on('click', (e) => {
      toggleColor(e.currentTarget, center);
    })
    centerListdiv.append(centerDiv)
  }
});

/*
센터 클릭 시 상세정보 확인
*/
function toggleColor(element, center) {
  const centerMapDiv = document.querySelector('.center-map')

  // 현재 배경색이 하얀색이면 초록색으로, 아니면 하얀색으로 변경
  if (element.style.backgroundColor === 'white') {
    centerMapDiv.innerHTML = "";
    selectedcenter.push(center.id)
      element.style.backgroundColor = '#28995C'; // 초록색
      element.style.color = 'white'; // 텍스트 색상 변경
      
      // Create and append the title
      const title = document.createElement('h2');
      title.textContent = center.foodMarketName;
      centerMapDiv.appendChild(title);

      // Create and append the map image
      const mapImage = document.createElement('img');
      mapImage.src = '../assets/map_dummy.png'; // Replace with your actual image URL
      mapImage.alt = '지도 이미지';
      centerMapDiv.appendChild(mapImage);

      // Create and append the address info
      const address = document.createElement('p');
      address.textContent = center.detailAddress;
      centerMapDiv.appendChild(address);

      // Create and append the phone number
      const phone = document.createElement('p');
      phone.textContent = center.phoneNumber;
      centerMapDiv.appendChild(phone);
  } else {
    selectedcenter.pop(center.id)
      element.style.backgroundColor = 'white'; // 하얀색
      element.style.color = 'black'; // 텍스트 색상을 검은색으로 변경
      
      centerMapDiv.innerHTML = ""

      }
  }
  

/*
신청서 최종 제출
*/
const applyBtn = document.querySelector('#applybtn');
applyBtn.addEventListener("click", async () => {
  const name = $('#username').val();
  const phone = $('#userphone').val();
  const email = $('#useremail').val();

  const applicaiontRequestData = JSON.stringify({
    // id: memberId,
    memberId: 1,
    // name: name,
    // phone: phone,
    // email: email,
    productList: items.map(product => ({
      category: product.category,
      name: product.itemname,
      quantity: 1,
      // quantity: product.itemcount,
      expireDate: product.expire,
      // storeType: product.howtokeep,
      storeType: 1,
      weight: 500,
      isSelected: 0
    })),
    foodMarketList: selectedcenter
  })

  let productIdList = [];
  console.log(applicaiontRequestData);
  // Fetch API 호출 - 신청서
  await fetch("/donations/product/donationForm", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: applicaiontRequestData
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(` ${response.status} 요청 실패`);
    }
    return response.json();
  })
  .then(data => {
    console.log(`기부 신청서 저장 성공 : ${data}`)
    productIdList = data.productIds
  })
  .catch(error => {
    console.error(`기부 신청서 저장 실패 : ${error}`);
    return centerlist;
  });


  // Fetch API 호출 - 첨부파일
  for (let id of productIdList) {

    STATIC_IMG.productId = id
    const formData = new FormData();
    formData.append('attachment', STATIC_IMG.src)

    await fetch("/donation/attachment/"+STATIC_IMG.productId, {
      method: "POST",
      body: formData
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(` ${response.status} 요청 실패`);
      }
      return response.json();
    })
    .then(data => {
      console.log(data.filepath)
    })
    .catch(error => {
      console.error(error)
    });
  }
})