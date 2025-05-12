import {
    isBoolean,
    isString,
    isHTMLElement,
    isFunction,
    notEmptyStr,
    isArray,
    isIdCorrect,
} from "./utils.js"
import { HTMLValidator } from "./html_validator.js"
import { Caller } from "./caller.js"
import { EventHandlers } from "./event_handlers.js"

/**
 * Кастомный HTML-объект (обертка над HTML-элементом)
 */
class HTMLObject {
    _element = null
    _handlers = {}

    /**
     * Конструктор кастомного HTML-объекта
     * @param {HTMLElement | string | null} element HTML-элемент или CSS-селектор для поиска
     */
    constructor(
        element = null,
    ) {
        this.element = element
    }

    /**
     * Геттер HTML-элемента
     * @returns {HTMLElement | null}
     */
    get element() {
        return this._element
    }
    /**
     * Сеттер HTML-элемента (может искать по CSS-селектору или обнулять)
     * @returns {undefined}
     */
    set element(newElement) {
        if (isHTMLElement(newElement)) this._element = newElement
        else if (notEmptyStr(newElement)) this.querySelector(newElement)
        else this._element = null
    }

    /**
     * Геттер имени тэга HTML-элемента
     * @returns {string | null}
     */
    get tagName() {
        return this.hasElement() ? this.element.tagName : null
    }

    /**
     * Геттер аттрибута id HTML-элемента
     * @returns {string | null}
     */
    get id() {
        return this.hasElement() ? this.element.id : null
    }
    /**
     * Сеттер аттрибута id HTML-элемента (может обнулять)
     * @returns {undefined}
     */
    set id(newId) {
        if (this.hasElement()) {
            this.element.removeAttribute('id')
            if (HTMLValidator.isValidAsId(newId)) this.element.id = newId
        }
    }

    /**
     * Геттер внутреннего текста текущего HTML-элемента
     * @returns {string | undefined}
     */
    get innerText() {
        return HTMLObject.getInnerText(this.element)
    }
    /**
     * Сеттер внутреннего текста текущего HTML-элемента
     * @returns {undefined}
     */
    set innerText(text) {
        HTMLObject.setInnerText(this.element, text)
    }

    /**
     * Геттер содержимого текущего HTML-элемента
     * @returns {string | undefined}
     */
    get innerHTML() {
        return HTMLObject.getInnerHTML(this.element)
    }
    /**
     * Сеттер содержимого текущего HTML-элемента
     * @returns {undefined}
     */
    set innerHTML(html) {
        HTMLObject.setInnerHTML(this.element, html)
    }

    /**
     * Проверяет: установлен ли HTML-элемент
     * @returns {boolean}
     */
    hasElement() {
        return isHTMLElement(this.element)
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
        if (HTMLValidator.isValidAsTagName(tagName)) {
            this.element = document.createElement(tagName)
            this.id = id
            if (isArray(classList)) this.addClasses(...classList)
            if (isArray(styleList)) this.addStyles(...styleList)
        }
        else this.element = null
    }

    /**
     * Находит DOM-элемент и устанавливает его в качестве текущего
     * @param {string} selector CSS-селектор
     */
    querySelector(selector) {
        this.element = document.querySelector(selector)
    }

    /**
     * Добавляет (при отсутствии) класс текущему HTML-элементу
     * @param {string} className имя класса
     * @returns {undefined}
     */
    addClass(className) {
        HTMLObject.addClass(this.element, className)
    }

    /**
     * Добавляет (при отсутствии) классы текущему HTML-элементу
     * @param {...string} classNames имена класса
     * @returns {undefined}
     */
    addClasses(...classNames) {
        HTMLObject.addClasses(this.element, ...classNames)
    }

    /**
     * Удаляет (при наличии) класс у текущего HTML-элемента
     * @param {string} className имя класса
     * @returns {undefined}
     */
    removeClass(className) {
        HTMLObject.removeClass(this.element, className)
    }

    /**
     * Добавляет текущему HTML-элементу CSS-правило (при отсутствии)
     * @param {Object} style объект формата { key, value }
     * @returns {undefined}
     */
    addStyle(style) {
        if (HTMLValidator.isValidAsStyleRule(style)) HTMLObject.addStyle(this.element, style)
    }

    /**
     * Добавляет текущему HTML-элементу CSS-правила (при отсутствии)
     * @param {...Object} styles объекты формата { key, value }
     * @returns {undefined}
     */
    addStyles(...styles) {
        HTMLObject.addStyles(this.element, ...styles)
    }

    /**
     * Удаляет у текущего HTML-элемента совпадающее CSS-правило (при наличии)
     * @param {Object} style объект формата { key, value }
     * @returns {undefined}
     */
    removeStyle(style) {
        if (HTMLValidator.isValidAsStyleRule(style)) HTMLObject.removeStyle(this.element, style)
    }

    /**
     * Публикует текущий HTML-элемент в конец контейнера DOM-разметки
     * @param {HTMLElement} dstContainer контейнер для публикации
     * @returns {undefined}
     */
    publish(dstContainer) {
        HTMLObject.appendElement(dstContainer, this.element)
    }

    /**
     * Удаляет текущий HTML-элемент из DOM-разметки
     * @returns {undefined}
     */
    unpublish() {
        HTMLObject.unpublishElement(this.element)
    }

    /**
     * Проверка: может ли быть вызван обработчик для события
     * @param {string} eventType тип события
     * @returns {undefined}
     */
    isReadyToHandle(eventType) {
        return notEmptyStr(eventType) && this._handlers[eventType] instanceof EventHandlers
    }

    /**
     * Определяет индекс обработчика события
     * @param {string} eventType тип события
     * @param {Caller | { callee: Function, context: Object, args: Array, onDeactivate: Caller, callOnce: boolean } | Function} targetHandler 
     * @returns {number}
     */
    indexOfHandler(eventType, targetHandler) {
        if (!this.isReadyToHandle(eventType)) return -1
        let id = this._handlers[eventType].indexOf(targetHandler)
        return isIdCorrect(id) ? id : -1
    }

    /**
     * Добавляет обработчик события
     * @param {string} eventType тип события
     * @param {Caller | { callee: Function, context: Object, args: Array, onDeactivate: Caller, callOnce: boolean } | Function} handler 
     * @returns {undefined}
     */
    addHandler(eventType, handler) {
        if (!notEmptyStr(eventType)) return
        if (!this.isReadyToHandle(eventType)) this._handlers[eventType] = new EventHandlers()
        if (this._handlers[eventType] instanceof EventHandlers) this._handlers[eventType].add(handler)
    }

    /**
     * Удаляет обработчик события
     * @param {string} eventType тип события
     * @param {Caller | { callee: Function, context: Object, args: Array, onDeactivate: Caller, callOnce: boolean } | Function} targetHandler 
     * @returns {undefined}
     */
    removeHandler(eventType, targetHandler) {
        if (!this.isReadyToHandle(eventType)) return
        this._handlers[eventType].remove(targetHandler)
    }

    /**
     * Вызывает общий обработчик для события
     * @param {string} eventType тип события
     * @param {Object | null} event объеект события
     * @returns {undefined}
     */
    handle(eventType, event = null) {
        if (this.isReadyToHandle(eventType)) this._handlers[eventType].handle(event)
    }

    /**
     * Активирует слушатель события текущего элемента
     * @param {string} eventType тип события
     * @returns {Function} фактическая обертка обработчика события
     */
    activateEventListener(eventType) {
        if (!this.isReadyToHandle(eventType)) return
        this.element.addEventListener(eventType, this._handlers[eventType].handle)
        return this._handlers[eventType].handle
    }

    /**
     * Деактивирует слушатель события текущего элемента
     * @param {string} eventType тип события
     * @returns {undefined}
     */
    deactivateEventListener(eventType) {
        if (!this.isReadyToHandle(eventType)) return
        this.element.removeEventListener(eventType, this._handlers[eventType].handle)
    }

    /**
     * Получает содержимое HTML-элемента
     * @param {HTMLElement} element HTML-элемент
     * @returns {string | undefined}
     */
    static getInnerHTML(element) {
        if (isHTMLElement(element)) return element.innerHTML
    }

    /**
     * Устанавливает содержимое HTML-элементу
     * @param {HTMLElement} element HTML-элемент
     * @param {string} html HTML-контент
     * @returns {undefined}
     */
    static setInnerHTML(element, html) {
        if (isHTMLElement(element)) {
            element.innerHTML = isString(html) ? html : ''
        }
    }

    /**
     * Получает внутренний текст HTML-элемента
     * @param {HTMLElement} element HTML-элемент
     * @returns {string | undefined}
     */
    static getInnerText(element) {
        if (isHTMLElement(element)) return element.innerText
    }

    /**
     * Устанавливает внутренний текст HTML-элементу
     * @param {HTMLElement} element HTML-элемент 
     * @param {string} text текст 
     * @returns {undefined}
     */
    static setInnerText(element, text) {
        if (isHTMLElement(element) && isString(text)) {
            element.innerText = text
        }
    }

    /**
     * Удаляет HTML-элемент из DOM-разметки
     * @param {HTMLElement} element HTML-элемент
     * @returns {undefined}
     */
    static unpublishElement(element) {
        if (isHTMLElement(element)) element.remove()
    }

    /**
     * Добавляет HTML-элемент в конец контейнера
     * @param {HTMLElement} dstContainer контейнер
     * @param {HTMLElement} element HTML-элемент
     * @returns {undefined}
     */
    static appendElement(dstContainer, element) {
        if (isHTMLElement(dstContainer) && isHTMLElement(element)) {
            dstContainer.append(element)
        }
    }

    /**
     * Добавляет (при отсутствии) класс HTML-элементу
     * @param {HTMLElement} element HTML-элемент
     * @param {string} className имя класса
     * @returns {undefined}
     */
    static addClass(element, className) {
        if (!isHTMLElement(element) || !HTMLValidator.isValidAsClassName(className)) return
        if (!element.classList.contains(className)) element.classList.add(className)
    }

    /**
     * Добавляет (при отсутствии) классы HTML-элементу
     * @param {HTMLElement} element HTML-элемент
     * @param {...string} classNames имена классов
     * @returns {undefined}
     */
    static addClasses(element, ...classNames) {
        classNames.forEach(className => HTMLObject.addClass(element, className))
    }

    /**
     * Удаляет (при наличии) класс у HTML-элемента
     * @param {HTMLElement} element HTML-элемент
     * @param {string} className имя класса
     * @returns {undefined}
     */
    static removeClass(element, className) {
        if (!isHTMLElement(element) || !HTMLValidator.isValidAsClassName(className)) return
        if (element.classList.contains(className)) element.classList.remove(className)
    }

    /**
     * Добавляет HTML-элементу CSS-правило (при отсутствии)
     * @param {HTMLElement} element HTML-элемент
     * @param {Object} style объект формата { key, value }
     * @returns {undefined}
     */
    static addStyle(element, { key, value }) {
        if (!HTMLValidator.isValidAsStyleRule({key, value}) || !isHTMLElement(element)) return
        if (element.style.getPropertyValue(key) !== value) element.style.setProperty(key, value)
    }

    /**
     * Добавляет (при отсутствии) стили HTML-элементу
     * @param {HTMLElement} element HTML-элемент
     * @param {...Object} styles стили формата { key, value }
     * @returns {undefined}
     */
    static addStyles(element, ...styles) {
        styles.forEach(style => HTMLObject.addStyle(element, style))
    }

    /**
     * Удаляет у HTML-элемента полностью совпадающее CSS-правило (при наличии)
     * @param {HTMLElement} element HTML-элемент
     * @param {Object} style объект формата { key, value }
     * @returns {undefined}
     */
    static removeStyle(element, {key, value}) {
        if (!HTMLValidator.isValidAsStyleRule({key, value}) || !isHTMLElement(element)) return
        if (element.style.getPropertyValue(key) === value) element.style.removeProperty(key)
    }
}

export { HTMLObject }