// Плавная прокрутка для навигационных ссылок
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Плавная прокрутка для логотипа
document.querySelector('.logo-link').addEventListener('click', function(e) {
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Анимация появления элементов при скролле
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.feature-card, .course-card, .teacher-card, .review-card');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        
        if (elementTop < window.innerHeight && elementBottom > 0) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
};

// Инициализация анимации
window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);

// Sticky header
const header = document.querySelector('.header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll <= 0) {
        header.classList.remove('scroll-up');
        return;
    }

    if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
        header.classList.remove('scroll-up');
        header.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
        header.classList.remove('scroll-down');
        header.classList.add('scroll-up');
    }
    lastScroll = currentScroll;
});

// Получение UTM-меток из URL
function getUTMParams() {
    const urlParams = new URLSearchParams(window.location.search);
    document.getElementById('utm_source').value = urlParams.get('utm_source') || '';
    document.getElementById('utm_medium').value = urlParams.get('utm_medium') || '';
    document.getElementById('utm_campaign').value = urlParams.get('utm_campaign') || '';
}

// Функция для отправки событий через Measurement Protocol
async function sendToGA4(eventName, eventParams) {
    const GA4_ENDPOINT = 'https://www.google-analytics.com/mp/collect';
    const MEASUREMENT_ID = 'G-5S3DZGDC35';
    const API_SECRET = 'qO2VDrKWTQqbLmTxBfj9sw';
    const CLIENT_ID = generateClientId(); // Генерируем или получаем существующий client_id

    try {
        const response = await fetch(`${GA4_ENDPOINT}?measurement_id=${MEASUREMENT_ID}&api_secret=${API_SECRET}`, {
            method: 'POST',
            body: JSON.stringify({
                client_id: CLIENT_ID,
                events: [{
                    name: eventName,
                    params: eventParams
                }]
            })
        });

        if (!response.ok) {
            throw new Error('GA4 event sending failed');
        }

        return await response.json();
    } catch (error) {
        console.error('Error sending GA4 event:', error);
        throw error;
    }
}

// Генерация или получение client_id
function generateClientId() {
    let clientId = localStorage.getItem('ga_client_id');
    if (!clientId) {
        clientId = Math.random().toString(36).substring(2) + '.' + Date.now();
        localStorage.setItem('ga_client_id', clientId);
    }
    return clientId;
}

// Обработка отправки формы
document.getElementById('leadForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    try {
        // Отправка события в Google Analytics через Measurement Protocol
        await sendToGA4('generate_lead', {
            course: formData.get('course'),
            source: formData.get('utm_source') || '(direct)',
            medium: formData.get('utm_medium') || '(none)',
            campaign: formData.get('utm_campaign') || '(not set)'
        });

        // Отправка события через gtag (для браузерных событий)
        gtag('event', 'generate_lead', {
            'event_category': 'Lead',
            'event_label': formData.get('course'),
            'value': 1
        });

        // Отправка события в Яндекс.Метрику
        if (typeof ym !== 'undefined') {
            ym(YOUR_METRIKA_ID, 'reachGoal', 'form_submission', {
                course: formData.get('course')
            });
        }

        // Очистка формы и показ сообщения об успехе
        form.reset();
        alert('Спасибо! Мы свяжемся с вами в ближайшее время.');
    } catch (error) {
        console.error('Error submitting form:', error);
        alert('Произошла ошибка при отправке формы. Пожалуйста, попробуйте позже.');
    }
});

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    getUTMParams();
});

// Маска для телефона
document.querySelector('input[name="phone"]').addEventListener('input', function(e) {
    let x = e.target.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
    e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
});

// Улучшенная обработка мобильного меню
const burgerMenu = document.querySelector('.burger-menu');
const navLinks = document.querySelector('.nav-links');
const body = document.body;

// Функция для переключения меню
function toggleMenu() {
    burgerMenu.classList.toggle('active');
    navLinks.classList.toggle('active');
    body.classList.toggle('menu-open');
}

// Обработчик клика на бургер-меню
burgerMenu.addEventListener('click', toggleMenu);

// Закрытие меню при клике на ссылку
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) {
            toggleMenu();
        }
    });
});

// Закрытие меню при клике вне его области
document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('active') && 
        !e.target.closest('.nav-links') && 
        !e.target.closest('.burger-menu')) {
        toggleMenu();
    }
});

// Предотвращение прокрутки при открытом меню
navLinks.addEventListener('touchmove', (e) => {
    if (body.classList.contains('menu-open')) {
        e.preventDefault();
    }
}, { passive: false });

// Анимация чисел в секции статистики
const animateNumbers = () => {
    const stats = document.querySelectorAll('.stat-number');
    
    stats.forEach(stat => {
        const target = parseInt(stat.textContent);
        const duration = 2000; // 2 секунды
        const step = target / (duration / 16); // 60 FPS
        let current = 0;
        
        const updateNumber = () => {
            current += step;
            if (current < target) {
                stat.textContent = Math.floor(current) + '+';
                requestAnimationFrame(updateNumber);
            } else {
                stat.textContent = target + '+';
            }
        };
        
        // Запускаем анимацию когда элемент появляется в viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateNumber();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(stat);
    });
};

// Запускаем анимацию чисел при загрузке страницы
window.addEventListener('load', animateNumbers); 