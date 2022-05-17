import request from "supertest";
import { Connection } from "typeorm";
import { hash } from "bcryptjs";
import { v4 as uuid} from "uuid";
import  createConnection  from "../../../../database/index";
import { app } from "../../../../app";

let connection: Connection;
describe("Create User Controller", () => {
    beforeAll(async () => {
        connection = await createConnection();

        await connection.runMigrations();

        
        
    });
    afterAll(async () => {
        //await connection.dropDatabase();

        await connection.close();
    });
    it("Should be able to create a new User", async () => {
        const response = await request(app).post("/users").send({
            name:"User",
            email:"user@email.com",
            password:"user#admin"
        });
        expect(response.status).toBe(201);
    });
});