package com.example

import dev.kord.core.Kord
import dev.kord.core.event.message.MessageCreateEvent
import dev.kord.core.on
import dev.kord.gateway.Intent
import dev.kord.gateway.PrivilegedIntent
import io.github.cdimascio.dotenv.dotenv

suspend fun main() {
    val dotenv = dotenv { directory = ".." }
    val token = dotenv["DISCORD_TOKEN"]
    val channel = dotenv["DISCORD_CHANNEL_ID"]       
    
    val kord = Kord(token)

    kord.on<MessageCreateEvent> {
        if (message.author?.isBot == true) return@on

        val content = message.content.lowercase()

        when {
            content == "!bot" -> {
                message.channel.createMessage("Cześć!")
            }
        }
    }

    kord.login {
        @OptIn(PrivilegedIntent::class)
        intents += Intent.MessageContent
    }
}