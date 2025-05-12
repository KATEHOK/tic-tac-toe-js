import { isIdCorrect } from "./utils.js"
import { Caller } from "./caller.js";

/**
 * Массив обработчиков события (одного типа) для одновременного вызова методом handle()
 */
class EventHandlers {
    _handlers = []

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
     * @param {Caller | { callee: Function, context: Object, args: Array, onDeactivate: Caller, callOnce: boolean } | Function} targetHandler 
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
     * Добавляет в массив обработчик события
     * @param {Caller | { callee: Function, context: Object, args: Array, onDeactivate: Caller, callOnce: boolean } | Function} handler 
     * @returns {undefined}
     */
    add(handler) {
        const caller = new Caller(handler)
        if (!caller.isReadyToCall()) return
        this._handlers.push(caller)
    }

    /**
     * Удаляет из массива обработчик события
     * @param {Caller | { callee: Function, context: Object, args: Array, onDeactivate: Caller, callOnce: boolean } | Function} targetHandler 
     * @returns {undefined}
     */
    remove(targetHandler) {
        const handlerId = this.indexOf(targetHandler)
        if (!isIdCorrect(handlerId, this.size)) return
        const removedHandler = this._handlers.splice(handlerId, 1)[0]
        removedHandler.callDeactivate()
    }

    /**
     * Сбрасывает массив обработчиков, актуализирует общий обработчик handle(event)
     * @returns {undefined}
     */
    reset() {
        this._handlers = []
        this.handle = this._handle.bind(this)
    }

    /**
     * Метод - прототип для общего обработчика handle(event)
     * @param {Object | null} event событие вызова
     * @returns {undefined}
     */
    _handle(event = null) {
        let curId = 0
        let limit = 5
        while (curId < this._handlers.length && limit > 0) {
            --limit
            const handler = this._handlers[curId]
            if (handler instanceof Caller && handler.isReadyToCall()) {
                handler.call(event)
                if (handler.callOnce) this.remove(handler)
                else ++curId;
            }
        }
    }

}

export { EventHandlers }