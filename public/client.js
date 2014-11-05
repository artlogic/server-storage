var serverStorage = (function($) {
    var pub = {};

    // TODO: figure out the proper api key

    pub.clear = function() {
    }

    pub.key = function(index) {
	return 'keytext';
    }

    pub.getItem = function(key) {
	return 'valuetext';
    }

    pub.setItem = function(key, value) {
    }

    pub.removeItem = function(key) {
    }

    return pub;
})(jQuery);
