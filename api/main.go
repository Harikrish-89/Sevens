package main

import (
	"fmt"
	"net/http"
	"os"

	"github.com/Harikrish-89/Sevens/handler"
	"github.com/gorilla/mux"
)

func main() {
	r := mux.NewRouter()
	r.Handle("/game", handler.CorsHeader(http.HandlerFunc(handler.CreateGameHanlder))).Methods("POST", "OPTIONS")
	r.Handle("/game/{gameId}", handler.CorsHeader(http.HandlerFunc(handler.GetGameHandler))).Methods("GET")
	r.Handle("/chats/{gameId}", handler.CorsHeader(http.HandlerFunc(handler.GetChat))).Methods("GET")
	r.Handle("/end", handler.CorsHeader(http.HandlerFunc(handler.EndGameHandler))).Methods("POST", "OPTIONS")
	r.Handle("/leave", handler.CorsHeader(http.HandlerFunc(handler.LeaveGameHanlder))).Methods("POST", "OPTIONS")
	r.Path("/join").Queries("gameId", "{gameId}", "playerId", "{playerId}").Handler(handler.CorsHeader(http.HandlerFunc(handler.JoinGameHanlder)))
	r.PathPrefix("/").Handler(http.FileServer(http.Dir("./web/")))
	http.ListenAndServe(GetPort(), r)

}

// GetPort gets port for server
func GetPort() string {
	var port = os.Getenv("PORT")
	if port == "" {
		port = "8080"
		fmt.Println("INFO: No PORT environment variable detected, defaulting to " + port)
	}
	return ":" + port
}
