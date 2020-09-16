package firebaseclients

import (
	"context"
	"net/http"

	"firebase.google.com/go/auth"
)

// FireBaseAuthClient struct
type FireBaseAuthClient struct {
	authClient *auth.Client
}

// MakeNewAuthClient makes new firebase auth client
func MakeNewAuthClient() FireBaseAuthClient {
	firebaseAuthClient, err := fireBaseApp.Auth(Ctx)
	if err != nil {
		panic(err)
	}
	return FireBaseAuthClient{authClient: firebaseAuthClient}
}

// VerifyToken verifies a user token
func (fbAuthClient FireBaseAuthClient) VerifyToken(r *http.Request) (*auth.Token, bool) {
	token, err := fbAuthClient.authClient.VerifyIDToken(context.Background(), r.Header.Get("Authorisation"))
	if err != nil {
		return nil, false
	}
	return token, true
}
