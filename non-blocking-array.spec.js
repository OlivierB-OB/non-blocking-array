
(function () {
    var nba = window.nba;

    var ARR_EMPTY = [],
        ARR_INT = [1, 2, 3],
        ARR_STR = ['a', 'b', 'c'],
        ARR_INT_BIG = Array.apply([], new Array(100000)).map(function (x, i) {
            return i;
        });
    var arr_empty, arr_int, arr_str, arr_int_big;

    function shuffle(arr) {
        arr.sort(function () {
            return Math.floor(Math.random() * 3) - 1;
        });
    }

    function wait (delay) {
        var start = new Date();
        while (new Date() - start < delay);
    }

    beforeEach(function () {
        arr_empty = ARR_EMPTY.slice(0);
        arr_int = ARR_INT.slice(0);
        arr_str = ARR_STR.slice(0);
        arr_int_big = ARR_INT_BIG.slice(0);
    });

    describe('non-blocking-array', function () {

        describe('exec', function () {
            it('1', function () {
                nba(arr_empty).then(function (arr) {
                    expect(arr).toBe(arr_empty);
                });
            });

            it('2', function () {
                nba(arr_int).then(function (arr) {
                    expect(arr).toBe(arr_int);
                });
            });

            it('3', function () {
                nba(arr_str).then(function (arr) {
                    expect(arr).toBe(arr_str);
                });
            });
        });

        describe('forEach', function () {
            it('1', function () {
                var result = [];
                nba(arr_empty).forEach(function (x) {
                    result.push(x);
                }).then(function () {
                    expect(arr_empty).toEqual(ARR_EMPTY);
                    expect(result).toEqual(ARR_EMPTY);
                    expect(result).not.toBe(arr_empty);
                });
            });

            it('2', function () {
                var result = [];
                nba(arr_int).forEach(function (x) {
                    result.push(x);
                }).then(function () {
                    expect(arr_int).toEqual(ARR_INT);
                    expect(result).toEqual(ARR_INT);
                    expect(result).not.toBe(arr_int);
                });
            });

            it('3', function () {
                var result = [];
                nba(arr_str).forEach(function (x) {
                    result.push(x);
                }).then(function () {
                    expect(arr_str).toEqual(ARR_STR);
                    expect(result).toEqual(ARR_STR);
                    expect(result).not.toBe(arr_str);
                });
            });

            it('4', function () {
                var result = [];
                var bool = true;
                nba(arr_int).forEach(function (x) {
                    wait(20);
                    result.push(bool);
                }).then(function () {
                    expect(result.length).toBe(3);
                    expect(result[0]).toBe(true);
                    expect(result[1]).toBe(false);
                    expect(result[2]).toBe(false);
                });
                bool = false;
            });
        });

        describe('filter', function () {
            it('1', function () {
                nba(arr_empty).filter(function (x) {
                    return true;
                }).then(function (arr) {
                    expect(arr_empty).toEqual(ARR_EMPTY);
                    expect(arr).toEqual(ARR_EMPTY);
                    expect(arr).not.toBe(arr_empty);
                });
            });

            it('2', function () {
                nba(arr_int).filter(function (x) {
                    return true;
                }).then(function (arr) {
                    expect(arr_int).toEqual(ARR_INT);
                    expect(arr).toEqual(ARR_INT);
                    expect(arr).not.toBe(arr_int);
                });
            });

            it('3', function () {
                nba(arr_int).filter(function (x) {
                    return false;
                }).then(function (arr) {
                    expect(arr_int).toEqual(ARR_INT);
                    expect(arr).toEqual(ARR_EMPTY);
                });
            });

            it('4', function () {
                nba(arr_int).filter(function (x) {
                    return x % 2;
                }).then(function (arr) {
                    expect(arr_int).toEqual(ARR_INT);
                    expect(arr.length).toBe(2);
                    expect(arr[0]).toBe(1);
                    expect(arr[1]).toBe(3);
                });
            });

            it('5', function () {
                nba(arr_int).filter(function (x) {
                    return (x + 1) % 2;
                }).then(function (arr) {
                    expect(arr_int).toEqual(ARR_INT);
                    expect(Array.isArray(arr)).toBe(true);
                    expect(arr.length).toBe(1);
                    expect(arr[0]).toBe(2);
                });
            });

            it('6', function () {
                shuffle(arr_int_big);
                nba(arr_int_big).filter(function (x) {
                    return x < 10;
                }).then(function (arr) {
                    expect(arr.sort()).toEqual(ARR_INT_BIG.slice(0, 10));
                });
            });

            it('7', function () {
                var bool = true;
                nba(arr_int).filter(function (x) {
                    wait(20);
                    return bool;
                }).then(function (arr) {
                    expect(arr.length).toBe(1);
                    expect(arr[0]).toBe(1);
                });
                bool = false;
            });
        });

        describe('map', function () {
            it('1', function () {
                nba(arr_empty).map(function (x) {
                    return x++;
                }).then(function (arr) {
                    expect(arr_empty).toEqual(ARR_EMPTY);
                    expect(arr).toEqual(ARR_EMPTY);
                    expect(arr).not.toBe(arr_empty);
                });
            });

            it('2', function () {
                nba(arr_int).map(function (x) {
                    return x++;
                }).then(function (arr) {
                    expect(arr_int).toEqual(ARR_INT);
                    expect(arr.length).toBe(3);
                    expect(arr[0]).toBe(1);
                    expect(arr[1]).toBe(2);
                    expect(arr[2]).toBe(3);
                });
            });

            it('3', function () {
                nba(arr_str).map(function (x) {
                    return x + 'a';
                }).then(function (arr) {
                    expect(arr_str).toEqual(ARR_STR);
                    expect(arr.length).toBe(3);
                    expect(arr[0]).toBe('aa');
                    expect(arr[1]).toBe('ba');
                    expect(arr[2]).toBe('ca');
                });
            });

            it('4', function () {
                var bool = true;
                nba(arr_int).map(function (x) {
                    wait(20);
                    return bool;
                }).then(function (arr) {
                    expect(arr.length).toBe(3);
                    expect(arr[0]).toBe(true);
                    expect(arr[1]).toBe(false);
                    expect(arr[2]).toBe(false);
                });
                bool = false;
            });
        });

        describe('some', function () {
            it('1', function () {
                nba(arr_empty).some(function (x) {
                    return x > 0;
                }).then(function (result) {
                    expect(arr_empty).toEqual(ARR_EMPTY);
                    expect(result).toBe(false);
                });
            });

            it('2', function () {
                nba(arr_int).some(function (x) {
                    return x > 0;
                }).then(function (result) {
                    expect(arr_int).toEqual(ARR_INT);
                    expect(result).toBe(true);
                });
            });

            it('3', function () {
                nba(arr_int).some(function (x) {
                    return x > 1;
                }).then(function (result) {
                    expect(arr_int).toEqual(ARR_INT);
                    expect(result).toBe(true);
                });
            });

            it('4', function () {
                nba(arr_int).some(function (x) {
                    return x > 3;
                }).then(function (result) {
                    expect(arr_int).toEqual(ARR_INT);
                    expect(result).toBe(false);
                });
            });

            it('5', function () {
                var bool = false;
                nba(arr_int).some(function (x) {
                    wait(20);
                    return bool;
                }).then(function (result) {
                    expect(result).toBe(true);
                });
                bool = true;
            });
        });

        describe('every', function () {
            it('1', function () {
                nba(arr_empty).every(function (x) {
                    return x > 0;
                }).then(function (result) {
                    expect(arr_empty).toEqual(ARR_EMPTY);
                    expect(result).toBe(true);
                });
            });

            it('2', function () {
                nba(arr_int).every(function (x) {
                    return x > 0;
                }).then(function (result) {
                    expect(arr_int).toEqual(ARR_INT);
                    expect(result).toBe(true);
                });
            });

            it('3', function () {
                nba(arr_int).every(function (x) {
                    return x > 1;
                }).then(function (result) {
                    expect(arr_int).toEqual(ARR_INT);
                    expect(result).toBe(false);
                });
            });

            it('4', function () {
                nba(arr_int).every(function (x) {
                    return x > 3;
                }).then(function (result) {
                    expect(arr_int).toEqual(ARR_INT);
                    expect(result).toBe(false);
                });
            });

            it('5', function () {
                var bool = true;
                nba(arr_int).every(function (x) {
                    wait(20);
                    return bool;
                }).then(function (result) {
                    expect(result).toBe(false);
                });
                bool = false;
            });
        });

        describe('sort', function () {
            it('1', function () {
                nba(arr_empty).sort().then(function (arr) {
                    expect(arr_empty).toEqual(ARR_EMPTY);
                    expect(arr).toBe(arr_empty);
                });
            });

            it('2', function () {
                nba(arr_int).sort().then(function (arr) {
                    expect(arr_int).toEqual(ARR_INT);
                    expect(arr).toBe(arr_int);
                });
            });

            it('3', function () {
                arr_int.reverse();
                nba(arr_int).sort().then(function (arr) {
                    expect(arr_int).toEqual(ARR_INT);
                    expect(arr).toBe(arr_int);
                });
            });

            it('4', function () {
                shuffle(arr_int);
                nba(arr_int).sort().then(function (arr) {
                    expect(arr_int).toEqual(ARR_INT);
                    expect(arr).toBe(arr_int);
                });
            });

            it('5', function () {
                shuffle(arr_int);
                nba(arr_int).sort(function (a, b) {
                    return b - a;
                }).then(function (arr) {
                    expect(arr_int).toEqual(ARR_INT.slice(0).reverse());
                    expect(arr).toBe(arr_int);
                });
            });

            it('6', function () {
                shuffle(arr_int_big);
                nba(arr_int_big).sort(function (a, b) {
                    return b - a;
                }).then(function (arr) {
                    expect(arr_int_big).toEqual(ARR_INT_BIG.slice(0).reverse());
                    expect(arr).toBe(arr_int_big);
                });
            });
        });

        describe('reverse', function () {
            it('1', function () {
                nba(arr_empty).reverse().then(function (arr) {
                    expect(arr_empty).toEqual(ARR_EMPTY);
                    expect(arr).toBe(arr_empty);
                });
            });

            it('2', function () {
                nba(arr_int.reverse()).reverse().then(function (arr) {
                    expect(arr_int).toEqual(ARR_INT);
                    expect(arr).toBe(arr_int);
                });
            });

            it('3', function () {
                nba(arr_int_big.reverse()).reverse().then(function (arr) {
                    expect(arr_int_big).toEqual(ARR_INT_BIG);
                    expect(arr).toBe(arr_int_big);
                });
            });
        });

        describe('reduce', function () {
            it('1', function () {
                nba(arr_empty).reduce(function () {
                    return true;
                }, false).then(function (result) {
                    expect(arr_empty).toEqual(ARR_EMPTY);
                    expect(result).toBe(false);
                });
            });

            it('2', function () {
                nba(arr_int).reduce(function (result) {
                    return result + 1;
                }, 0).then(function (result) {
                    expect(arr_int).toEqual(ARR_INT);
                    expect(result).toBe(arr_int.length);
                });
            });

            it('3', function () {
                var bool = true;
                nba(arr_int).reduce(function (result) {
                    wait(10);
                    return result && bool;
                }, true).then(function (result) {
                    expect(result).toBe(false);
                });
                bool = false;
            });
        });

        describe('chaining', function () {
            it('1', function () {
                shuffle(arr_int);
                nba(arr_int).map(function (x) {
                    return x;
                }).sort(function (a, b) {
                    return a - b;
                }).reverse()
                .then(function (arr) {
                    expect(arr).not.toBe(arr_int);
                    expect(arr.length).toBe(3);
                    expect(arr[0]).toBe(3);
                    expect(arr[1]).toBe(2);
                    expect(arr[2]).toBe(1);
                });
            });

            it('2', function () {
                nba(arr_int).map(function (x) {
                    return x * 2;
                }).filter(function (x) {
                    return (x + 1) % 2;
                }).then(function (arr) {
                    expect(arr).not.toBe(arr_int);
                    expect(arr.length).toBe(3);
                    expect(arr[0]).toBe(2);
                    expect(arr[1]).toBe(4);
                    expect(arr[2]).toBe(6);
                });
            });

            it('4', function () {
                nba(arr_int).filter(function (x) {
                    return (x + 1) % 2;
                }).some(function (x) {
                    return x % 2;
                }).then(function (result) {
                    expect(result).toBe(false);
                });
            });

            it('5', function () {
                nba(arr_int).filter(function (x) {
                    return (x + 1) % 2;
                }).every(function (x) {
                    return (x + 1) % 2;
                }).then(function (result) {
                    expect(result).toBe(true);
                });
            });
        });

        describe('callback exection params', function () {
            it('forEach', function () {
                var result = [];
                nba(arr_int).forEach(function (x, i, a) {
                    result.push([x, i, a]);
                    return true;
                }).then(function () {
                    arr_int.forEach(function (y, j, b) {
                        expect(result[j][0]).toBe(y);
                        expect(result[j][1]).toBe(j);
                        expect(result[j][2]).toBe(b);
                    });
                });
            });

            it('filter', function () {
                var result = [];
                nba(arr_int).filter(function (x, i, a) {
                    result.push([x, i, a]);
                    return true;
                }).then(function () {
                    arr_int.forEach(function (y, j, b) {
                        expect(result[j][0]).toBe(y);
                        expect(result[j][1]).toBe(j);
                        expect(result[j][2]).toBe(b);
                    });
                });
            });

            it('map', function () {
                var result = [];
                nba(arr_int).map(function (x, i, a) {
                    result.push([x, i, a]);
                    return true;
                }).then(function () {
                    arr_int.forEach(function (y, j, b) {
                        expect(result[j][0]).toBe(y);
                        expect(result[j][1]).toBe(j);
                        expect(result[j][2]).toBe(b);
                    });
                });
            });

            it('some', function () {
                var result = [];
                nba(arr_int).some(function (x, i, a) {
                    result.push([x, i, a]);
                    return false;
                }).then(function () {
                    arr_int.forEach(function (y, j, b) {
                        expect(result[j][0]).toBe(y);
                        expect(result[j][1]).toBe(j);
                        expect(result[j][2]).toBe(b);
                    });
                });
            });

            it('every', function () {
                var result = [];
                nba(arr_int).every(function (x, i, a) {
                    result.push([x, i, a]);
                    return true;
                }).then(function () {
                    arr_int.forEach(function (y, j, b) {
                        expect(result[j][0]).toBe(y);
                        expect(result[j][1]).toBe(j);
                        expect(result[j][2]).toBe(b);
                    });
                });
            });

            it('reduce', function () {
                nba(arr_int).reduce(function (result, x, i, a) {
                    result.push([x, i, a]);
                    return result;
                }, []).then(function (result) {
                    arr_int.forEach(function (y, j, b) {
                        expect(result[j][0]).toBe(y);
                        expect(result[j][1]).toBe(j);
                        expect(result[j][2]).toBe(b);
                    });
                });
            });
        });

        describe('callback exection scope', function () {
            it('forEach', function () {
                var scope = {counter: 0};
                nba(arr_int).forEach(function () {
                    scope.counter++;
                    return true;
                }, scope).then(function () {
                    expect(scope.counter).toBe(arr_int.length);
                });
            });

            it('filter', function () {
                var scope = {counter: 0};
                nba(arr_int).filter(function () {
                    scope.counter++;
                    return true;
                }, scope).then(function () {
                    expect(scope.counter).toBe(arr_int.length);
                });
            });

            it('map', function () {
                var scope = {counter: 0};
                nba(arr_int).map(function () {
                    scope.counter++;
                    return true;
                }, scope).then(function () {
                    expect(scope.counter).toBe(arr_int.length);
                });
            });

            it('some', function () {
                var scope = {counter: 0};
                nba(arr_int).some(function () {
                    scope.counter++;
                    return false;
                }, scope).then(function () {
                    expect(scope.counter).toBe(arr_int.length);
                });
            });

            it('every', function () {
                var scope = {counter: 0};
                nba(arr_int).every(function () {
                    scope.counter++;
                    return true;
                }, scope).then(function () {
                    expect(scope.counter).toBe(arr_int.length);
                });
            });
        });

        describe('error handling', function () {
            it('sort 1', function () {
                nba(arr_int).sort(function () {
                    throw Error();
                }).then(function () {
                    throw Error(); // should not be called
                }, function () {
                    expect(true).toBe(true); // should be called
                });
            });

            it('sort 2', function () {
                nba(arr_int).reduce(function () {}).sort(function () {
                    throw Error();
                }).then(function () {
                    throw Error(); // should not be called
                }, function () {
                    expect(true).toBe(true); // should be called
                });
            });

            it('forEach', function () {
                nba(arr_int).forEach(function () {
                    throw Error();
                }).then(function () {
                    throw Error(); // should not be called
                }, function () {
                    expect(true).toBe(true); // should be called
                });
            });

            it('filter', function () {
                nba(arr_int).filter(function () {
                    throw Error();
                }).then(function () {
                    throw Error(); // should not be called
                }, function () {
                    expect(true).toBe(true); // should be called
                });
            });

            it('map', function () {
                nba(arr_int).map(function () {
                    throw Error();
                }).then(function () {
                    throw Error(); // should not be called
                }, function () {
                    expect(true).toBe(true); // should be called
                });
            });

            it('some', function () {
                nba(arr_int).some(function () {
                    throw Error();
                }).then(function () {
                    throw Error(); // should not be called
                }, function () {
                    expect(true).toBe(true); // should be called
                });
            });

            it('every', function () {
                nba(arr_int).every(function () {
                    throw Error();
                }).then(function () {
                    throw Error(); // should not be called
                }, function () {
                    expect(true).toBe(true); // should be called
                });
            });

            it('reduce', function () {
                nba(arr_int).reduce(function () {
                    throw Error();
                }).then(function () {
                    throw Error(); // should not be called
                }, function () {
                    expect(true).toBe(true); // should be called
                });
            });
        });

        describe('noConflict', function () {
            it('1', function () {
                var nbaRefBackup = window.nba;
                var nbaRef = window.nba.noConflict();
                expect(nbaRef).toBe(nbaRefBackup);
                expect(typeof window.nba).toBe('undefined');
                window.nba = nbaRef;
            });
        });
    });

})();
