package controllers

import javax.inject._
import play.api.mvc._
import play.api.libs.json._
import models.CartItem
import scala.collection.mutable.ListBuffer

@Singleton
class CartController @Inject()(val controllerComponents: ControllerComponents) extends BaseController {

  implicit val cartItemFormat: Format[CartItem] = Json.format[CartItem]
  private val cartItemsList: ListBuffer[CartItem] = ListBuffer[CartItem]()
  private var nextId: Long = 1

  // 1. Show all (GET)
  def getAll: Action[AnyContent] = Action {
    Ok(Json.toJson(cartItemsList.toList))
  }

  // 2. Show by ID (GET)
  def getById(id: Long): Action[AnyContent] = Action {
    cartItemsList.find(_.id == id) match {
      case Some(item) => Ok(Json.toJson(item))
      case None => NotFound(Json.obj("message" -> "Element koszyka nie znaleziony"))
    }
  }

  // 3. Add (POST)
  def add(): Action[JsValue] = Action(parse.json) { request =>
    request.body.validate[CartItem].fold(
      errors => BadRequest(Json.obj("message" -> "Błędne dane")),
      item => {
        val existingItemIndex = cartItemsList.indexWhere(_.productId == item.productId)
        
        if (existingItemIndex >= 0) {
          val existingItem = cartItemsList(existingItemIndex)
          val updatedItem = existingItem.copy(quantity = existingItem.quantity + 1)
          cartItemsList.update(existingItemIndex, updatedItem)
          Ok(Json.toJson(updatedItem))
        } else {
          val itemWithNewId = item.copy(id = nextId)
          nextId += 1
          
          cartItemsList += itemWithNewId
          Created(Json.toJson(itemWithNewId))
        }
      }
    )
  }

  // 4. Update (PUT)
  def update(id: Long): Action[JsValue] = Action(parse.json) { request =>
    request.body.validate[CartItem].fold(
      errors => BadRequest(Json.obj("message" -> "Błędne dane")),
      updatedItem => {
        val index = cartItemsList.indexWhere(_.id == id)
        if (index >= 0) {
          cartItemsList.update(index, updatedItem.copy(id = id))
          Ok(Json.toJson(cartItemsList(index)))
        } else {
          NotFound(Json.obj("message" -> "Element koszyka nie znaleziony"))
        }
      }
    )
  }

  // 5. Delete (DELETE)
  def delete(id: Long): Action[AnyContent] = Action {
    val index = cartItemsList.indexWhere(_.id == id)
    if (index >= 0) {
      cartItemsList.remove(index)
      Ok(Json.obj("message" -> "Element usunięty z koszyka"))
    } else {
      NotFound(Json.obj("message" -> "Element koszyka nie znaleziony"))
    }
  }
}