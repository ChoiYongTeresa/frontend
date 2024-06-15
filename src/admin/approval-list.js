const API_URL = '/admin/donations/requestList';
const foodmarketId = 1; // foodmarket_id를 설정
const itemsPerPage = 10;
let currentPage = 1;

window.onload = function() {
    fetchDonationRequests(foodmarketId).then(data => {
        displayList(data, itemsPerPage, currentPage);
        setupPagination(data, itemsPerPage);
    }).catch(error => {
        console.error('Error fetching donation requests:', error);
        alert('기부 신청 리스트를 불러오는데 실패했습니다.');
    });
}

function fetchDonationRequests(foodmarketId) {
    return fetch(`${API_URL}?foodmarket_id=${foodmarketId}`)
        .then(response => response.json())
        .then(data => data.map((item, index) => ({
            no: index + 1,
            donationId: item.donation_id,
            title: `기부 신청 ${item.donation_id}`,
            author: item.user_id,
            status: "승인 대기" // status 받아와야 함...
        })))
        .catch(error => {
            console.error('Error fetching donation requests:', error);
            throw error;
        });
}

function displayList(items, itemsPerPage, page) {
    const approvalList = document.getElementById('approval-list');
    approvalList.innerHTML = "";
    page--;

    const start = itemsPerPage * page;
    const end = start + itemsPerPage;
    const paginatedItems = items.slice(start, end);

    paginatedItems.forEach(item => {
        const row = document.createElement('tr');
        
        const cellNo = document.createElement('td');
        cellNo.textContent = item.no;
        row.appendChild(cellNo);
        
        const cellTitle = document.createElement('td');
        const titleLink = document.createElement('a');
        titleLink.href = `/donation/details/${item.donationId}`;
        titleLink.textContent = item.title;
        cellTitle.appendChild(titleLink);
        row.appendChild(cellTitle);
        
        const cellAuthor = document.createElement('td');
        cellAuthor.textContent = item.author;
        row.appendChild(cellAuthor);

        const cellStatus = document.createElement('td');
        cellStatus.textContent = item.status;

        if (item.status === "승인 대기") {
            cellStatus.classList.add('status-pending');
        } else if (item.status === "승인 완료") {
            cellStatus.classList.add('status-approved');
        }
        
        row.appendChild(cellStatus);
        approvalList.appendChild(row);
    });
}

function setupPagination(items, itemsPerPage) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = "";

    const pageCount = Math.ceil(items.length / itemsPerPage);
    for (let i = 1; i <= pageCount; i++) {
        const btn = paginationButton(i, items);
        pagination.appendChild(btn);
    }
}

function paginationButton(page, items) {
    const button = document.createElement('button');
    button.textContent = page;

    if (currentPage == page) button.classList.add('active');

    button.addEventListener('click', function () {
        currentPage = page;
        displayList(items, itemsPerPage, currentPage);

        const currentBtn = document.querySelector('.pagination button.active');
        if (currentBtn) currentBtn.classList.remove('active');

        button.classList.add('active');
    });

    return button;
}
