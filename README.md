# monopoly-backend

## Структура папок

-  [models](src/models): В этой папке хранятся все схемы моделей базы данных.

```models/
├── User.js
├── Product.js
└── ...
```

- [dtos](src/dtos): В этой папке будут располагаться все объекты DTO для передачи данных между клиентом и сервером.

```
dtos/
├── UserDTO.js
├── ProductDTO.js
└── ...
```

- [routes](src/routes): Здесь размещаются файлы, отвечающие за определение маршрутов.

```
routes/
├── userRoutes.js
├── productRoutes.js
└── ...
```

- [services](src/services): Эта папка содержит файлы, которые предоставляют сервисные функции для работы с моделями.

```
services/
├── userService.js
├── productService.js
└── ...
```

- [controllers](src/controllers): В этой папке находятся файлы контроллеров, которые обрабатывают запросы от маршрутов и вызывают соответствующие сервисы для выполнения бизнес-логики.

```
controllers/
├── userController.js
├── productController.js
└── ...
```

- [types](src/types): Здесь располагаются все интерфейсы, связанные с моделями данных и взаимодействием с базой данных.

```
types/
├── UserInterface.js
├── ProductInterface.js
└── ...
```

- [utils](src/utils): В этой папке находятся файлы утилитарных функций или хелперов, которые могут использоваться в различных частях проекта.

```
utils/
├── authentication.js
├── imageUpload.js
└── ...
```

- [validations](src/validations): Здесь располагаются файлы, отвечающие за валидацию полей, полученных от клиента.

```
validations/
├── userValidation.js
├── productValidation.js
└── ...
```

- [config](src/config): В этой папке хранятся файлы с конфигурациями, такими как конфигурация базы данных и сервера для обработки изображений

```
config/
├── databaseConfig.js
├── imageServerConfig.js
└── ...
```
