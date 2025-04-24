document.addEventListener('DOMContentLoaded', function () {
    const API_BASE_URL = 'http://127.0.0.1:8000';
    const loginForm = document.getElementById('loginForm');
    const captchaImage = document.getElementById('captchaImage');
    const captchaKeyInput = document.getElementById('captchaKey');
    const refreshBtn = document.getElementById('refreshCaptcha');

    // CAPTCHA yuklash
    async function loadCaptcha() {
        try {
            const res = await fetch(`${API_BASE_URL}/api/captcha/`);
            const data = await res.json();
            captchaImage.src = data.captcha_image;
            captchaKeyInput.value = data.captcha_key;
        } catch (error) {
            console.error("CAPTCHA yuklashda xatolik:", error);
            captchaImage.alt = "CAPTCHA yuklanmadi";
        }
    }

    // CAPTCHA yangilash tugmasi
    refreshBtn.addEventListener('click', loadCaptcha);

    // Parolni ko‘rsatish/berkitish
    document.getElementById('togglePassword').addEventListener('click', function () {
        const passwordInput = document.getElementById('password');
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        this.textContent = type === 'password' ? '👁️' : '👁️‍🗨️';
    });

    // Formani yuborish
    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const formData = {
            username: this.username.value,
            password: this.password.value,
            captcha: {
                key: this.captcha_key.value,
                value: this.captcha_value.value
            }
        };

        try {
            const response = await fetch(`${API_BASE_URL}/api/login/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (!response.ok) {
                let errorMsg = "";
                for (const field in result) {
                    errorMsg += `${field}: ${result[field].join(', ')}\n`;
                }
                throw new Error(errorMsg || "Kirishda xatolik yuz berdi");
            }

            localStorage.setItem('token', result.token);
            alert("Tizimga muvaffaqiyatli kirildi!");
            window.location.href = 'home.html'; // asosiy sahifaga yo‘naltirish

        } catch (error) {
            alert("Xatolik:\n" + error.message);
            loadCaptcha(); // CAPTCHA-ni yangilash
        }
    });

    // Sahifa yuklanganda CAPTCHA-ni birinchi marta chaqirish
    loadCaptcha();
});
