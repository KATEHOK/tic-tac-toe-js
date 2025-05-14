import { isHTMLElement, isIdCorrect, isString, notEmptyStr } from "./utils.js";
import { HTMLObject } from "./html_object.js";
import { ClickableHTMLObject } from "./clickable_html_object.js";
import { HTMLValidator } from "./html_validator.js";
import { Caller } from "./caller.js";

/**
 * HTML-объект toggle-кнопки
 */
class ToggleButton extends ClickableHTMLObject {
    _startBtnClassName = null
    _stopBtnClassName = null
    _states = ['start', 'stop']
    _stateId = -1

    /**
     * Конструктор toggle-кнопки
     * @param {HTMLElement | string | null} element HTML-элемент или CSS-селектор для поиска (по умолчанию - #tic-tac-toe__btn, если не передан - создается)
     * @param {string | null} id атрибут id (по умолчанию - tic-tac-toe__btn)
     * @param {string | null} startBtnClassName имя класса-модификатора для кнопки "start" (по умолчанию - btn--green)
     * @param {string | null} stopBtnClassName имя класса-модификатора для кнопки "stop" (по умолчанию - btn--red)
     * @param {string[] | null} classList массив имен классов (по умолчанию - ['btn', 'tic-tac-toe__btn'])
     */
    constructor(
        element = '#tic-tac-toe__btn',
        id = 'tic-tac-toe__btn',
        startBtnClassName = 'btn--green',
        stopBtnClassName = 'btn--red',
        classList = ['btn', 'tic-tac-toe__btn']
    ) {
        super(element)
        if (this.element === null) this.create('button', id, classList)
        this.startBtnClassName = startBtnClassName
        this.stopBtnClassName = stopBtnClassName
    }

    /**
     * Активирована ли кнопка
     * @returns {boolean}
     */
    get isActive() {
        return this.isClickable && isString(this.state)
    }

    /**
     * Геттер текущего состояния кнопки
     * @returns {string | null}
     */
    get state() {
        return isIdCorrect(this._stateId, this._states.length) ? this._states[this._stateId] : null
    }
    
    /**
     * Геттер класса-модификатора для старт-кнопки
     * @returns {string | null}
     */
    get startBtnClassName() {
        return this._startBtnClassName
    }
    /**
     * Сеттер класса-модификатора для старт-кнопки
     * @returns {undefined}
     */
    set startBtnClassName(newStartBtnClassName) {
        if (HTMLValidator.isValidAsClassName(newStartBtnClassName) || newStartBtnClassName === null) {
            this._startBtnClassName = newStartBtnClassName
        }
    }
    
    /**
     * Геттер класса-модификатора для стоп-кнопки
     * @returns {string | null}
     */
    get stopBtnClassName() {
        return this._stopBtnClassName
    }
    /**
     * Сеттер класса-модификатора для стоп-кнопки
     * @returns {undefined}
     */
    set stopBtnClassName(newStopBtnClassName) {
        if (HTMLValidator.isValidAsClassName(newStopBtnClassName) || newStopBtnClassName === null) {
            this._stopBtnClassName = newStopBtnClassName
        }
    }

    /**
     * Деактивация кнопки: отключает кликабельность, устанавливает состояние в "стоп"
     * @returns {undefined}
     */
    deactivate() {
        if (this.isActive) this.deactivateClick()
        this.setStop()
    }

    /**
     * Активация кнопки: включает кликабельность, устанавливает состояние в "старт"
     * @param {Caller | { callee: Function, context: Object, args: Array, onDeactivate: Caller, callOnce: boolean } | Function} clickHandler
     * @returns {undefined}
     */
    activate(clickHandler) {
        this.addClickHandler(clickHandler)
        const newAfterClickCaller = new Caller({
            callee: this._toggleState,
            context: this
        })
        this.setAfterClickHandler(newAfterClickCaller)
        this.activateClick()
        this.setStart()
    }

    /**
     * Устанавливает состояние в "старт", синхронизирует прочие параметры
     * @returns {undefined}
     */
    setStart() {
        this._setState('start')
        this._syncWithState()
    }

    /**
     * Устанавливает состояние в "стоп", синхронизирует прочие параметры
     * @returns {undefined}
     */
    setStop() {
        this._setState('stop')
        this._syncWithState()
    }

    /**
     * Устанавливает индекс состояния (если корректен)
     * @param {number} id 
     * @returns {undefined}
     */
    _setStateId(id) {
        this._stateId = isIdCorrect(id, this._states.length) ? id : -1
    }

    /**
     * Устанавливает состояние (если корректно)
     * @param {string} state 
     * @returns {undefined}
     */
    _setState(state) {
        if (isString(state)) this._setStateId(this._states.indexOf(state))
        // console.log('ToggleButton -> after _setState')
        // console.log('this.state', this.state)
    }

    /**
     * Меняет индекс текущего состояния на следующий
     * @returns {undefined}
     */
    _toggleStateId() {
        if (this._states.length !== 0) {
            this._stateId = (this._stateId + 1) % this._states.length
        }
        else this._stateId = -1 
    }

    /**
     * Добавляет клетке класс старт-кнопки
     * @returns {undefined}
     */
    _addStartBtnClassName() {
        this.addClass(this.startBtnClassName)
    }
    
    /**
     * Удаляет у клетки класс старт-кнопки
     * @returns {undefined}
     */
    _removeStartBtnClassName() {
        this.removeClass(this.startBtnClassName)
    }

    /**
     * Добавляет клетке класс стоп-кнопки
     * @returns {undefined}
     */
    _addStopBtnClassName() {
        this.addClass(this.stopBtnClassName)
    }
    
    /**
     * Удаляет у клетки класс стоп-кнопки
     * @returns {undefined}
     */
    _removeStopBtnClassName() {
        this.removeClass(this.stopBtnClassName)
    }

    /**
     * Меняет класс текущего состояния
     * @returns {undefined}
     */
    _toggleStateClassName() {
        this.toggleClass(this.startBtnClassName)
        this.toggleClass(this.stopBtnClassName)
    }

    /**
     * Синхронизирует класс состояния с текущим состоянием кнопки
     * @returns {undefined}
     */
    _syncStateClassName() {
        this._removeStopBtnClassName()
        this._removeStartBtnClassName()
        if (this.state === 'stop') this._addStopBtnClassName()
        else if (this.state === 'start') this._addStartBtnClassName()
    }

    /**
     * Синхронизирует текст кнопки с текущим состоянием
     * @returns {undefined}
     */
    _syncInnerText() {
        this.innerText = this.state
    }


    /**
     * Синхронизирует параметры кнопки с текущим состоянием
     * @returns {undefined}
     */
    _syncWithState() {
        this._syncStateClassName()
        this._syncInnerText()
    }

    /**
     * Меняет состояние и класс состояния кнопки)
     * @returns {undefined}
     */
    _toggleState() {
        this._toggleStateId()
        this._syncWithState()
    }
}

export { ToggleButton }