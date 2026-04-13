package controller

import (
    "net/http"
    "kwintaj.com/shop/database"
    "kwintaj.com/shop/model"
    "github.com/labstack/echo/v4"
)

func GetCategories(c echo.Context) error {
    var categories []model.Category
    database.DB.Preload("Products").Find(&categories)

    return c.JSON(http.StatusOK, categories)
}

func CreateCategory(c echo.Context) error {
    cat := new(model.Category)
    if err := c.Bind(cat); err != nil {
        return err
    }
    database.DB.Create(&cat)
    return c.JSON(http.StatusCreated, cat)
}

func GetCategoryProducts(c echo.Context) error {
    id := c.Param("id")
    var products []model.Product

    if err := database.DB.Preload("Category").Where("category_id = ?", id).Find(&products).Error; err != nil {
        return c.JSON(http.StatusNotFound, map[string]string{"message": "Zła kategoria"})
    }
    
    return c.JSON(http.StatusOK, products)
}