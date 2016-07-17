function NInterval() {
    
    var mCurrentTime;
    var mIntervalTimeMS;
    var mLoops;
    var mCurrentLoop;

    var mOnFinishedLoopCallback;
    var mOnFinishedIntervalCallback;

    this.Initialize = function (intervalTimeInSeconds, loops) {
        mCurrentTime = 0;
        mCurrentLoop = 0;
        mLoops = loops;
        mIntervalTimeMS = intervalTimeInSeconds;
    }

    this.AddListener_OnFinishedLoop = function (onFinishedLoopCallback) {
        mOnFinishedLoopCallback = onFinishedLoopCallback;
    }

    this.AddListener_OnFinishedInterval = function (onFinishedIntervalCallback) {
        mOnFinishedIntervalCallback = onFinishedIntervalCallback;
    }

    this.Update = function (args) {
        if (mCurrentLoop < mLoops) {
            mCurrentTime += args.dt;

            if (mCurrentTime >= mIntervalTimeMS) {
                mCurrentTime = 0;
                mCurrentLoop++;
                
                if (mCurrentLoop == mLoops) {
                    if (mOnFinishedIntervalCallback != undefined) {
                        mOnFinishedIntervalCallback();
                    }
                }
                else {
                    if (mOnFinishedLoopCallback != undefined) {
                        mOnFinishedLoopCallback();
                    }
                }
            }
        }
    }

    this.Destroy = function () {
        mOnFinishedIntervalCallback = null;
        mOnFinishedLoopCallback = null;
    }
}