function NGameScene(params) {
    // calling base.constructor
    NBaseScene.call(this, params);

    var mGraviusGame;
    var mGameHud;

    this.Initialize = function (sceneManager) {
        NBaseScene.prototype.Initialize(sceneManager);

        // Load resources for this scene
        this.GetContentManagment().LoadImage('../www/asset/spSpriteSheetGameElements.png');

        setTimeout(function () {
            mGraviusGame = new NGraviusGame();
            mGameHud = new NGGameHud();

            mGraviusGame.Initialize();
            mGameHud.Initialize();

        }, 1250);
    }

    this.OnMouseMove = function (x, y) {
        NBaseScene.prototype.OnMouseMove(x, y);

        if (mGraviusGame != null) { mGraviusGame.OnMouseMove(x, y); }
    }

    this.OnMouseDown = function (event) {
        NBaseScene.prototype.OnMouseDown(event);
    }

    this.OnMouseUp = function (event) {
        NBaseScene.prototype.OnMouseUp(event);
    }

    this.OnKeyDown = function (keyCode) {
        NBaseScene.prototype.OnKeyDown(keyCode);

        if (mGraviusGame != null) { mGraviusGame.OnKeyDown(keyCode); }
    }

    this.OnKeyUp = function (keyCode) {
        NBaseScene.prototype.OnKeyUp(keyCode);
    }

    this.Update = function (args) {
        NBaseScene.prototype.Update(args);

        if (mGraviusGame != null) { mGraviusGame.Update(args); }
        if (mGameHud != null) { mGameHud.Update(args); }
    }
}