import { notEmptyStr, isObject, isIdCorrect } from "./utils.js";
import { Player } from "./player.js";

class Players {
    _players = []
    _activePlayerId = -1

    /**
     * Конструктор игроков
     * @param  {...(Player | { name: string, HTMLContent: string })} players игроки или объекты формата { name, HTMLContent }
     * @returns {undefined}
     */
    constructor(...players) {
        this.addPlayers(...players)
    }

    /**
     * Геттер количества игроков
     * @returns {number}
     */
    get playersCount() {
        return this._players.length
    }

    /**
     * Геттер активного игрока
     * @returns {Player | null}
     */
    get activePlayer() {
        if (!isIdCorrect(this._activePlayerId, this.playersCount)) return null
        return this._players[this._activePlayerId]
    }

    /**
     * Ищет игрока по имени
     * @param {string} name имя игрока
     * @returns {Player | null}
     */
    getPlayerByName(name) {
        if (!notEmptyStr(name)) return null
        const found = this._players.find(player => player.name === name)
        return found instanceof Player ? found : null
    }

    /**
     * Меняет индекс активного игрока (геттер активного игрока зависит от индекса)
     * @returns {undefined}
     */
    switchActivePlayer() {
        if (this.playersCount === 0) this._activePlayerId = -1
        else this._activePlayerId = (this._activePlayerId + 1) % this.playersCount
    }

    /**
     * Добавляет игрока
     * @param  {Player | { name: string, HTMLContent: string }} newPlayer игрок или объект формата { name, HTMLContent }
     * @returns {undefined}
     */
    addPlayer(newPlayer = null) {
        if (newPlayer instanceof Player) this._players.push(newPlayer)
        else if (isObject(newPlayer)) {
            const {name, HTMLContent} = newPlayer
            if (notEmptyStr(name) && notEmptyStr(HTMLContent)) {
                this._players.push(new Player(name, HTMLContent))
            }
        }
    }

    /**
     * Добавляет игроков
     * @param  {...(Player | { name: string, HTMLContent: string })} newPlayers игроки или объекты формата { name, HTMLContent }
     * @returns {undefined}
     */
    addPlayers(...newPlayers) {
        newPlayers.forEach(newPlayer => { this.addPlayer(newPlayer) })
    }

    /**
     * Всем игрокам сбрасывает заполненные клетки
     * @returns {undefined}
     */
    resetAllPlayersFilledCells() {
        this._players.forEach(player => {
            if (player instanceof Player) player.resetFilledCells()
        })
    }

    /**
     * Удаляет всех игроков, очищаяя их клетки
     * @returns {undefined}
     */
    deleteAllPlayers() {
        this.resetAllPlayersFilledCells()
        this._players = []
        this._activePlayerId = -1
    }

    /**
     * Сбрасывает активного игрока
     * @returns {undefined}
     */
    resetActivePlayer() {
        this._activePlayerId = -1
    }
}

export { Players }