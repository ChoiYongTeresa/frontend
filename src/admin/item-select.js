window.onload = function() {
    // URL에서 donationId 파라미터 추출
    const urlParams = new URLSearchParams(window.location.search);
    const donationId = urlParams.get('donationId');

    if (!donationId) {
        console.error('Donation ID is missing from the URL.');
        return;
    }

    fetch(`/admin/donations/${donationId}`)
        .then(response => response.json())
        .then(data => {
            // author, phone, email을 response 데이터에서 설정합니다
            const authorElement = document.querySelector('.author');
            authorElement.textContent = data.name;

            const titleElement = document.querySelector('.title');
            titleElement.textContent = `${data.product_name} ${data.product_num}개`;

            const items = [{
                name: data.product_name,
                weight: data.product_weight || '', // weight 필드가 없다면 빈 문자열
                quantity: data.product_num,
                expirationDate: data.expiration_date,
                storageMethod: data.product_storage === 1 ? '실온' : '냉장', // 수정 필요
                image: data.product_url,
                selected: false
            }];

            const containerItemList = document.querySelector('.container-item-list');
            containerItemList.innerHTML = ''; 

            items.forEach((item, index) => {
                const article = document.createElement('article');
                article.className = 'container-item';

                article.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" class="item-image">
                    <div class="container-item-info">
                        <p class="item-name">${item.name}</p>
                        <div class="container-info-class"><p class="class-name">무게</p><p class="class-value">${item.weight}</p></div>
                        <div class="container-info-class"><p class="class-name">개수</p><p class="class-value">${item.quantity}</p></div>
                        <div class="container-info-class"><p class="class-name">유통기한</p><p class="class-value">${item.expirationDate}</p></div>
                        <div class="container-info-class"><p class="class-name">보관 방법</p><p class="class-value">${item.storageMethod}</p></div>
                    </div>
                    <div class="container-button">
                        <button class="button select" data-index="${index}">선택하기</button>
                    </div>
                `;

                containerItemList.appendChild(article);
            });

            document.querySelectorAll('.button').forEach(button => {
                button.addEventListener('click', toggleButton);
            });

            document.querySelector('.button.approval').addEventListener('click', () => approveItems(donationId, items));
        })
        .catch(error => {
            console.error('Error fetching donation data:', error);
        });
}

function toggleButton(event) {
    const button = event.target;
    const itemIndex = button.getAttribute('data-index');

    if (button.classList.contains('select')) {
        button.classList.replace('select', 'cancel');
        button.textContent = '취소하기';
    } else if (button.classList.contains('cancel')) {
        button.classList.replace('cancel', 'select');
        button.textContent = '선택하기';
    }

    updateItemSelectedState(itemIndex);
}

function updateItemSelectedState(itemIndex) {
    const items = document.querySelectorAll('.container-item .button');
    items.forEach(button => {
        const index = button.getAttribute('data-index');
        if (index == itemIndex) {
            const selected = button.classList.contains('cancel');
            button.dataset.selected = selected;
        }
    });
}

function approveItems(donationId, items) {
    const selectedItems = items.filter((item, index) => {
        const button = document.querySelector(`.button[data-index="${index}"]`);
        return button.classList.contains('cancel');
    });

    selectedItems.forEach(item => {
        const isApproved = true; // 선택된 아이템 승인

        fetch(`/admin/donations/${donationId}/approval`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                donation_id: donationId,
                foodmarket_id: item.name, // 수정 필요
                isApproved: isApproved
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 200) {
                console.log(`Item ${item.name} approved successfully`);
            } else {
                console.error(`Failed to approve item ${item.name}`);
            }
        })
        .catch(error => {
            console.error('Error approving item:', error);
        });
    });
}
