import request from "supertest";
import { Connection } from "typeorm";
import  createConnection  from "../../../../database/index";
import { app } from "../../../../app";

let connection: Connection;
describe("Create User Controller", () => {
    beforeAll(async () => {
        connection = await createConnection();

        await connection.runMigrations();        
        
    });
    afterAll(async () => {
        await connection.dropDatabase();

        await connection.close();
    });
    it("Should be able to create a new User", async () => {
        const response = await request(app)
        .post("/api/v1/users")
        .send({
            name:"User",
            email:"user@email.com",
            password:"user#admin"
        });
        expect(response.status).toBe(201);
    });
    it("Should not be possible to create a user with email exists", async () => {
        await request(app)
        .post("/api/v1/users")
        .send({
            name:"User1",
            email:"user1@email.com",
            password:"user1#admin"
        });
        const response = await request(app)
        .post("/api/v1/users")
        .send({
            name:"User2",
            email:"user1@email.com",
            password:"user2#admin"
        });
        expect(response.status).toBe(400);
    });
});