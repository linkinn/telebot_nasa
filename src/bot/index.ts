import TelegramBot from 'node-telegram-bot-api'

import api from '../services/api'

const msg = "Algum asteroide oferece perigo ao planeta Terra na data de hoje?"

type SendMessageParams = {
    name: string
    diameter: string
    distance: string
    speed: string
    url: string
}


class Bot {
    private bot
    private user: number[]

    constructor() {
        this.bot = new TelegramBot(process.env.TOKEN as string, {polling: true})
        this.user = []
    }

    getUsers() {
        return this.user
    }

    async getAteroidsPotential() {
        const todayDate = new Date().toISOString().slice(0,10);
        const { data } = await api.get(`feed?start_date=${todayDate}&end_date=${todayDate}&api_key=${process.env.API_KEY}`)
        const asteroids = data.near_earth_objects[todayDate].filter((neo: any) => neo.is_potentially_hazardous_asteroid === true)
        return asteroids
    }

    createText({name, diameter, distance, speed, url}: SendMessageParams) {
        return `Sim!\n\nNome: ${name}\nDiâmetro estimado (em Km): ${diameter}\nDistância em que ele irá passar em relação à Terra (em Km): ${distance}\nVelocidade relativa à Terra (em Km/h): ${speed}\nLink NASA: ${url}`
    }

    async sendMessage(id: number) {
        const asteroids = await this.getAteroidsPotential()

        if(asteroids.length > 0) {
            asteroids.forEach((asteroid: any) => {
                const { estimated_diameter_max } = asteroid.estimated_diameter.kilometers
                const { relative_velocity, miss_distance } = asteroid.close_approach_data[0]

                const text = this.createText({
                    name: asteroid.name,
                    diameter: estimated_diameter_max,
                    distance: miss_distance.kilometers,
                    speed: relative_velocity.kilometers_per_hour,
                    url: asteroid.links.self
                })

                this.bot.sendMessage(id, text)
            });
        }
    }

    execute() {
        this.bot.onText(/\/register/, (message) => {
            this.user.push(message.chat.id)
            this.bot.sendMessage(message.chat.id, `${message.chat.username} registrado`)
        })

        this.bot.on("message", async (message) => {
            if (message.text === "/register") {
                return
            }
            if(message.text !== msg) {
                this.bot.sendMessage(message.chat.id, "Não")
            }

            await this.sendMessage(message.chat.id)
        })
    }

    async schedule(users: number[]) {
        if (users.length === 0) {
            console.log('Ainda não tem usuario registrador!')
            return
        }
        const promises = users.map(user => {
            return this.sendMessage(user)
        })

        Promise.all(promises)
    }
}

export default Bot
