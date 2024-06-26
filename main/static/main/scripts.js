document.addEventListener('DOMContentLoaded', function () {
    // Получение элементов из DOM
    const heart = document.getElementById('heart');
    const modal = document.getElementById("modal");
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
    const reviewModalContent = document.getElementById("review-modal-content");
    const likeModalContent = document.getElementById("like-modal-content");
    const submitBtn = document.getElementById("submit-btn");
    const loginButton = document.getElementById("login-button");
    const registerButton = document.getElementById("register-button");
    const showRegisterLink = document.getElementById("show-register");
    const showLoginLink = document.getElementById("show-login");
    const closeButtons = document.getElementsByClassName("close");
    const reviewTextarea = document.getElementById("review");
    const reviewsContainer = document.getElementById('reviews-container');

    // Переменная для хранения текста отзыва до публикации
    let reviewToPost = '';

    // Функция для показа модального окна с указанным контентом
    function showModal(content) {
        modal.style.display = "block";
        loginForm.style.display = "none";
        registerForm.style.display = "none";
        reviewModalContent.style.display = "none";
        likeModalContent.style.display = "none";
        content.style.display = "block";
    }

    // Обработчик события клика по элементу heart
    heart.addEventListener('click', function () {
        heart.innerHTML = `
            <svg width="90" height="90" viewBox="0 0 24 24" fill="#335D2D" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
        `;
    });

    // Обработчик события клика по кнопке отправки формы
    submitBtn.onclick = function (event) {
        if (reviewTextarea.value.trim() !== "") {
            event.preventDefault();
            reviewToPost = reviewTextarea.value.trim();
            showModal(loginForm);
        }
    };

    // Обработчик события клика по кнопке логина
    loginButton.onclick = async function (event) {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const response = await fetch('/api/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('access_token', data.access);
            localStorage.setItem('refresh_token', data.refresh);

            const userResponse = await fetch('/api/user/', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${data.access}`,
                    'Content-Type': 'application/json'
                }
            });

            if (userResponse.ok) {
                const userData = await userResponse.json();
                localStorage.setItem('user_name', userData.name);
            }

            if (reviewToPost !== '') {
                const accessToken = localStorage.getItem('access_token');
                const reviewResponse = await fetch('/api/review/', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ content: reviewToPost })
                });

                if (reviewResponse.ok) {
                    const savedReview = await reviewResponse.json();
                    addReview({
                        user: { name: localStorage.getItem('user_name') },
                        content: savedReview.content,
                        likes: savedReview.likes,
                        id: savedReview.id
                    });

                    reviewToPost = '';
                    document.getElementById('review-form').reset();
                    showModal(reviewModalContent);
                }
            } else {
                showModal(likeModalContent);
            }
        } else {
            alert('Invalid credentials. Please try again.');
        }
    };

    // Обработчик события клика по кнопке регистрации
    registerButton.onclick = async function (event) {
        event.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }

        const response = await fetch('/api/register/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('access_token', data.access);
            localStorage.setItem('refresh_token', data.refresh);
            showModal(loginForm);
        } else {
            alert('Registration failed. Please try again.');
        }
    };

    // Обработчики событий для переключения между формами логина и регистрации
    showRegisterLink.onclick = function () {
        showModal(registerForm);
    };

    showLoginLink.onclick = function () {
        showModal(loginForm);
    };

    // Обработчики событий для закрытия модального окна
    for (let i = 0; i < closeButtons.length; i++) {
        closeButtons[i].onclick = function () {
            modal.style.display = "none";
        };
    }

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };

    // Обработчик события клика по иконке лайка
    document.addEventListener('click', function (event) {
        if (event.target.closest('.like-icon')) {
            const likeIcon = event.target.closest('.like-icon');
            const reviewId = likeIcon.getAttribute('data-review-id');
            const accessToken = localStorage.getItem('access_token');

            if (!accessToken) {
                showModal(loginForm);
                return;
            }

            fetch(`/api/review/${reviewId}/like/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                if (!response.ok) {
                    if (response.status === 401) {
                        showModal(loginForm);
                        throw new Error('Unauthorized');
                    }
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.likes !== undefined) {
                    const likeCount = likeIcon.previousElementSibling;
                    likeCount.textContent = data.likes;
                    likeIcon.innerHTML = `
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="#335D2D" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                    `;
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
    });

    // Функция для добавления отзыва в DOM
    function addReview(reviewData) {
        const reviewElement = document.createElement('div');
        reviewElement.classList.add('review');
        reviewElement.innerHTML = `
            <div class="review-icon">
                <svg width="64" height="54" viewBox="0 0 64 54" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_14_177)">
                        <path d="M30 4C16.2 4 5 14.304 5 27C5 39.696 16.2 50 30 50C43.8 50 55 39.696 55 27C55 14.304 43.8 4 30 4ZM30 13.2C34.825 13.2 38.75 16.811 38.75 21.25C38.75 25.689 34.825 29.3 30 29.3C25.175 29.3 21.25 25.689 21.25 21.25C21.25 16.811 25.175 13.2 30 13.2ZM30 45.4C24.925 45.4 18.925 43.514 14.65 38.776C18.875 35.74 24.2 33.9 30 33.9C35.8 33.9 41.125 35.74 45.35 38.776C41.075 43.514 35.075 45.4 30 45.4Z" fill="#335D2D"/>
                    </g>
                    <defs>
                        <clipPath id="clip0_14_177">
                            <rect width="64" height="54" fill="white"/>
                        </clipPath>
                    </defs>
                </svg>
            </div>
            <div class="review-content">
                <strong>${reviewData.user.name}</strong>
                <p>${reviewData.content}</p>
                <div class="like-container">
                    <span class="like-count">${reviewData.likes}</span>
                    <span class="like-icon" data-review-id="${reviewData.id}">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                                  stroke="#335D2D" stroke-width="2"/>
                        </svg>
                    </span>
                </div>
            </div>
        `;

        document.getElementById('reviews-container').appendChild(reviewElement);
    }

    // Функция для загрузки всех отзывов из базы данных и их отображения
    async function loadReviews() {
        reviewsContainer.innerHTML = ''; // Очистка существующих отзывов
        const response = await fetch('/api/review/');
        const reviews = await response.json();
        reviews.forEach(review => {
            addReview({
                user: { name: review.user_name },
                content: review.content,
                likes: review.likes,
                id: review.id
            });
        });
    }

    loadReviews();

    // Обработчик отправки формы отзыва
    document.getElementById('review-form').addEventListener('submit', async function (event) {
        event.preventDefault();
        const name = localStorage.getItem('user_name');
        const review = document.getElementById('review').value;

        const accessToken = localStorage.getItem('access_token');
        const response = await fetch('/api/review/', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content: review })
        });

        if (response.ok) {
            const savedReview = await response.json();
            addReview({
                user: { name },
                content: savedReview.content,
                likes: savedReview.likes,
                id: savedReview.id
            });
        }

        document.getElementById('review-form').reset();
    });
});
