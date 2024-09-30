let sprite;
let spriteImage;
let circles = [];
let attachedCircles = []; 
let backgroundImage;
let gameFont;

let GameState = {
  Start: 'start',
  Playing: 'playing',
  GameOver: 'gameOver'
};

let game = {
  score: 0,
  maxScore: 0,
  maxTime: 10,
  elapsedTime: 0,
  totalSprites: 10,
  state: GameState.Start
};

function preload() {
  spriteImage = loadImage('images/katamari.png');
  backgroundImage = loadImage('images/background.jpeg');
  gameFont = loadFont("images/PressStart2P-Regular.ttf");
}

function setup() {
  createCanvas(600, 600);
  textFont(gameFont);

  sprite = {
    x: 250,
    y: 250,
    size: 100,
    speed: 5
  };

  for (let i = 0; i < game.totalSprites; i++) {
    let newCircle = createNewCircle();
    circles.push(newCircle);
  }
}

function draw() {
  if (game.state === GameState.Start) {
    image(backgroundImage, 0, 0, width, height);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(20);
    text("Press any key to start", width / 2, height / 2);
    return;
  }

  if (game.state === GameState.Playing) {
    game.elapsedTime = floor((millis() / 1000)); 

    if (game.elapsedTime >= game.maxTime) {
      gameOver();
      return;
    }
  }

  image(backgroundImage, 0, 0, width, height);

  if (keyIsDown(LEFT_ARROW)) {
    sprite.x -= sprite.speed;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    sprite.x += sprite.speed;
  }
  if (keyIsDown(UP_ARROW)) {
    sprite.y -= sprite.speed;
  }
  if (keyIsDown(DOWN_ARROW)) {
    sprite.y += sprite.speed;
  }

  image(spriteImage, sprite.x, sprite.y, sprite.size, sprite.size);

  // the circle and sprite interaction space
  for (let i = 0; i < circles.length; i++) {
    if (!circles[i].collected) {
      fill(255, 0, 0);
      ellipse(circles[i].x, circles[i].y, circles[i].size);

      if (dist(sprite.x + sprite.size / 2, sprite.y + sprite.size / 2, circles[i].x, circles[i].y) < (sprite.size / 2 + circles[i].size / 2)) {
        circles[i].collected = true;
        attachedCircles.push(circles[i]);

        game.score++;

        let newCircle = createNewCircle();
        circles.push(newCircle);
      }
    }
  }

  // circle surrounding sprite
  for (let i = 0; i < attachedCircles.length; i++) {
    let angle = TWO_PI / attachedCircles.length * i; 
    let distanceFromSprite = sprite.size / 2 + attachedCircles[i].size / 2; 
    let xPos = sprite.x + sprite.size / 2 + cos(angle) * distanceFromSprite;
    let yPos = sprite.y + sprite.size / 2 + sin(angle) * distanceFromSprite;

    fill(255, 0, 0);
    ellipse(xPos, yPos, attachedCircles[i].size);
  }

  fill(255);
  textSize(24);
  text("Score: " + game.score, 480, 45);
  text("Time: " + (game.maxTime - game.elapsedTime), 100, 45);

  sprite.x = constrain(sprite.x, 0, width - sprite.size);
  sprite.y = constrain(sprite.y, 0, height - sprite.size);
}

// continous loading of circle drawn
function createNewCircle() {
  return {
    x: random(width),
    y: random(height),
    size: random(20, 40),
    collected: false
  };
}

function keyPressed() {
  if (game.state === GameState.Start) {
    game.state = GameState.Playing; 
  }
}

function gameOver() {
  game.state = GameState.GameOver; 
  image(backgroundImage, 0, 0, width, height);
  fill(255);
  textSize(32);
  textAlign(CENTER, CENTER);
  text("Final Score: " + game.score, width / 2, height / 2 + 20);
  noLoop(); 
}
