## MarketKurly

### Introduction

2주 동안 클라이언트 한 명과 짝을 이뤄 진행한 마켓컬리 앱 클론 프로젝트입니다.

### Directory Structure
```
📂 config
 ├── 📄 baseResponseStatus.js
 ├── 📄 express.js
 ├── 📄 jwtMiddleware.js
 ├── 📄 limiter.js
 ├── 📄 response.js
 └── 📄 winston.js
📂 src
 └── 📂 app
      ├── 📂 Address
      |    ├── 📄 addressController.js
      |    ├── 📄 addressDao.js
      |    ├── 📄 addressProvider.js
      |    ├── 📄 addressRoute.js
      |    └── 📄 addressService.js
      ├── 📂 Basket
      |    ├── 📄 basketController.js
      |    ├── 📄 basketDao.js
      |    ├── 📄 basketProvider.js
      |    ├── 📄 basketRoute.js
      |    └── 📄 basketService.js 
      ├── 📂 Order
      |    ├── 📄 orderController.js
      |    ├── 📄 orderDao.js
      |    ├── 📄 orderProvider.js
      |    ├── 📄 orderRoute.js
      |    └── 📄 orderService.js
      ├── 📂 Product
      |    ├── 📄 productController.js
      |    ├── 📄 productDao.js
      |    ├── 📄 productProvider.js
      |    ├── 📄 productRoute.js
      |    └── 📄 productService.js
      ├── 📂 Search
      |    ├── 📄 searchController.js
      |    ├── 📄 searchDao.js
      |    ├── 📄 searchProvider.js
      |    ├── 📄 searchRoute.js
      |    └── 📄 searchService.js
      └── 📂 User
           ├── 📄 userController.js
           ├── 📄 userDao.js
           ├── 📄 userProvider.js
           ├── 📄 userRoute.js
           └── 📄 userService.js
      
📄 .gitignore
📄 index.js
📄 package.json
```
### Role

- 서버 구축
- ERD 설계
  - [Aquerytool](https://aquerytool.com/aquerymain/index/?rurl=6385f783-a240-41ae-a6e0-30f9da7bbd59)
  - password : 11au14
- [DOS공격과 개인의 너무많은 API요청을 막기 위한 레이트리미팅](https://zzangwoolog.tistory.com/179)
- [성능 개선을 위해 redis로 cache처리하기](https://zzangwoolog.tistory.com/180?category=959189)

<p align="center">
    <img src="https://user-images.githubusercontent.com/64726822/131082826-1a134c8d-cee3-460f-bc3c-79af792ac0bd.png" border="0">
</p>
 
- API 구현 및 명세서 작성
  - [API 명세서](https://docs.google.com/spreadsheets/d/1D_X-jigpNFRN9SfkOiPDhY3gUED8nCPZ56ENcgmuf24/edit?usp=sharing)


### Architecture
 
<p align="center">
    <img src="https://user-images.githubusercontent.com/46131688/115104653-e58aff00-9f94-11eb-9e1b-09f757a9687d.png" border="0">
</p>
