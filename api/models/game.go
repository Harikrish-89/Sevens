package models

// Game represents a game
type Game struct {
	GameID   string
	Players  []Player
	Rounds   []Round
	Settings GameSettings
	Started  bool
	Ended    bool
}
