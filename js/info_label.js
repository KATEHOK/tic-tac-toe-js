import { HTMLObject } from "./html_object.js";
import { notEmptyStr } from "./utils.js";

/**
 * Информационное табло
 */
class InfoLabel extends HTMLObject {

    /**
     * Конструктор информационного табло
     * @param {HTMLElement | string | null} element HTML-элемент или CSS-селектор для поиска (по умолчанию - #tic-tac-toe__info, если не передан - создается)
     * @param {string | null} tagName имя тэга (по умолчанию - p, используется, если не передан HTML-элемент)
     * @param {string | null} id атрибут id (по умолчанию - , используется, если не передан HTML-элемент)
     * @param {string[] | null} classList массив имен классов (по умолчанию - только tic-tac-toe__info, используется, если не передан HTML-элемент)
     */
    constructor(
        element = '#tic-tac-toe__info',
        tagName = 'p',
        id = 'tic-tac-toe__info',
        classList = ['tic-tac-toe__info']
    ) {
        super(element)
        if (this.element === null) this.create(tagName, id, classList)
    }

    setNotStarted() {
        this.innerText = 'Game not started'
    }

    setActivePlayer(playerName) {
        if (notEmptyStr(playerName)) this.innerText = `${playerName}'s turn`
    }

    setWinner(playerName) {
        if (notEmptyStr(playerName)) this.innerText = `${playerName} is winner!`
    }

    setDraw() {
        this.innerText = 'Draw!'
    }
}

export { InfoLabel }