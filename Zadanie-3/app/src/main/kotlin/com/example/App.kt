package com.example

import dev.kord.core.Kord
import dev.kord.core.event.message.MessageCreateEvent
import dev.kord.core.on
import dev.kord.gateway.Intent
import dev.kord.gateway.PrivilegedIntent
import io.github.cdimascio.dotenv.dotenv

class Category(val id: Int, val name: String)

val categories = listOf(
    Category(1, "Elektronika"),
    Category(2, "Gry"),
    Category(3, "Akcesoria")
)

suspend fun main() {
    val dotenv = dotenv { directory = ".." }
    val token = dotenv["DISCORD_TOKEN"]
    val channel = dotenv["DISCORD_CHANNEL_ID"]       
    
    val kord = Kord(token)

    kord.on<MessageCreateEvent> {
        if (message.author?.isBot == true) return@on

        val content = message.content.lowercase()

        when {
            content.equals("!sklep") -> {
                val response = categories.joinToString("\n") { "- ${it.name}" }
                message.channel.createMessage("**Dostępne kategorie:**\n$response")
            }
        }
    }

    kord.login {
        @OptIn(PrivilegedIntent::class)
        intents += Intent.MessageContent
    }
}