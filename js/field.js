import { isArray, isIdCorrect, notNegativeInt, isNum, isHTMLElement } from "./utils.js"
import { HTMLObject } from "./html_object.js"
import { Cell } from "./cell.js"

/**
 * Игровое поле
 */
class Field extends HTMLObject {
    _cells = []
    _winCombinations = []

    // TO DO
    // мб нужно добавить класс-обертку для контейнеров

    /**
     * Конструктор игрового поля
     * @param {HTMLElement | string | null} element HTML-элемент или CSS-селектор для поиска (по умолчанию - #tic-tac-toe__field)
     * @param {number | null} size размер поля, по умолчанию - 3
     * @param {string | null} fieldSizeCSSVarName название CSS-переменной размера поля, по умолчанию - --field-size
     */
    constructor(
        element = '#tic-tac-toe__field',
        size = 3,
        fieldSizeCSSVarName = '--field-size',
    ) {
        super(element)
        this._fieldSizeCSSVarName = fieldSizeCSSVarName
        this.resize(size)
    }

    /**
     * Геттер размера игрового поля
     * @returns {number}
     */
    get size() {
        return this._cells.length
    }

    /**
     * Геттер победных комбинаций
     * @returns {Cell[][]}
     */
    get winCombinations() {
        return this._winCombinations
    }

    /**
     * Обновляет победные комбинации
     * @returns {undefined}
     */
    updateWinCombinations() {
        this._winCombinations = [
            ...this._getLines(),
            ...this._getColumns(),
            ...this._getDiagonals()
        ]
    }

    /**
     * Получение клетки игрового поля по ее координатам
     * @param {number} x индекс колонки
     * @param {number} y индекс строки
     * @returns {Cell | null} клетка
     */
    getCell(x, y) {
        if (!isIdCorrect(x, this.size) || !isIdCorrect(y, this.size)) return null
        return this._cells[y][x]
    }

    /**
     * Активирует все клетки поля (устанавливает слушатель кликов и класс кликера)
     * @param {Caller | { callee: Function, context: Object, args: Array, callOnce: boolean } | Function} clickHandler
     * @param {Caller | { callee: Function, context: Object, args: Array} | Function | null} onRemove
     * @returns {undefined}
     */
    activateAllCells(clickHandler, onRemove = null) {
        this._cells.forEach(line => {
            if (isArray(line)) {
                line.forEach(cell => { this._activateCell(cell, clickHandler, onRemove) })
            }
        })
    }

    /**
     * Деактивирует клетку (удаляет слушатель кликов и класс кликера)
     * @param {Cell} targetCell целевая клетка
     * @returns {undefined}
     */
    deactivateCell(targetCell) {
        if (targetCell instanceof Cell) targetCell.deactivate()
    }

    /**
     * Деактивирует все клетки поля (удаляет слушатель кликов и класс кликера)
     * @returns {undefined}
     */
    deactivateAllCells() {
        this._cells.forEach(line => {
            if (isArray(line)) {
                line.forEach(cell => { this.deactivateCell(cell) })
            }
        })
    }

    /**
     * Заполняет содержимое клетки
     * @param {Cell} cell клетка
     * @param {string | null} content HTML-строка
     * @returns {undefined}
     */
    fillCell(cell, content) {
        if (cell instanceof Cell) cell.fill(content)
    }

    /**
     * Деактивирует и очищает все клетки (сбрасывает победные классы)
     * @returns {undefined}
     */
    resetAllCells() {
        this.deactivateAllCells()
        this._removeWinClassNameFromAll()
        this._freeAllCells()
    }

    /**
     * Изменяет размер поля (удаляет или добавляет клетки, обновляет победные комбинации)
     * @param {number} newSize новый размер поля
     * @param {HTMLObject | HTMLElement | null} fieldContainer контейнер игрового поля
     * @returns {undefined}
     */
    resize(newSize, fieldContainer = null) {
        if (!isNum(newSize) || newSize === this.size) return
        if (newSize > this.size) this._resizeToBigger(newSize)
        else this._resizeToSmaller(newSize)
        this.updateWinCombinations()

        // Обновление CSS-переменной
        const style = {
            key: this._fieldSizeCSSVarName,
            value: String(this.size)
        }
        if (fieldContainer instanceof HTMLObject) fieldContainer.addStyle(style)
        else HTMLObject.addStyle(fieldContainer, style)
    }

    addWinClassNameFor(cells) {
        if (!isArray(cells)) return
        cells.forEach(cell => {
            if (cell instanceof Cell) cell.addWinClassName()
        })
    }

    _removeWinClassNameFrom(cells) {
        if (!isArray(cells)) return
        cells.forEach(cell => {
            if (cell instanceof Cell) cell.removeWinClassName()
        })
    }

    _removeWinClassNameFromAll() {
        this._cells.forEach(line => {
            this._removeWinClassNameFrom(line)
        })
    }

    /**
     * Возвращает массив линий игрового поля
     * @returns {Cell[][]}
     */
    _getLines() {
        return this._cells
    }

    /**
     * Возвращает массив колонок игрового поля
     * @returns {Cell[][]}
     */
    _getColumns() {
        const columns = []
        this._cells.forEach(line => {
            if (isArray(line)) {
                for (let i = 0; i < line.length; ++i) {
                    if (!isArray(columns[i])) columns[i] = []
                    columns[i].push(line[i])
                }
            }
        })
        return columns
    }

    /**
     * Возвращает массив диагоналей игрового поля
     * @returns {Cell[][]}
     */
    _getDiagonals() {
        const diagonals = [[], []]
        this._cells.forEach((line, lineId) => {
            if (isArray(line)) {
                diagonals[0].push(line[lineId])
                diagonals[1].push(line[line.length - lineId - 1])
            }
        })
        return diagonals
    }

    /**
     * Очищает содержимое клетки
     * @param {Cell} cell клетка
     * @returns {undefined}
     */
    _freeCell(cell) {
        if (cell instanceof Cell) cell.free()
    }

    /**
     * Очищает содержимое всех клеток игрового поля
     * @returns {undefined}
     */
    _freeAllCells() {
        this._cells.forEach(line => {
            if (isArray(line)) {
                line.forEach(cell => { this._freeCell(cell) })
            }
        })
    }
    
    /**
     * Активирует клетку (устанавливает слушатель кликов и класс кликера)
     * @param {Cell} targetCell целевая клетка
     * @param @param {Caller | { callee: Function, context: Object, args: Array, callOnce: boolean } | Function} clickHandler
     * @param {Caller | { callee: Function, context: Object, args: Array} | Function | null} onRemove
     * @returns {undefined}
     */
    _activateCell(targetCell, clickHandler, onRemove = null) {
        if (targetCell instanceof Cell) {
            targetCell.deactivate()
            targetCell.activate(clickHandler, onRemove)
        }
    }

    /**
     * Публикует клетку в конец поля
     * @param {Cell} cell клетка
     * @returns {undefined}
     */
    _publishCell(cell) {
        if (cell instanceof Cell) cell.publish(this.element)
    }

    /**
     * Удаляет клетку из DOM-разметки
     * @param {Cell} cell клетка
     * @returns {undefined}
     */
    _unpublishCell(cell) {
        if (cell instanceof Cell) cell.unpublish()
    }

    /**
     * Уменьшает размер поля (удаляет клетки)
     * @param {number} newSize новый размер поля
     * @returns {undefined}
     */
    _resizeToSmaller(newSize) {
        if (!notNegativeInt(newSize)) return

        // delete extra lines
        for (let y = newSize; y < this.size; ++y) {
            if (isArray(this._cells[y])) {
                this._cells[y].forEach(cell => {
                    this.deactivateCell(cell)
                    this._unpublishCell(cell)
                })
            }
        }
        this._cells.splice(newSize)

        // delete extra columns
        this._cells.forEach(line => {
            if (isArray(line)) {
                for (let x = newSize; x < line.length; ++x) {
                    this.deactivateCell(line[x])
                    this._unpublishCell(line[x])
                }
                line.splice(newSize)
            }
        })
    }

    /**
     * Увеличивает размер поля (добавляет и публикует новые клетки)
     * @param {number} newSize новый размер поля
     * @returns {undefined}
     */
    _resizeToBigger(newSize) {
        if (!notNegativeInt(newSize)) return

        // add extra columns
        this._cells.forEach(line => {
            if (isArray(line)) {
                while (line.length < newSize) {
                    const cell = new Cell()
                    this._publishCell(cell)
                    line.push(cell)
                }
            }
        })

        // add extra lines
        while (this.size < newSize) {
            const line = []
            while (line.length < newSize) {
                const cell = new Cell()
                this._publishCell(cell)
                line.push(cell)
            }
            this._cells.push(line)
        }
    }
}

export { Field }
