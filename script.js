document.addEventListener("DOMContentLoaded", function() {
    const gameContainer = document.getElementById('game-container');
    const ball = document.getElementById('ball');
    const goal = document.getElementById('goal');
    const obstacle1 = document.getElementById('obstacle1'); // Eerste obstakel
    const obstacle2 = document.getElementById('obstacle2'); // Tweede obstakel
    const levelDisplay = document.getElementById('level-display');
    let currentLevel = 1;
    let obstacle1Direction = 1; // Richting van beweging voor obstakel 1: 1 (rechts) of -1 (links)
    let obstacle2Direction = -1; // Richting van beweging voor obstakel 2: -1 (links) of 1 (rechts)
    let obstacleSpeed = 3; // Snelheid van obstakels

    // Functie om een willekeurige positie binnen het game-container te krijgen
    function getRandomPosition() {
        const containerWidth = gameContainer.clientWidth;
        const containerHeight = gameContainer.clientHeight;
        const size = 50; // Diameter van bal, doel en obstakels

        const x = Math.floor(Math.random() * (containerWidth - size));
        const y = Math.floor(Math.random() * (containerHeight - size));

        return { x, y };
    }

    // Plaats de bal, doel en obstakels op willekeurige posities binnen het game-container
    function placeElementsRandomly() {
        const ballPosition = getRandomPosition();
        const goalPosition = getRandomPosition();
        const obstacle1Position = getRandomPosition();
        const obstacle2Position = getRandomPosition();

        ball.style.top = ballPosition.y + 'px';
        ball.style.left = ballPosition.x + 'px';

        goal.style.top = goalPosition.y + 'px';
        goal.style.left = goalPosition.x + 'px';

        obstacle1.style.top = obstacle1Position.y + 'px';
        obstacle1.style.left = obstacle1Position.x + 'px';

        obstacle2.style.top = obstacle2Position.y + 'px';
        obstacle2.style.left = obstacle2Position.x + 'px';
    }

    // Initialiseer het spel door de elementen op willekeurige posities te plaatsen
    placeElementsRandomly();

    // Functie om de obstakels heen en weer te laten bewegen
    function moveObstacles() {
        moveObstacle(obstacle1, obstacle1Direction); // Beweeg obstakel 1
        moveObstacle(obstacle2, obstacle2Direction); // Beweeg obstakel 2

        // Blijf de obstakels periodiek verplaatsen
        requestAnimationFrame(moveObstacles);
    }

    // Beweeg een specifiek obstakel heen en weer binnen het game-container
    function moveObstacle(obstacle, direction) {
        const obstacleStyle = getComputedStyle(obstacle);
        let obstacleLeft = parseInt(obstacleStyle.left);

        // Controleer of het obstakel de randen van het game-container bereikt
        if (obstacleLeft <= 0 || obstacleLeft >= (gameContainer.clientWidth - obstacle.clientWidth)) {
            direction = -direction; // Verander van richting
        }

        obstacleLeft += direction * obstacleSpeed;
        obstacle.style.left = obstacleLeft + 'px';
    }

    // Start het bewegen van de obstakels
    moveObstacles();

    // Voeg event listener toe voor balbeweging
    document.addEventListener('keydown', function(event) {
        const key = event.key;
        const ballStyle = getComputedStyle(ball);
        let ballLeft = parseInt(ballStyle.left);
        let ballTop = parseInt(ballStyle.top);
        const step = 10;

        switch (key) {
            case 'ArrowUp':
                ballTop = Math.max(ballTop - step, 0); // Bovenkant van het speelgebied
                break;
            case 'ArrowDown':
                ballTop = Math.min(ballTop + step, gameContainer.clientHeight - ball.clientHeight); // Onderkant van het speelgebied
                break;
            case 'ArrowLeft':
                ballLeft = Math.max(ballLeft - step, 0); // Linkerkant van het speelgebied
                break;
            case 'ArrowRight':
                ballLeft = Math.min(ballLeft + step, gameContainer.clientWidth - ball.clientWidth); // Rechterkant van het speelgebied
                break;
        }

        // Update de positie van de bal binnen het speelgebied
        ball.style.top = ballTop + 'px';
        ball.style.left = ballLeft + 'px';

        // Controleer winvoorwaarde
        if (checkCollision(ball, goal)) {
            currentLevel++;
            updateLevelDisplay(); // Werk het niveau-display bij
            const nextLevel = currentLevel + 1;
            alert(`Gefeliciteerd! Je mag naar level ${currentLevel}. Op naar level ${nextLevel}!`);
            placeElementsRandomly(); // Plaats elementen opnieuw voor het volgende level
        }

        // Controleer verliesvoorwaarde (bal raakt een obstakel)
        if (checkCollision(ball, obstacle1) || checkCollision(ball, obstacle2)) {
            showLossMessage(); // Toon verliesmelding
        }
    });

    // Toon verliesmelding bij botsing tussen bal en obstakel
    function showLossMessage() {
        alert('Helaas! Je hebt verloren. Probeer het opnieuw.');
        currentLevel = 1; // Reset naar level 1 bij verlies
        updateLevelDisplay(); // Werk het niveau-display bij
        placeElementsRandomly(); // Plaats elementen opnieuw voor een nieuw spel
    }

    // Update het niveau-display met het huidige niveau
    function updateLevelDisplay() {
        levelDisplay.textContent = `Level: ${currentLevel}`;
    }

    // Controleer of er een botsing is tussen de bal en een object
    function checkCollision(ball, target) {
        const ballRect = ball.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();
        return !(ballRect.right < targetRect.left ||
                 ballRect.left > targetRect.right ||
                 ballRect.bottom < targetRect.top ||
                 ballRect.top > targetRect.bottom);
    }

    // Initialiseer het niveau-display
    updateLevelDisplay();
});
