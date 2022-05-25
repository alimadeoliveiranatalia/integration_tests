import request from "supertest";
import { Connection } from "typeorm";
import {v4 as uuid } from "uuid";
import { hash } from "bcryptjs";
import createConnection from "../../../../database/index";
import auth from "../../../../config/auth";
import { app } from "../../../../app";
import { OperationType } from "../../entities/Statement";

let connection: Connection;

describe("GET: api/v1/statements/:statement_id", () => {
    beforeAll(async () => {
        connection = await createConnection();

        await connection.runMigrations();

        const id = uuid();

        const password = await hash("get_statement",8);

        await connection.query(`
            INSERT INTO USERS(id, name, email, password, created_at, updated_at)
            VALUES('${id}','GetUserStatement','get_statement@email.com','${password}','now()','now()')
        `);
        auth.jwt.secret = password;
    });
    afterAll(async () => {
        await connection.dropDatabase();

        await connection.close();
    });
    it("Should be able get statement operation", async () => {
        const user = await request(app)
        .post("/api/v1/sessions")
        .send({
            email:"get_statement@email.com",
            password:"get_statement"
        });

        const { token } = user.body;

        const statement = await request(app)
        .post("/api/v1/statements/deposit")
        .send({
            user_id: user.body.id,
            type: OperationType.DEPOSIT,
            amount: 100,
            description:"Deposit Test get statement"
        })
        .set({ Authorization: `Bearer ${ token }`});

        const list_statement = await request(app)
        .get("/api/v1/statements/"+statement.body.id)
        .set({ Authorization: `Bearer ${ token }`});
        expect(list_statement.body).toHaveProperty("id");
    });
});