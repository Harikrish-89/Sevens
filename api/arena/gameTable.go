package arena

import (
	"fmt"

	"github.com/Harikrish-89/Sevens/firebaseclients"
	"github.com/Harikrish-89/Sevens/models"
)

//GameTable reprsents a game table
type GameTable struct {
	ActivePlayers map[*GamePlayer]bool
	Join          chan *GamePlayer
	Leave         chan *GamePlayer
	Broadcast     chan models.SocketData
	End           chan models.Game
}

// GameTableMap is the map with game table and game id
var GameTableMap map[string]*GameTable

func init() {
	GameTableMap = make(map[string]*GameTable)
}

//MakeNewTableAndStart makes a new table and adds it to game table map
func MakeNewTableAndStart(game models.Game) {
	GameTableMap[game.GameID] = &GameTable{
		Join:          make(chan *GamePlayer),
		Leave:         make(chan *GamePlayer),
		Broadcast:     make(chan models.SocketData),
		ActivePlayers: make(map[*GamePlayer]bool),
		End:           make(chan models.Game),
	}
	go runTable(game)
}

// Run all game tables
func runTable(game models.Game) {
	fmt.Println("running table with id", game.GameID)
	gameTable := GameTableMap[game.GameID]
	for {
		select {
		case gamePlayer := <-gameTable.Join:
			gameTable.ActivePlayers[gamePlayer] = true
		case gamePlayer := <-gameTable.Leave:
			_, ok := gameTable.ActivePlayers[gamePlayer]
			if ok {
				gamePlayer.Conn.Close()
				delete(gameTable.ActivePlayers, gamePlayer)
			}
		case socketData := <-gameTable.Broadcast:
			if socketData.MessageType == "GAME" {
				firebaseclients.UpdateGame(socketData.Game)
			} else if socketData.MessageType == "TABLE_MESSAGE" {
				firebaseclients.UpdateTableMessage(socketData.TableMessage)
			} else if socketData.MessageType == "CHAT" {
				firebaseclients.UpdateChatMessage(socketData.Chat)
			}

			for player, isActive := range gameTable.ActivePlayers {
				if isActive {
					select {
					case player.Send <- socketData:
					default:
						close(player.Send)
					}
				} else {
					select {
					case gameTable.Leave <- player:
					}
				}

			}
		case game := <-gameTable.End:
			fmt.Println("Ending game table for game id", game.GameID)
			firebaseclients.UpdateGame(game)
			socketData := models.SocketData{MessageType: "GAME", Game: game}
			for player, isActive := range gameTable.ActivePlayers {
				if isActive {
					select {
					case player.Send <- socketData:
					default:
						close(player.Send)
					}
				}
			}

			for player := range gameTable.ActivePlayers {
				gameTable.Leave <- player
			}
			break
		}
	}
}
