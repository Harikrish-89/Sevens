package models

// Player is a player in a game
type Player struct {
	ID                string
	Name              string
	PhotoURL          string
	Token             string
	Points            int
	IsDealer          bool
	Cards             []Card
	IsHost            bool
	IsPlayingHand     bool
	FailedToPlayCount int
	IsWaiting         bool
	HasLost           bool
}
