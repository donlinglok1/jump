class Doodler {
  constructor(left, right) {
    this.x = width / 2;
    this.y = height / 2;
    this.height = 60;
    this.width = 40;

    this.velocity = 0;
    this.gravity = 0.1;
    this.jumpForce = 9;

    this.left = left;
    this.right = right;

    this.goingLeft = true;
  }

  draw() {
    //rect(this.x, this.y, this.width, this.height);

    if (this.goingLeft) {
      image(this.left, this.x, this.y, this.width, this.height);
    } else {
      image(this.right, this.x, this.y, this.width, this.height);
    }
  }

  update() {
    this.velocity += this.gravity;
    this.y += this.velocity;
    if (this.x + this.width < 0) this.x = width; 
    if (this.x > width) this.x = -this.width;

    // TODO Play around with the moving left/right, you could use lerp to make this a lot smoother
    if (keyIsDown(LEFT_ARROW)) {
      this.x -= 4;
      this.goingLeft = true;
    }

    if (keyIsDown(RIGHT_ARROW)) {
      this.x += 4;
      this.goingLeft = false;
    }

    for (let platform of platforms) {
      if (this.y + this.height >= platform.y && this.y + this.height <= platform.y + platform.height) {
        let minX = platform.x - this.width;
        let maxX = platform.x + platform.width;

        // TODO Master the hit detection, the Doodler has a big nose which throws off the hit detection a little
        if (this.x >= minX && this.x <= maxX) {
          this.jump();
        }
      }
    }

    if (this.velocity < -9) this.velocity = -9;

    if (platforms[0].y > doodler.y + 400) {
      platforms.splice(0, 1);
      score++;
      if(score>highScore) highScore = score;
    }
  }

  jump() {
    this.velocity -= this.jumpForce;
    //TODO Fiddle with the jump force make it more responsive
  }
}

class Platform {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.height = 15;
    this.width = 60;
  }

  draw() {
    fill(100, 255, 100);
    image(plat, this.x, this.y, this.width, this.height);
  }
}

let bg;
let doodlerLeft;
let doodlerRight;
let plat;
let doodler;
var highScore;
var score;
let gap;
let platforms;
function setup() {
  createCanvas(400, 600);

  bg = loadImage('bg.png');
  doodlerLeft = loadImage('doodler-left.png');
  doodlerRight = loadImage('doodler-right.png');
  plat = loadImage('platform.png');
  doodler = new Doodler(doodlerLeft, doodlerRight);
  platforms = [];
  score = 0;

  // create the platforms
  let platformCount = 6;
  gap = height / platformCount;
  for (let i = 1; i < 6; i++) {
    platforms.push(new Platform(random(width), height - i * gap))
  }
  
  // TODO Add in aliens!
}

function draw() {
  image(bg, 0, 0);
  console.log(doodler.y)
  if(doodler.y > 1000){ 
    // dead
  }else{
    translate(0, width / 2 - doodler.y);

    doodler.draw();
    doodler.update(platforms);

    // draw our new platforms
    for (let platform of platforms) {
      platform.draw();
    }

    // create more platforms as the doodler moves up the screen
    if (doodler.y < platforms[platforms.length - 1].y + 200) {
      platforms.push(new Platform(random(width), platforms[platforms.length - 1].y - gap));
    }
  }

  push();
  fill(255, 255, 255)
  textSize(30);
  textAlign(CENTER);
  text("score: "+score, width / 2, doodler.y - 150);
  text("highScore: "+highScore, width / 2, doodler.y - 120);
  pop();
}

function keyPressed() {
  if (key == ' ') {
    doodler.jump();
  }
  if (key == 'r' || key == 'R') {
    setup();
  }
}
