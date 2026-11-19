# Osmolovska — тема Shopify

Тема магазину Osmolovska Art (Online Store 2.0). Дизайн повторює демо-сайт https://alya-syoma.github.io/osmolovska/

## Як підключити до магазину

1. Адмінка Shopify → **Online Store → Themes → Add theme → Connect from GitHub**.
2. Увійдіть у GitHub, оберіть акаунт `alya-syoma`, репозиторій `osmolovska-shop`, гілку `main`.
3. Тема з'явиться в бібліотеці. Натисніть **Customize**, щоб подивитися й налаштувати.

Кожна зміна в гілці `main` автоматично потрапляє в магазин. Зміни, зроблені в редакторі Shopify, Shopify сам записує назад у репозиторій.

## Що є в темі

| Секція | Що робить |
| --- | --- |
| Intro screen | Заставка на весь екран, три картини й ім'я |
| Featured works | Сітка робіт з колекції, ціна, позначка Sold, фільтри серій |
| Drop countdown | Анонс дропу з таймером і підпискою; після старту — кнопка в колекцію дропу (вимкнена за замовчуванням) |
| In your room | Робота в інтер'єрах з перемиканням |
| Up close | Деталі мазків |
| About the artist | Фото й текст про художницю |
| Commissions | Замовлення картини в 4 кроки |
| Collectors' list | Підписка на розсилку (контакти потрапляють у Customers з тегом `newsletter`) |

Сторінки: товар (галерея, розмір, рік, «Only N left», додавання в кошик без перезавантаження), колекція, усі серії, кошик, пошук, 404, сторінка з паролем.

## Поля товару (metafields)

Створіть у **Settings → Custom data → Products** такі поля (namespace `custom`):

| Поле | Ключ | Тип | Приклад |
| --- | --- | --- | --- |
| Size | `custom.size` | Single line text | 100 × 80 cm |
| Year | `custom.year` | Single line text | 2025 |
| Medium | `custom.medium` | Single line text | Oil on canvas |

## Меню

- `main-menu` — головне меню в шапці (Works, Prints, Drops, About, Commissions).
- `footer` — меню у футері (Shipping, Returns, Contact).
