import request from "supertest";
import { Connection } from "typeorm";
import  createConnection  from "../../../../database/index";
import { app } from "../../../../app";
import auth from "../../../../config/auth";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let connection: Connection;
describe("POST: /api/v1/sessions", () => {
    beforeAll(async () => {
        connection = await createConnection();

        await connection.runMigrations();
        
    });
    afterAll(async () => {
        await connection.dropDatabase();

        await connection.close();
    });
    it("Should be able authenticate User", async () => {
        await request(app)
        .post("/api/v1/users")
        .send({
            name: "UserAuth",
            email: "email@user.com",
            password: "pass"
        });

        auth.jwt.secret = "pass"; 
         
        const response = await request(app)
        .post("/api/v1/sessions")
        .send({
            email: "email@user.com",
            password:"pass"
        });
        expect(response.body).toHaveProperty("token");
    });
    /*it("Should not be able authenticate an nonexistent User", () => {
        expect(async () => {
            await request(app)
            .post("/api/v1/users")
            .send({
                name:"flavia",
                email:"email@flavia.com",
                password:"pass#flavia"
            });
            auth.jwt.secret = "pass#flavia";
            await request(app)
            .post("/api/v1/sessions")
            .send({
                email:"email@flaviaBetel.com",
                password:"pass#flavia"
            })
        }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
    });
    it("Should not be able authenticate with incorrect password", () => {
        expect(async () => {
            await request(app)
            .post("/api/v1/users")
            .send({
                name:"Joabe",
                email:"email@joabe.com",
                password:"pass#joabe"
            });
            auth.jwt.secret = "pass#joabe"
            await request(app)
            .post("/api/v1/sessions")
            .send({
                email:"email@joabe.com",
                password:"pass#joabe$php"
            });
        }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
    });*/

});