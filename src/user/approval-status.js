$(document).ready(function() {
    const API_URL = '/donation/selected_info';
    const SAVE_URL = '/donations/selection/';
    const donationFormId = 1; // 실제 donationFormId 설정 필요
    let productId = [];
    let imgs = [];
    let donationData = [];

    async function fetchData() {
        await fetch(API_URL+`?donationFormId=${donationFormId}`, {
            method: 'GET',
            contentType: 'application/json',
            headers: { "Content-Type": "application/json; charset=utf-8" },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(` ${response.status} 요청 실패`);
                }
                return response.json();
            })
            .then(data => {
                donationData = data[0]
                donationData.selectedProductList.forEach(product => {
                    productId.push(product.productId);
                });
            })
            .catch(error => {
                console.error(error)
            });

        for (let id of productId) {
            await fetch("/donations/attachment/"+id, {
            method: "GET",
            headers: { "Content-Type": "application/json; charset=utf-8" },
          })
          .then(response => {
            if (!response.ok) {
              throw new Error(` ${response.status} 요청 실패`);
            }
            return response.blob();
          })
          .then(data => {
            const url = URL.createObjectURL(blob);
            imgs.push(url)
              console.log(url)
          })
          .catch(error => {
            console.error(error)
          });
        }
        loadData(donationData)
        
    }

    function loadData(donationData) {
        $('#donation-title').text(donationData.foodMarketName);
        $('#author-name').text(donationData.donorName); // 작성자 이름 설정

        $('#center-name').text(donationData.foodMarketName);
        $('#center-address').text(donationData.centerAddress || '');

        // 아이템 로드
        const itemList = $('#item-list');
        itemList.empty();

        let i = 0;
        donationData.selectedProductList.forEach(product => {
            const itemHTML = `
                <article class="container-item">
                    <img src="${imgs[i]}" alt="${product.productName}" class="item-image" id="${product.productName}">
                    <div class="container-item-info">
                        <p class="item-name">${product.productName}</p>
                        <div class="container-info-class"><p class="class-name">무게</p><p class="class-value">${product.productWeight}kg</p></div>
                        <div class="container-info-class"><p class="class-name">개수</p><p class="class-value">${product.productQuantity}개</p></div>
                        <div class="container-info-class"><p class="class-name">유통기한</p><p class="class-value">${product.expirationDate}</p></div>
                        <div class="container-info-class"><p class="class-name">보관 방법</p><p class="class-value">${getStoreType(product.storeType)}</p></div>
                    </div>
                    <h2 class="status">${getApprovalStatus(product.isSelected)}</h2>
                </article>
            `;
            itemList.append(itemHTML);
            i = i + 1;
        });

        const centerList = donationData.centers || [];
        const containerCheckbox = $('.container-checkbox');
        containerCheckbox.empty();

        centerList.forEach(center => {
            const centerHTML = `
                <input type="checkbox" id="center${center.id}" name="center" value="${center.id}">
                <label for="center${center.id}">${center.name}</label>
            `;
            containerCheckbox.append(centerHTML);
        });
    }

    function getStoreType(storeType) {
        switch (storeType) {
            case 1:
                return '실온';
            case 2:
                return '냉장';
            case 3:
                return '냉동';
            default:
                return '기타';
        }
    }

    function getApprovalStatus(isSelected) {
        switch (isSelected) {
            case 1:
                return '승인 완료';
            case -1:
                return '승인 거부';
            case 0:
                return '승인 대기';
            default:
                return '상태 미정';
        }
    }

    function saveSelectedCenter() {
        const selectedFoodMarketId = $('input[name="center"]:checked').val();
        if (!selectedFoodMarketId) {
            alert("센터를 선택하세요.");
            return;
        }

        $.ajax({
            url: SAVE_URL + selectedFoodMarketId,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ foodMarketId: selectedFoodMarketId, donationFormId: donationFormId }),
            success: function(response) {
                if (response.status === 200) {
                    alert("기부 센터 결정이 성공했습니다.");
                } else {
                    alert("센터 결정에 실패했습니다.");
                }
            },
            error: function(error) {
                console.error('Error saving selected center:', error);
                alert("센터 저장 중 오류가 발생했습니다.");
            }
        });
    }

    $('.button.save').on('click', saveSelectedCenter);

    fetchData();
});
