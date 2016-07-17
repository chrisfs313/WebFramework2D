function NGEnemyFactory() {
    var mSelf = this;

    var mGameInstance;
    var mICreationEnemy;

    var mSpriteBatcher;

    var mEnemies = [];

    this.GetEnemies = function () { return mEnemies; }
    this.GetBatcher = function () { return mSpriteBatcher; }
    this.GetGameInstance = function () { return mGameInstance; }

    this.Initialize = function (gameInstance) {
        mGameInstance = gameInstance;

        mSpriteBatcher = new NSpriteBatcher('../www/asset/spSpriteSheetGameElements.png');

        mICreationEnemy = new NInterval();
        mICreationEnemy.Initialize(0.01, 100000000);
        mICreationEnemy.AddListener_OnFinishedLoop(this.OnFinishedLoop_CreationEnemy);
    }

    this.OnFinishedLoop_CreationEnemy = function () {
        var x = NOctopusFramework.GetAppWidth() + 40;
        var y = NMath.Random(0, NOctopusFramework.GetAppHeight());

        this.CreateEnemy(EnemyTypeEnum.Dummy, x, y);
    }

    CreateEnemy = function (enemyType, x, y) {
        var enemy = undefined;
        
        switch (enemyType) {
        case EnemyTypeEnum.Dummy:
            enemy = new NGDummyEnemy(mSelf);
            enemy.Initialize(x, y);
            enemy.GetSprite().SetSpriteBatch(mSpriteBatcher);
            break;
        }

        if (enemy != undefined) {
            mEnemies.push(enemy);
        }
    }

    this.Update = function (args) {
        if (mICreationEnemy != undefined) {
            mICreationEnemy.Update(args);
        }

        mSpriteBatcher.BeginDraw();


        for (var i = 0; i < mEnemies.length; i++) {
            var enemy = mEnemies[i];

            if (enemy != undefined) {
                if (!enemy.GetIsWaitingForDelete()) {
                    enemy.Update(args);
                }
                else {
                    enemy.Destroy();
                    enemy = undefined;

                    mEnemies.splice(i, 1);
                    i--;
                }
            }
        }

        mSpriteBatcher.EndDraw();
        mSpriteBatcher.Update(args);
    }
}