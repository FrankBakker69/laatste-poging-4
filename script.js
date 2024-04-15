document.addEventListener("DOMContentLoaded", function() {
    const gameContainer = document.getElementById('game-container');
    const ball = document.getElementById('ball');
    const goal = document.getElementById('goal');
    const obstacle = document.getElementById('obstacle');
    const levelDisplay = document.getElementById('level-display');
    let currentLevel = 1;
    let obstacleDirection = 1; // Richting van beweging: 1 (rechts) of -1 (links)
    let obstacleSpeed = 3; // Snelheid van het obstakel

    // Functie om een willekeurige positie binnen het game-container te krijgen
    function getRandomPosition() {
        const containerWidth = gameContainer.clientWidth;
        const containerHeight = gameContainer.clientHeight;
        const size = 50; // Diameter van bal, doel en obstakel

        const x = Math.floor(Math.random() * (containerWidth - size));
        const y = Math.floor(Math.random() * (containerHeight - size));

        return { x, y };
    }

    // Plaats de bal op een willekeurige positie binnen het game-container
    function placeBallRandomly() {
        const ballPosition = getRandomPosition();
        ball.style.top = ballPosition.y + 'px';
        ball.style.left = ballPosition.x + 'px';
    }

    // Plaats het doel op een willekeurige positie binnen het game-container
    function placeGoalRandomly() {
        const goalPosition = getRandomPosition();
        goal.style.top = goalPosition.y + 'px';
        goal.style.left = goalPosition.x + 'px';
    }

    // Plaats het obstakel op een willekeurige positie binnen het game-container
    function placeObstacleRandomly() {
        const obstaclePosition = getRandomPosition();
        obstacle.style.top = obstaclePosition.y + 'px';
        obstacle.style.left = obstaclePosition.x + 'px';
    }

    // Initialiseer het spel door de elementen op willekeurige posities te plaatsen
    function placeElementsRandomly() {
        placeBallRandomly();
        placeGoalRandomly();
        placeObstacleRandomly();
    }

    // Initialiseer het spel bij het begin
    placeElementsRandomly();

    // Functie om het obstakel heen en weer te laten bewegen
    function moveObstacle() {
        const obstacleStyle = getComputedStyle(obstacle);
        let obstacleLeft = parseInt(obstacleStyle.left);

        // Controleer of het obstakel de randen van het game-container bereikt
        if (obstacleLeft <= 0 || obstacleLeft >= (gameContainer.clientWidth - obstacle.clientWidth)) {
            obstacleDirection = -obstacleDirection; // Verander van richting
        }

        obstacleLeft += obstacleDirection * obstacleSpeed;
        obstacle.style.left = obstacleLeft + 'px';

        // Controleer voor botsing tussen bal en obstakel
        if (checkCollision(ball, obstacle)) {
            const ballRect = ball.getBoundingClientRect();
            const obstacleRect = obstacle.getBoundingClientRect();

            // Controleer of de bal de zijkant van het obstakel raakt
            if (ballRect.right >= obstacleRect.left && ballRect.left <= obstacleRect.right) {
                showLossMessage(); // Toon verliesmelding bij botsing
            }
        }

        // Blijf het obstakel periodiek verplaatsen
        requestAnimationFrame(moveObstacle);
    }

    // Start het bewegen van het obstakel
    moveObstacle();

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

        // Controleer verliesvoorwaarde (bal raakt het obstakel)
        if (checkCollision(ball, obstacle)) {
            const ballRect = ball.getBoundingClientRect();
            const obstacleRect = obstacle.getBoundingClientRect();

            // Controleer of de bal de zijkant van het obstakel raakt
            if (ballRect.right >= obstacleRect.left && ballRect.left <= obstacleRect.right) {
                showLossMessage(); // Toon verliesmelding
            }
        }
    });

    // Voeg event listener toe voor doelbeweging (WASD-toetsen)
    document.addEventListener('keydown', function(event) {
        const key = event.key.toLowerCase();
        const goalStyle = getComputedStyle(goal);
        let goalLeft = parseInt(goalStyle.left);
        let goalTop = parseInt(goalStyle.top);
        const step = 10;

        switch (key) {
            case 'w':
                goalTop = Math.max(goalTop - step, 0); // Bovenkant van het speelgebied
                break;
            case 's':
                goalTop = Math.min(goalTop + step, gameContainer.clientHeight - goal.clientHeight); // Onderkant van het speelgebied
                break;
            case 'a':
                goalLeft = Math.max(goalLeft - step, 0); // Linkerkant van het speelgebied
                break;
            case 'd':
                goalLeft = Math.min(goalLeft + step, gameContainer.clientWidth - goal.clientWidth); // Rechterkant van het speelgebied
                break;
        }

        // Update de positie van het doel binnen het speelgebied
        goal.style.top = goalTop + 'px';
        goal.style.left = goalLeft + 'px';

        // Controleer winvoorwaarde
        if (checkCollision(ball, goal)) {
            currentLevel++;
            updateLevelDisplay(); // Werk het niveau-display bij
            const nextLevel = currentLevel + 1;
            alert(`Gefeliciteerd! Je mag naar level ${currentLevel}. Op naar level ${nextLevel}!`);
            placeElementsRandomly(); // Plaats elementen opnieuw voor het volgende level
        }
    });

    // Controleer of er een botsing is tussen de bal en het doel/obstakel
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
