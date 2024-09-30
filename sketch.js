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
    text("Katamari Damacy Inspired", 300, 250);
    text("Minigame", 300, 280);
    textSize(15);
    text("Press any key to start", 300, 320);
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

  // circle collected
  for (let i = 0; i < circles.length; i++) {
    if (!circles[i].collected) {
      fill(255, 0, 0);
      ellipse(circles[i].x, circles[i].y, circles[i].size);

      // distance from sprite for score
      if (dist(sprite.x + sprite.size / 4, sprite.y + sprite.size / 4, circles[i].x, circles[i].y) < (sprite.size / 2 + circles[i].size / 2)) {
        circles[i].collected = true;
        attachedCircles.push(circles[i]);

        game.score++;

        //create more circles
        let newCircle = createNewCircle();
        circles.push(newCircle);  
      }
    }
  }

  // holding circle
  for (let i = 0; i < attachedCircles.length; i++) {
    let offset = i * 3; 
    let xPos = sprite.x + sprite.size / 3 + offset + random(-1,1);
    let yPos = sprite.y + sprite.size / 3 + offset  + random(-1,1);

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
