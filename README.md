# Jan Kwinta | E-biznes  

## Zadanie 1 | Docker
✓ | **3.0** Obraz ubuntu z Pythonem w wersji 3.10 | [Docker image](https://hub.docker.com/repository/docker/jankwinta/ebiznes-01-3.0/general) | [Commit](https://github.com/KwintaJ/E-biznes/commit/51acc6da4f20e4cffc62b14465b9ac3e1d964052)  
✓ | **3.5** Obraz ubuntu:24.02 z Javą w wersji 8 oraz Kotlinem | [Docker image](https://hub.docker.com/repository/docker/jankwinta/ebiznes-01-3.5/general) | [Commit](https://github.com/KwintaJ/E-biznes/blob/a568ea9f8fd00924ed85499b552ad9882158228a/Zadanie-1/3_5/Dockerfile)  
✓ | **4.0** Najnowszy Gradle oraz paczka JDBC, SQLite w ramach build.gradle | [Docker image](https://hub.docker.com/repository/docker/jankwinta/ebiznes-01-4.0/general) | [Commit](https://github.com/KwintaJ/E-biznes/commit/0d2787ec78f384039bb7eba0a38a92f83213d438)  
✓ | **4.5** Przykład typu HelloWorld - uruchomienie aplikacji przez CMD oraz gradle [Docker image](https://hub.docker.com/repository/docker/jankwinta/ebiznes-01-4.5/general) | [Commit](https://github.com/KwintaJ/E-biznes/commit/708bbeed8dcceb53179865757f4e1c96880833f0)  
✓ | **5.0** Konfiguracja docker-compose | [Commit](https://github.com/KwintaJ/E-biznes/commit/703319ee354f5f854888c5923423b2e60969d36b)  
  
## Zadanie 2 | Scala  
Aplikacja na frameworku Play | [Screen recording](https://github.com/KwintaJ/E-biznes/blob/main/Zadanie-2/Screen-recording.mov)  
  
✓ | **3.0** Kontroler do Produktów | [Commit](https://github.com/KwintaJ/E-biznes/commit/2f9e0e7993ed6f25ef03e99393bd2a6036477917)  
✓ | **3.5** Endpointy do kontrolera zgodnie z CRUD - dane pobierane z listy | [Commit](https://github.com/KwintaJ/E-biznes/commit/fb2ae85c281966c5d171e329ce2e80c6d42a3908)  
✓ | **4.0** Kontrolery do Kategorii oraz Koszyka + endpointy zgodnie z CRUD | [Commit](https://github.com/KwintaJ/E-biznes/commit/8ea3fbaf9b15ad609420444744ab9e59735277af)  
✓ | **4.5** Aplikacja uruchomiana na dockerze oraz skrypt uruchamiający aplikację via ngrok | [Docker image](https://hub.docker.com/repository/docker/jankwinta/ebiznes-02/general) | [Commit](https://github.com/KwintaJ/E-biznes/commit/10d76bc8def6c461fda295447ece3fbe0fa0464a)  
✓ | **5.0** Konfiguracja CORS dla dwóch hostów dla metod CRUD | [Commit](https://github.com/KwintaJ/E-biznes/commit/ac5d74abe6b928fbbe917de8ad4dd191180b0747)  
  
## Zadanie 3 | Kotlin  
Aplikacja we frameworku Ktor | [Screen recording](https://github.com/KwintaJ/E-biznes/blob/main/Zadanie-3/Screen-recording.mov)  

✓ | **3.0** Aplikacja kliencka, która pozwala na przesyłanie wiadomości na platformę Discord | [Commit](https://github.com/KwintaJ/E-biznes/commit/9260f70c68566caa7446f53423ad3758bfad1d92)  
✓ | **3.5** Odbieranie wiadomości użytkowników z platformy Discord skierowane do bota | [Commit](https://github.com/KwintaJ/E-biznes/commit/6ccb5afbc05ece81d42c04e1a6edaf59bdde72c8)  
✓ | **4.0** Lista kategorii na określone żądanie użytkownika | [Commit](https://github.com/KwintaJ/E-biznes/commit/a4434af898aa1fe2b2186ae7902359a2ff4955b5)  
✓ | **4.5** Lista produktów wg żądanej kategorii | [Commit](https://github.com/KwintaJ/E-biznes/commit/2bdbd6b00e26b12107065b3bb29afb719dde04c6)  
✓ | **5.0** Aplikacja obsługuje dodatkowo platformę Slack | [Commit](https://github.com/KwintaJ/E-biznes/commit/42d7b8d6545829c775f33a9ae122490dee97b733)  

## Zadanie 4 | Go  

Projekt w echo w Go, modele z gorm, baza w sqlite.  

✓ | **3.0** Aplikację we frameworku echo w języku Go + kontroler Produktów zgodny z CRUD | [Commit](https://github.com/KwintaJ/E-biznes/commit/27b9e254cdd92c2595c73cc6e7227eca55032c77)  
✓ | **3.5** Model Produktów wykorzystując gorm wykorzystany w kontrolerze (zamiast listy) | [Commit](https://github.com/KwintaJ/E-biznes/commit/84b5d9d5020d71c53c240153d9a1cafd716d81fe)  
✓ | **4.0** Model Koszyka oraz odpowiedni endpoint | [Commit](https://github.com/KwintaJ/E-biznes/commit/cb93f11380272f4d79ec3ca486792121db1be12b)  
✓ | **4.5** Model kategorii i relacja między kategorią a produktem | [Commit](https://github.com/KwintaJ/E-biznes/commit/5d5db6fe4204bc4aaf08084ea1f6b2f36c135af3)  
✓ | **5.0** Zapytania pogrupowane w gorm’owe scope'y | [Commit](https://github.com/KwintaJ/E-biznes/commit/482d4cb9016065c16857c6937abecf7ec0661ac1)  

## Zadanie 5 | React.js  

Aplikacja kliencka wykorzystująca bibliotekę React.js. Trzy komponenty: Produkty, Koszyk oraz Płatności. Koszyk oraz Płatności wysyłają do aplikacji serwerowej dane, a w Produktach dane o produktach są pobierane z aplikacji serwerowej. Aplikacja serwera w Go. Dane pomiędzy wszystkimi komponentami przesyłane za pomocą React hooks. | [Screen recording](https://github.com/KwintaJ/E-biznes/blob/main/Zadanie-5/Screen%20Recording%202026-04-22%20at%2022.44.59.mov)  

✓ | **3.0** Produkty oraz Płatności; Płatności wysyłają dane, a Produkty pobierają dane | [Commit](https://github.com/KwintaJ/E-biznes/tree/73ce8418251b372491e6420298542fa8c1474cc0/Zadanie-5/frontend/src/components)  
✓ | **3.5** Koszyk wraz z widokiem | [Commit](https://github.com/KwintaJ/E-biznes/commit/fa4caa279597b72ec66e50a2f022000910ef8714)  
✓ | **4.0** Dane pomiędzy wszystkimi komponentami przesyłane za pomocą React hooks | [Commit](https://github.com/KwintaJ/E-biznes/commit/9ebb262d09e03863bf3097d16ec5a3a5d4909227)  
✓ | **4.5** Skrypt uruchamiający aplikację serwerową oraz kliencką na dockerze via docker-compose | [Commit](https://github.com/KwintaJ/E-biznes/commit/b7c64941777473de77b12e0a249aa06a24dd7e28)  
✓ | **5.0** Axios + nagłówki pod CORS | [Commit](https://github.com/KwintaJ/E-biznes/commit/3d8ad1fa3e8ce35f00e5421b75e0e7fffae600be)  

## Zadanie 6 | Testy  

Ponad 20 przypadków testowych w Selenium (Python) do aplikacji webowych, zawierających 50 asercji. Możliwe uruchamianie na platformie Browserstack.  

✓ | **3.0** 20+ przypadków testowych w Selenium | [Commit](https://github.com/KwintaJ/E-biznes/tree/de128c539a9a42e954a167735e066d6d3eb92150/Zadanie-6)  
✓ | **3.5** 50+ asercji | [Commit](https://github.com/KwintaJ/E-biznes/commit/de128c539a9a42e954a167735e066d6d3eb92150)  
✓ | **4.0** Działa z wybranym wcześniejszym projektem z tego repozytorium | [Screen recording](https://github.com/KwintaJ/E-biznes/blob/main/Zadanie-6/Screen-recording-1.mov)  
✓ | **4.5** Testy API, pokryte wszystkie endpointy (minimum jeden scenariusz negatywny per endpoint) | [Commit](https://github.com/KwintaJ/E-biznes/commit/1b02b3b25e740e61bc179356285e3fadfd484613)  
✓ | **5.0** Uruchamianie testów funkcjonalych na Browserstacku | [Github Actions](https://github.com/KwintaJ/E-biznes/blob/5aa4175440fcde01b9af7608711db36fbf357e16/.github/workflows/main.yml) | [Workflow run](https://github.com/KwintaJ/E-biznes/actions/runs/25381430627/job/74430516521)  

## Zadanie 7 | Sonar  

Testowanie aplikacji klient-serwer na platformie Sonar | [Repozytorium serwera](https://github.com/KwintaJ/e-biznes-7-backend) | [Repozytorium klienta](https://github.com/KwintaJ/e-biznes-7-frontend)

✓ | **3.0** Linter dodany do kodu aplikacji serwerowej w hookach gita | [Commit](https://github.com/KwintaJ/e-biznes-7-backend/commit/e810b2b48a11db592b6d1420fcfcf611ce429846)  
✓ | **3.5** Wyeliminowane wszystkie bugi w Sonarze (kod aplikacji serwerowej) | [Commit](https://github.com/KwintaJ/e-biznes-7-backend/commit/385e05bc7bae16cc36b29b957d116c59e0a20220)  
✓ | **4.0** Wyeliminowane wszystkie code smells w Sonarze (kod aplikacji serwerowej)  
✓ | **4.5** Wyeliminowane wszystkie podatności oraz błędy bezpieczeństwa w Sonarze (kod aplikacji serwerowej) | [Commit](https://github.com/KwintaJ/e-biznes-7-backend/commit/6f86e6bf22ba3b0ab0f3f02c9464bd467f260c6d)  
✓ | **5.0** Wyeliminowane wszystkie błędy oraz zapaszki w kodzie aplikacji klienckiej | [Commit 1](https://github.com/KwintaJ/e-biznes-7-frontend/commit/6d498a04719b92f1741538472596519d72577f33) | [Commit 2](https://github.com/KwintaJ/e-biznes-7-frontend/commit/a8d66245a1bebe501f453048408003f2e34ca7c4) | [Commit 3](https://github.com/KwintaJ/e-biznes-7-frontend/commit/8ccc74d01a87ee2e9a52d79dfb8e4285265b08cf) | [Commit 4](https://github.com/KwintaJ/e-biznes-7-frontend/commit/0de994740fb7f21ac5bf246040afa436df8a618c) | [Commit 5](https://github.com/KwintaJ/e-biznes-7-frontend/commit/3f43e3ae51d833bd4752d5062c422cb317b0d39c)  

Badge z repozytorium serwera:  
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=KwintaJ_e-biznes-7-backend&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=KwintaJ_e-biznes-7-backend)  
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=KwintaJ_e-biznes-7-backend&metric=bugs)](https://sonarcloud.io/summary/new_code?id=KwintaJ_e-biznes-7-backend)  
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=KwintaJ_e-biznes-7-backend&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=KwintaJ_e-biznes-7-backend)  

Badge z repozytorium klienta:  
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=KwintaJ_e-biznes-7-frontend&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=KwintaJ_e-biznes-7-frontend)  
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=KwintaJ_e-biznes-7-frontend&metric=bugs)](https://sonarcloud.io/summary/new_code?id=KwintaJ_e-biznes-7-frontend)  
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=KwintaJ_e-biznes-7-frontend&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=KwintaJ_e-biznes-7-frontend)  

## Zadanie 8 | Oauth2  

Konfigurowanie klienta Oauth2. Dane o użytkowniku wraz z tokenem przechowywane po stronie bazy serwera, a nowy token (inny niż ten od dostawcy) wysłany do klienta (React); mechanizm sesji.  
Klienci NIE są tworzeni bezpośrednio po stronie React'a; komunikacja: react-sewer-dostawca-serwer(via return uri)-react.  

✗ | **3.0** Logowanie przez aplikację serwerową (bez Oauth2)  
✗ | **3.5** Rejestracja przez aplikację serwerową (bez Oauth2)  
✗ | **4.0** Logowanie via Google OAuth2  
✗ | **4.5** Logowanie via Github OAuth2  
✗ | **5.0** Zapisywanie danych logowania OAuth2 po stronie serwera  

## Zadanie 9 | ollama  

Rozszerzenie funkcjonalności wcześniej stworzonego bota. Aplikacja frontendowa łączy się z osobnym serwisem w Pythonie, który analizuje tekst od użytkownika i przesyła zapytanie do LLM, a następnie przesyła odpowiedź do użytkownika. Rozmowy poza zakresem LLMa przesyłane via Discord do obsługi klienta.

✗ | **3.0** Serwis do łączenia się z LLM ollama  
✗ | **3.5** Połączenie serwisu z interfejsem frontendowym via Kotlin (zadanie 3)  
✗ | **4.0** Lista 5 różnych otwarć oraz zamknięć rozmowy  
✗ | **4.5** Filtrowanie po zagadnieniach związanych ze sklepem do LLM  
✗ | **5.0** Filtrowanie odpowiedzi po sentymencie  
