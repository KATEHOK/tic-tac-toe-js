import { isArray, isBoolean, isFunction, isObject } from "./utils.js"

/**
 * Обертка над функцией для вызова с контекстом
 */
class Caller {
    _callee = null
    _context = null
    _args = []
    _onDeactivate = null
    _callOnce = false
    _returned = null

    /**
     * Конструктор
     * @param {Caller | { callee: Function, context: Object, args: Array, onDeactivate: Caller, callOnce: boolean } | Function | null} caller 
     */
    constructor(caller) {
        this.parseCaller(caller)
    }

    /**
     * Геттер вызываемой функции
     * @returns {Function | null}
     */
    get callee() {
        return this._callee
    }
    /**
     * Сеттер вызываемой функции (может обнулять)
     * @returns {undefined}
     */
    set callee(newCallee) {
        this.reset()
        if (isFunction(newCallee)) this._callee = newCallee
    }

    /**
     * Геттер контекста
     * @returns {Object | null}
     */
    get context() {
        return this._context
    }
    /**
     * Сеттер контекста (может обнулять)
     * @returns {undefined}
     */
    set context(newContext) {
        this._context = isObject(newContext) ? newContext : null
        this._returned = null
    }

    /**
     * Геттер аргументов
     * @returns {Array | null}
     */
    get args() {
        return this._args
    }
    /**
     * Сеттер аргументов (может обнулять)
     * @returns {undefined}
     */
    set args(newArgs) {
        this._args = isArray(newArgs) ? [...newArgs] : []
        this._returned = null
    }

    /**
     * Геттер колбэка при деактивации коллера
     * @returns {Caller | null}
     */
    get onDeactivate() {
        return this._onDeactivate
    }
    /**
     * Сеттер колбэка при деактивации коллера
     * @returns {undefined}
     */
    set onDeactivate(callback) {
        this._onDeactivate = new Caller(callback)
    }

    /**
     * Геттер настройки однократного вызова
     * @returns {boolean}
     */
    get callOnce() {
        return this._callOnce
    }
    /**
     * Сеттер настройки однократного вызова
     * @returns {undefined}
     */
    set callOnce(value) {
        if (isBoolean(value)) this._callOnce = value
    }

    /**
     * Геттер последнего возврата
     * @returns {*}
     */
    get returned() {
        this._returned
    }

    /**
     * Сбрасывает текущий объект до пустых значений
     * @returns {undefined}
     */
    reset() {
        this._callee = null
        this._context = null
        this._args = []
        this._onDeactivate = null
        this._callOnce = false
        this._returned = null
    }

    /**
     * Проверяет: готова ли функция к вызову
     * @returns {boolean}
     */
    isReadyToCall() {
        return isFunction(this.callee)
    }

    /**
     * Вызывает функцию с установленными контекстом и аргументами
     * @param {Object | null} event событие (для слушателей событий)
     * @returns {*} возврат вызываемой функции
     */
    call(event = null) {
        if (!this.isReadyToCall()) return
        const composed = isObject(event) ? [...this.args, event] : [...this.args]
        this._returned = this.callee.call(this.context, ...composed)
        return this.returned
    }

    /**
     * Проверяет массив аргументов на эквивалентность текущему
     * @param {Array} anotherArgs 
     * @returns {boolean}
     */
    areArgsEqual(anotherArgs) {
        if (!isArray(anotherArgs)) return false
        if (this.args.length !== anotherArgs.length) return false
        let areEqual = true
        this.args.forEach(arg => {
            if (!anotherArgs.includes(arg)) {
                areEqual = false
                return
            }
        })
        return areEqual
    }

    /**
     * Проверяет объект на эквивалентность текущему (сравнение по свойствам: callee, context и args)
     * @param {{callee: Function, context: Object, args: Array, onDeactivate: Caller, callOnce: boolean}} anotherCaller 
     * @returns {boolean}
     */
    isEqual(anotherCaller) {
        return isObject(anotherCaller) &&
            this.callee === anotherCaller.callee &&
            this.context === anotherCaller.context &&
            this.areArgsEqual(anotherCaller.args) &&
            (
                this.onDeactivate instanceof Caller &&
                this.onDeactivate.isEqual(anotherCaller.onDeactivate) ||
                this.onDeactivate === anotherCaller.onDeactivate
            ) &&
            this.callOnce === anotherCaller.callOnce
    }

    /**
     * Инициализирует текущий объект (может сбрасывать)
     * @param {Caller | { callee: Function, context: Object, args: Array, onDeactivate: Caller, callOnce: boolean } | Function | null} anotherCaller 
     */
    parseCaller(anotherCaller) {
        if (isObject(anotherCaller)) {
            this.callee = anotherCaller.callee
            if (this.isReadyToCall()) {
                this.context = anotherCaller.context
                this.args = anotherCaller.args
                this.onDeactivate = anotherCaller.onDeactivate
                this.callOnce = anotherCaller.callOnce
            }
        }
        else if (isFunction(anotherCaller)) this.callee = anotherCaller
        else this.reset()
    }

    /**
     * Вызов коллера - обработчика деактивации
     */
    callDeactivate() {
        if (this.onDeactivate instanceof Caller) this._onDeactivate.call()
    }

    /**
     * Создание копии объекта
     * @returns {Caller}
     */
    copy() {
        return new Caller({
            callee: this.callee,
            context: isObject(this.context)
                ? {...this._context}
                : null,
            args: [...this.args],
            onDeactivate: (this.onDeactivate instanceof Caller)
                ? this.onDeactivate.copy()
                : null,
            callOnce: this.callOnce
        })
    }
}

export { Caller }