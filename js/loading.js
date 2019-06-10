/*
    file name : loading.js
    description : loading ui object
	create date : 2017-07-20
	creator : saltgamer
*/
'use strict';
define(['$alt'],
	function ($alt) {
	'use strict';
    var loading = {
        loadingContainer: $alt.qs('#loadingContainer'),
        loadingIconAnimation: $alt.qs('.loadingIconAnimation'),
        show: function (targetObject) {
            this.loadingContainer.style.opacity = targetObject.opacity;
            this.loadingContainer.style.display = 'block';
            if (targetObject.showLoadingIcon) {
                this.loadingIconAnimation.style.display = 'block';
            } else {
                this.loadingIconAnimation.style.display = 'none';
            }
        },
        hide: function (targetObject) {
            this.loadingContainer.style.display = 'none';
            this.loadingIconAnimation.style.display = 'none';

        }
    };

    return loading;
});
