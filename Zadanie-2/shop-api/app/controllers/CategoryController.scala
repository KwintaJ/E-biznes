package controllers

import javax.inject._
import play.api.mvc._
import play.api.libs.json._
import models.Category
import scala.collection.mutable.ListBuffer

@Singleton
class CategoryController @Inject()(val controllerComponents: ControllerComponents) extends BaseController {
  
  // lista jako baza danych
  private val categoriesList = ListBuffer(
    Category(1, "Komponenty PC"),
    Category(2, "Peryferia"),
    Category(3, "Audio")
  )

  // 1. Show all (GET)
  def getAll: Action[AnyContent] = Action {
    Ok(Json.toJson(categoriesList))
  }

  // 2. Show by ID (GET)
  def getById(id: Long): Action[AnyContent] = Action {
    categoriesList.find(_.id == id) match {
      case Some(category) => Ok(Json.toJson(category))
      case None => NotFound(Json.obj("message" -> "Kategoria nie znaleziona"))
    }
  }

  // 3. Add (POST)
  def add(): Action[JsValue] = Action(parse.json) { request =>
    request.body.validate[Category].fold(
      errors => BadRequest(Json.obj("message" -> "Błędne dane")),
      category => {
        categoriesList += category
        Created(Json.toJson(category))
      }
    )
  }

  // 4. Update (PUT)
  def update(id: Long): Action[JsValue] = Action(parse.json) { request =>
    request.body.validate[Category].fold(
      errors => BadRequest(Json.obj("message" -> "Błędne dane")),
      updatedCategory => {
        val index = categoriesList.indexWhere(_.id == id)
        if (index >= 0) {
          categoriesList.update(index, updatedCategory.copy(id = id))
          Ok(Json.toJson(categoriesList(index)))
        } else {
          NotFound(Json.obj("message" -> "Kategoria nie znaleziona"))
        }
      }
    )
  }

  // 5. Delete (DELETE)
  def delete(id: Long): Action[AnyContent] = Action {
    val index = categoriesList.indexWhere(_.id == id)
    if (index >= 0) {
      categoriesList.remove(index)
      Ok(Json.obj("message" -> "Kategoria usunięta"))
    } else {
      NotFound(Json.obj("message" -> "Kategoria nie znaleziona"))
    }
  }
}