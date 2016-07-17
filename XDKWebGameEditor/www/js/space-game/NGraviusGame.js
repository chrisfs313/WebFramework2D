function NGraviusGame() {
    var mPlayer;
    var mBulletFactory;
    var mEnemyFactory;
    var mEffectFactory;

    this.GetPlayer = function () { return mPlayer; }
    this.GetBulletFactory = function () { return mBulletFactory; }
    this.GetEnemyFactory = function () { return mEnemyFactory; }
    this.GetEffectFactory = function () { return mEffectFactory; }

    this.Initialize = function () {
        mPlayer = new NPlayer();
        mPlayer.Initialize(this);

        mBulletFactory = new NGBulletFactory();
        mEnemyFactory = new NGEnemyFactory();
        mEffectFactory = new NEffect2DFactory();

        mBulletFactory.Initialize(this);
        mEnemyFactory.Initialize(this);
    }

    this.OnMouseMove = function (x, y) {
        mPlayer.OnMouseMove(x, y);
    }

    this.OnKeyDown = function (keyCode) {
        mPlayer.OnKeyDown(keyCode);
    }

    this.Update = function (args) {
        mBulletFactory.Update(args);
        mEnemyFactory.Update(args);

        mPlayer.Update(args);
        mEffectFactory.Update(args);
    }
}