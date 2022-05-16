import request from "supertest";
import { app } from "../../../../app";
describe("Create User Controller", () => {
    it("Should be able to create a new User", async () => {
        const response = await request(app).post("/users").send({
            name:"User",
            email:"user@email.com",
            password:"user#admin"
        });
        expect(response.status).toBe(201);
    });
});