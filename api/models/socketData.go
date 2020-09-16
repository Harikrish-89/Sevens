package models

//SocketData data coming from socket
type SocketData struct{
	MessageType string
	Game Game
	TableMessage TableMessage
	Chat Chat
}