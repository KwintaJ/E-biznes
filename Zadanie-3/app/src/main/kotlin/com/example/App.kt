package com.example

import dev.kord.core.Kord
import dev.kord.core.event.message.MessageCreateEvent
import dev.kord.core.on
import dev.kord.gateway.Intent
import dev.kord.gateway.PrivilegedIntent
import io.github.cdimascio.dotenv.dotenv
import com.slack.api.bolt.App
import com.slack.api.bolt.socket_mode.SocketModeApp
import kotlinx.coroutines.*

// --- baza danych jako listy ---
class Category(val id: Int, val name: String)
class Product(var name: String, var categoryId: Int, var price: Double)

val categories = listOf(
    Category(1, "Elektronika"),
    Category(2, "Gry"),
    Category(3, "Akcesoria")
)

val products = listOf(
    Product("Myszka gamingowa", 1, 250.00),
    Product("Monitor 4K", 1, 1299.99),
    Product("Wiedźmin 3", 2, 69.59),
    Product("Cyberpunk 2077", 2, 124.45),
    Product("Podkładka pod mysz", 3, 30.00)
)

// --- logika odpowiedzi ---
fun getResponse(query: String): String {
    val q = query.lowercase().trim()
    return when {
        q.startsWith("!sklep") -> {
            val req = q.removePrefix("!sklep").trim()

            when {
                req.isEmpty() -> "Cześć! Tu sklep KwintaJ-KtorBot!\n\nDostępne komendy:\n- Lista kategorii:  `!sklep kategorie`\n- Produkty w kategorii: `!sklep [nazwa_kategorii]`"
                
                req.equals("kategorie") -> {
                    val response = categories.joinToString("\n") { "- ${it.name}" }
                    "**Dostępne kategorie:**\n$response"
                }

                else -> {
                    val category = categories.find { it.name.equals(req, ignoreCase = true) }

                    if (category == null) "Nie istnieje kategoria **${query.removePrefix("!sklep").trim()}**" 
                    else {
                        val matchingProducts = products.filter { it.categoryId == category.id }
                        
                        if (matchingProducts.isEmpty()) "Brak produktów w kategorii **${category.name}**."
                        else {
                            val productList = matchingProducts.joinToString("\n") { "- **${it.name}**: ${it.price} zł" }
                            "Produkty w kategorii **${category.name}**:\n$productList"
                        }
                    }
                }
            }
        }
        
        else -> ""
    }
}

fun main() {
    runBlocking {
        // --- tokeny botow ---
        val dotenv = dotenv { directory = ".." }
        val dsc_token = dotenv["DISCORD_TOKEN"]
        val channel = dotenv["DISCORD_CHANNEL_ID"]
        val slck_app = dotenv["SLACK_APP_TOKEN"]
        val slck_bot = dotenv["SLACK_BOT_TOKEN"]       
        
        // --- discord ---
        launch {
            val kord = Kord(dsc_token)
            kord.on<MessageCreateEvent> {
                if (message.author?.isBot == true) return@on
                val reply = getResponse(message.content)
                if (reply.isNotEmpty()) message.channel.createMessage(reply)
            }
            kord.login {
                @OptIn(PrivilegedIntent::class)
                intents += Intent.MessageContent
            }
        }

        // --- slack ---
        launch(Dispatchers.IO) {
            val config = com.slack.api.bolt.AppConfig.builder().singleTeamBotToken(slck_bot).build()
            val slackApp = App(config)
            
            slackApp.event(com.slack.api.model.event.AppMentionEvent::class.java) { payload, ctx ->
                val reply = getResponse(payload.event.text.replace("<@.*?>".toRegex(), ""))
                if (reply.isNotEmpty()) ctx.say(reply)
                ctx.ack()
            }

            val socketModeApp = SocketModeApp(slck_app, slackApp)
            socketModeApp.start() 
        }
    }
}