$(document).ready(function() {
    const API_URL = '/donation/selected_info';
    const SAVE_URL = '/donations/selection/'; // foodmarket_id 동적으로 추가

    function fetchData() {
        $.getJSON(API_URL, function(data) {
            if (data && data.length > 0) {
                const donationData = data[0];

                $('#donation-title').text(donationData.foodmarket_name);
                $('#author-name').text("조단현");

                $('#center-name').text(donationData.foodmarket_name);
                $('#center-address').text(donationData.center_address);

                // 아이템 로드
                const itemList = $('#item-list');
                itemList.empty();

                donationData.selected_product_list.forEach(product => {
                    const itemHTML = `
                        <article class="container-item">
                            <img src="../assets/${product.productName.toLowerCase()}.png" alt="${product.productName}" class="item-image">
                            <div class="container-item-info">
                                <p class="item-name">${product.productName}</p>
                                <div class="container-info-class"><p class="class-name">무게</p><p class="class-value">${product.productWeight}kg</p></div>
                                <div class="container-info-class"><p class="class-name">개수</p><p class="class-value">${product.productQuantity}개</p></div>
                                <div class="container-info-class"><p class="class-name">유통기한</p><p class="class-value">${product.expirationDate}</p></div>
                                <div class="container-info-class"><p class="class-name">보관 방법</p><p class="class-value">${getStoreType(product.storeType)}</p></div>
                            </div>
                            <h2 class="status">${product.is_selected ? '승인 완료' : '승인 대기'}</h2>
                        </article>
                    `;
                    itemList.append(itemHTML);
                });

                const centerList = donationData.centers;
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
        });
    }

    // 보관 방법을 텍스트로 변환
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

    // 센터 저장
    function saveSelectedCenter() {
        const selectedCenter = $('input[name="center"]:checked').val();
        if (!selectedCenter) {
            alert("센터를 선택하세요.");
            return;
        }

        $.ajax({
            url: SAVE_URL + selectedCenter,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ foodmarket_id: selectedCenter }),
            success: function(response) {
                if (response.status === 200) {
                    alert("센터가 성공적으로 저장되었습니다.");
                } else {
                    alert("센터 저장에 실패했습니다.");
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
