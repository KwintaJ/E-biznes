package controller

import (
    "net/http"
    "app/database"
    "app/model"
    "github.com/labstack/echo/v4"
)

func GetAllProducts(c echo.Context) error {
    var products []model.Product
    database.DB.Find(&products)
    
    return c.JSON(http.StatusOK, products)
}

func GetProduct(c echo.Context) error {
    id := c.Param("id")
    var product model.Product

    if err := database.DB.First(&product, id).Error; err != nil {
        return c.JSON(http.StatusNotFound, map[string]string{"message": "Produkt nie znaleziony"})
    }

    return c.JSON(http.StatusOK, product)
}

func CreateProduct(c echo.Context) error {
    product := new(model.Product)

    if err := c.Bind(product); err != nil {
        return err
    }

    database.DB.Create(&product)
    return c.JSON(http.StatusCreated, product)
}

func UpdateProduct(c echo.Context) error {
    id := c.Param("id")
    var product model.Product
    
    if err := database.DB.First(&product, id).Error; err != nil {
        return c.JSON(http.StatusNotFound, map[string]string{"message": "Produkt nie istnieje"})
    }

    if err := c.Bind(&product); err != nil {
        return err
    }
    
    database.DB.Save(&product)
    return c.JSON(http.StatusOK, product)
}

func DeleteProduct(c echo.Context) error {
    id := c.Param("id")
    var product model.Product

    if err := database.DB.First(&product, id).Error; err != nil {
        return c.JSON(http.StatusNotFound, map[string]string{"message": "Produkt nie istnieje"})
    }
    
    database.DB.Delete(&product)
    return c.NoContent(http.StatusNoContent)
}