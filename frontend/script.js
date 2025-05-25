document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');

    // URL Back-End Flask kita
    // Jika kamu menjalankan Flask di port 5000 di komputer yang sama:
    const BACKEND_URL = 'http://127.0.0.1:5000';

    let userId = localStorage.getItem('pintaraiUserId');

    // Jika userId belum ada, buat yang baru dan simpan
    if (!userId) {
        userId = 'user-' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        localStorage.setItem('pintaraiUserId', userId);
        console.log("ID Pengguna Baru Dibuat:", userId);
    } else {
        console.log("ID Pengguna Yang Ada:", userId);
    }

    // Fungsi untuk menambahkan pesan ke UI chat
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);
        messageDiv.textContent = text;
        chatMessages.appendChild(messageDiv);
        // Otomatis scroll ke bawah
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Fungsi untuk mengirim pesan ke Backend
    async function sendMessage() {
        const question = userInput.value.trim();
        if (question === '') return; // Jangan kirim pesan kosong

        addMessage(question, 'user'); // Tampilkan pesan pengguna di UI
        userInput.value = ''; // Kosongkan input

        try {
            // Tampilkan pesan "sedang mengetik"
            addMessage('PintarAI sedang berpikir...', 'bot');
            const thinkingMessage = chatMessages.lastChild; // Ambil elemen pesan "sedang berpikir"

            const response = await fetch(`${BACKEND_URL}/ask`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ question: question, userId: userId }) // Kirim pertanyaan dan userId
            });

            // Hapus pesan "sedang berpikir" sebelum menampilkan jawaban
            if (thinkingMessage && thinkingMessage.textContent === 'PintarAI sedang berpikir...') {
                chatMessages.removeChild(thinkingMessage);
            }

            if (!response.ok) {
                // Tangani error HTTP (misal 400, 500)
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            addMessage(data.answer, 'bot'); // Tampilkan jawaban AI di UI

        } catch (error) {
            console.error('Error saat mengirim pesan:', error);
            // Tampilkan pesan error yang lebih user-friendly
            addMessage('Maaf, terjadi kesalahan. Silakan coba lagi nanti.', 'bot');
            // Pastikan pesan "sedang berpikir" dihapus jika ada error
            const thinkingMessage = chatMessages.lastChild;
            if (thinkingMessage && thinkingMessage.textContent === 'PintarAI sedang berpikir...') {
                chatMessages.removeChild(thinkingMessage);
            }
        }
    }

    // Event Listener untuk tombol Kirim
    sendButton.addEventListener('click', sendMessage);

    // Event Listener untuk tombol Enter di input
    userInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });
});