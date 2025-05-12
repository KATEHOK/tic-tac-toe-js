import { isFunction } from "./utils.js"
import { HTMLObject } from "./html_object.js";
import { HTMLValidator } from "./html_validator.js";

/**
 * Кликабельный HTML-объект
 */
class ClickableHTMLObject extends HTMLObject {
    _clickableClassName = null
    _clickHandler = null
    _isClickable = false

    /**
     * Конструктор кликабельного HTML-объекта
     * @param {HTMLElement | string | null} element HTML-элемент или CSS-селектор для поиска
     * @param {string | null} clickableClassName имя класса-модификатора кликера
     */
    constructor(
        element = null,
        clickableClassName = null
    ) {
        super(element)
        this.clickableClassName = clickableClassName
    }

    /**
     * Геттер класса-модификатора для кликеров
     * @returns {string | null}
     */
    get clickableClassName() {
        return this._clickableClassName
    }
    /**
     * Сеттер класса-модификатора для кликеров (может обнулять)
     * @returns {undefined}
     */
    set clickableClassName(newClickableClassName) {
        if (HTMLValidator.isValidAsClassName(newClickableClassName) || newClickableClassName === null) {
            this._clickableClassName = newClickableClassName
        }
    }

    /**
     * Геттер: включен ли кликер
     * @returns {boolean}
     */
    get isClickable() {
        return this._isClickable
    }

    /**
     * Геттер: добавлен ли обработчик клика
     * @returns {Boolean}
     */
    get isClickHandlerSet() {
        return this.isReadyToHandle('click')
    }
    
    /**
     * Геттер: активирован ли слушатель клика
     * @returns {Boolean}
     */
    get isClickListenerActive() {
        return isFunction(this._clickHandler)
    }

    /**
     * Добавляет обработчик клика
     * @param {Caller | { callee: Function, context: Object, args: Array, onDeactivate: Caller, callOnce: boolean } | Function} newClickHandler 
     * @returns {undefined}
     */
    addClickHandler(newClickHandler) {
        this.addHandler('click', newClickHandler)
    }

    /**
     * Удаляет обработчик клика
     * @param {Caller | { callee: Function, context: Object, args: Array, onDeactivate: Caller, callOnce: boolean } | Function} clickHandler 
     * @returns {undefined}
     */
    removeClickHandler(clickHandler) {
        this.removeHandler('click', clickHandler)
    }

    /**
     * Активирует слушатель клика
     * @returns {Function}
     */
    activateClickListener() {
        if (!this.isClickListenerActive) {
            this._clickHandler = this.activateEventListener('click')
        }
        return this._clickHandler
    }

    /**
     * Деактивирует слушатель клика
     * @returns {undefined}
     */
    deactivateClickListener() {
        this.deactivateEventListener('click')
        this._clickHandler = null
    }

    /**
     * Устанавливает текущему объекту класс кликера и добавляет (не заменяет!) обработчик клика
     * @returns {undefined}
     */
    activateClick() {
        this.activateClickListener()
        this._addClickableClassName()
        this._isClickable = true
    }

    /**
     * Удаляет (при наличии) класс кликера и обработчик клика
     * @returns {undefined}
     */
    deactivateClick() {
        this.deactivateClickListener()
        this._removeClickableClassName()
        this._isClickable = false
    }

    /**
     * Вызывает обработчик клика для события
     * @param {Object | null} event событие
     * @returns 
     */
    click(event = null) {
        if (this.isClickListenerActive) return this.handle('click', event)
    }

    /**
     * Создает HTML-элемент и заменяет им текущий
     * @param {string} tagName имя тэга
     * @param {string | null} id значение атрибута id
     * @param {string[]} classList массив классов
     * @param {Object[]} styleList массив стилей
     * @returns {undefined}
     */
    create(tagName, id = null, classList = [], styleList = []) {
        this.deactivateClick()
        super.create(tagName, id, classList, styleList)
    }

    /**
     * Добавляет HTML-элементу класс кликера
     * @returns {undefined}
     */
    _addClickableClassName() {
        this.addClass(this.clickableClassName)
    }
    
    /**
     * Удаляет у HTML-элемента класс кликера
     * @returns {undefined}
     */
    _removeClickableClassName() {
        this.removeClass(this.clickableClassName)
    }
}

export { ClickableHTMLObject }