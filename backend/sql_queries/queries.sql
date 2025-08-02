CREATE TABLE IF NOT EXISTS Users (
     id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
     username VARCHAR(50) NOT NULL,
     email VARCHAR(50) NOT NULL,
     password VARCHAR(50) NOT NULL,
     img VARCHAR(255)
);

ALTER TABLE Users
    MODIFY password VARCHAR(500) NOT NULL;

CREATE TABLE IF NOT EXISTS Posts (
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    title VARCHAR(50) NOT NULL,
    description VARCHAR(1000) NOT NULL,
    img VARCHAR(255) NOT NULL,
    date DATETIME NOT NULL,
    userId INT NOT NULL,
    FOREIGN KEY (userId) REFERENCES Users (id)
);


INSERT INTO Users (username, email, password, img)
VALUES ( "harold", "harold@mail.com", "azerty2025", "./disk/images/harold.png"),
       ( "ken", "ken@mail.com", "qwerty2025", "./disk/images/ken.png");

INSERT INTO Posts (title, description, img, date, userId)
VALUES ("post 1", "azertyuiop zcvgdhzqsdfgh", "./disk/azerty/image.png", "2025-08-15", 1),
       ("post 2", "qsdfghbn vf zcvgdvr,vrjkbhzqsdfgh", "./disk/ynhje/ede.png", "2025-05-02", 1),
       ("post 3", "azertyuiop zcvgdhzqsdfgh", "./disk/qzerty/imagefee.png", "2024-08-31", 2);

SELECT description
FROM Posts
WHERE title LIKE '%1%';