class Player {
    constructor(x, y, imageSource) {
        this.x = x;
        this.y = y;
        this.ship = new Image();
        this.ship.src = imageSource;
        this.lives = 3;
    }
}

class Bullet {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Enemy {
    constructor(x, y, imageSource) {
        this.x = x;
        this.y = y;
        this.alive = true;
        this.ship = new Image();
        this.ship.src = imageSource;
    }
}

let canvas;
let ctx;
let buffer;

let player;

let bullets = [];
let enemyBullets = [];
let enemies = [];
let level;
let lives;
let score = 0;

let gamestate = 0;

function initBackground() {
    ctx.fillStyle = 'silver';
}

function initElements() {

    canvas = document.createElement("canvas");

    canvas.width = 500;
    canvas.height = 500;

    ctx = canvas.getContext("2d");
    buffer = canvas.getContext("2d");

    document.body.appendChild(canvas);
}

function drawBackground() {

    var background = new Image();
    background.src = "sky.jpg"
    background.onload = function () {
        ctx.drawImage(background, 0, 0);
    }

}


let oldTime = 0;

function playerInput(e) {
    let time = new Date;
    time = time.getTime();

    enemyInput(e);

    enemyInput();

    if (e.keyCode == "65")
        player.x -= 5;

    else if (e.keyCode == "68")
        player.x += 5;

    else if (e.keyCode == "32") {
        if (time - oldTime > 500) {
            bullets.push(new Bullet(player.x, player.y));
            oldTime = time;
            collisionEnemy();
            updateBullets();
        } else {
            return
        }
    }
}



function drawPlayer() {
    buffer.drawImage(player.ship, player.x - 20, player.y, 40, 20);
}


function drawBullets() {
    if (bullets.length == 0)
        return;

    for (let i = 0; i < bullets.length; i++) {
        buffer.beginPath();
        buffer.arc(bullets[i].x, bullets[i].y, 2, 0, 2 * Math.PI);
        buffer.stroke();
    }
    updateBullets();
}


oldTime = 0;
let enemyBulletTime = 0;
let heroBulletTime = 0;



function draw(time) {
    drawBackground();

    writeScore();

    let newTime = time - oldTime;
    let newTimeHero = time - heroBulletTime;


    if (gamestate == 0) {

        if (newTimeHero > 10) {
            drawPlayer();
            heroBulletTime = time;
        }
        if (newTime > 2000) {
            updateEnemy();
            oldTime = time;
        }

        drawPlayer();
        drawBullets();
        drawEnemies();
        drawEnemyBullets();


        if (enemies.length == 0 && gamestate == 1) {
            level++;
            levelEnemy(); 
            gamestate = 0;
        }
        window.requestAnimationFrame(draw);

    }
    if (gamestate == -1) {
        console.log('gameover');
       gameover();
    }


}


function levelEnemy() {
    for (let j = 0; j < level * 2; j++)
        for (let i = 0; i < 6; i++) {
            let enemy = new Enemy(50 * (i + 1) + 20, 30 * (j + 1), "ship.png");
            enemies.push(enemy);
        }
}

let enemyMove = 0;


function updateEnemy() {

    for (let i = 0; i < enemies.length; i++) {
        if (enemies[i].alive == false) {
            enemies.splice(i, 1);
            continue;
        }
        enemies[i].y += 5;
        if (enemyMove == 0) {
            enemies[i].x += 30;
        } else {
            enemies[i].x -= 30;
        }
    }
    if (enemies.length == 0) {
        gamestate = 1;
    }

    if (enemyMove == 0) {
        enemyMove = 1;
    } else {
        enemyMove = 0;
    }


}


function updateBullets() {

    for (let i = 0; i < bullets.length; i++) {
        bullets[i].y -= 3;

        if (bullets[i].y <= 0) {
            bullets.splice(i, 1);
            continue;
        }

        if (collisionEnemy(bullets[i].x, bullets[i].y)) {
            bullets.splice(i, 1);
        }

    }

}

function updateEnemyBullets(idx) {

    for (let i = 0; i < enemyBullets.length; i++) {
        enemyBullets[i].y += 3;


        if (collisionHero(enemyBullets[i].x, enemyBullets[i].y)) {
            enemyBullets.splice(i, 1);
            continue;
        }

        if (enemyBullets[i].y >= player.y) {
            enemyBullets.splice(i, 1);
        }
    }

    if (idx != -1) {
        enemyBullets.push(new Bullet(enemies[idx].x + 30, enemies[idx].y,));
        updateBullets();
    }


}

function drawEnemyBullets() {

    if (enemyBullets.length == 0)
        return;

    for (let i = 0; i < enemyBullets.length; i++) {
        buffer.beginPath();
        buffer.arc(enemyBullets[i].x, enemyBullets[i].y, 2, 0, 2 * Math.PI);
        buffer.stroke();
    }

    updateEnemyBullets(-1);
}

function drawEnemies() {
    for (let i = 0; i < enemies.length; i++) {
        buffer.drawImage(enemies[i].ship, enemies[i].x, enemies[i].y, 40, 20);
    }
}

function collisionEnemy(x, y) {
    if (enemies.length == 0) {
        gamestate = 1;
        return
    }
    for (let j = enemies.length - 1; j > -1; j--) {


        if (x < (enemies[j].x + 70)
            && x > enemies[j].x
            && y < (enemies[j].y + 50)
            && y > enemies[j].y
            && enemies[j].alive) {
            enemies[j].alive = false;
            updateEnemy();
            score += 3;
            return 1;

        }
    }
}

function collisionHero(x, y) {


    if (x < (player.x + 70)
        && x > player.x
        && y < (player.y + 50)
        && y > player.y) {
        player.lives -= 1;
        if (player.lives <= 0)
            gamestate=-1;
        return 1;
    }

}


function enemyInput(e) {
    for (i = 0; i < enemies.length; i++) {
        if (Math.floor(Math.random() * 30) + 1 == 4) {
            enemyBullets.push(new Bullet(enemies[i].x, enemies[i].y));
            updateEnemyBullets(i);
        }

    }
}

function writeScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText("Score: " + score, 400, 20);

    ctx.fillText("level: " + level, 10, 20);
}

function gameover() {
  
    ctx.font = "20px Arial";
    ctx.textAlign= 'center';
    ctx.fillStyle = "#FFFFFF";

	ctx.fillText("GAME OVER!", 230, 100);

	ctx.fillText("YOUR SCORE: "+ score, 230, 150);

    ctx.fillText("YOUR LEVEL: "+ level, 230, 170);

    window.requestAnimationFrame(gameover);

}

function init() {

    document.addEventListener('keydown', playerInput);
    initElements();
    initBackground();
    player = new Player(canvas.width / 2, canvas.height - 30, "ship.png");
    level = 1;
    levelEnemy();

    draw();


}