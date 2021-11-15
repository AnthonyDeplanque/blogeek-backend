/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS USERS(
  `id` VARCHAR(20) NOT NULL,
  `first_name` VARCHAR(50),
  `last_name` VARCHAR(50),
  `nick_name` VARCHAR(50) NOT NULL,
  `email` VARCHAR(250) NOT NULL,
  `hashed_password` VARCHAR(100) NOT NULL,
  `inscription_time` BIGINT NOT NULL,
  `avatar` TEXT,
  `biography` TEXT,
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS CATEGORIES(
  `id` VARCHAR(20) NOT NULL,
  `title` TINYTEXT NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS SUBCATEGORIES(
  `id` VARCHAR(20) NOT NULL,
  `id_category` VARCHAR(20) NOT NULL,
  `title` TINYTEXT NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS ARTICLES(
  `id` VARCHAR(20) NOT NULL,
  `id_user` VARCHAR(20) NOT NULL,
  `title` TINYTEXT NOT NULL,
  `subtitle` TINYTEXT NOT NULL,
  `content` MEDIUMTEXT NOT NULL,
  `date_of_write` BIGINT NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS ARTICLE_HAS_CATEGORIES(
  `id` VARCHAR(20) NOT NULL,
  `id_article` VARCHAR(20) NOT NULL,
  `id_subcategory` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS COMMENTS(
  `id` VARCHAR(20) NOT NULL,
  `id_article` VARCHAR(20) NOT NULL,
  `id_user` VARCHAR(20) NOT NULL,
  `date_of_write` BIGINT NOT NULL,
  `content` MEDIUMTEXT NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS ARTICLE_HAS_REACTION_FROM_USER(
  `id` VARCHAR(20) NOT NULL,
  `id_article` VARCHAR(20) NOT NULL,
  `id_user` VARCHAR(20) NOT NULL,
  `id_reaction` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS COMMENT_HAS_REACTION_FROM_USER(
  `id` VARCHAR(20) NOT NULL,
  `id_comment` VARCHAR(20) NOT NULL,
  `id_user` VARCHAR(20) NOT NULL,
  `id_reaction` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS REACTIONS(
  `id` VARCHAR(20) NOT NULL,
  `name` VARCHAR(64) NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS IMAGES(
  `id` VARCHAR(20) NOT NULL,
  `title` VARCHAR(64) NOT NULL,
  `subtitle` VARCHAR(64) NOT NULL,
  `link` TEXT NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS ARTICLE_HAS_IMAGES(
  `id` VARCHAR(20) NOT NULL,
  `id_article` VARCHAR(20) NOT NULL,
  `id_image` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS ROLES(
  `id` VARCHAR(20) NOT NULL,
  `name` VARCHAR(64) NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS USER_HAS_ROLES(
  `id` VARCHAR(20) NOT NULL,
  `id_user` VARCHAR(20) NOT NULL,
  `id_role` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS PRIVATE_MESSAGES(
  `id` VARCHAR(20) NOT NULL,
  `id_user_sender` VARCHAR(20) NOT NULL,
  `id_user_receiver` VARCHAR(20) NOT NULL,
  `is_read` TINYINT DEFAULT 0 NOT NULL,
  `date_of_write` BIGINT NOT NULL,
  `content` MEDIUMTEXT NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS CHAT_MESSAGES(
  `id` VARCHAR(20) NOT NULL,
  `id_user` VARCHAR(20) NOT NULL,
  `date_of_write` BIGINT NOT NULL,
  `content` MEDIUMTEXT NOT NULL,
  PRIMARY KEY (`id`)
);

/* 
 SQL NEEDED INSERTIONS TO WORK CORRECTLY
 */
INSERT INTO
  ROLES (id, name)
VALUES
  ('61684e7867704', 'ROLE_USER'),
  ('61684edc617c6', 'ROLE_MODERATOR'),
  ('61684ee8a27f8', 'ROLE_CREATOR'),
  ('61684ef679a89', 'ROLE_ADMIN'),
  ('617025fd844e1', 'ROLE_MUTED');

INSERT INTO
  REACTIONS (id, name)
VALUES
  ('61701c3a4ee52', 'REACTION_PLUS'),
  ('61701cea18b8b', 'REACTION_MINUS'),
  ('61701c26d4215', 'REACTION_SMILE'),
  ('61701d0bc44e0', 'REACTION_FROWN'),
  ('61701d11b24d0', 'REACTION_LOVE'),
  ('61701d1a663e8', 'REACTION_ANGRY');

INSERT INTO
  USERS (
    id,
    first_name,
    last_name,
    nick_name,
    email,
    hashed_password,
    inscription_time,
    avatar,
    biography
  )
VALUES
  (
    'ldErogiuz2CN8DJe294h',
    'admin',
    'admin',
    'admin',
    'admin@admin.com',
    '$argon2i$v=19$m=4096,t=3,p=1$cRYl168biM4xei3EFj9NXQ$mfxTdb/+79JsYL0w+jfwv7OYXeHyqD24JvN0AZEUw9Q',
    0,
    '',
    ''
  );

INSERT INTO
  USER_HAS_ROLES (id, id_user, id_role)
VALUES
  (
    'FJRS12234509test4984',
    'ldErogiuz2CN8DJe294h',
    '61684e7867704'
  ),
  (
    'FJRS12234509test4935',
    'ldErogiuz2CN8DJe294h',
    '61684edc617c6'
  ),
  (
    'FJRS12234509test4982',
    'ldErogiuz2CN8DJe294h',
    '61684ee8a27f8'
  ),
  (
    'FJRS12234509test4981',
    'ldErogiuz2CN8DJe294h',
    '61684ef679a89'
  );

INSERT INTO
  CATEGORIES (id, title)
VALUES
  ('3XBEkfl4W8mWiQvbLWN9', 'Jeux Vidéos'),
  ('49IQlZDdLjx2TU7Z7ySg', 'Mangas'),
  ('AiRT4YUGfRgaBYdNvPZw', 'Films-Séries'),
  ('wU8uc5t53aatVr07WkrP', 'Figurines'),
  ('xJ331yB7UbswN3LtD4iK', 'Romans');

INSERT INTO
  SUBCATEGORIES (id, id_category, title)
VALUES
  (
    '2NCaR01YsLfThG0q5O0E',
    '3XBEkfl4W8mWiQvbLWN9',
    'RPG'
  ),
  (
    '2V2V9U4hN0vAoOm5hnpY',
    '3XBEkfl4W8mWiQvbLWN9',
    'FPS'
  ),
  (
    '5FDrCYSrlackpBdO1Jwf',
    '49IQlZDdLjx2TU7Z7ySg',
    'Hentai'
  ),
  (
    'apog1XwXWow9If4hcem8',
    'wU8uc5t53aatVr07WkrP',
    'Funkos'
  ),
  (
    'j4JZgALRXtuQnZyb3CsB',
    '3XBEkfl4W8mWiQvbLWN9',
    'SHMUP'
  ),
  (
    'lj5p93jPnpeNEsBhsxW2',
    'AiRT4YUGfRgaBYdNvPZw',
    'Horreur'
  ),
  (
    'ObmJK6nMDLkYtF5ZIAr9',
    'AiRT4YUGfRgaBYdNvPZw',
    'Fantasy'
  ),
  (
    'rgsVII8GceOypE7bGPbk',
    'xJ331yB7UbswN3LtD4iK',
    'Eau-de-rose'
  ),
  (
    'SwysG0mslJ6lDOnFM0DW',
    '3XBEkfl4W8mWiQvbLWN9',
    'Platformer'
  ),
  (
    'U2mz2xcoBAnpF5L3NHZo',
    'xJ331yB7UbswN3LtD4iK',
    'Romans-Graphiques'
  ),
  (
    'vAy6XLzJyw63Duth7gFu',
    '49IQlZDdLjx2TU7Z7ySg',
    'Shonen'
  ),
  (
    'vYWmoGsMOqw9miNN80ms',
    'wU8uc5t53aatVr07WkrP',
    'Jouets'
  ),
  (
    'wvrlzDU31ViFwU1mq3pu',
    'wU8uc5t53aatVr07WkrP',
    'Collectibles'
  ),
  (
    'x7MqseMUGNWv6WidlxX6',
    'AiRT4YUGfRgaBYdNvPZw',
    'Aventure'
  ),
  (
    'Y46oymUtpxvAcE8jTa1N',
    'AiRT4YUGfRgaBYdNvPZw',
    'Sci-fi'
  );

INSERT INTO
  ARTICLES (
    id,
    id_user,
    title,
    subtitle,
    content,
    date_of_write
  )
VALUES
  (
    '1ovzocznpepyroy28194',
    'ldErogiuz2CN8DJe294h',
    'lorem ipsum',
    'dolor si amet',
    'lorem ipsum dolor si amet',
    0
  ),
  (
    '1ovzocznpepyroy28191',
    'ldErogiuz2CN8DJe294h',
    'lorem ipsum',
    'dolor si amet',
    'lorem ipsum dolor si amet',
    0
  ),
  (
    '1ovzocznpepyroy28192',
    'ldErogiuz2CN8DJe294h',
    'lorem ipsum',
    'dolor si amet',
    'lorem ipsum dolor si amet',
    0
  ),
  (
    '1ovzocznpepyroy28193',
    'ldErogiuz2CN8DJe294h',
    'lorem ipsum',
    'dolor si amet',
    'lorem ipsum dolor si amet',
    0
  ),
  (
    '1ovzocznpepyroy28195',
    'ldErogiuz2CN8DJe294h',
    'lorem ipsum',
    'dolor si amet',
    'lorem ipsum dolor si amet',
    0
  );

INSERT INTO
  ARTICLE_HAS_CATEGORIES (id, id_article, id_subcategory)
VALUES
  (
    "pyroy21ovzpe819oczn5",
    "1ovzocznpepyroy28195",
    "2NCaR01YsLfThG0q5O0E"
  );