var FuseUtils = /** @class */ (function () {
    function FuseUtils() {
    }
    /**
     * Filter array by string
     *
     * @param mainArr
     * @param searchText
     * @returns {any}
     */
    FuseUtils.filterArrayByString = function (mainArr, searchText) {
        var _this = this;
        if (searchText === '') {
            return mainArr;
        }
        searchText = searchText.toLowerCase();
        return mainArr.filter(function (itemObj) {
            return _this.searchInObj(itemObj, searchText);
        });
    };
    /**
     * Search in object
     *
     * @param itemObj
     * @param searchText
     * @returns {boolean}
     */
    FuseUtils.searchInObj = function (itemObj, searchText) {
        for (var prop in itemObj) {
            if (!itemObj.hasOwnProperty(prop)) {
                continue;
            }
            var value = itemObj[prop];
            if (typeof value === 'string') {
                if (this.searchInString(value, searchText)) {
                    return true;
                }
            }
            else if (Array.isArray(value)) {
                if (this.searchInArray(value, searchText)) {
                    return true;
                }
            }
            if (typeof value === 'object') {
                if (this.searchInObj(value, searchText)) {
                    return true;
                }
            }
        }
    };
    /**
     * Search in array
     *
     * @param arr
     * @param searchText
     * @returns {boolean}
     */
    FuseUtils.searchInArray = function (arr, searchText) {
        for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
            var value = arr_1[_i];
            if (typeof value === 'string') {
                if (this.searchInString(value, searchText)) {
                    return true;
                }
            }
            if (typeof value === 'object') {
                if (this.searchInObj(value, searchText)) {
                    return true;
                }
            }
        }
    };
    /**
     * Search in string
     *
     * @param value
     * @param searchText
     * @returns {any}
     */
    FuseUtils.searchInString = function (value, searchText) {
        return value.toLowerCase().includes(searchText);
    };
    /**
     * Generate a unique GUID
     *
     * @returns {string}
     */
    FuseUtils.generateGUID = function () {
        function S4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return S4() + S4();
    };
    /**
     * Toggle in array
     *
     * @param item
     * @param array
     */
    FuseUtils.toggleInArray = function (item, array) {
        if (array.indexOf(item) === -1) {
            array.push(item);
        }
        else {
            array.splice(array.indexOf(item), 1);
        }
    };
    /**
     * Handleize
     *
     * @param text
     * @returns {string}
     */
    FuseUtils.handleize = function (text) {
        return text.toString().toLowerCase()
            .replace(/\s+/g, '-') // Replace spaces with -
            .replace(/[^\w\-]+/g, '') // Remove all non-word chars
            .replace(/\-\-+/g, '-') // Replace multiple - with single -
            .replace(/^-+/, '') // Trim - from start of text
            .replace(/-+$/, ''); // Trim - from end of text
    };
    return FuseUtils;
}());
export { FuseUtils };
//# sourceMappingURL=index.js.map