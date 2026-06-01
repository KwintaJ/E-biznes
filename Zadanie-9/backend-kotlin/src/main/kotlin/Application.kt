package com.shop

import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation as ClientContentNegotiation
import io.ktor.client.plugins.HttpTimeout
import io.ktor.client.request.*
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.plugins.contentnegotiation.ContentNegotiation as ServerContentNegotiation
import io.ktor.server.plugins.cors.routing.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.Serializable

@Serializable
data class UserMessage(val message: String)

@Serializable
data class BotResponse(val reply: String)

fun main() {
    embeddedServer(Netty, port = 8080) {
        install(CORS) {
            anyHost()
            allowHeader(HttpHeaders.ContentType)
        }
        
        install(ServerContentNegotiation) {
            json()
        }

        val httpClient = HttpClient(CIO) {
            install(ClientContentNegotiation) {
                json()
            }
            
            install(HttpTimeout) {
                requestTimeoutMillis = 120_000
                connectTimeoutMillis = 15_000
                socketTimeoutMillis = 120_000
            }
        }

        routing {
            post("/chat") {
                val userRequest = call.receive<UserMessage>()

                try {
                    val pythonResponse: BotResponse = httpClient.post("http://127.0.0.1:8000/api/chat") {
                        contentType(ContentType.Application.Json)
                        setBody(userRequest)
                    }.body()

                    call.respond(pythonResponse)
                } catch (e: Exception) {
                    call.respond(BotResponse(reply = "Błąd komunikacji backendu: ${e.localizedMessage}"))
                }
            }
        }
    }.start(wait = true)
}