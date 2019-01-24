export default class Game extends Phaser.Scene {
  /**
   *  A sample Game scene, displaying the Phaser logo.
   *
   *  @extends Phaser.Scene
   */
  constructor() {
    super({key: 'Game'});

  }

  preload() {
    const x = this.cameras.main.width  / 2;
    const y = this.cameras.main.height / 4;

    this.gameState = 'nothing';
    this.bestResult = 999999;
    this.throwCount = 0;

    this.circle = this.add
      .image(x, y, 'circle')
      .setScale(0.253);

    this.text = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, 'Потяните камень \nв сторону дома', { font: '20px Arial', fill: '#666666', align: 'center'});
    this.text.setOrigin(0.5);
  }


  /**
   *  Called when a scene is initialized. Method responsible for setting up
   *  the game objects of the scene.
   *
   *  @protected
   *  @param {object} data Initialization parameters.
   */
  create(/* data */) {
    this.ball = this.physics.add.image(this.cameras.main.width / 2, 570, 'stone').setScale(0.23);
    this.ball.setCircle(75);
    this.ball.setCollideWorldBounds(true);
    this.ball.setBounce(1);
    this.ball.setVelocity(0);
    this.ball.setInteractive();

    this.input.setDraggable(this.ball);

    this.input.on('dragend', (pointer, gameObject) => {
      var speedX = -(gameObject.x - pointer.x) * 1.5;
      var speedY = -(gameObject.y - pointer.y) * 1.5;
      gameObject.setVelocity(speedX, speedY);
      this.gameState = 'ingame';
      this.throwCount++;
      this.text.text = '';
      // this.input.setDraggable(gameObject, false);
    });
    this.input.on('pointerdown',  () =>  {
      if (this.gameState == 'stopped') {
        if (this.throwCount >= 3) {
          if (!this.lastScreen) {
            this.lastScreen = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'last').setScale(0.585).setOrigin(0.5);
          } else {
            //API.send.BestResult
            this.lastScreen.destroy();
            this.gameState = 'nothing';
            this.bestResult = 999999;
            this.throwCount = 0;
            this.text.setFont('20px Arial');
            this.text.text = 'Потяните камень \nв сторону дома';
            this.ball.setX(this.cameras.main.width / 2);
            this.ball.setY(570);

          }
        } else {
          this.ball.setX(this.cameras.main.width / 2);
          this.ball.setY(570);
          this.text.text = '';
          this.gameState = 'nothing';
        }
      }
    });

  }



  /**
   *  Called when a scene is updated. Updates to game logic, physics and game
   *  objects are handled here.
   *
   *  @protected
   *  @param {number} t Current internal clock time.
   *  @param {number} dt Time elapsed since last update.
   */
  update(/* t, dt */) {
    // this.logo.update();
    var speedX = this.ball.body.velocity.x;
    var speedY = this.ball.body.velocity.y;

    speedX = speedX - 0.01 * speedX;
    speedY = speedY - 0.01 * speedY;

    if (speedX !== 0 || speedY !== 0) {
      this.ball.angle += 0.1 * Math.sqrt(speedX * speedX + speedY * speedY);
    }

    this.ball.setVelocity(speedX, speedY);

    if (this.gameState != 'nothing' && Math.abs(this.ball.body.velocity.x) < 5 && Math.abs(this.ball.body.velocity.y) < 5) {
      this.ball.setVelocity(0);
      this.gameState = 'stopped';
    }

    if (this.gameState == 'stopped') {
      this.bestResult = Math.min(this.bestResult, Math.floor(this.getDist(this.circle, this.ball)));
      this.input.on('pointerdown',  () =>  {

      });

      if (this.throwCount >= 3) {
        this.text.text = 'Best: ' + this.bestResult + '\n' ;
      }

      if (this.throwCount <= 2) {
        this.text.setFont('40px Arial');
        this.text.text = Math.floor(this.getDist(this.circle, this.ball)) + '\n tap to continue' ;
        this.bestResult = Math.floor(this.getDist(this.circle, this.ball));
      }
    }



    // this.sleep(100);

    // console.log(this.getDist(this.circle, this.ball));
  }

  getDist(point1, point2) {
    return Math.sqrt(this.sqr(point1.x - point2.x) +  this.sqr(point1.y - point2.y));
  }

  sqr(x) {
    return x * x;
  }
}
