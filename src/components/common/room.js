/*eslint react-hooks/exhaustive-deps: "off"*/
import React, { useState, useEffect, useRef } from 'react'
import { useHistory } from 'react-router-dom'
import io from 'socket.io-client'

import '../../styles/common/room.scss'

import PracticeEditor from '../lobby/practice-editor'
import Lobby from '../lobby/lobby'
import LobbyEditors from '../lobby/lobby-editors'
import Chat from '../chat/chat'
import { Button } from 'godspeed'

const Room = ({ params }) => {
	const { name, room } = params

	const [User, setUser] = useState([])
	const [HostId, setHostId] = useState([])

	const [lobby, setLobby] = useState({
		players: [],
		playersReady: false,
		inSession: false,
		options: {}
	})
	const [users, setUsers] = useState([])
	const [usersDropdown, setUsersDropdown] = useState(false)
	const [practiceEditor, setPracticeEditor] = useState(false)
	const [practiceOptions, setPracticeOptions] = useState({
		exactly: 10, maxLength: 5
	})


	const history = useHistory()

	const socketRef = useRef(io(process.env.REACT_APP_ENDPOINT, { path: '/socket' }))
	let socket = socketRef.current

	useEffect(() => {

		socket.on('connect', () => {
			console.log('Socket Connected', socket.connected)
			socket.emit('join', { name, room })
		})

		socket.on('duplicate-name', () => {
			console.log('hit')
			history.push('/')
		})

		socket.on('room-users', (list) => {
			console.log('User List', { list })
			setUsers(list)
		})

		socket.on('room-host', (id) => {
			console.log('Room Host', { id })
			setHostId(id)
		})

		socket.on('room-lobby', (lobby) => {
			console.log('Lobby', { lobby });
			setLobby(lobby)
		})

		socket.on('local-user', (user) => {
			console.log('Local User', { user })
			setUser(user)
		})

		return () => socket.disconnect()
	}, [])

	const props = {
		socket, name, room,
		lobby, setLobby,
		users, User, HostId,
		practiceEditor, setPracticeEditor,
		practiceOptions, setPracticeOptions,
		usersDropdown
	}

	return (
		<div className="room-main">

			<nav>
				<div className="nav-cont">
					<p className="nav-title">
						<span className="board">Board</span> <span className="master">Master</span>
					</p>
					<p className="nav-room">
						<span className="board">{room}</span>
					</p>
				</div>
				<Button className="leave-room" text="Leave" onClick={() => {
					socket.disconnect()
					history.push('/')
				}} />
			</nav>
			<main>
				<div className="session">
					{practiceEditor
						? <PracticeEditor {...props} />
						: !lobby.playersReady
							? <Lobby {...props} />
							: <LobbyEditors {...props} />
					}
				</div>
				<div className="chat">
					<div className="toggle">
						<Button text={`Show Users ${users.length}`} onClick={() => setUsersDropdown(!usersDropdown)} />
					</div>
					<Chat {...props} />
				</div>
			</main>
		</div >
	)
}

export default Room
