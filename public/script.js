const presentListContainer = document.getElementById('present-list-container');

async function fetchGifts() {
    try {
        const response = await fetch('/api/gifts');
        if (!response.ok) {
            throw new Error('Erro ao buscar os presentes.');
        }
        const data = await response.json();
        renderGifts(data.data);
    } catch (error) {
        console.error("Falha ao carregar a lista:", error);
        presentListContainer.innerHTML = '<p>Não foi possível carregar a lista de presentes. Tente novamente mais tarde.</p>';
    }
}

function renderGifts(gifts) {
    if (gifts.length === 0) {
        presentListContainer.innerHTML = '<p>Todos os presentes já foram escolhidos! Obrigado!</p>';
        return;
    }

    presentListContainer.innerHTML = ''; 

    gifts.forEach(gift => {
        const giftItem = document.createElement('div');
        giftItem.className = 'gift-item';

        giftItem.innerHTML = `
            <img src="${gift.image}" alt="${gift.name}">
            <div class="gift-details">
                <h2>${gift.name}</h2>
                <button class="present-button" data-id="${gift.id}">PRESENTEAR</button>
            </div>
        `;
        presentListContainer.appendChild(giftItem);
    });
}

fetchGifts();

document.addEventListener('click', async (e) => {
    if (e.target.classList.contains('present-button')) {
        const giftId = e.target.dataset.id;
        window.location.href = `/present/${giftId}`;
    }
});