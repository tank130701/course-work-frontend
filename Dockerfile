# Используем образ Node.js для сборки приложения
FROM node:latest as build

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# Копируем package.json и package-lock.json (или yarn.lock) для установки зависимостей
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем остальные файлы в контейнер
COPY . .

# Собираем приложение
RUN npm run build

# Используем nginx для обслуживания собранного приложения
FROM nginx:latest

# Копируем собранное приложение из контейнера сборки в контейнер nginx
COPY --from=build /app/build /usr/share/nginx/html

# Опционально: копируем конфигурацию nginx, если требуется изменить настройки
# COPY nginx.conf /etc/nginx/nginx.conf

# Указываем порт, на котором будет работать приложение
EXPOSE 80

# Команда для запуска nginx при старте контейнера
CMD ["nginx", "-g", "daemon off;"] 