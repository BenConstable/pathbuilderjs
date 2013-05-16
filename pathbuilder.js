(function () {




/*
 * PathBuilder.js
 *
 * Easily modify parameters in paths.
 *
 * This is useful when using routing frameworks like Backbone.js or Path.js.
 *
 * See https://github.com/BenConstable/pathbuilderjs/ for documentation.
 */
function PathBuilder() {




    // Store a reference to this for inner functions
    var that = this;




    var _prefix = '',
        _path = [],
        _delimiter = '/',
        _delimiterLength = _delimiter.length,
        _ordering = [],
        _hasLeadingDelimiter = false,
        _hasTrailingDelimiter = false,
        _cachedObject;




    /*
     * Set or get the current delimeter.
     *
     * The path is reset if the delimiter is set.
     */
    this.delimiter = function (delimiter) {
        if (!arguments.length) return _delimiter;
        _delimiter = delimiter;
        _delimiterLength = delimiter.length;
        _path = [];
        _cachedObject = undefined;
        return this;
    };




    /*
     * Set or get the ordering array.
     */
    this.ordering = function (ordering) {
        if (!arguments.length) return _ordering;
        _ordering = ordering;
        return this;
    };




    /*
     * Set or get a parameter.
     *
     * Set value to `false` to remove key.
     */
    this.param = function (key, value) {
        if (arguments.length === 1) {
            return that.toObject()[key];
        } else {
            var indices = [],
                start = 0,
                index;

            while ((index = _path.indexOf(key, start)) > -1) {
                indices.push(index);
                start = index + 1;
            }

            if (indices.length) {
                for (var i = 0; i < indices.length; i++) {
                    if ((indices[i] % 2) === 0) {
                        if (value !== false) {
                            _path.splice(indices[i] + 1, 1, value);
                        } else {
                            _path.splice(indices[i], 2);
                        }
                    }
                }
            } else {
                if (value !== false) {
                    _path.push(key, value);
                }
            }

            _cachedObject = undefined;

            return that;
        }
    };




    /*
     * Set or get the path.
     */
    this.path = function (path) {
        return !arguments.length ? _getPath() : _setPath(path);
    };




    /*
     * Set or get the prefix string.
     */
    this.prefix = function (prefix) {
        if (!arguments.length) return _prefix;
        _prefix = prefix;
        return this;
    };




    /*
     * Get the current path as an object.
     */
    this.toObject = function () {
        if (typeof _cachedObject === 'undefined') {
            var obj = {};

            for (var i = 0; i < _path.length; i += 2) {
                obj[_path[i]] = _path[i + 1];
            }

            _cachedObject = obj;
        }

        return _cachedObject;
    };




    /*
     * Get the path.
     */
    function _getPath() {
        var object = that.toObject(),
            p = _hasLeadingDelimiter ? _delimiter : '';

        // Add explicitly-ordered params first
        for (var i = 0; i < _ordering.length; i++) {
            var key = _ordering[i];
            if ((typeof object[key] !== 'undefined') && object[key] !== '') {
                p += key + _delimiter + object[key] + _delimiter;
                delete object[key];
            }
        }

        // Add the rest of the params
        for (var jey in object) {
            if (object[jey] !== '') {
                p += jey + _delimiter + object[jey] + _delimiter;
            }
        }

        if (!_hasTrailingDelimiter) {
            p = p.substring(0, p.length - _delimiterLength);
        }

        return _prefix + p;
    }




    /*
     * Set the path.
     */
    function _setPath(path) {
        if (_prefix.length) {
            if (path.indexOf(_prefix) === 0) {
                path = path.substring(_prefix.length);
            } else {
                throw new Error('Prefix set, but could not be found in path');
            }
        }

        _hasLeadingDelimiter =
            path.substring(0, _delimiterLength) === _delimiter,
        _hasTrailingDelimiter = 
            path.substring(path.length - _delimiterLength) === _delimiter;
        
        if (_hasLeadingDelimiter) {
            path = path.substring(_delimiterLength, path.length);
        }

        if (_hasTrailingDelimiter) {
            path = path.substring(0, path.length - _delimiterLength);
        }

        _path = path.split(_delimiter);
        _cachedObject = undefined;

        return that;
    }
}




PathBuilder.VERSION = '0.2.0';




// Export for Node and the browser
var root = this;
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = new PathBuilder();
} else {
    root.PathBuilder = PathBuilder;
}




}).call(this);
