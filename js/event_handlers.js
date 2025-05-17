import { isIdCorrect } from "./utils.js"
import { Caller } from "./caller.js";

/**
 * Массив обработчиков события (одного типа) для одновременного вызова методом handle()
 */
class EventHandlers {
    _handlers = []
    _onRemoveHandlers = []
    _afterHandler = new Caller()

    /**
     * Создает пустой массив обработчиков, создает общий обработчик handle(event)
     */
    constructor () {
        this.reset()
    }

    /**
     * Геттер размера массива обработчика события
     * @returns {number}
     */
    get size() {
        return this._handlers.length
    }

    /**
     * Определяет индекс обработчика в массиве
     * @param {Caller | { callee: Function, context: Object, args: Array, callOnce: boolean } | Function} targetHandler 
     * @returns {number}
     */
    indexOf(targetHandler) {
        const caller = new Caller(targetHandler)
        if (!caller.isReadyToCall()) return -1
        let resId = -1
        this._handlers.forEach((handler, id) => {
            resId = id
            if (caller.isEqual(handler)) return 
        })
        return isIdCorrect(resId, this.size) ? resId : -1
    }

    /**
     * Определяет: есть ли такой обработчик в массиве
     * @param {Caller | { callee: Function, context: Object, args: Array, callOnce: boolean } | Function} targetHandler 
     * @returns {boolean}
     */
    includes(targetHandler) {
        return isIdCorrect(this.indexOf(targetHandler), this.size)
    }

    /**
     * Добавляет в конец массива обработчик события
     * @param {Caller | { callee: Function, context: Object, args: Array, callOnce: boolean } | Function} handler 
     * @param {Caller | { callee: Function, context: Object, args: Array } | Function | null} onRemove 
     * @returns {undefined}
     */
    append(handler, onRemove = null) {
        const caller = new Caller(handler)
        if (!caller.isReadyToCall()) return
        this._handlers.push(caller)
        this._onRemoveHandlers.push(new Caller(onRemove))
    }

    /**
     * Добавляет в начало массива обработчик события
     * @param {Caller | { callee: Function, context: Object, args: Array, callOnce: boolean } | Function} handler 
     * @param {Caller | { callee: Function, context: Object, args: Array } | Function | null} onRemove 
     * @returns {undefined}
     */
    unshift(handler, onRemove = null) {
        const caller = new Caller(handler)
        if (!caller.isReadyToCall()) return
        this._handlers.unshift(caller)
        this._onRemoveHandlers.unshift(new Caller(onRemove))
    }

    /**
     * Удаляет из массива обработчик события (вызывает коллер "при удалении")
     * @param {Caller | { callee: Function, context: Object, args: Array, callOnce: boolean } | Function} targetHandler 
     * @returns {undefined}
     */
    remove(targetHandler) {
        const handlerId = this.indexOf(targetHandler)
        if (!isIdCorrect(handlerId, this.size)) return
        this._handlers.splice(handlerId, 1)
        this._onRemoveHandlers.splice(handlerId, 1)[0].call()
    }

    /**
     * Сбрасывает массив обработчиков, актуализирует общий обработчик handle(event)
     * @returns {undefined}
     */
    reset() {
        this._handlers = []
        this._onRemoveHandlers = []
        this._afterHandler.reset()
        this.handle = this._handle.bind(this)
    }

    /**
     * Устанавливает постобработчик (может сбрасывать)
     * @param {Caller | { callee: Function, context: Object, args: Array} | Function | null} newAfterHandler 
     */
    setAfterHandler(newAfterHandler = null) {
        this._afterHandler.parseCaller(newAfterHandler)
    }

    /**
     * Метод - прототип для общего обработчика handle(event)
     * @param {Object | null} event событие вызова
     * @returns {undefined}
     */
    _handle(event = null) {
        let curId = 0
        while (curId < this._handlers.length) {
            const handler = this._handlers[curId]
            handler.call(event)
            if (handler.callOnce) this.remove(handler)
            else ++curId;
        }
        this._afterHandle(event)
    }

    /**
     * Вызывает коллер постобработки
     * @param {Object | null} event событие вызова
     * @returns {undefined}
     */
    _afterHandle(event = null) {
        this._afterHandler.call(event)
    }

}

export { EventHandlers }