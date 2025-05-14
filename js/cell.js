import { isFunction } from "./utils.js"
import { HTMLValidator } from "./html_validator.js"
import { ClickableHTMLObject } from "./clickable_html_object.js"
import { Caller } from "./caller.js"

/**
 * Клетка игрового поля
 */
class Cell extends ClickableHTMLObject {
    _winClassName = null

    /**
     * Конструктор клетки игрового поля
     * @param {HTMLElement | string | null} element HTML-элемент или CSS-селектор для поиска (если не передан - создается)
     * @param {string | null} clickableClassName имя класса-модификатора для кликеров (по умолчанию - tic-tac-toe__cell--empty)
     * @param {string | null} winClassName имя победного класса-модификатора (по умолчанию - tic-tac-toe__cell--win)
     * @param {string | null} tagName имя тэга (по умолчанию - div, используется, если не передан HTML-элемент)
     * @param {string[] | null} classList массив имен классов (по умолчанию - только tic-tac-toe__cell, используется, если не передан HTML-элемент)
     */
    constructor(
        element = null,
        clickableClassName = 'tic-tac-toe__cell--empty',
        winClassName = 'tic-tac-toe__cell--win',
        tagName = 'div',
        classList = ['tic-tac-toe__cell']
    ) {
        super(element, clickableClassName)
        this.winClassName = winClassName
        if (this.element === null) this.create(tagName, null, classList)
    }

    /**
     * Активирована ли клетка
     * @returns {boolean}
     */
    get isActive() {
        return this.isClickable
    }

    /**
     * Геттер победного класса-модификатора
     * @returns {string | null}
     */
    get winClassName() {
        return this._winClassName
    }
    /**
     * Сеттер победного класса-модификатора (может обнулять)
     * @returns {undefined}
     */
    set winClassName(newWinClassName) {
        if (HTMLValidator.isValidAsClassName(newWinClassName) || newWinClassName === null) {
            this._winClassName = newWinClassName
        }
    }

    /**
     * Добавляет клетке победный класс
     * @returns {undefined}
     */
    addWinClassName() {
        this.addClass(this.winClassName)
    }
    
    /**
     * Удаляет у клетки победный класс
     * @returns {undefined}
     */
    removeWinClassName() {
        this.removeClass(this.winClassName)
    }

    /**
     * Не делает ничего (блок вызова добавления обработчика клика)
     */
    addClickHandler(newClickHandler, position) {}
    
    /**
     * Меняет обработчик клика
     * @param {Caller | { callee: Function, context: Object, args: Array, onDeactivate: Caller, callOnce: boolean } | Function} newClickHandler
     * @returns {undefined}
     */
    changeClickHandler(newClickHandler) {
        this.resetClickHandlers()
        const ownHandler = (new Caller(newClickHandler)).copy()
        ownHandler.args = [this, ...ownHandler.args]
        if (ownHandler.onDeactivate === null) {
            ownHandler.onDeactivate = new Caller({
                callee: this.deactivate,
                context: this,
                callOnce: true
            })
        }
        super.addClickHandler(ownHandler)
    }

    /**
     * Деактивация клетки: отключает кликабельность
     * @returns {undefined}
     */
    deactivate() {
        if (this.isActive) this.deactivateClick()
    }

    /**
     * Активация клетки: включает кликабельность
     * @param {Caller | { callee: Function, context: Object, args: Array, onDeactivate: Caller, callOnce: boolean } | Function} clickHandler
     * @returns {undefined}
     */
    activate(clickHandler) {
        this.changeClickHandler(clickHandler)
        this.activateClick()
    }

    /**
     * Заполняет содержимым
     * @param {string} HTMLContent HTML-строка содержимого
     * @returns {undefined}
     */
    fill(HTMLContent) {
        this.innerHTML = HTMLContent
    }

    /**
     * Удаляет содержимое
     * @returns {undefined}
     */
    free() {
        this.innerHTML = ""
    }

    /**
     * Дкактивирует и очищает клетку
     * @returns {undefined}
     */
    reset() {
        this.deactivate()
        this.free()
    }
}

export { Cell }
