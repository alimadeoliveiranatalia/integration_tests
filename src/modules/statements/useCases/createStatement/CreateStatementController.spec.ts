import request from "supertest";
import { Connection } from "typeorm";
import {v4 as uuid } from "uuid";
import { hash } from "bcryptjs";
import createConnection from "../../../../database/index";
import auth from "../../../../config/auth";
import { app } from "../../../../app";
import { OperationType } from "../../entities/Statement";

let connection: Connection;

describe("Create Statement Controller", () => {
    beforeAll(async() => {
        connection = await createConnection();

        await connection.runMigrations();

        const id = uuid();

        const password = await hash("statement",8);

        await connection.query(`
            INSERT INTO USERS(id, name, email, password, created_at, updated_at)
            VALUES('${id}','UserStatement','statement@email.com','${password}','now()','now()')
        `);
        auth.jwt.secret = password;
    });
    afterAll(async () => {
        await connection.dropDatabase();

        await connection.close();
    });
    it("POST: /api/v1/statements/deposit", async () => {
        const user = await request(app)
        .post("/api/v1/sessions")
        .send({
            email:"statement@email.com",
            password:"statement"
        });
        const { token } = user.body;
        const deposit = await request(app)
        .post("/api/v1/statements/deposit")
        .send({
            user_id: user.body.id,
            type: OperationType.DEPOSIT,
            amount: 40,
            description:"Deposit Test"
        })
        .set({ Authorization: `Bearer ${ token }`});
        expect(deposit.body).toHaveProperty("id");
        expect(deposit.status).toBe(201);
    });
    it("POST: /api/v1/statements/withdraw", async () => {
        const user = await request(app)
        .post("/api/v1/sessions")
        .send({
            email:"statement@email.com",
            password:"statement"
        });

        const { token } = user.body;

        await request(app)
        .post("/api/v1/statements/deposit")
        .send({
            user_id: user.body.id,
            type: OperationType.DEPOSIT,
            amount: 140,
            description:"Deposit Test"
        })
        .set({ Authorization: `Bearer ${ token }`});

        const withdraw = await request(app)
        .post("/api/v1/statements/withdraw")
        .send({
            user_id: user.body.id,
            type: OperationType.WITHDRAW,
            amount: 40,
            description:"Withdraw Test"
        })
        .set({ Authorization: `Bearer ${ token }`});
        
        expect(withdraw.body).toHaveProperty("id");
        expect(withdraw.status).toBe(201);
    });
});