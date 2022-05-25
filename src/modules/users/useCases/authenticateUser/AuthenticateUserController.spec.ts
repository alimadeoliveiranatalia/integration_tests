import request from "supertest";
import { Connection } from "typeorm";
import  createConnection  from "../../../../database/index";
import { app } from "../../../../app";
import auth from "../../../../config/auth";

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
    it("Should not be able authenticate an nonexistent User", async () => {
        const user = await request(app)
            .post("/api/v1/users")
            .send({
                name:"flavia",
                email:"email@flavia.com",
                password:"pass#flavia"
            });
            auth.jwt.secret = "pass#flavia";
            const response = await request(app)
            .post("/api/v1/sessions")
            .send({
                email:"email@flaviaBetel.com",
                password:user.body.password
            })
        expect(response.status).toBe(401);
    });
    it("Should not be able authenticate with incorrect password", async () => {
        const user = await request(app)
            .post("/api/v1/users")
            .send({
                name:"Joabe",
                email:"email@joabe.com",
                password:"pass#joabe"
            });
            auth.jwt.secret = "pass#joabe"
            const response = await request(app)
            .post("/api/v1/sessions")
            .send({
                email:user.body.email,
                password:"pass#joabe$php"
            });
        expect(response.status).toBe(401);
    });

});