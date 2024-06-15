document.addEventListener('DOMContentLoaded', function() {
    const heart = document.getElementById('heart');

    heart.addEventListener('click', function() {
        if (heart.classList.contains('filled')) {
            heart.classList.remove('filled');
            heart.innerHTML = `
                <svg width="90" height="90" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="#9B2D30" stroke-width="2"/>
                </svg>
            `;
        } else {
            heart.classList.add('filled');
            heart.innerHTML = `
                <svg width="90" height="90" viewBox="0 0 24 24" fill="#9B2D30" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
            `;
        }
    });
});
document.addEventListener('DOMContentLoaded', function() {
    // Тестовые данные для отображения отзывов
    const testReviews = [
        {
            name: 'Иван Иванов',
            review: 'Япония - страна, где традиции встречаются с передовыми технологиями, создавая уникальную культурную палитру. Гостеприимство японцев, их внимание к деталям и безупречное качество сервиса делают путешествие по этой стране незабываемым.'
        },
        {
            name: 'Мария Петрова',
            review: 'Путешествие в Японию было одной из самых ярких и запоминающихся поездок в моей жизни. Японская культура, кухня и гостеприимство оставили неизгладимое впечатление.'
        }
    ];

    // Функция для добавления отзывов на страницу
    function addReview(reviewData) {
        const reviewElement = document.createElement('div');
        reviewElement.classList.add('review');
        reviewElement.innerHTML = `
            <div class="review-icon">
                <svg width="64" height="54" viewBox="0 0 64 54" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_14_177)">
                        <path d="M30 4C16.2 4 5 14.304 5 27C5 39.696 16.2 50 30 50C43.8 50 55 39.696 55 27C55 14.304 43.8 4 30 4ZM30 13.2C34.825 13.2 38.75 16.811 38.75 21.25C38.75 25.689 34.825 29.3 30 29.3C25.175 29.3 21.25 25.689 21.25 21.25C21.25 16.811 25.175 13.2 30 13.2ZM30 45.4C24.925 45.4 18.925 43.514 14.65 38.776C18.875 35.74 24.2 33.9 30 33.9C35.8 33.9 41.125 35.74 45.35 38.776C41.075 43.514 35.075 45.4 30 45.4Z" fill="#B03337"/>
                    </g>
                    <defs>
                        <clipPath id="clip0_14_177">
                            <rect width="64" height="54" fill="white"/>
                        </clipPath>
                    </defs>
                </svg>
            </div>
            <div class="review-content">
                <strong>${reviewData.name}</strong>
                <p>${reviewData.review}</p>
            </div>
        `;

        document.getElementById('reviews-container').appendChild(reviewElement);
    }

    // Добавление тестовых данных на страницу
    testReviews.forEach(reviewData => {
        addReview(reviewData);
    });

    // Обработка формы для добавления нового отзыва
    document.getElementById('review-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const name = 'ФИО'; // Здесь можно взять имя из формы, если оно будет добавлено
        const review = document.getElementById('review').value;
        addReview({ name, review });
        document.getElementById('review-form').reset();
    });
});
