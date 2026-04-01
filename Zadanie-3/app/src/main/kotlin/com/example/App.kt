package com.example

import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import kotlinx.coroutines.runBlocking
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import io.github.cdimascio.dotenv.dotenv

@Serializable
data class DiscordMessage(val content: String)

fun main() {
    val client = HttpClient(CIO) {
        install(ContentNegotiation) {
            json(Json { ignoreUnknownKeys = true })
        }
    }
    
    val dotenv = dotenv()
    val botToken = dotenv["DISCORD_TOKEN"]
    val channelId = dotenv["DISCORD_CHANNEL_ID"]

    runBlocking {
        try {
            val response: HttpResponse = client.post("https://discord.com/api/v10/channels/$channelId/messages") {
                header(HttpHeaders.Authorization, "Bot $botToken")
                contentType(ContentType.Application.Json)
                setBody(DiscordMessage("Witaj Discordzie!"))
            }

            if (response.status.isSuccess()) {
                println("Sukces! Wiadomość wysłana.")
            } else {
                println("Błąd: ${response.status} - ${response.bodyAsText()}")
            }
        } catch (e: Exception) {
            println("Wyjątek: ${e.message}")
        } finally {
            client.close()
        }
    }
}
