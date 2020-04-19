let flappy = (function () {
  let canvas, context;

  function collides(obj1, obj2) {
    return obj1.y + obj1.width >= obj2.y;
  }

  const audio = {
    play(audioName) {
      const audio = new Audio(`./audio/${audioName}.wav`);
      audio.play();
    },
  };

  // Frame control
  const frameControl = {
    currentFrame: 0,
    update() {
      this.currentFrame = (this.currentFrame + 1) % Number.MAX_SAFE_INTEGER;
    },
  };

  // Util
  const Util = {
    range(start, end) {
      return Array(end - start + 1)
        .fill()
        .map((_, idx) => start + idx);
    },
  };

  // Flappy Bird
  const flappyBird = {
    x: 10,
    y: 50,
    diameter: 36,
    speed: 0,
    gravity: 0.25,
    jump: 4.6,
    alreadyCollided: false,
    wingPositions: [],
    init() {
      this.x = 10;
      this.y = 50;
      this.width = this.diameter;
      this.speed = 0;
      this.alreadyCollided = false;
      this.wingPositions = Util.range(-10, 10).concat(
        Util.range(-10, 10).reverse()
      );
    },
    update() {
      if (collides(flappyBird, floor)) {
        if (!this.alreadyCollided) {
          audio.play("hit-1");
          floor.speed = 0;
          this.alreadyCollided = true;
        }

        window.setTimeout(() => screens.activate(screens.start), 500);

        return;
      }

      this.speed += this.gravity;
      this.y += this.speed;
    },
    draw() {
      context.beginPath();
      context.arc(
        this.x + this.diameter / 2,
        this.y + this.diameter / 2,
        this.diameter / 2,
        0,
        2 * Math.PI
      );

      context.fillStyle = "#f6e05e";
      context.lineWidth = 4;
      context.strokeStyle = "#ecc94b";

      context.fill();
      context.stroke();

      context.beginPath();
      context.arc(
        this.x + this.diameter - 10,
        this.y + this.diameter / 2 - 6,
        2,
        0,
        2 * Math.PI
      );

      context.fillStyle = "#2d3748";
      context.lineWidth = 2;
      context.strokeStyle = "#f7fafc";

      context.fill();
      context.stroke();

      context.beginPath();
      context.moveTo(this.x + 6, this.y + this.diameter / 2);

      const frameToDraw = frameControl.currentFrame % this.wingPositions.length;

      context.bezierCurveTo(
        this.x + this.diameter / 2 - 4,
        this.y + this.diameter / 2 - this.wingPositions[frameToDraw],
        this.x + this.diameter / 2 + 4,
        this.y + this.diameter / 2 - this.wingPositions[frameToDraw],
        this.x + this.diameter - 6,
        this.y + this.diameter / 2
      );

      context.fillStyle = "#f6e05e";
      context.lineWidth = 4;
      context.strokeStyle = "#ecc94b";

      context.stroke();
      context.fill();

      context.beginPath();

      context.fillStyle = "#ed8936";
      context.lineWidth = 4;
      context.strokeStyle = "#dd6b20";

      const peckOffset = 4;
      context.moveTo(
        this.x + this.diameter,
        this.y + this.diameter / 2 - peckOffset
      );
      context.bezierCurveTo(
        this.x + this.diameter + 10,
        this.y + this.diameter / 2 - this.wingPositions[frameToDraw] / 5,
        this.x + this.diameter + 10,
        this.y + this.diameter / 2 - this.wingPositions[frameToDraw] / 5,
        this.x + this.diameter,
        this.y + this.diameter / 2 + peckOffset
      );

      context.fill();
      context.stroke();
    },
    pula() {
      this.speed = -this.jump;
    },
  };

  // Background
  const bg = {
    height: 0,
    width: 0,
    x: 0,
    y: 0,
    init() {
      this.width = canvas.width;
      this.height = canvas.height;
    },
    draw() {
      const gradient = context.createLinearGradient(
        this.x,
        this.y,
        this.x,
        this.height
      );
      gradient.addColorStop(0, "#90cdf4");
      gradient.addColorStop(1, "#63b3ed");

      context.fillStyle = gradient;

      context.fillRect(this.x, this.y, this.width, this.height);
    },
  };

  // Floor
  const floor = {
    height: 112,
    width: 0,
    x: 0,
    y: 0,
    patternContext: null,
    grassPerScreen: 40,
    grassHeight: 8,
    speed: 0.2,
    init() {
      this.speed = 0.2;
      this.width = canvas.width * 2;
      this.y = canvas.height - this.height;
      this.createPattern();
    },
    createPattern() {
      const patternCanvas = document.createElement("canvas");
      this.patternContext = patternCanvas.getContext("2d");

      patternCanvas.width = this.width / (2 * this.grassPerScreen);
      patternCanvas.height = this.grassHeight;

      this.patternContext.fillStyle = "#2f855a";
      this.patternContext.fillRect(
        0,
        0,
        patternCanvas.width,
        patternCanvas.height
      );

      this.patternContext.fillStyle = "#48bb78";
      this.patternContext.fillRect(
        0,
        1,
        patternCanvas.width / 2,
        patternCanvas.height - 2
      );
    },
    draw() {
      const gradient = context.createLinearGradient(
        this.x,
        this.y,
        this.x,
        canvas.height
      );
      gradient.addColorStop(0, "#276749");
      gradient.addColorStop(1, "#22543d");

      context.fillStyle = gradient;
      context.fillRect(this.x, this.y, this.width, this.height);

      this.patternContext.translate(this.x, 0);
      const pattern = context.createPattern(
        this.patternContext.canvas,
        "repeat"
      );

      pattern.setTransform(new DOMMatrix().translateSelf(this.x, 0, 0));

      context.fillStyle = pattern;
      context.fillRect(this.x, this.y, this.width, this.grassHeight);
    },
    update() {
      this.x = (this.x - this.speed) % (this.width / 2);
    },
    increaseSpeed() {
      this.speed += 0.2;
    },
  };

  // Start Screen
  const startScreen = {
    y: 120,
    title: "Welcome!",
    subtitle: "Tap to start",
    draw() {
      this.centerText(this.title, "bold 50px sans-serif", this.y);
      this.centerText(this.subtitle, "30px sans-serif", this.y + 120);
    },
    centerText(text, fontStyle, y) {
      context.font = fontStyle;
      context.fillStyle = "#c05621";

      const textMeasure = context.measureText(this.title);

      context.fillText(text, (canvas.width - textMeasure.width) / 2, y);
    },
  };

  //Screens
  const screens = {
    active: null,
    start: {
      init() {
        flappyBird.init();
        floor.init();
        bg.init();
      },
      update() {
        floor.update();
      },
      draw() {
        bg.draw();
        floor.draw();
        flappyBird.draw();
        startScreen.draw();
      },
      click() {
        screens.activate(screens.game);
      },
    },
    game: {
      init() {
        floor.increaseSpeed();
      },
      draw() {
        bg.draw();
        floor.draw();
        flappyBird.draw();
      },
      update() {
        flappyBird.update();
        floor.update();
      },
      click() {
        flappyBird.pula();
      },
    },
    activate(newScreen) {
      this.active = newScreen;

      if (this.active.init) this.active.init();
    },
  };

  //Interaction
  const interaction = {
    init() {
      document.addEventListener("click", this.click);
    },
    click(e) {
      if (screens.active.click) screens.active.click();
    },
  };

  let loop = function () {
    frameControl.update();
    screens.active.draw();

    if (screens.active.update) screens.active.update();

    requestAnimationFrame(loop);
  };

  return {
    init() {
      canvas = document.querySelector("#game-canvas");
      context = canvas.getContext("2d");

      interaction.init();

      screens.activate(screens.start);

      requestAnimationFrame(loop);
    },
  };
})();

document.addEventListener("DOMContentLoaded", flappy.init);
