# JS Betting

JS Betting is a backend application for managing and selling sports betting tips.

The project is currently focused on backend logic. The frontend user interface is not implemented yet.

## Project idea

The application allows users to register, log in, view premium betting tip offers, buy tips, claim one free tip every 5 days, and see purchased tips in their account.

Before purchase, the full details of a premium tip are hidden.

The user can only see:

- odds range
- price

After purchase, the user can see:

- league
- teams
- pick
- exact odds
- stake
- match date
- analysis
- tip status

## Main features

### User features

- user registration
- user login
- password hashing with BCrypt
- viewing premium offers without full tip details
- buying premium tips
- claiming one free tip every 5 days
- viewing active purchased tips
- viewing tip history
- duplicate purchase protection

### Admin features

- adding new tips
- viewing all tips
- updating tip status
- marking tips as WON or LOST
- separating admin access from public user access

## Business logic

Premium tips are hidden before purchase.

Public offer example:

```json
{
  "id": 6,
  "oddsRange": "1.50 - 1.70",
  "price": 7.99
}
```

The user does not see the match, pick, exact odds or analysis before buying the tip.

After buying the tip, the user can see full details in "My tips".

## Free tip logic

A registered user can claim one free tip every 5 days.

Free tips:

- have price 0
- are not premium
- are available only if the user has not claimed one recently
- are visible in the user's purchased tips after claiming

## Roles

The application has two roles:

- USER
- ADMIN

Regular users can buy and claim tips.

Admins can manage tips and update their results.

## Tech stack

- Java
- Spring Boot
- Spring Data JPA
- PostgreSQL
- Maven
- BCrypt password hashing

## Current status

The backend core is implemented.

Implemented modules:

- tips
- premium offers
- purchases
- user accounts
- register/login
- roles USER and ADMIN
- free tip claim once every 5 days
- admin tip management
- hidden premium offer logic
- purchased tip access logic

## Not implemented yet

- frontend user interface
- real online payments
- JWT/token-based authentication
- real email sending
- production deployment
- full security configuration

## Example endpoints

### Public premium offers

```http
GET /offers/premium
```

Returns hidden premium offers without full tip details.

### Register

```http
POST /auth/register
```

### Login

```http
POST /auth/login
```

### Buy tip

```http
POST /purchases?userId=5&tipId=6
```

### Claim free tip

```http
POST /users/5/free-tip/claim
```

### Free tip status

```http
GET /users/5/free-tip/status
```

### My active tips

```http
GET /users/5/my-tips/active
```

### My tip history

```http
GET /users/5/my-tips/history
```

### Admin: get all tips

```http
GET /admin/tips?adminId=4
```

### Admin: create tip

```http
POST /admin/tips?adminId=4
```

### Admin: update tip status

```http
PATCH /admin/tips/6/status?adminId=4&status=WON
```

## Configuration

The real local configuration file is:

```text
src/main/resources/application.properties
```

This file is ignored by Git because it contains local database credentials.

To configure the project locally, create your own `application.properties` file based on:

```text
src/main/resources/application-example.properties
```

Example:

```properties
spring.application.name=js-betting

spring.datasource.url=jdbc:postgresql://localhost:5432/js_betting
spring.datasource.username=postgres
spring.datasource.password=YOUR_PASSWORD

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

## Git status

The first backend version is committed and pushed to GitHub.

Current branch:

```text
main
```

Repository:

```text
https://github.com/kubasurma/js-betting
```

## Project stage

This is an early backend version of the project.

The main backend logic is working, but the project still needs:

- frontend
- real authentication tokens
- payment integration
- real email service
- deployment