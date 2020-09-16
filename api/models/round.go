package models

// Round represent a round
type Round struct {
	Players              []Player
	DroppedCards         []Card
	DrawableCards        []Card
	Started              bool
	Ended                bool
	IsClockwise          bool
	SevensDroppedCount   int
	CurrentSuit          string
	IsPlayerSkipRequired bool
}
