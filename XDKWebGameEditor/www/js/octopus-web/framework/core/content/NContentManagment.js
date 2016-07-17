function NContentManagment(framework) {

    var mFrameworkInstance = framework;
    var mContentRepository = [];

    this.GetFramework = function () { return mFrameworkInstance; }

    this.Initialize = function () {

    }

    this.GetImage = function (path) {
        var resultObject = undefined;
        var contentCount = mContentRepository.length;

        for (var i = 0; i < contentCount; i++) {
            var content = mContentRepository[i];
            
            if (content != undefined) {
                if (content.GetPath() == path) {
                    resultObject = content;
                    break;
                }
            }
        }

        return resultObject;
    }

    this.LoadImage = function (path) {
        var imageContent = new NImageContent(this);
        imageContent.Initialize();
        imageContent.Load(path);

        mContentRepository.push(imageContent);

        console.log("NContentManagment::LoadImage> " + path);

        return imageContent;
    }

    this.UnloadImage = function (path) {

    }
}