import request from "supertest";
import { Connection } from "typeorm";
import {v4 as uuid } from "uuid";
import { hash } from "bcryptjs";
import createConnection from "../../../../database/index";
import auth from "../../../../config/auth";
import { app } from "../../../../app";

let connection: Connection;

describe("GET: /api/v1/statements/balance",() => {
    beforeAll(async() => {
        connection = await createConnection();

        await connection.runMigrations();

        const id = uuid();

        const password = await hash("get",8);

        await connection.query(`
            INSERT INTO USERS(id, name, email, password, created_at, updated_at)
            VALUES('${id}','UserGetBalance','getbalance@email.com','${password}','now()','now()')
        `);
        auth.jwt.secret = password;
    });
    afterAll(async () => {
        await connection.dropDatabase();

        await connection.close();
    });
    it("Should be able to get User balance", async () => {
        const user = await request(app)
        .post("/api/v1/sessions")
        .send({
            email:"getbalance@email.com",
            password:"get"
        });

        const { token } = user.body;

        const response = await request(app)
        .get("/api/v1/statements/balance")
        .send({
            user_id:user.body.id
        })
        .set({Authorization: `Bearer ${ token }`});
        expect(response.body).toHaveProperty("statement");
    })
});