document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('present-form');
    const guestNameInput = document.getElementById('guest-name');
    const guestPhoneInput = document.getElementById('guest-phone');
    const successMessage = document.getElementById('success-message');

    const urlParts = window.location.pathname.split('/');
    const giftId = urlParts[urlParts.length - 1];

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const guestName = guestNameInput.value;
        const guestPhone = guestPhoneInput.value;
        
        if (!guestName) {
            alert("Por favor, digite seu nome.");
            successMessage.style.display = 'block';
            successMessage.style.color = 'red';
            return;
        }

        try {
            const response = await fetch('/api/present', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: giftId,
                    guest_name: guestName,
                    guest_phone: guestPhone
                }),
            });
            const data = await response.json();
            if (response.ok) {
                successMessage.textContent = "Reserva confirmada com sucesso! Redirecionando...";
                successMessage.style.display = 'block';
                successMessage.style.color = 'white';

                setTimeout(() => {
                    window.location.href = '/';
                }, 1000);
            } else {
                successMessage.textContent = "Erro ao reservar. Tente novamente.";
                successMessage.style.display = 'block';
                successMessage.style.color = 'red';
                console.error(data.error);
                alert(data.error);
            }
        } catch (error) {
            successMessage.textContent = "Ocorreu um erro ao reservar o presente.";
            successMessage.style.display = 'block';
            successMessage.style.color = 'red';
            console.error("Erro ao reservar o presente:", error);
            }
    });
});