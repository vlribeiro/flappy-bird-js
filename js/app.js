let flappy = (function () {
  let canvas, context;

  // Flappy Bird
  const flappyBird = {
    x: 10,
    y: 50,
    height: 24,
    width: 36,
    speed: 0,
    gravity: 0.25,
    update() {
      this.speed += this.gravity;
      this.y += this.speed;
      console.log(this.speed);
    },
    draw() {
      context.beginPath();
      context.arc(
        this.x + this.width / 2,
        this.y + this.height / 2,
        this.width / 2,
        0,
        2 * Math.PI
      );

      context.fillStyle = "#f6e05e";
      context.lineWidth = 4;
      context.strokeStyle = "#ecc94b";

      context.fill();
      context.stroke();
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
    init() {
      this.width = canvas.width;
      this.y = canvas.height - this.height;
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
      context.lineWidth = 6;
      context.strokeStyle = "#2f855a";

      context.strokeRect(this.x, this.y, this.width, this.height);
      context.fillRect(this.x, this.y, this.width, this.height);
    },
  };

  let loop = function () {
    bg.init();
    floor.init();

    bg.draw();
    floor.draw();
    flappyBird.draw();

    flappyBird.update();

    requestAnimationFrame(loop);
  };

  return {
    init() {
      canvas = document.querySelector("#game-canvas");
      context = canvas.getContext("2d");

      requestAnimationFrame(loop);
    },
  };
})();

document.addEventListener("DOMContentLoaded", flappy.init);
