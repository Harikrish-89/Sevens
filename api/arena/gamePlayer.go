package arena

import (
	"encoding/json"
	"fmt"
	"log"
	"time"

	"github.com/Harikrish-89/Sevens/models"
	"github.com/gorilla/websocket"
)

//GamePlayer represents a player in game
type GamePlayer struct {
	ID        string
	Send      chan models.SocketData
	GameTable *GameTable
	Conn      *websocket.Conn
}

const (
	// Time allowed to write a message to the peer.
	writeWait = 10 * time.Second

	// Time allowed to read the next pong message from the peer.
	pongWait = 60 * time.Second

	// Send pings to peer with this period. Must be less than pongWait.
	pingPeriod = (pongWait * 9) / 10

	// Maximum message size allowed from peer.
	maxMessageSize = 1024 * 1024 * 10
)

// ReadPump pumps messages from the websocket Connection to the hub.
//
// The application runs readPump in a per-Connection goroutine. The application
// ensures that there is at most one reader on a Connection by executing all
// reads from this goroutine.
func (gp *GamePlayer) ReadPump() {
	fmt.Println("running read pump for client", gp.ID)
	defer func() {
		gp.GameTable.Leave <- gp
		gp.Conn.Close()
	}()
	gp.Conn.SetReadLimit(maxMessageSize)
	gp.Conn.SetReadDeadline(time.Now().Add(pongWait))
	gp.Conn.SetPongHandler(func(string) error { gp.Conn.SetReadDeadline(time.Now().Add(pongWait)); return nil })
	for {
		var socketData models.SocketData
		err := gp.Conn.ReadJSON(&socketData)
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("error: %v", err)
			}
			break
		}
		fmt.Println("reading from websocket", socketData)
		gp.GameTable.Broadcast <- socketData
	}
}

// WritePump pumps messages from the hub to the websocket Connection.
//
// A goroutine running writePump is started for each Connection. The
// application ensures that there is at most one writer to a Connection by
// executing all writes from this goroutine.
func (gp *GamePlayer) WritePump() {
	fmt.Println("running write pump for client", gp.ID)
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		gp.Conn.Close()
	}()
	for {
		select {
		case socketData, ok := <-gp.Send:
			gp.Conn.SetWriteDeadline(time.Now().Add(writeWait))
			if !ok {
				// The hub closed the channel.
				gp.Conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			w, err := gp.Conn.NextWriter(websocket.TextMessage)
			if err != nil {
				return
			}
			bs, err := json.Marshal(socketData)
			if err != nil {
				panic(err)
			}
			fmt.Println("writing into websocket", socketData)
			w.Write(bs)

			if err := w.Close(); err != nil {
				return
			}
		case <-ticker.C:
			gp.Conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := gp.Conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}
