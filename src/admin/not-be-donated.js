// 더미 데이터
const dummyData = ["전자제품", "유리제품", "의약품", "밀가루", "건전지"];

// 초기 물품 목록 생성
window.onload = () => {
    fetchItems().then(savedItems => {
        savedItems.forEach(itemName => addItemToList(itemName));

        // 입력 필드에 이벤트 리스너 추가
        const inputField = document.getElementById("itemInput");
        inputField.addEventListener("keyup", handleKeyUp);

        const addButton = document.getElementById("addItemButton");
        addButton.addEventListener("click", addItem)
    }).catch(error => {
        console.error('Failed to fetch items:', error);
        alert("물품 목록을 불러오는데 실패했습니다.");
    });
}

// 'Enter' 키 입력 이벤트 처리
const handleKeyUp = (event) => {
    if (event.key === "Enter") {
        addItem();
    }
}

// 물품을 목록에 추가
const addItem = () => {
    const input = document.getElementById("itemInput");
    const itemName = input.value.trim();

    if (!itemName) {
        // alert("물품을 입력하세요.");
        return;
    }

    addItemToList(itemName);
    input.value = "";
    saveItemsToServer();
}

// 물품을 물품 목록에 추가
const addItemToList = (itemName) => {
    const itemList = document.getElementById("itemList");
    const newItem = document.createElement("li");
    newItem.className = "item";

    newItem.appendChild(document.createTextNode(itemName));

    const deleteButton = document.createElement("span");
    deleteButton.className = "material-icons delete-button";
    deleteButton.textContent = "close";
    deleteButton.onclick = () => {
        itemList.removeChild(newItem);
        saveItemsToServer();
    };

    newItem.appendChild(deleteButton);
    itemList.appendChild(newItem);
}

// 서버에서 물품 목록 가져옴
const fetchItems = async () => {
    try {
        // 여기에 실제 API 호출 코드 작성
        // const response = await fetch('/api/items');
        // const data = await response.json();
        
        // 현재는 로컬 스토리지를 사용
        const data = JSON.parse(localStorage.getItem("itemList")) || dummyData;
        return data;
    } catch (error) {
        console.error('Error fetching items:', error);
        throw error;
    }
}

// 서버에 물품 목록을 저장
const saveItemsToServer = async () => {
    try {
        const itemList = document.getElementById("itemList");
        const items = [];
        itemList.querySelectorAll(".item").forEach(item => {
            items.push(item.firstChild.textContent);
        });

        // 여기에 실제 API 호출 코드 작성
        // await fetch('/api/items', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify(items)
        // });

        // 현재는 로컬 스토리지를 사용
        localStorage.setItem("itemList", JSON.stringify(items));
    } catch (error) {
        console.error('Error saving items:', error);
    }
}

/*
const saveItemsToServer = async (itemName) => {
    try {
        const foodmarketId = 1; // 실제 값으로 변경 필요

        await fetch(`/admin/donations/${foodmarketId}/banned_product`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                foodmarket_id: foodmarketId,
                significant: itemName
            })
        });
    } catch (error) {
        console.error('Error saving items:', error);
    }
}
*/