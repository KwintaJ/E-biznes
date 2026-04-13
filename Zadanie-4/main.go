package main

import (
    "kwintaj.com/shop/controller"
    "github.com/labstack/echo/v4"
)

func main() {
    e := echo.New()

    g := e.Group("/products")
    
    g.GET("", controller.GetAllProducts)
    g.GET("/:id", controller.GetProduct)
    g.POST("", controller.CreateProduct)
    g.PUT("/:id", controller.UpdateProduct)
    g.DELETE("/:id", controller.DeleteProduct)

    e.Logger.Fatal(e.Start(":8080"))
}