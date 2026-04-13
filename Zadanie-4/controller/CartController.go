package controller

import (
    "net/http"
    "kwintaj.com/shop/database"
    "kwintaj.com/shop/model"
    "github.com/labstack/echo/v4"
)

func AddToCart(c echo.Context) error {    
    cartID := database.GetCartID()

    type AddRequest struct {
        ProductID uint `json:"product_id"`
        Quantity  int  `json:"quantity"`
    }

    req := new(AddRequest)
    if err := c.Bind(req); err != nil {
        return err
    }

    item := model.CartItem{
        CartID:    cartID,
        ProductID: req.ProductID,
        Quantity:  req.Quantity,
    }

    database.DB.Create(&item)
    return c.JSON(http.StatusCreated, item)
}

func ChangeQuantity(c echo.Context) error {    
    cartID := database.GetCartID()
    itemID := c.Param("id")
    var item model.CartItem
    
    if err := database.DB.Where("id = ? AND cart_id = ?", itemID, cartID).First(&item).Error; err != nil {
        return c.JSON(http.StatusNotFound, map[string]string{"message": "Produktu nie ma w koszyku"})
    }

    type AddRequest struct {
        NewQuantity  int  `json:"quantity"`
    }

    req := new(AddRequest)
    if err := c.Bind(req); err != nil {
        return err
    }

    item.Quantity = req.NewQuantity

    database.DB.Save(&item)
    return c.JSON(http.StatusOK, item)
}

func DeleteFromCart(c echo.Context) error {
    cartID := database.GetCartID()
    itemID := c.Param("id")
    var item model.CartItem
    
    if err := database.DB.Where("id = ? AND cart_id = ?", itemID, cartID).First(&item).Error; err != nil {
        return c.JSON(http.StatusNotFound, map[string]string{"message": "Produktu nie ma w koszyku"})
    }
    
    database.DB.Delete(&item)
    return c.NoContent(http.StatusNoContent)
}

func GetCart(c echo.Context) error {
    cartID := database.GetCartID()

    var items []model.CartItem

    if err := database.DB.Where("cart_id = ?", cartID).Find(&items).Error; err != nil {
        return c.JSON(http.StatusNotFound, map[string]string{"message": "Błąd koszyka"})
    }
    
    return c.JSON(http.StatusOK, items)
}