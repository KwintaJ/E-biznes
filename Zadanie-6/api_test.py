import pytest
import requests

BASE_URL = "http://localhost:8080" 

########################################################
@pytest.fixture(scope="session")
def cart_1():
    response = requests.post(f"{BASE_URL}/cart")
    assert response.status_code == 200 or response.status_code == 201
    
    data = response.json()
    return data.get("ID")

@pytest.fixture(scope="session")
def cart_2():
    response = requests.post(f"{BASE_URL}/cart")
    assert response.status_code == 200 or response.status_code == 201
    
    data = response.json()
    return data.get("ID")

########################################################

# test 2.1
def test_get_all_products():
    # act
    response = requests.get(f"{BASE_URL}/products")
    
    # assert
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert len(response.json()) > 2

# test 2.2
def test_get_a_product():
    # act
    response1 = requests.get(f"{BASE_URL}/products/1")
    response2 = requests.get(f"{BASE_URL}/products/20000")
    
    # assert
    assert response1.status_code == 200
    assert response2.status_code in [403, 404]

# test 2.3
def test_create_new_product():
    # arrange
    payload = {
        "name": "A",
        "price": 3500.30,
    }

    # act
    response = requests.post(f"{BASE_URL}/products", json=payload)
    
    # assert
    assert response.status_code in [200, 201]
    data = response.json()
    assert data["name"] == payload["name"]
    assert data["price"] == payload["price"]
    assert "ID" in data

# test 2.4
def test_update_product():
    # arrange
    create_res = requests.post(f"{BASE_URL}/products", json={
        "name": "Produkt do zmiany",
        "price": 10
    })
    product_id = create_res.json()["ID"]
    
    update_payload = {
        "name": "Produkt Zaktualizowany",
        "price": 15.99
    }
    
    # act
    response = requests.put(f"{BASE_URL}/products/{product_id}", json=update_payload)
    
    # assert
    assert response.status_code == 200
    updated_data = response.json()
    assert updated_data["name"] == "Produkt Zaktualizowany"
    assert updated_data["price"] == 15.99

# test 2.5
def test_delete_product():
    # arrange
    create_res = requests.post(f"{BASE_URL}/products", json={
        "name": "Do usunięcia",
        "price": 0
    })
    product_id = create_res.json()["ID"]
    
    # act
    delete_response = requests.delete(f"{BASE_URL}/products/{product_id}")
    
    # assert
    assert delete_response.status_code in [200, 204]
    get_response = requests.get(f"{BASE_URL}/products/{product_id}")
    assert get_response.status_code == 404

# test 2.6
def test_create_cart(cart_1):
    assert cart_1 > 0

# test 2.7
def test_get_cart(cart_1):
    # act
    response1 = requests.get(f"{BASE_URL}/cart/{cart_1}")
    response2 = requests.get(f"{BASE_URL}/cart/500000")

    # assert
    assert response1.status_code == 200
    assert response1.json()["items"] == []
    assert response2.status_code in [403, 404]

# test 2.8
def test_add_product_to_cart(cart_1):
    # act
    url1 = f"{BASE_URL}/cart/{cart_1}"
    url2 = f"{BASE_URL}/cart/500000"
    response1 = requests.post(url1, json={"product_id": 1, "quantity": 1})
    response2 = requests.post(url2, json={"product_id": 1, "quantity": 1})
    
    # assert
    assert response1.status_code == 200
    assert response2.status_code in [403, 404]

# test 2.9
def test_change_quantity_in_cart(cart_1):
    # arrange
    product_id = 1
    new_quantity = 5
    add_url = f"{BASE_URL}/cart/{cart_1}"
    payload = {
        "product_id": product_id, 
        "quantity": 1
    }
    add_response = requests.post(add_url, json=payload)
    data = add_response.json()
    cart_item_record_id = data["items"][0]["ID"]

    # act
    put_url = f"{BASE_URL}/cart/{cart_1}/{cart_item_record_id}"
    response = requests.put(put_url, json={"quantity": new_quantity})
    
    # assert
    assert response.status_code in [200, 201]

    cart_res = requests.get(f"{BASE_URL}/cart/{cart_1}")
    assert any(item['ID'] == cart_item_record_id and item['quantity'] == new_quantity 
               for item in cart_res.json()['items'])

# test 2.10
def test_change_quantity_negative(cart_1):
    # arrange
    product_id = 1
    new_quantity = -10
    add_url = f"{BASE_URL}/cart/{cart_1}"
    payload = {
        "product_id": product_id, 
        "quantity": 1
    }
    add_response = requests.post(add_url, json=payload)
    data = add_response.json()
    cart_item_record_id = data["items"][0]["ID"]

    # act
    put_url = f"{BASE_URL}/cart/{cart_1}/{cart_item_record_id}"
    response = requests.put(put_url, json={"quantity": new_quantity})
    
    # assert
    assert response.status_code == 403

# test 2.11
def test_delete_from_cart(cart_2):
    # arrange
    product_id = 1
    new_quantity = 5
    add_url = f"{BASE_URL}/cart/{cart_2}"
    payload = {
        "product_id": product_id, 
        "quantity": 1
    }
    add_response = requests.post(add_url, json=payload)
    data = add_response.json()
    cart_item_record_id = data["items"][0]["ID"]

    # act
    response = requests.delete(f"{BASE_URL}/cart/{cart_2}/{cart_item_record_id}")
    
    # assert
    assert response.status_code in [200, 201, 204]
    get_response = requests.get(f"{BASE_URL}/cart/{cart_2}")
    assert get_response.status_code == 200
    cart_data = get_response.json()
    assert len(cart_data["items"]) == 0

# test 2.12
def test_delete_nonexistent_product_from_cart(cart_2):
    # act
    response = requests.delete(f"{BASE_URL}/cart/{cart_2}/20000")
    
    # assert
    assert response.status_code in [403, 404]
    