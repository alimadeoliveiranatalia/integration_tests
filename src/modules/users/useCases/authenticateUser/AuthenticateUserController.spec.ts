import request from "supertest";
import { Connection } from "typeorm";
import  createConnection  from "../../../../database/index";
import { app } from "../../../../app";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let connection: Connection;
describe("Authenticate User", () => {
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
        const response = await request(app)
        .post("/api/v1/sessions")
        .send({
            email: "email@user.com",
            password:"pass"
        });
        expect(response.body).toHaveProperty("token");
    });
    it("Should not be able authenticate an nonexistent User", () => {
        expect(async () => {
            const user = await request(app)
            .post("/api/v1/users")
            .send({
                name:"test_user",
                email:"email@test%.com",
                password:"pass"
            });
            await request(app)
            .post("/api/v1/sessions")
            .send({
                email:"email@test.com",
                password:user.body.password
            })
        }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
    });
    it("Should not be able authenticate with incorrect password", () => {
        expect(async () => {
            const user = await request(app)
            .post("/api/v1/users")
            .send({
                name:"test_user1",
                email:"email@test1.com",
                password:"test1"
            });
            await request(app)
            .post("/api/v1/sessions")
            .send({
                email:user.body.email,
                password:"incorrect"
            });
        }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
    });

});