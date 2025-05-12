function isNum(num) {
    return typeof num === 'number'
}

function isInt(num) {
    return isNum(num) && Number.isInteger(num)
}

function isNatural(num) {
    return isInt(num) && num > 0
}

function notNegativeInt(num) {
    return isNatural(num) || num === 0
}

function isIdCorrect(num, size) {
    return notNegativeInt(num) && notNegativeInt(size) && num < size
}

function isBoolean(bool) {
    return typeof bool === 'boolean'
}

function isString(str) {
    return typeof str === 'string'
}

function notEmptyStr(str) {
    return isString(str) && str.trim()
}

function isFunction(func) {
    return typeof func === 'function'
}

function isArray(array) {
    return array instanceof Array
}

function isObject(obj) {
    return typeof obj === 'object' && obj !== null
}

function isHTMLElement(element) {
    return element instanceof HTMLElement
}

function isPrimitive(value) {
    return !(['object', 'function'].includes(typeof value))
}

function arePrimitivesEqual(first, second) {
    if (!isPrimitive(first) || !isPrimitive(second)) return false
    return first === second
}

function arePrimitivesArraysEqual(firstArray, secondArray) {
    if (!isArray(firstArray) || !isArray(secondArray)) return false
    if (firstArray.length !== secondArray.length) return false
    for (let id = 0; id < firstArray.length; ++id) {
        if (!arePrimitivesEqual(firstArray[id], secondArray[id])) return false
    }
    return true
}

function arePrimitivesObjectsEqual(firstObj, secondObj) {
    if (!isObject(firstObj) || !isObject(secondObj)) return false
    if (Object.keys(firstObj).length !== Object.keys(secondObj).length) return false
    for (let key in firstObj) {
        if (!(key in secondObj) || !arePrimitivesEqual(firstObj[key], secondObj[key])) return false
    }
    return true
}

function areArraysOfPrimitivesObjectsEqual(firstArray, secondArray) {
    if (!isArray(firstArray) || !isArray(secondArray)) return false
    if (firstArray.length !== secondArray.length) return false
    for (let id = 0; id < firstArray.length; ++id) {
        if (!arePrimitivesObjectsEqual(firstArray[id], secondArray[id])) return false
    }
    return true
}

function copyArrayOfPrimitivesObjects(srcArray) {
    if (!isArray(srcArray)) return srcArray
    const targetArray = []
    for (let id = 0; id < srcArray.length; ++id) {
        if (!isObject(srcArray[id])) return null
        targetArray.push({...srcArray[id]})
    }
    return targetArray
}

export {
    isNum,
    isInt,
    isNatural,
    notNegativeInt,
    isIdCorrect,
    notEmptyStr,
    isBoolean,
    isFunction,
    isArray,
    isObject,
    isString,
    isHTMLElement,
    arePrimitivesArraysEqual,
    arePrimitivesEqual,
    isPrimitive,
    arePrimitivesObjectsEqual,
    areArraysOfPrimitivesObjectsEqual,
    copyArrayOfPrimitivesObjects,
}