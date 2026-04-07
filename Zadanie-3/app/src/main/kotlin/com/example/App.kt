package com.example

import dev.kord.core.Kord
import dev.kord.core.event.message.MessageCreateEvent
import dev.kord.core.on
import dev.kord.gateway.Intent
import dev.kord.gateway.PrivilegedIntent
import io.github.cdimascio.dotenv.dotenv

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

suspend fun main() {
    val dotenv = dotenv { directory = ".." }
    val token = dotenv["DISCORD_TOKEN"]
    val channel = dotenv["DISCORD_CHANNEL_ID"]       
    
    val kord = Kord(token)

    kord.on<MessageCreateEvent> {
        if (message.author?.isBot == true) return@on

        val content = message.content.lowercase().trim()

        when {
            content.equals("!sklep") -> {
                val response = categories.joinToString("\n") { "- ${it.name}" }
                message.channel.createMessage("**Dostępne kategorie:**\n$response")
            }

            content.startsWith("!produkty") -> {
                val requestedCategoryName = content.removePrefix("!produkty").trim()

                if (requestedCategoryName.isEmpty()) {
                    message.channel.createMessage("Użycie: `!produkty [nazwa_kategorii]` (np. `!produkty Gry`)")
                    return@on
                }

                val category = categories.find { it.name.equals(requestedCategoryName, ignoreCase = true) }

                if (category == null) {
                    message.channel.createMessage("Nie istnieje taka kategoria **${requestedCategoryName}**")
                } else {
                    val matchingProducts = products.filter { it.categoryId == category.id }

                    if (matchingProducts.isEmpty()) {
                        message.channel.createMessage("Brak produktów w kategorii **${category.name}**.")
                    } else {
                        val productList = matchingProducts.joinToString("\n") { "- **${it.name}**: ${it.price} zł" }
                        message.channel.createMessage("Produkty w kategorii **${category.name}**:\n$productList")
                    }
                }
            }
        }
    }

    kord.login {
        @OptIn(PrivilegedIntent::class)
        intents += Intent.MessageContent
    }
}