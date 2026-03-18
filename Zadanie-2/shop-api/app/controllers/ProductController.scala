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
    Product(1, "GeForce RTX 5080", 6000.0),
    Product(2, "Logitech MX Master 3S", 450.0)
  )
  
}