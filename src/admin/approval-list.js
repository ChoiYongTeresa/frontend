// approval-list.js

// 더미 데이터 정의 (더 많은 항목 추가)
const dummyData = [
    { no: 1, title: "밀가루 1개, 참치 2개", author: "조단현", status: "승인 대기" },
    { no: 2, title: "소보로빵 3개", author: "임세빈", status: "승인 완료" },
    { no: 3, title: "계란 30개", author: "서은서", status: "반려" },
    // { no: 4, title: "밀가루 1개, 참치 2개", author: "조단현", status: "승인 대기" },
    // { no: 5, title: "소보로빵 3개", author: "임세빈", status: "승인 완료" },
    // { no: 6, title: "계란 30개", author: "서은서", status: "반려" },
    // { no: 7, title: "밀가루 1개, 참치 2개", author: "조단현", status: "승인 대기" },
    // { no: 8, title: "소보로빵 3개", author: "임세빈", status: "승인 완료" },
    // { no: 9, title: "계란 30개", author: "서은서", status: "반려" },
    // { no: 10, title: "밀가루 1개, 참치 2개", author: "조단현", status: "승인 대기" },
    // { no: 11, title: "소보로빵 3개", author: "임세빈", status: "승인 완료" },
    // { no: 12, title: "계란 30개", author: "서은서", status: "반려" },
];

const itemsPerPage = 10;
let currentPage = 1;

window.onload = function() {
    displayList(dummyData, itemsPerPage, currentPage);
    setupPagination(dummyData, itemsPerPage);
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
        cellTitle.textContent = item.title;
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
        currentBtn.classList.remove('active');

        button.classList.add('active');
    });

    return button;
}
