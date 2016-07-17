function NGDummyEnemy(enemyFactoryInstance) {
    var mEnemyFactoryInstance = enemyFactoryInstance;

    var mIsWaitingForDelete = false;
    var mDirection;
    var mSpeed;
    var mSprite;
    var mHealth = 3;
    var mICreationMissile;

    this.GetSprite = function () { return mSprite; }
    this.GetIsWaitingForDelete = function () { return mIsWaitingForDelete; }

    this.Initialize = function (x, y) {
        var direction = new NVector2();
        direction.x = -1;
        direction.y = 0;

        mDirection = direction;
        mSpeed = 100;

        var imageContent = NOctopusFramework.Instance().GetContentManagment().GetImage('../www/asset/spSpriteSheetGameElements.png');

        mSprite = new NSprite(x, y);
        mSprite.SetImageContent(imageContent);
        mSprite.rotation = -Math.PI / 2;
        mSprite.scaleX = 1;
        mSprite.scaleY = 1;
        mSprite.SetAdvanceAnimationTileConfig(1123, 190, 32, 32);

        var collWidth = mSprite.GetWidth() * mSprite.scaleX;
        var collHeight = mSprite.GetHeight() * mSprite.scaleY;

        var primitiveQuad = mSprite.CreateCollision(0, 0, collWidth, collHeight, new NColor("1,1,0,0"));
        primitiveQuad.offsetX = -collWidth / 2;
        primitiveQuad.offsetY = -collHeight / 2;

        mICreationMissile = new NInterval();
        mICreationMissile.Initialize(2, 20);
        mICreationMissile.AddListener_OnFinishedLoop(this.OnFinishedLoop_CreationMissile);
    }

    this.OnFinishedLoop_CreationMissile = function () {
        var rnd = NMath.Random(0, 100);
        
        if (rnd > 70) {
            var turnFactor = 0.7;
            var speed = 200;
            
            mEnemyFactoryInstance.GetGameInstance().GetBulletFactory().CreateMissile(
                ProyectileTypeEnum.MissileEnemy, mSprite.x, mSprite.y, turnFactor, speed);
        }
    }

    this.OnHit = function (damage) {
        mHealth -= damage;

        if (mHealth <= 0) {
            mIsWaitingForDelete = true;

            var enemyEffect2D = mEnemyFactoryInstance.GetGameInstance().GetEffectFactory().CreateEffect2D(
                '../www/asset/spSpriteSheetGameElements.png', mSprite.x, mSprite.y, 8, 3);
            enemyEffect2D.GetAnimator2D().SetAdvanceAnimationTileConfig(0, 0, 1024, 384);
            enemyEffect2D.GetAnimator2D().scaleX = 0.5;
            enemyEffect2D.GetAnimator2D().scaleY = 0.5;
        }
    }
    
    this.Update = function (args) {
        if (mICreationMissile != undefined) {
            mICreationMissile.Update(args);
        }
        
        mSprite.x += mDirection.x * mSpeed * args.dt;
        mSprite.y += mDirection.y * mSpeed * args.dt;
        mSprite.Update(args);

        if (mSprite.x < -mSprite.GetWidth()) {
            mIsWaitingForDelete = true;
        }
    }

    this.Destroy = function () {
        mSprite.Destroy();
        mSprite = undefined;

        mDirection = undefined;
    }
}