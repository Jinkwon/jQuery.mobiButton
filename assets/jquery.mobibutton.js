(function($){

	var nTimer;
	var elOrg = null;

	var nOptDelay;
	var nOptBoundary;
	var cb;

	jQuery.fn.mobiButton = function(htOptions){

		htOptions = jQuery.extend({
			nOptDelay : 100,
			nOptBoundary : 90
		}, htOptions);

		nOptDelay = htOptions.nOptDelay;
		nOptBoundary = htOptions.nOptBoundary;

		cb = function(){
			$(this).trigger('click');
		};

		$(document).on('touchstart', 'input', function(we){
			elOrg = we.target;

			$(document)
				.off('touchstart', _returnFalse)
				.off('touchmove',  _onMove)
				.off('touchend touchcancel', 'input', _onCancel);

			$(document).on('touchend touchcancel', 'input', _onCancel);

			$(elOrg).removeClass('active');
			clearTimeout(nTimer);
			nTimer = setTimeout(function(){
				$(elOrg).addClass('active');
				$(document)
					.on('touchmove', _onMove)
					.on('touchstart', _returnFalse);
			}, nOptDelay);
		});
	};

	var _returnFalse = function(){
		return false;
	};var elOrg = null;

	var checkInBound = function($el, nX, nY, nBnd){
		var htElPos = $el.position();
		var nX1 = htElPos.left - nX;
		var nX2 = nX - (htElPos.left + $el.outerWidth());
		var nY1 = htElPos.top - nY;
		var nY2 = nY - (htElPos.top + $el.outerHeight());

		return nBnd > nX1 && nBnd > nX2 && nBnd > nY1 && nBnd > nY2;
	};

	var checkOnHover = function(htTouch){
		var bInBound = checkInBound($(elOrg), htTouch.pageX, htTouch.pageY, nOptBoundary);
		var el = document.elementFromPoint(htTouch.clientX, htTouch.clientY);
		return (el === elOrg || bInBound);
	};

	var _onMove = function(we){
		clearTimeout(nTimer);
		if(elOrg === null) return;

		var htTouch = we.originalEvent.touches[0];

		if(checkOnHover(htTouch)){
			$(elOrg).addClass('active');
			return false;
		} else{
			$(elOrg).removeClass('active');
		}
	};

	var _onCancel = function(we){
		clearTimeout(nTimer);
		var htTouch = we.originalEvent.changedTouches[0];

		if(checkOnHover(htTouch) && $(elOrg).hasClass('active')){
			if(cb){
				cb.apply(this, [we.originalEvent]);

			}
		}

		$(we.target).removeClass('active');
		$(document).off('touchstart', _returnFalse);
		elOrg = null;
	};

})(jQuery);