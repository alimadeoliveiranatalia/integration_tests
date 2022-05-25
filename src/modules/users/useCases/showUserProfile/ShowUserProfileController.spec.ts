import { hash } from "bcryptjs";
import  request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuid } from "uuid";
import createConnection from "../../../../database/index";
import { app } from "../../../../app";
import auth from "../../../../config/auth";

let connection: Connection;
describe("GET: /api/v1/profile", () => {
    beforeAll(async () => {
        connection = await createConnection();

        await connection.runMigrations();

        const id = uuid();

        const password = await hash("access",8);

        await connection.query(`
            INSERT INTO USERS(id, name, email, password, created_at, updated_at)
            VALUES('${id}','UserAccess','access@email.com','${password}','now()','now()')
        `);
        auth.jwt.secret = password;
    });
    afterAll(async () => {
        await connection.dropDatabase();

        await connection.close();
    });
    it("Should be able show profile an User", async () => {
        const AuthUser = await request(app)
        .post("/api/v1/sessions")
        .send({
            email:"access@email.com",
            password:"access"
        });
        const { token } = AuthUser.body;

        const response = await request(app)
        .get("/api/v1/profile")
        .send({
            user_id:AuthUser.body.id
        })
        .set({
            Authorization: `Bearer ${ token }`
        });
        expect(response.body).toHaveProperty("id");
    });
});