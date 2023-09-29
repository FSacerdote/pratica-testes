import app from "../src/app"
import { FruitInput } from "services/fruits-service"
import supertest from "supertest"

const api = supertest(app)

describe("POST /fruits", ()=>{

    it("Should return 201 when inserting a fruit", async ()=>{
        const fruit: FruitInput = {
            name: "Amora",
            price: 14
        }

        const result = await api.post("/fruits").send(fruit)
        expect(result.statusCode).toBe(201)
    })

    it("Should return 409 when inserting a fruit that is already registered", async ()=>{
        const fruit: FruitInput = {
            name: "Amora",
            price: 14
        }

        const result = await api.post("/fruits").send(fruit)
        expect(result.statusCode).toBe(409)
    })

    it("Should return 422 when inserting a fruit with data missing", async ()=>{
        type InvalidFruit = Omit<FruitInput, "price">
        const fruit: InvalidFruit  = {
            name: "Pessêgo"
        }

        const result = await api.post("/fruits").send(fruit)
        expect(result.statusCode).toBe(422)
    })
})

describe("GET /fruits", ()=>{

    it("Should return 404 when trying to get a fruit by an id that doesn't exist", async ()=>{
        const result = await api.get("/fruits/10")
        expect(result.statusCode).toBe(404)
    })

    it("Should return 400 when id param is present but not valid", async ()=>{
        const result = await api.get("/fruits/amora")
        expect(result.statusCode).toBe(400)
    })

    it("Should return one fruit when given a valid and existing id", async ()=>{
        const result = await api.get("/fruits/1")
        expect(result.statusCode).toBe(200)
        expect(result.body).toEqual({
            id: expect.any(Number),
            name: expect.any(String),
            price: expect.any(Number)
        })
    })

    it("Should return all fruits if no id is present", async ()=>{
        const result = await api.get("/fruits")
        expect(result.statusCode).toBe(200)
        expect(result.body).toHaveLength(1)
    })
})