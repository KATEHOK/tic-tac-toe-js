import { notEmptyStr } from "./utils.js"

class HTMLValidator {
    static isValidAsTagName(value) {
        return notEmptyStr(value)
    }
    static isValidAsId(value) {
        return notEmptyStr(value)
    }
    static isValidAsClassName(value) {
        return notEmptyStr(value)
    }
    static isValidAsClassList(value) {
        return true
    }
    static isValidAsStyleRule(value) {
        return true
    }
    static isValidAsStyleList(value) {
        return true
    }
}

export {HTMLValidator}