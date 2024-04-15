document.addEventListener("DOMContentLoaded", function() {
    const gameContainer = document.getElementById('game-container');
    const ball = document.getElementById('ball');
    const goal = document.getElementById('goal');
    const obstacle = document.getElementById('obstacle');
    const levelDisplay = document.getElementById('level-display');
    let currentLevel = 1;
    let obstacleDirection = 1;
    let obstacleSpeed = 3;

    function getRandomPosition() {
        const containerWidth = gameContainer.clientWidth;
        const containerHeight = gameContainer.clientHeight;
        const size = 50;

        const x = Math.floor(Math.random() * (containerWidth - size));
        const y = Math.floor(Math.random() * (containerHeight - size));

        return { x, y };
    }

    function placeBallRandomly() {
        const ballPosition = getRandomPosition();
        ball.style.top = ballPosition.y + 'px';
        ball.style.left = ballPosition.x + 'px';
    }

    function placeGoalRandomly() {
        const goalPosition = getRandomPosition();
        goal.style.top = goalPosition.y + 'px';
        goal.style.left = goalPosition.x + 'px';
    }

    function placeObstacleRandomly() {
        const obstaclePosition = getRandomPosition();
        obstacle.style.top = obstaclePosition.y + 'px';
        obstacle.style.left = obstaclePosition.x + 'px';
    }

    function placeElementsRandomly() {
        placeBallRandomly();
        placeGoalRandomly();
        placeObstacleRandomly();
    }

    placeElementsRandomly();

    function moveObstacle() {
        const obstacleStyle = getComputedStyle(obstacle);
        let obstacleLeft = parseInt(obstacleStyle.left);

        if (obstacleLeft <= 0 || obstacleLeft >= (gameContainer.clientWidth - obstacle.clientWidth)) {
            obstacleDirection = -obstacleDirection;
        }

        obstacleLeft += obstacleDirection * obstacleSpeed;
        obstacle.style.left = obstacleLeft + 'px';

        if (checkCollision(ball, obstacle)) {
            const ballRect = ball.getBoundingClientRect();
            const obstacleRect = obstacle.getBoundingClientRect();

            if (ballRect.right >= obstacleRect.left && ballRect.left <= obstacleRect.right) {
                showLossMessage();
            }
        }

        requestAnimationFrame(moveObstacle);
    }

    moveObstacle();

    function showLossMessage() {
        alert('Sorry! You lost. Try again.');
        currentLevel = 1;
        updateLevelDisplay();
        placeElementsRandomly();
    }

    function updateLevelDisplay() {
        levelDisplay.textContent = `Level: ${currentLevel}`;
    }

    updateLevelDisplay();

    document.addEventListener('keydown', function(event) {
        const key = event.key.toLowerCase(); // Convert key to lowercase
        const goalStyle = getComputedStyle(goal);
        let goalLeft = parseInt(goalStyle.left);
        let goalTop = parseInt(goalStyle.top);
        const step = 10;

        switch (key) {
            case 'w':
                goalTop = Math.max(goalTop - step, 0); // Move up
                break;
            case 's':
                goalTop = Math.min(goalTop + step, gameContainer.clientHeight - goal.clientHeight); // Move down
                break;
            case 'a':
                goalLeft = Math.max(goalLeft - step, 0); // Move left
                break;
            case 'd':
                goalLeft = Math.min(goalLeft + step, gameContainer.clientWidth - goal.clientWidth); // Move right
                break;
        }

        goal.style.top = goalTop + 'px';
        goal.style.left = goalLeft + 'px';

        if (checkCollision(ball, goal)) {
            currentLevel++;
            updateLevelDisplay();
            const nextLevel = currentLevel + 1;
            alert(`Congratulations! You've reached level ${currentLevel}. Moving on to level ${nextLevel}!`);
            placeElementsRandomly();
        }
    });

    function checkCollision(ball, target) {
        const ballRect = ball.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();
        return !(ballRect.right < targetRect.left ||
                 ballRect.left > targetRect.right ||
                 ballRect.bottom < targetRect.top ||
                 ballRect.top > targetRect.bottom);
    }
});
