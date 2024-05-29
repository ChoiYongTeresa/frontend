document.getElementById('upload-icon').addEventListener('click', function() {
    document.getElementById('file-input').click();
  });

  document.getElementById('file-input').addEventListener('change', function(event) {
    const files = event.target.files;
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

  
document.querySelectorAll('.center').forEach((center) => {
    center.addEventListener('click', function() {
        toggleColor(this);
    });
  });

const centerMapDiv = document.querySelector('.center-map')

function toggleColor(element) {
    // 현재 배경색이 하얀색이면 초록색으로, 아니면 하얀색으로 변경
    if (element.style.backgroundColor === 'white') {
        element.style.backgroundColor = '#28995C'; // 초록색
        element.style.color = 'white'; // 텍스트 색상 변경
        
        // Create and append the title
        var title = document.createElement('h2');
        title.textContent = '대전 가볼만한 공식 지원센터';
        centerMapDiv.appendChild(title);

        // Create and append the map image
        var mapImage = document.createElement('img');
        mapImage.src = '../assets/map_dummy.png'; // Replace with your actual image URL
        mapImage.alt = '지도 이미지';
        centerMapDiv.appendChild(mapImage);

        // Create and append the address info
        var address = document.createElement('p');
        address.textContent = '대전시 유성구대 660번길 3 층 다이셀';
        centerMapDiv.appendChild(address);

        // Create and append the phone number
        var phone = document.createElement('p');
        phone.textContent = '042-123-2134';
        centerMapDiv.appendChild(phone);
    } else {
        element.style.backgroundColor = 'white'; // 하얀색
        element.style.color = 'black'; // 텍스트 색상을 검은색으로 변경
        
        centerMapDiv.innerHTML = ""

    }
}
