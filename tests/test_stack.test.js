 // <reference types="jest" />
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
    const nonExistentUserData = {
        email: "test1@test1.com",
        password: '654321'
    }
    const orderData = {
        product: 'piwo',
        quantity: 1,
        userId: 2
    }
    const invalidOrderData = {
        product: 'piwo',
        quantity: '23',
        userId: 2
    }
    const updatedOrderData = {
        product: 'wino',
        quantity: 1,
        userId: 2
    }
    const updatedUserData = {
        email: 'update@test.com',
        password: '123456'
    }

    beforeAll(async () => {
        const composeDir = path.resolve(__dirname, "../compose");

        environment = await new DockerComposeEnvironment(composeDir, [
            "main.yaml",
            "networks.yaml",
            "dev.override.yaml"
        ])
            .withWaitStrategy("auth", Wait.forLogMessage("auth api started on port 4000"))
            .withWaitStrategy("users", Wait.forLogMessage("Users service running on port 4000"))
            .withWaitStrategy("orders", Wait.forLogMessage("Orders service running on port 4000"))
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
        expect(res.status).toBe(201);
        expect(res.data.token).toBeDefined();
        token = res.data.token;
    });

    test('POST /login - 404', async () => {
        const res = await axios
            .post("http://localhost:4001/login", nonExistentUserData)
            .catch((err) => err.response);
        expect(res.status).toBe(404);
        expect(res.data.message).toBe("User not found");
    });


    test("GET /users – with authorization", async () => {
        const res = await axios.get("http://localhost:4002/", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log('USERS:',res.data)
        expect(res.status).toBe(200);
        expect(Array.isArray(res.data)).toBe(true);
    });


    test('PUT /users success', async () => {
        const res = await axios.put("http://localhost:4002/1", updatedUserData, {
            headers: { Authorization: `Bearer ${token}` }
        });

        expect(res.status).toBe(200);

    });




    test('DELETE /users successful', async () => {
        const res = await axios.delete("http://localhost:4002/1", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        expect(res.status).toBe(200);
        expect(res.data.message).toBe("User deleted");

    })
    test('PUT /users 404', async () => {
        const res = await axios.put("http://localhost:4002/1", updatedUserData, {
            headers: { Authorization: `Bearer ${token}` }
        }).catch(err => err.response);

        expect(res).toBeDefined();
        expect(res.status).toBe(404);
    });

    test('DELETE /users 404', async () => {
        const res = await axios.delete("http://localhost:4002/99", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).catch((err) => err.response);
        expect(res.status).toBe(404);
        expect(res.data.message).toBe("User not found");
    })

    //----------orders-----------

    test("POST /order successfully", async () => {
        const res = await axios.post("http://localhost:4003/", orderData);
        expect(res.status).toBe(201);

    })

    test("GET /orders – public access", async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const res = await axios.get("http://localhost:4003/")
            .catch(err => err.response);
        console.log("ORDERS TEST:", res.status, res.data);
        expect(res.status).toBe(200);
        expect(res.data.orders).toBeDefined();
    });

    test("POST /orders invalid data", async () => {
        const res = await axios.post("http://localhost:4003/", invalidOrderData)
        .catch(err => err.response);
        expect(res.status).toBe(400);
        expect(res.data.message).toBe('invalid data');
    })
    test("PUT /orders succesfull", async () => {
        const res = await axios.put("http://localhost:4003/3", updatedOrderData);
        expect(res.status).toBe(200);
    })
    test("PUT /orders 404 ", async () => {
        const res = await axios.put("http://localhost:4003/99", updatedOrderData)
            .catch(err => err.response);
        expect(res.status).toBe(404);
    })

    test('DELETE /orders successfully', async () => {
        const res = await axios.delete("http://localhost:4003/3");
        expect(res.status).toBe(200);
        expect(res.data.id).toBe(3);
    });

    test('DELETE /orders 404', async () => {
        const res = await axios
            .delete("http://localhost:4003/3")
            .catch(err => {
                console.error("DELETE 404 ERROR:", err.toJSON?.() || err.message || err);
                return err.response;
            });

        expect(res).toBeDefined();
        expect(res.status).toBe(404);
        expect(res.data.message).toBe("not found");
    });




});
