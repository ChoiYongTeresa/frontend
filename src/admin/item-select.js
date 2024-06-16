const foodMarketId = new URLSearchParams(window.location.search).get('foodMarketId');

window.onload = function() {
    // URL에서 donationId 파라미터 추출
    const urlParams = new URLSearchParams(window.location.search);
    const donationId = urlParams.get('donationId');

    if (!donationId || !foodMarketId) {
        console.error('Donation ID or Food Market ID is missing from the URL.');
        return;
    }

    fetch(`/admin/donations/${donationId}/details?foodMarketId=${foodMarketId}`)
        .then(response => response.json())
        .then(data => {
            const authorElement = document.querySelector('.author');
            authorElement.textContent = data[0].name; // 첫 번째 항목의 기부자 이름 설정

            const titleElement = document.querySelector('.title');
            titleElement.textContent = `${data.length}개의 기부 항목`; // 항목 개수 설정

            const relationId = data[0].relationId; // response에서 relationId 저장

            const items = data.map(item => ({
                name: item.productName,
                weight: item.productWeight || '', // weight가 없다면 빈 문자열
                quantity: item.productNum,
                expirationDate: formatDate(item.expireDate), // 날짜 포맷팅
                storageMethod: getStorageMethod(item.productStorage),
                image: item.productUrl || '',
                selected: false
            }));

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

            document.querySelector('.button.approval').addEventListener('click', () => approveItems(relationId));
        })
        .catch(error => {
            console.error('Error fetching donation data:', error);
        });
}

function getStorageMethod(storageCode) {
    switch (storageCode) {
        case 1: return '실온';
        case 2: return '냉장';
        case 3: return '냉동';
        default: return '알 수 없음';
    }
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

function approveItems(relationId) {
    fetch(`/admin/donations/${relationId}/approval`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            relationId: relationId // request에 relationId만 포함
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 200) {
                console.log(`Approval successful`);
            } else {
                console.error(`Approval failed`);
            }
        })
        .catch(error => {
            console.error('Error approving item:', error);
        });
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}
