package handler

import (
	"encoding/json"
	"io/ioutil"
	"net/http"

	"github.com/Harikrish-89/Sevens/arena"
	"github.com/Harikrish-89/Sevens/firebaseclients"
	"github.com/Harikrish-89/Sevens/models"
	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

// GetGameHandler handler to get game by id
func GetGameHandler(w http.ResponseWriter, req *http.Request) {
	gameID := mux.Vars(req)["gameId"]
	game, err := firebaseclients.GetGameByID(gameID)
	if err != nil {
		w.WriteHeader(400)
		return
	}
	bs, err := json.Marshal(game)
	if err != nil {
		panic(err)
	}
	w.Write(bs)
}

// CreateGameHanlder is handler to create a game
func CreateGameHanlder(w http.ResponseWriter, req *http.Request) {
	game := models.Game{}
	body, err := ioutil.ReadAll(req.Body)
	if err != nil {
		panic(err)
	}
	json.Unmarshal(body, &game)
	createdGame, err := firebaseclients.PushGame(game)
	if err != nil {
		w.WriteHeader(400)
		return
	}
	arena.MakeNewTableAndStart(createdGame)
	createGameJSON, jsonError := json.Marshal(createdGame)
	if jsonError != nil {
		panic(jsonError)
	}
	w.Write(createGameJSON)
}

// JoinGameHanlder is handler to join a game
func JoinGameHanlder(w http.ResponseWriter, req *http.Request) {
	queryMap := req.URL.Query()
	gameTable := arena.GameTableMap[queryMap.Get("gameId")]
	if gameTable != nil {
		upgrader.CheckOrigin = func(r *http.Request) bool { return true }
		conn, err := upgrader.Upgrade(w, req, nil)
		if err != nil {
			panic(err)
		}
		player := &arena.GamePlayer{ID: queryMap.Get("playerId"), GameTable: gameTable, Send: make(chan models.SocketData, 1024), Conn: conn}
		go player.ReadPump()
		go player.WritePump()
		gameTable.Join <- player
	} else {
		w.WriteHeader(400)
	}
}

//EndGameHandler end the game
func EndGameHandler(w http.ResponseWriter, req *http.Request) {
	game := models.Game{}
	body, err := ioutil.ReadAll(req.Body)
	if err != nil {
		panic(err)
	}
	json.Unmarshal(body, &game)
	arena.GameTableMap[game.GameID].End <- game
	delete(arena.GameTableMap, game.GameID)
	w.WriteHeader(200)
}

//LeaveGameHanlder end the game
func LeaveGameHanlder(w http.ResponseWriter, req *http.Request) {
	leaveGame := models.LeaveGame{}
	body, err := ioutil.ReadAll(req.Body)
	if err != nil {
		panic(err)
	}
	json.Unmarshal(body, &leaveGame)
	gameTable, ok := arena.GameTableMap[leaveGame.GameID]
	if !ok {
		panic("game not found")
	}
	for k := range gameTable.ActivePlayers {
		if k.ID == leaveGame.PlayerID {
			delete(gameTable.ActivePlayers, k)
		}
	}
	w.WriteHeader(200)
}
