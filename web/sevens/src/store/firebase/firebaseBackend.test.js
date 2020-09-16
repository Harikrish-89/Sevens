import * as firebase from "./firebaseBackend";

describe("firebase", ()=>{
    it("should verify the firebase app",()=>{
        expect(firebase.firebaseApp).toBeDefined();
    })
})