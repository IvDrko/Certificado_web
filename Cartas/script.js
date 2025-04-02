document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll('.card');
    let flippedCards = [];

    // Mostrar las cartas por un tiempo inicial (2 segundos) al principio del juego
    setTimeout(() => {
        cards.forEach(card => card.classList.add('flipped'));  // Mostrar todas las cartas
    }, 2000);  // Mostrar las cartas por 2 segundos

    // Voltear todas las cartas después de 2 segundos (esto es lo que muestra las cartas al principio)
    setTimeout(() => {
        cards.forEach(card => card.classList.remove('flipped'));  // Voltear todas las cartas nuevamente
    }, 4000);  // Voltear las cartas después de 4 segundos

    // Función para manejar el clic en las cartas
    cards.forEach(card => {
        card.addEventListener('click', () => {
            // Evitar hacer clic en las cartas ya volteadas
            if (flippedCards.length === 2 || card.classList.contains('flipped')) {
                return;
            }

            // Voltear la carta
            card.classList.add('flipped');
            flippedCards.push(card);

            // Si ya hay dos cartas volteadas, verificar si coinciden
            if (flippedCards.length === 2) {
                setTimeout(() => {
                    const [firstCard, secondCard] = flippedCards;

                    if (firstCard.querySelector('.front').textContent === secondCard.querySelector('.front').textContent) {
                        // Si las cartas coinciden, mantenemos las cartas volteadas
                        flippedCards = [];
                    } else {
                        // Si no coinciden, voltear las cartas de nuevo
                        firstCard.classList.remove('flipped');
                        secondCard.classList.remove('flipped');
                        flippedCards = [];
                    }
                }, 1000); // Tiempo para comparar las cartas
            }
        });
    });
});
