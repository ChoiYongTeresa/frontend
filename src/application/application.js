let imgs = [];
let items = [];
let sort_type = 1;
let address = {};
let total_item_count = []
let centerlist = [
  {id:1, foodMarketName:"대전광역푸드뱅크", phoneNumber:"042-123-2134", address:"중구 보문로 246, 805호(대흥동)", detailAddress:"대전시 유성구대 660번길 3 층 다이셀"},
  {id:2, foodMarketName:"대전가톨릭농수산물지원센터", phoneNumber:"042-123-1234", address:"유성구 노은동로 33(노은동)", detailAddress:"어쩌고"}
];
let selectedcenter = [];
let userid = 1;


document.getElementById('upload-icon').addEventListener('click', function() {
  document.getElementById('file-input').click();
});

document.getElementById('file-input').addEventListener('change', function(event) {
  const files = event.target.files;
  imgs.push(files);
  const container = document.getElementById('gallery-container');
  
  for (const file of files) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const imgElement = document.createElement('img');
      imgElement.src = e.target.result;
      imgElement.className = 'uploaded-img';
      container.appendChild(imgElement);
    };
    reader.readAsDataURL(file);
  }
});

const loadBtn = document.querySelector('#load');
loadBtn.addEventListener("click", () => {
  const memberId = 1;
  // API 호출 함수
	fetch("/member/summary/"+memberId)
	.then(resp=>resp.json())
	.then(data => {
    const namediv = document.querySelector('#username');
    const phonediv = document.querySelector('#userphone');
    const emaildiv = document.querySelector('#useremail');
    namediv.value = data.memberName;
    phonediv.value = data.phoneNumber;
    emaildiv.value = data.email;
    userid = data.id;
	})
	.catch(error => {
    console.log(error)
    const namediv = document.querySelector('#username');
    const phonediv = document.querySelector('#userphone');
    const emaildiv = document.querySelector('#useremail');
    namediv.value = "실패!";
    phonediv.value = "실패!";
    emaildiv.value = "실패!";
	});
})
  
document.querySelectorAll('.center').forEach((center) => {
    center.addEventListener('click', function() {
        toggleColor(this);
    });
  });

const centerMapDiv = document.querySelector('.center-map')

function toggleColor(element) {
    // 현재 배경색이 하얀색이면 초록색으로, 아니면 하얀색으로 변경
    if (element.style.backgroundColor === 'white') {
      centerMapDiv.innerHTML = "";
      selectedcenter.push(element)
        element.style.backgroundColor = '#28995C'; // 초록색
        element.style.color = 'white'; // 텍스트 색상 변경
        
        // Create and append the title
        const title = document.createElement('h2');
        title.textContent = '대전 가볼만한 공식 지원센터';
        centerMapDiv.appendChild(title);

        // Create and append the map image
        const mapImage = document.createElement('img');
        mapImage.src = '../assets/map_dummy.png'; // Replace with your actual image URL
        mapImage.alt = '지도 이미지';
        centerMapDiv.appendChild(mapImage);

        // Create and append the address info
        const address = document.createElement('p');
        address.textContent = '대전시 유성구대 660번길 3 층 다이셀';
        centerMapDiv.appendChild(address);

        // Create and append the phone number
        const phone = document.createElement('p');
        phone.textContent = '042-123-2134';
        centerMapDiv.appendChild(phone);
    } else {
        element.style.backgroundColor = 'white'; // 하얀색
        element.style.color = 'black'; // 텍스트 색상을 검은색으로 변경
        
        centerMapDiv.innerHTML = ""

    }
}


const itemputbtn = document.querySelector("#putbtn");
itemputbtn.addEventListener("click", () => {
  const curitem = {category:"가공식품", itemname:"햇반", itemcount:"1개", expire:"2025년 1월 1일", keepway:"실온 보관", img:[]};
  
  curitem.category = $('select[name="category"] > option:checked').text();
  if ($('#itemname').val() != "") {
    curitem.itemname = $('#itemname').val();
  }
  if ($('#itemcount').val() != "") {
    curitem.itemcount = $('#itemcount').val()+$('#itemcountway').val();
  }
  if ($('#expireY').val() != "") {
    curitem.expire = $('#expireY').val()+"년 "+$('#expireM').val()+"월 "+$('#expireD').val()+"일";
  }
  if ($('#store_way').val() != undefined) {
    curitem.keepway = $('#store_way').val();
  }
  curitem.img = imgs;

  // if (category != null)
  console.log(curitem)

  const itemdiv = document.createElement('div');
  itemdiv.className = "submitted-item";
  console.log(items);
  const text = curitem.itemname + " (" + curitem.category + ") | " + curitem.expire + " | "
              + curitem.keepway + " | " + curitem.itemcount;
  itemdiv.innerHTML = text;

  const putdiv = document.querySelector('#submitted');
  const childp = document.querySelector('#not-submit');
  if (childp != null) {
    childp.style.display = "none";
  }
  items.push(curitem);
  let flag = 1;
  for (let i of total_item_count) {
    if (i.category == curitem.category) {
      i.count += parseInt($('#itemcount').val());
      flag = 2;
      break;
    }
  }
  if (flag == 1) {
    total_item_count.push({category: curitem.category, count:parseInt($('#itemcount').val())})
  }
  console.log(total_item_count);
  putdiv.appendChild(itemdiv);
  imgs = [];
})

const centerSort = document.querySelector('#centerSort');
centerSort.addEventListener("change", () => {
  const curSelect = $('select[name="centerSort"] > option:checked').index();
  sort_type = curSelect;
  navigator.geolocation.getCurrentPosition((position) => {
    address = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    };
  });
  // API 호출 함수
  $.ajax({
    url: "/donations/center/readAll",
    type: "GET",
    data: {
      sort_type: sort_type,
      address: address,
      foodList: total_item_count
    },
    success: data => {
      centerlist = data;
      const centerListdiv = document.querySelector('.center-list');
      centerListdiv.innerHTML = "";

      for (let i of centerlist) {
        const centerdiv = document.createElement('div');
        centerdiv.className = "center";
        const p1 = document.createElement('p');
        p1.innerHTML = i.foodMarketName;
        const p2 = document.createElement('p');
        p2.innerHTML = i.address;
        centerdiv.appendChild(p1, p2);
        centerListdiv.appendChild(centerdiv);
      }

      centerListdiv.childNodes.forEach((center) => {
        center.addEventListener('click', function() {
            toggleColor(this);
        });
      });

    },
    error: () => {
      console.error("기부 신청서 API 연결 실패");
      const centerListdiv = document.querySelector('.center-list');
      centerListdiv.innerHTML = "";

      for (let i of centerlist) {
        const centerdiv = document.createElement('div');
        centerdiv.className = "center";
        const p1 = document.createElement('p');
        p1.innerHTML = i.foodMarketName;
        const p2 = document.createElement('p');
        p2.innerHTML = i.address;
        centerdiv.appendChild(p1);
        centerdiv.appendChild(p2);
        centerListdiv.appendChild(centerdiv);
      }
      
      centerListdiv.childNodes.forEach((center) => {
        center.addEventListener('click', function() {
            toggleColor(this);
        });
      });
    }
  })
})