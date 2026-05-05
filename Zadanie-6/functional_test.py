import os
import pytest
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support import expected_conditions as EC

@pytest.fixture
def driver():
    bstack_user = os.getenv("BROWSERSTACK_USERNAME")
    bstack_key = os.getenv("BROWSERSTACK_ACCESS_KEY")
    
    options = Options()
    
    bstack_options = {
        "os": "Windows",
        "osVersion": "10",
        "browserVersion": "latest",
        "sessionName": "BStack Test - Selenium",
        "buildName": "build-1",
        "local": "true",
        "localIdentifier": "zadanie-6"
    }
    
    options.set_capability('bstack:options', bstack_options)

    hub_url = f"https://{bstack_user}:{bstack_key}@hub-cloud.browserstack.com/wd/hub"

    driver = webdriver.Remote(
        command_executor=hub_url,
        options=options
    )
    
    yield driver
    driver.quit()

# test 1.1
def test_add_to_cart(driver):
    # arrange
    url = "http://localhost:5173"
    wait = WebDriverWait(driver, 10)
    driver.get(url)

    # act
    xpath_add_button = '//*[@id="root"]/div/div[1]/div/div[1]/button'
    add_button = wait.until(EC.element_to_be_clickable((By.XPATH, xpath_add_button)))
    add_button.click()

    # assert
    xpath_quantity_window = '//*[@id="root"]/div/div[2]/div[1]/input'
    quantity_window = wait.until(EC.presence_of_element_located((By.XPATH, xpath_quantity_window)))
    actual_quantity = quantity_window.get_attribute("value")
    assert actual_quantity == "1"
    assert quantity_window.is_displayed()

# test 1.2
def test_multiple_add_to_cart(driver):
    # arrange
    url = "http://localhost:5173"
    wait = WebDriverWait(driver, 10)
    driver.get(url)

    # act
    xpath_add_button = '//*[@id="root"]/div/div[1]/div/div[1]/button'
    add_button = wait.until(EC.element_to_be_clickable((By.XPATH, xpath_add_button)))
    add_button.click()
    time.sleep(0.2)
    add_button.click()
    time.sleep(0.2)

    # assert
    xpath_quantity_window = '//*[@id="root"]/div/div[2]/div[1]/input'
    quantity_window = wait.until(EC.presence_of_element_located((By.XPATH, xpath_quantity_window)))
    actual_quantity = quantity_window.get_attribute("value")
    assert actual_quantity == "2"

    # act
    add_button.click()
    time.sleep(0.2)

    # assert
    actual_quantity = quantity_window.get_attribute("value")
    assert actual_quantity == "3"

# test 1.3
def test_change_quantity_text_input(driver):
    # arrange
    url = "http://localhost:5173"
    wait = WebDriverWait(driver, 10)
    driver.get(url)
    
    xpath_add_button = '//*[@id="root"]/div/div[1]/div/div[1]/button'
    add_button = wait.until(EC.element_to_be_clickable((By.XPATH, xpath_add_button)))
    add_button.click()

    # act
    xpath_quantity_window = '//*[@id="root"]/div/div[2]/div[1]/input'
    quantity_window = wait.until(EC.presence_of_element_located((By.XPATH, xpath_quantity_window)))
    quantity_window.click()
    time.sleep(0.2)
    quantity_window.send_keys(Keys.COMMAND + 'a')
    time.sleep(0.2)
    quantity_window.send_keys("1")
    time.sleep(0.2)
    quantity_window.send_keys("0")
    time.sleep(0.2)

    # assert
    actual_quantity = quantity_window.get_attribute("value")
    assert actual_quantity == "10"

    #act
    quantity_window.click()
    time.sleep(0.2)
    quantity_window.send_keys(Keys.COMMAND + 'a')
    time.sleep(0.2)
    quantity_window.send_keys("1")
    time.sleep(0.2)
    quantity_window.send_keys("8")
    time.sleep(0.2)

    # assert
    actual_quantity = quantity_window.get_attribute("value")
    assert actual_quantity == "18"


# test 1.4
def test_prevent_negative_quantity_text_input(driver):
    # arrange
    url = "http://localhost:5173"
    wait = WebDriverWait(driver, 10)
    driver.get(url)
    
    xpath_add_button = '//*[@id="root"]/div/div[1]/div/div[1]/button'
    add_button = wait.until(EC.element_to_be_clickable((By.XPATH, xpath_add_button)))
    add_button.click()

    # act
    xpath_quantity_window = '//*[@id="root"]/div/div[2]/div[1]/input'
    quantity_window = wait.until(EC.presence_of_element_located((By.XPATH, xpath_quantity_window)))
    quantity_window.click()
    time.sleep(0.2)
    quantity_window.send_keys(Keys.COMMAND + 'a')
    time.sleep(0.2)
    quantity_window.send_keys("-1")
    time.sleep(0.2)

    # negative assertion
    actual_quantity = quantity_window.get_attribute("value")
    assert actual_quantity != "-1"
    assert int(actual_quantity) >= 0

# test 1.5
def test_change_quantity_arrows(driver):
    # arrange
    url = "http://localhost:5173"
    wait = WebDriverWait(driver, 10)
    driver.get(url)
    
    xpath_add_button = '//*[@id="root"]/div/div[1]/div/div[1]/button'
    add_button = wait.until(EC.element_to_be_clickable((By.XPATH, xpath_add_button)))
    add_button.click()

    # act
    xpath_quantity_window = '//*[@id="root"]/div/div[2]/div[1]/input'
    quantity_window = wait.until(EC.presence_of_element_located((By.XPATH, xpath_quantity_window)))
    
    quantity_window.click()
    time.sleep(0.2)
    quantity_window.send_keys(Keys.ARROW_UP)
    time.sleep(0.2)
    
    # assert
    assert quantity_window.get_attribute("value") == "2"

    # act
    quantity_window.send_keys(Keys.ARROW_DOWN)
    time.sleep(0.2)
    
    # assert
    assert quantity_window.get_attribute("value") == "1"

# test 1.6
def test_prevent_negative_quantity_arrows(driver):
    # arrange
    url = "http://localhost:5173"
    wait = WebDriverWait(driver, 10)
    driver.get(url)
    
    xpath_add_button = '//*[@id="root"]/div/div[1]/div/div[1]/button'
    add_button = wait.until(EC.element_to_be_clickable((By.XPATH, xpath_add_button)))
    add_button.click()

    # act
    xpath_quantity_window = '//*[@id="root"]/div/div[2]/div[1]/input'
    quantity_window = wait.until(EC.presence_of_element_located((By.XPATH, xpath_quantity_window)))
    quantity_window.click()
    time.sleep(0.2)
    quantity_window.send_keys(Keys.ARROW_DOWN)
    time.sleep(0.2)
    quantity_window.send_keys(Keys.ARROW_DOWN)
    time.sleep(0.2)
    quantity_window.send_keys(Keys.ARROW_DOWN)
    time.sleep(0.2)
    quantity_window.send_keys(Keys.ARROW_DOWN)
    time.sleep(0.2)

    # assert
    actual_quantity = quantity_window.get_attribute("value")
    assert int(actual_quantity) >= 0

# test 1.7
def test_remove_from_cart(driver):
    # arrange
    url = "http://localhost:5173"
    wait = WebDriverWait(driver, 10)
    driver.get(url)
    
    xpath_add_button = '//*[@id="root"]/div/div[1]/div/div[1]/button'
    add_button = wait.until(EC.element_to_be_clickable((By.XPATH, xpath_add_button)))
    add_button.click()
    time.sleep(0.2)

    # act
    remove_button = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[text()='Usuń']")))
    remove_button.click()
    time.sleep(0.2)

    # assert
    empty_cart_message = wait.until(EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'Twój koszyk jest pusty.')]")))
    assert empty_cart_message.is_displayed()

    items_count = len(driver.find_elements(By.XPATH, "//button[text()='Usuń']"))
    assert items_count == 0

# test 1.8
def test_total_price_calculation(driver):
    # arrange
    url = "http://localhost:5173"
    wait = WebDriverWait(driver, 10)
    driver.get(url)
    
    # act
    xpath_add_button1 = '//*[@id="root"]/div/div[1]/div/div[1]/button'
    add_button1 = wait.until(EC.element_to_be_clickable((By.XPATH, xpath_add_button1)))
    add_button1.click()
    time.sleep(0.2)

    xpath_add_button2 = '//*[@id="root"]/div/div[1]/div/div[2]/button'
    add_button2 = wait.until(EC.element_to_be_clickable((By.XPATH, xpath_add_button2)))
    add_button2.click()
    time.sleep(0.2)

    # assert
    xpath_total_price = '//*[@id="root"]/div/div[2]/div[3]' 
    total_price_element = wait.until(EC.presence_of_element_located((By.XPATH, xpath_total_price)))
    total_price_text = total_price_element.text
    assert "8459.59" in total_price_text

    # act
    remove_button = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[text()='Usuń']")))
    remove_button.click()
    time.sleep(0.2)

    # assert
    xpath_total_price = '//*[@id="root"]/div/div[2]/div[2]' 
    total_price_element = wait.until(EC.presence_of_element_located((By.XPATH, xpath_total_price)))
    total_price_text = total_price_element.text
    assert "2459.59" in total_price_text

# test 1.9
def test_payment_price_calculation(driver):
    # arrange
    url = "http://localhost:5173"
    wait = WebDriverWait(driver, 10)
    driver.get(url)
    
    # act
    xpath_add_button1 = '//*[@id="root"]/div/div[1]/div/div[1]/button'
    add_button1 = wait.until(EC.element_to_be_clickable((By.XPATH, xpath_add_button1)))
    add_button1.click()
    time.sleep(0.2)

    xpath_add_button2 = '//*[@id="root"]/div/div[1]/div/div[2]/button'
    add_button2 = wait.until(EC.element_to_be_clickable((By.XPATH, xpath_add_button2)))
    add_button2.click()
    time.sleep(0.2)

    # assert
    xpath_total_price = '//*[@id="root"]/div/div[3]/p/strong' 
    total_price_element = wait.until(EC.presence_of_element_located((By.XPATH, xpath_total_price)))
    total_price_text = total_price_element.text
    assert "8459.59" in total_price_text

    # act
    remove_button = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[text()='Usuń']")))
    remove_button.click()
    time.sleep(0.2)

    # assert
    xpath_total_price = '//*[@id="root"]/div/div[3]/p/strong' 
    total_price_element = wait.until(EC.presence_of_element_located((By.XPATH, xpath_total_price)))
    total_price_text = total_price_element.text
    assert "2459.59" in total_price_text

# test 1.10
def test_cart_contents_after_refresh(driver):
    # arrange
    url = "http://localhost:5173"
    wait = WebDriverWait(driver, 10)
    driver.get(url)

    # act
    xpath_add_button = '//*[@id="root"]/div/div[1]/div/div[1]/button'
    add_button = wait.until(EC.element_to_be_clickable((By.XPATH, xpath_add_button)))
    add_button.click()
    time.sleep(0.2)
    driver.refresh()

    # assert
    xpath_quantity_window = '//*[@id="root"]/div/div[2]/div[1]/input'
    quantity_window = wait.until(EC.presence_of_element_located((By.XPATH, xpath_quantity_window)))
    actual_quantity = quantity_window.get_attribute("value")
    assert actual_quantity == "1"
