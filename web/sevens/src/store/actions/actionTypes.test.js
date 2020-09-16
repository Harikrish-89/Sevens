import * as actionTypes from "./actionTypes";

describe("Action types", () =>{
    it("should verify all the auth action types", () =>{
        expect(actionTypes.AUTH_STARTED).toEqual("AUTH_STARTED");
        expect(actionTypes.AUTH_SUCCESS).toEqual("AUTH_SUCCESS");
        expect(actionTypes.AUTH_FAILURE).toEqual("AUTH_FAILURE");
        expect(actionTypes.AUTH_LOGOUT).toEqual("AUTH_LOGOUT");
    });

    it("should verify all the game action types", () =>{
        expect(actionTypes.GAME_FETCHED).toEqual("GAME_FETCHED");
        expect(actionTypes.GAME_FETCH_STARTED).toEqual("GAME_FETCH_STARTED");
        expect(actionTypes.GAME_FETCH_FAILED).toEqual("GAME_FETCH_FAILED");
        expect(actionTypes.CREATE_GAME).toEqual("CREATE_GAME");
        expect(actionTypes.CREATE_GAME_ASYNC).toEqual("CREATE_GAME_ASYNC");
    });

    it("should verify all the player action types", () =>{
        expect(actionTypes.PLAYER_JOIN).toEqual("PLAYER_JOIN");
        expect(actionTypes.PLAYER_JOINED).toEqual("PLAYER_JOINED");
        expect(actionTypes.PLAYER_JOIN_FAILED).toEqual("PLAYER_JOIN_FAILED");
    });
});