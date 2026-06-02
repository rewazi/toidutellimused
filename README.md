# Toidutellimused

See on toidutellimise rakendus, mis on arendatud agiilse arendusmetoodika abil. See on Node.js ja Express.js baasil loodud toidutellimise API rakendus, mis võimaldab kasutajatel registreeruda, menüüd sirvida, tellimusi esitada ja oma tellimuse olekut jälgida.

## Tehnoloogiad

Node.js — keskkond, mis võimaldab käivitada JavaScripti serveris.
Express.js — lihtne tööriist serverite ja API-de loomiseks Node.js-i abil.
CORS — mehhanism, mis võimaldab andmete vahetamist erinevate veebilehtede ja rakenduste vahel.

## Keskkondade erinevused

| | Dev | Prod |
|--|-----|------|
| Port | 3000 | 3001 |
| Logid | kaasatud| puudega |
| Restart |auto | manuaalne |

## Käivitamine

### Dev keskkond

Käivitab serverit nodemoni abil, mis taaskäivitab serveri failide muutumisel: nodemon src/server.js

### Prod keskkond

Käivitab rakenduse Node.js abil ilma automaatse taaskäivituseta: node src/server.js

## Testid

Testide käivitamiseks käivitage käsk: node src/test.js

## API

## Serveri töökindluse kontroll

| Meetod | Endpoint | Kirjeldus |
|---------|----------|-----------|
| GET | `/health` | Serveri saadavuse ja oleku kontroll |

## Kasutajad

| Meetod | Endpoint | Kirjeldus |
|---------|----------|-----------|
| POST | `/api/users/signup` | Uue kasutajakonto loomine |
| POST | `/api/users/login` | Kasutaja autentimine süsteemis |

## Menüü

| Meetod | Endpoint | Kirjeldus |
|---------|----------|-----------|
| GET | `/api/menu` | Kogu menüü andmete kuvamine |

## Tellimused

| Meetod | Endpoint | Kirjeldus |
|---------|----------|-----------|
| POST | `/api/orders` | Uue tellimuse loomine |

## GitHub Actions

Kui projektil oleks GitHub Actionsi abil konfigureeritud CI/CD töövoog, käivitaks iga edasilükkamine automaatse kinnituse, mis ei ühendaks töötavat haru mittetöötavaga.
