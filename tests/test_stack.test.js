/// <reference types="jest" />
import {DockerComposeEnvironment, Wait} from "testcontainers";
import path from "path";
import axios from "axios";
import {jest} from '@jest/globals'
import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
jest.setTimeout(180_000);

describe("Docker Compose – register, login, GET users & orders", () => {
    let environment;
    let token;

    const userData = {
        email: "test@test.com",
        password: "123456",
    };

    beforeAll(async () => {
        const composeDir = path.resolve(__dirname, "../compose");

        environment = await new DockerComposeEnvironment(composeDir, [
            "main.yaml",
            "networks.yaml",
            "dev.override.yaml"
        ])
            .withWaitStrategy("auth-1", Wait.forLogMessage("auth api started on port 4000"))
            .withWaitStrategy("users-1", Wait.forLogMessage("Users service running on port 4000"))
            .withWaitStrategy("orders-1", Wait.forLogMessage("Orders service running on port 4000"))
            .withStartupTimeout(120_000)
            .up();
    });

    afterAll(async () => {
        await environment.down({ removeVolumes: true });
    });

    test("POST /register – register user successfully", async () => {
        const res = await axios.post("http://localhost:4002/register", userData);
        expect(res.status).toBe(201);
        expect(res.data.message).toBe("User registered");
    });

    test("POST /login – login successfully", async () => {
        const res = await axios.post("http://localhost:4001/login", userData);
        expect(res.status).toBe(200);
        expect(res.data.token).toBeDefined();
        token = res.data.token;
    });

    test("GET /users – with authorization", async () => {
        const res = await axios.get("http://localhost:4002/", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        expect(res.status).toBe(200);
        expect(Array.isArray(res.data)).toBe(true);
    });

    test("GET /orders – public access", async () => {
        const res = await axios.get("http://localhost:4003/");
        expect(res.status).toBe(200);
        expect(res.data.orders).toBeDefined();
    });
});
