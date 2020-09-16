package handler

import (
	"encoding/json"
	"net/http"

	"github.com/Harikrish-89/Sevens/firebaseclients"
	"github.com/gorilla/mux"
)

//GetChat gets the  current chat and writes to response
func GetChat(w http.ResponseWriter, req *http.Request) {
	gameID := mux.Vars(req)["gameId"]
	chats, err := firebaseclients.GetChatByGameID(gameID)
	if err != nil {

		newBs, _ := json.Marshal([]string{})
		w.Write(newBs)
		return
	}
	bs, err := json.Marshal(chats)
	if err != nil {
		panic(err)
	}
	w.Write(bs)
}
