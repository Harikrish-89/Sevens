package firebaseclients

import (
	"context"
	"log"

	firebase "firebase.google.com/go"
	"google.golang.org/api/option"
)

var fireBaseApp *firebase.App
var appErr error

//Ctx Defines the application context
var Ctx context.Context

func init() {
	config := &firebase.Config{
		DatabaseURL:   "https://sevens-e08f5.firebaseio.com/",
		ProjectID:     "sevens-e08f5",
		StorageBucket: "sevens-e08f5.appspot.com",
	}
	Ctx = context.Background()
	opts := option.WithAPIKey("AIzaSyAdQeH3TkThTSzxhxCY0wzjQGtuebWLIG0")
	fireBaseApp, appErr = firebase.NewApp(Ctx, config, opts)
	if appErr != nil {
		log.Fatalf("error initializing app: %v\n", appErr)
	}
}
