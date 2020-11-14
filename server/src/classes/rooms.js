const { uniqBy, remove, isEmpty, uniq } = require('lodash')
const { wordList } = require('random-words')

class RoomsClass {
	constructor() {
		this.rooms = [
			new RoomClass('', 'Beginner'),
			new RoomClass('', 'Intermediate'),
			new RoomClass('', 'Advanced')
		]
	}

	getRoom(room) {
		return this.rooms.find(rm => rm.name === room)
	}
	getRooms() {
		return this.rooms
	}
	getUsers(room) {
		return this.getRoom(room).users
	}
	getLobby(room) {
		return this.getRoom(room).lobby
	}

	addRoom(room) {
		if (!this.getRoom(room.name)) this.rooms.push(room)
	}
	addUser({ room, user }) {
		const emptyRoom = this.getRoom(room).roomId === ''
		if (emptyRoom) this.getRoom(room).roomId = user.userId
		this.getRoom(room).users = uniqBy([...this.getRoom(room).users, user], 'userId')
	}

	removeUser({ room, user }) {
		this.getRoom(room).users = remove(this.getUsers(room), u => u.userId !== user.userId)
	}
	removeRoom(room) {
		if (room === 'Beginner' || room === 'Intermediate' || room === 'Advanced') {
			return this.getRoom(room).roomId = ''
		}
		this.rooms = remove(this.rooms, r => r.name !== room)
	}
	transferHost({ room, userId }) {
		this.getRoom(room).roomId = userId
	}
}

class RoomClass {
	constructor(roomId, name) {
		this.roomId = roomId
		this.name = name
		this.users = []
		this.lobby = new LobbyClass()
	}
	getLobby() {
		return this.lobby
	}
	resetLobby() {
		this.lobby = new LobbyClass()
	}
}

class UserClass {
	constructor(userId, name) {
		this.userId = userId
		this.name = name
	}
}

class LobbyClass {
	constructor() {
		this.players = []
		this.playerCount = this.players.length
		this.options = { exactly: 25, maxLength: 5 }
		this.wordSet = []
		this.playersReady = false
		this.inSession = false
		this.startTime = null
	}
	getPlayer(player) {
		return this.players.find(p => p.userId === player.userId)
	}
	getPlayers() {
		return this.players
	}
	getPlayerCount() {
		return this.playerCount
	}
	getOptions() {
		return this.options
	}
	addPlayer(player) {
		if (this.playerCount < 2) {
			if (!this.players.some(p => p.userId === player.userId)) {
				this.players.push(player)
			}
		}
		this.playerCount = this.players.length
	}
	setOptions({ exactly, maxLength }) {
		this.options = { exactly, maxLength }
	}
	setWordSet(wordSet) {
		this.wordSet = wordSet
	}
	setPlayersReady(bool) {
		this.playersReady = bool
	}
	setInSession() {
		this.inSession = !this.inSession
	}
	setStartTime() {
		this.startTime = Date.now()
	}
	removePlayer(player) {
		this.players = remove(this.players, p => p.userId !== player.userId)
		this.playerCount = this.players.length
	}
}

class PlayerClass {
	constructor(userId, name) {
		this.userId = userId
		this.name = name
		this.ready = false
		this.forfeited = false
		this.finished = false
		this.wordClasses = []
		this.currentIndex = 0
		this.accuracy = 0
		this.wpm = 0
	}
	setReady(bool) {
		this.ready = bool
	}
	setCurrentIndex(currentIndex) {
		this.currentIndex = currentIndex
	}
	setWordClasses(classes) {
		this.wordClasses = classes
	}
	setStats({ wpm, acc }) {
		this.wpm = wpm
		this.accuracy = acc
	}
	isForfeited() {
		this.forfeited = true
	}
	isFinished() {
		this.finished = true
	}
}


module.exports = {
	Rooms: new RoomsClass,
	RoomClass,
	UserClass,
	PlayerClass
}