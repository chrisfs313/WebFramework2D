function NGBulletFactory() {
    
    var mBullets = [];
    var mGameInstance

    var mSpriteBatcher;

    this.GetGameInstance = function () { return mGameInstance; }
    this.GetBatcher = function () { return mSpriteBatcher; }

    this.Initialize = function (gameInstance) {
        mGameInstance = gameInstance;

        mSpriteBatcher = new NSpriteBatcher('../www/asset/spSpriteSheetGameElements.png');
    }

    this.CreateBullet = function (bulletType, x, y, direction, speed) {
        var bullet = undefined;

        switch (bulletType) {
            case ProyectileTypeEnum.Player:
                bullet = new NGPlayerBullet(this);
                bullet.Initialize(x, y, direction, speed);
                bullet.GetSprite().SetSpriteBatch(mSpriteBatcher);
                break;
        }

        if (bullet != undefined) {
            mBullets.push(bullet);
        }
    }

    this.CreateMissile = function (missileType, x, y, turnFactor, speed) {
        var bullet = undefined;

        switch (missileType) {
            case ProyectileTypeEnum.MissileEnemy:
                bullet = new NGEnemyHomingMissile(this, mGameInstance.GetPlayer());
                bullet.Initialize(x, y, turnFactor, speed);
                bullet.GetAnimator().SetSpriteBatch(mSpriteBatcher);
                break;
        }

        if (bullet != undefined) {
            mBullets.push(bullet);
        }
    }

    this.Update = function (args) {
        mSpriteBatcher.BeginDraw();

        for (var i = 0; i < mBullets.length; i++) {
            var bullet = mBullets[i];

            if (!bullet.GetIsWaitingForDelete()) {
                bullet.Update(args);
            }
            else {
                bullet.Destroy();
                mBullets.splice(i, 1);
                i--;
            }
        }

        mSpriteBatcher.EndDraw();
        mSpriteBatcher.Update(args);
    }
}