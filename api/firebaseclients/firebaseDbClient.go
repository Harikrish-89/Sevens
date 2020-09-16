package firebaseclients

import (
	"errors"

	"firebase.google.com/go/db"
	"github.com/Harikrish-89/Sevens/models"
)

//FireBaseDbClient is db client stuct
var dbClient *db.Client

// MakeNewDbClient makes new firebase db client
func init() {
	var err error
	dbClient, err = fireBaseApp.Database(Ctx)
	if err != nil {
		panic(err)
	}

}

// PushGame creates new game in firebase database
func PushGame(game models.Game) (models.Game, error) {
	ref := dbClient.NewRef("/Games/" + game.GameID)
	error := ref.Set(Ctx, game)
	if error != nil {
		panic(error)
	}
	return GetGameByID(game.GameID)
}

// GetGameByID  get a given game with id
func GetGameByID(id string) (models.Game, error) {
	ref := dbClient.NewRef("/Games")
	results, err := ref.OrderByChild("GameID").EqualTo(id).GetOrdered(Ctx)
	if err != nil {
		panic(err)
	}
	var g models.Game
	var error error
	if len(results) == 0 {
		error = errors.New("empty result")
	} else {
		results[0].Unmarshal(&g)
	}
	return g, error
}

//UpdateGame in firebase
func UpdateGame(game models.Game) (models.Game, error) {
	ref := dbClient.NewRef("/Games/" + game.GameID)
	err := ref.Set(Ctx, game)
	if err != nil {
		panic(err)
	}
	return GetGameByID(game.GameID)
}

//UpdateTableMessage in firebase
func UpdateTableMessage(tableMessage models.TableMessage) (models.TableMessage, error) {
	ref := dbClient.NewRef("/TableMessages/" + tableMessage.GameID)
	err := ref.Set(Ctx, tableMessage)
	if err != nil {
		panic(err)
	}
	return GetTableMessageByGameID(tableMessage.GameID)
}

//GetTableMessageByGameID gets table message by game id
func GetTableMessageByGameID(gameID string) (models.TableMessage, error) {
	ref := dbClient.NewRef("/TableMessages")
	results, err := ref.OrderByChild("GameID").EqualTo(gameID).GetOrdered(Ctx)
	if err != nil {
		panic(err)
	}
	var tbmsg models.TableMessage
	var error error
	if len(results) == 0 {
		error = errors.New("empty result")
	} else {
		results[0].Unmarshal(&tbmsg)
	}
	return tbmsg, error
}

//UpdateTableMessage in firebase
func UpdateChatMessage(chat models.Chat) (models.Chat, error) {
	ref := dbClient.NewRef("/Chats/" + chat.GameID)
	err := ref.Set(Ctx, chat)
	if err != nil {
		panic(err)
	}
	return GetChatByGameID(chat.GameID)
}

//GetChatByGameID gets table message by game id
func GetChatByGameID(gameID string) (models.Chat, error) {
	ref := dbClient.NewRef("/Chats")
	results, err := ref.OrderByChild("GameID").EqualTo(gameID).GetOrdered(Ctx)
	if err != nil {
		panic(err)
	}
	var chat models.Chat
	var error error
	if len(results) == 0 {
		error = errors.New("empty result")
	} else {
		results[0].Unmarshal(&chat)
	}
	return chat, error
}
