package controllers

import javax.inject._
import play.api.mvc._
import play.api.libs.json._
import models.Product
import scala.collection.mutable.ListBuffer

@Singleton
class ProductController @Inject()(val controllerComponents: ControllerComponents) extends BaseController {
  
  // lista jako baza danych
  private val productsList = ListBuffer(
    Product(1, "GeForce RTX 5080", 6000.0, 1),
    Product(2, "Intel Core i9-14900K", 2500.0, 1),
    Product(3, "Płyta główna ASUS ROG Z790", 1800.0, 1),
    Product(4, "Zasilacz be quiet 1000W", 900.0, 1),

    Product(5, "Logitech MX Master 3S", 450.0, 2),
    Product(6, "Klawiatura Keychron Q1", 850.0, 2),
    Product(7, "Monitor Dell UltraSharp 27", 2200.0, 2),
    Product(8, "Podkładka pod mysz SteelSeries XL", 120.0, 2),

    Product(9, "Słuchawki Sony WH-1000XM5", 1400.0, 3),
    Product(10, "Głośniki Edifier R1280DB", 550.0, 3),
    Product(11, "Mikrofon Blue Yeti", 600.0, 3)
  )
  
  // 1. Show all (GET)
  def getAll: Action[AnyContent] = Action {
    Ok(Json.toJson(productsList))
  }

  // 2. Show by ID (GET)
  def getById(id: Long): Action[AnyContent] = Action {
    productsList.find(_.id == id) match {
      case Some(product) => Ok(Json.toJson(product))
      case None => NotFound(Json.obj("message" -> "Produkt nie znaleziony"))
    }
  }

  // 3. Add (POST)
  def add(): Action[JsValue] = Action(parse.json) { request =>
    request.body.validate[Product].fold(
      errors => BadRequest(Json.obj("message" -> "Błędne dane")),
      product => {
        productsList += product
        Created(Json.toJson(product))
      }
    )
  }

  // 4. Update (PUT)
  def update(id: Long): Action[JsValue] = Action(parse.json) { request =>
    request.body.validate[Product].fold(
      errors => BadRequest(Json.obj("message" -> "Błędne dane")),
      updatedProduct => {
        val index = productsList.indexWhere(_.id == id)
        if (index >= 0) {
          productsList.update(index, updatedProduct.copy(id = id))
          Ok(Json.toJson(productsList(index)))
        } else {
          NotFound(Json.obj("message" -> "Produkt nie znaleziony"))
        }
      }
    )
  }

  // 5. Delete (DELETE)
  def delete(id: Long): Action[AnyContent] = Action {
    val index = productsList.indexWhere(_.id == id)
    if (index >= 0) {
      productsList.remove(index)
      Ok(Json.obj("message" -> "Produkt usunięty"))
    } else {
      NotFound(Json.obj("message" -> "Produkt nie znaleziony"))
    }
  }
}
