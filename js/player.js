import { isArray, notEmptyStr } from "./utils.js"
import { Cell } from "./cell.js"

/**
 * Игрок
 */
class Player {
    _name = null
    _HTMLcontent = null
    _filledCells = []

    /**
     * Конструктор игрока
     * @param {string} name имя игрока
     * @param {string} HTMLcontent HTML-строка, контент для заполнения клетки
     * @param {Cell[]} filledCells клетки, заполненные игроком
     */
    constructor(name, HTMLcontent = null, filledCells = null) {
        this.name = name
        this.HTMLcontent = HTMLcontent
        this._setFilledCells(filledCells)
    }

    /**
     * Геттер имени игрока
     * @returns {string | null}
     */
    get name() {
        return this._name
    }
    /**
     * Сеттер имени игрока (может обнулять)
     * @param {string | null} name 
     * @returns {undefined}
     */
    set name(name) {
        this._name = notEmptyStr(name) ? name : null
    }


    /**
     * Геттер HTML-контента игрока
     * @returns {string | null}
     */
    get HTMLcontent() {
        return this._HTMLcontent
    }
    /**
     * Сеттер HTML-контента игрока (может обнулять)
     * @param {string | null} name 
     * @returns {undefined}
     */
    set HTMLcontent(content) {
        this._HTMLcontent = notEmptyStr(content) ? content : null
    }

    /**
     * Геттер массива заполненных клеток
     * @returns {Cell[] | null}
     */
    get filledCells() {
        return this._filledCells
    }

    extractWinCombination(winCombinations) {
        if (!isArray(winCombinations)) return null
        let winCombination = null
        winCombinations.forEach(combination => {
            if (isArray(combination)) {
                let matches = 0
                combination.forEach(item => {
                    if (this.hasFilledCell(item)) ++matches
                })
                if (matches === combination.length) {
                    winCombination = combination
                    return
                }
            }
        })
        return winCombination
    }

    /**
     * Определяет: выиграл ли игрок (собрал ли победную комбинацию)
     * @param {Cell[][]} winCombinations выигрышные комбинации (массив массивов клеток)
     * @returns {boolean}
     */
    isWinner(winCombinations) {
        return this.extractWinCombination(winCombinations)
    }

    /**
     * Определяет: заполнил ли игрок клетку
     * @param {Cell} targetCell проверяемая клетка
     * @returns {boolean}
     */
    hasFilledCell(targetCell) {
        return targetCell instanceof Cell && this._getFilledCellId(targetCell) >= 0
    }

    /**
     * Добавляет клетку в массив заполненных
     * @param {Cell} cell 
     * @returns {undefined}
     */
    addFilledCell(cell) {
        if (cell instanceof Cell) this.filledCells.push(cell)
    }

    /**
     * Удаляет клетку из массива заполненных
     * @param {Cell} targetCell 
     * @returns {undefined}
     */
    removeFilledCell(targetCell) {
        if (!this.hasFilledCell(targetCell)) return
        if (targetCell instanceof Cell) targetCell.free()
        this.filledCells.splice(this._getFilledCellId(targetCell), 1)
    }

    /**
     * Обнуляет массив заполненных клеток
     * @returns {undefined}
     */
    resetFilledCells() {
        this._filledCells = []
    }

    /**
     * Определяет индекс клетки в массиве заполненных
     * @param {Cell} targetCell 
     * @returns {number}
     */
    _getFilledCellId(targetCell) {
        return this.filledCells.indexOf(targetCell)
    }

    /**
     * Заполняет массив заполненных клеток элементами
     * @param {Cell[]} cells
     * @returns {undefined}
     */
    _setFilledCells(cells) {
        if (cells instanceof Array) {
            cells.forEach(cell => this.addFilledCell(cell))
        }
    }
}

export { Player }