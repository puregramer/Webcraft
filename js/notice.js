/*
    file name : notice.js
    description : notice layer popup object
	create date : 2017-05-24
	creator : saltgamer
*/
define([],
	function () {
	'use strict';
    var notice = {
        append : function (params) {
            this.remove();

            var noticeContainer = $alt.ce({
                tag: 'div',
                id: 'noticeContainer',
                targetElement: document.body
            });
            noticeContainer.style.position = 'absolute';
            noticeContainer.style.top = '50%';
            noticeContainer.style.marginTop = '-120px';
            noticeContainer.style.width = '100%';
            noticeContainer.style.height = '100%';
            noticeContainer.style.textAlign = 'center';
            noticeContainer.style.zIndex = 100;

            var noticeCellArea = $alt.ce({
                tag: 'div',
                targetElement: noticeContainer
            });
            noticeCellArea.style.display = 'inline-block';

            var noticeBody = $alt.ce({
                tag: 'div',
                id: 'noticeBody',
                targetElement: noticeCellArea
            });
            noticeBody.style.width = '320px';
            noticeBody.style.height = '150px';
            noticeBody.style.backgroundColor = '#ebebeb';
            noticeBody.style.border = '1px solid #555';
            noticeBody.style.borderRadius = '5px';
            noticeBody.style.color = '#333';
            noticeBody.style.fontSize = '16px';
            noticeBody.style.lineHeight = '35px';
            noticeBody.style.opacity = 0;

            var noticeBodyText = $alt.ce({
                tag: 'div',
                html: params.noticeText,
                targetElement: noticeBody
            });
            noticeBodyText.style.marginTop = '30px';
            noticeBodyText.style.lineHeight = '25px';

            var noticeButtion = $alt.ce({
                tag: 'div',
                class: 'noticeButtion',
                html: params.buttonText,
                targetElement: noticeBody
            });
			noticeButtion.style.position = 'absolute';
			noticeButtion.style.left = '50%';
			noticeButtion.style.marginLeft = '-55px';
			noticeButtion.style.bottom = '20px';
			noticeButtion.style.width = '110px';
			noticeButtion.style.height = '35px';
			noticeButtion.style.backgroundColor = '#555';
			noticeButtion.style.color = '#fff';
			noticeButtion.style.cursor = 'pointer';
			noticeButtion.style.fontSize = '15px';
			noticeButtion.style.borderRadius = '5px';
			noticeButtion.addEventListener('click', params.clickEvent, false);

			if (params.type === 'confirm') {
				noticeButtion.style.marginLeft = '0px';
				noticeButtion.style.right = '40px';

                var noButton = $alt.ce({
                    tag: 'div',
                    html: params.noButtonText,
                    targetElement: noticeBody
                });
				noButton.style.position = 'absolute';
				noButton.style.left = '40px';
				noButton.style.bottom = '20px';
				noButton.style.width = '110px';
				noButton.style.height = '35px';
				noButton.style.backgroundColor = '#ccc';
				noButton.style.color = '#fff';
				noButton.style.cursor = 'pointer';
				noButton.style.fontSize = '15px';
				noButton.style.borderRadius = '5px';
				noButton.addEventListener('click', params.noButtonEvent, false);
			}

        },
        remove : function () {
            var noticeContainer = $alt.qs('#noticeContainer');

            if (noticeContainer) document.body.removeChild(noticeContainer);
        },
        show : function (params) {
            this.append(params);

//            $DT2017.animation.animate({
//                delay: 1,
//                duration: 400,
//                delta: $DT2017.animation.makeEaseInOut($DT2017.animation.aniEffect.bounce),
//                step: function (delta) {
//                    noticeBody.style.opacity = delta;
//                    noticeBody.style.transform = 'scale(' + delta + ')';
//                }
//            });
        },
        hide : function () {
            var opacityValue = 1;
//            $DT2017.animation.animate({
//                delay: 1,
//                duration: 100,
//                delta: $DT2017.animation.makeEaseInOut($DT2017.animation.aniEffect.quad),
//                step: function (delta) {
//                    opacityValue = opacityValue - delta;
//                    noticeBody.style.opacity = opacityValue;
//                    if (delta > 0.9) noticeContainer.style.display = 'none';
//                }
//            });
        }
    };
    return notice;
});
