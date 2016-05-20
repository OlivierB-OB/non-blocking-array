
(function () {

    var STEP_STOP = 15;

    var root = typeof self == 'object' && self.self === self && self ||
            typeof global == 'object' && global.global === global && global ||
            this;

    var previousNba = root.nba;

    var nba = function(array) {
        if (!array.hasOwnProperty('length')) throw new TypeError('Expecting an array...');
        return new Nba(array);
    };

    nba.noConflict = function() {
        root.nba = previousNba;
        return this;
    };

    if (typeof exports != 'undefined' && !exports.nodeType) {
        if (typeof module != 'undefined' && !module.nodeType && module.exports) {
            exports = module.exports = nba;
        }
        exports.nba = nba;
    } else {
        root.nba = nba;
    }

    function Nba (array, previous) {
        this.array = array;
        this.previous = previous || null;
        this.operation = null;
    }

    Nba.prototype.then = function (success, error) {
        if (!this.previous) {
            startExecution.call(this, success, error, this.array);
        }
        else {
            this.previous.then(startExecution.bind(this, success, error), error);
        }
    };

    function startExecution (success, error, array) {
        if (!this.operation) {
            success(array);
        }
        else {
            this.operation(success, error, array);
        }
    }

    Nba.prototype.sort = function (comparator) {
        comparator = comparator || defaultComparator;
        this.operation = function (success, error, array) {
            try {
                quickSort(array, 0, array.length - 1, comparator, success, error);
            } catch (e) {
                if (!error) throw e;
                error(e);
            }
        };
        return new Nba(this.array, this);
    };

    Nba.prototype.reverse = function (comparator) {
        this.operation = function (success, error, array) {
            var i = 0,
                j = array.length - 1,
                start;
            (function step () {
                try {
                    start = new Date();
                    while (i < j) {
                        if (mustStop(step, start)) return;
                        swap(array, i, j);
                        i++;
                        j--;
                    }
                    success(array);
                } catch (e) {
                    if (!error) throw e;
                    error(e);
                }
            })();
        };
        return new Nba(this.array, this);
    };

    Nba.prototype.forEach = function (action, that) {
        that = that || root;
        this.operation = function (success, error, array) {
            var i = 0,
                start;
            (function step () {
                try {
                    start = new Date();
                    while (i < array.length) {
                        if (mustStop(step, start)) return;
                        action.call(that, array[i], i, array);
                        i++;
                    }
                    success(array);
                } catch (e) {
                    if (!error) throw e;
                    error(e);
                }
            })();
        };
        return new Nba(this.array, this);
    };

    Nba.prototype.filter = function (action, that) {
        that = that || root;
        this.operation = function (success, error, array) {
            var i = 0,
                start,
                result = [];
            (function step () {
                try {
                    start = new Date();
                    while (i < array.length) {
                        if (mustStop(step, start)) return;
                        if (action.call(that, array[i], i, array)) result.push(array[i]);
                        i++;
                    }
                    success(result);
                } catch (e) {
                    if (!error) throw e;
                    error(e);
                }
            })();
        };
        return new Nba(this.array, this);
    };

    Nba.prototype.map = function (action, that) {
        that = that || root;
        this.operation = function (success, error, array) {
            var i = 0,
                start,
                result = [];
            (function step () {
                try {
                    start = new Date();
                    while (i < array.length) {
                        if (mustStop(step, start)) return;
                        result.push(action.call(that, array[i], i, array));
                        i++;
                    }
                    success(result);
                } catch (e) {
                    if (!error) throw e;
                    error(e);
                }
            })();
        };
        return new Nba(this.array, this);
    };

    Nba.prototype.some = function (action, that) {
        that = that || root;
        this.operation = function (success, error, array) {
            var i = 0,
                start,
                result = false;
            (function step () {
                try {
                    start = new Date();
                    while (i < array.length) {
                        if (mustStop(step, start)) return;
                        result = !!action.call(that, array[i], i, array);
                        if (result) break;
                        i++;
                    }
                    success(result);
                } catch (e) {
                    if (!error) throw e;
                    error(e);
                }
            })();
        };
        return new Nba(this.array, this);
    };

    Nba.prototype.every = function (action, that) {
        that = that || root;
        this.operation = function (success, error, array) {
            var i = 0,
                start,
                result = true;
            (function step () {
                try {
                    start = new Date();
                    while (i < array.length) {
                        if (mustStop(step, start)) return;
                        result = !!action.call(that, array[i], i, array);
                        if (!result) break;
                        i++;
                    }
                    success(result);
                } catch (e) {
                    if (!error) throw e;
                    error(e);
                }
            })();
        };
        return new Nba(this.array, this);
    };

    Nba.prototype.reduce = function (action, initial) {
        this.operation = function (success, error, array) {
            var i = 0,
                start,
                result = initial;
            (function step () {
                try {
                    start = new Date();
                    while (i < array.length) {
                        if (mustStop(step, start)) return;
                        result = action.call(root, result, array[i], i, array);
                        i++;
                    }
                    success(result);
                } catch (e) {
                    if (!error) throw e;
                    error(e);
                }
            })();
        };
        return new Nba(this.array, this);
    };

    function mustStop(operation, start) {
        if (new Date() - start < STEP_STOP) return false;
        setTimeout(operation, 0);
        return true;
    }

    function quickSort (array, low, high, comparator, success, error) {
        if (low >= high) {
            success(array);
            return;
        }
        partition(array, low, high, comparator, function (pivot) {
            quickSort(array, low, pivot, comparator, function () {
                quickSort(array, pivot+1, high, comparator, success, error);
            }, error);
        }, error);
    }

    function partition(array, low, high, comparator, success, error) {
        var pivot = array[low],
            i = low - 1,
            j = high + 1,
            start;
        (function step () {
            try {
                start = new Date();
                while (true) {
                    if (mustStop(step, start)) return;
                    do {
                        i++;
                    } while (comparator(array[i], pivot) < 0);
                    do {
                        j--;
                    } while (comparator(array[j], pivot) > 0);
                    if (i >= j) break;
                    swap(array, i, j);
                }
                success(j);
            } catch (e) {
                if (!error) throw e;
                error(e);
            }
        })();
    }

    function swap (array, i, j) {
        var tmp = array[i];
        array[i] = array[j];
        array[j] = tmp;
    }

    function defaultComparator (a, b) {
        return a.toString() < b.toString() ? -1 :
            b.toString() < a.toString() ? 1 : 0;
    }

})();
