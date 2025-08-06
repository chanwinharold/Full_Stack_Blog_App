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
                                     title VARCHAR(255) NOT NULL,
                                     description VARCHAR(1000) NOT NULL,
                                     category CHAR(20),
                                     img VARCHAR(255) NOT NULL,
                                     date DATETIME NOT NULL,
                                     userId INT NOT NULL,
                                     FOREIGN KEY (userId) REFERENCES Users (id) ON DELETE CASCADE
);


INSERT INTO Users (username, email, password, img)
VALUES ( "harold", "harold@mail.com", "azerty2025", "./disk/images/harold.png"),
       ( "ken", "ken@mail.com", "qwerty2025", "./disk/images/ken.png");

INSERT INTO Posts (title, description, img, date, userId)
VALUES ("blabla ipsum dolor sit amet consectetur adipisicing elit", "Lorem, ipsum dolor sit amet consectetur adipisicing elit. A possimus excepturi aliquid nihil cumque ipsam facere aperiam at! Ea dolorem ratione sit debitis deserunt repellendus numquam ab vel perspiciatis corporis!", "https://images.pexels.com/photos/7008010/pexels-photo-7008010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", "2025-08-06", 1),
       ("Lorem ipsum dolor sit amet consectetur adipisicing elit", "Lorem, ipsum dolor sit amet consectetur adipisicing elit. A possimus excepturi aliquid nihil cumque ipsam facere aperiam at! Ea dolorem ratione sit debitis deserunt repellendus numquam ab vel perspiciatis corporis!", "https://images.pexels.com/photos/6489663/pexels-photo-6489663.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", "2025-08-14", 1),
       ("blabla ipsum dolor sit amet consectetur adipisicing elit", "Lorem, ipsum dolor sit amet consectetur adipisicing elit. A possimus excepturi aliquid nihil cumque ipsam facere aperiam at! Ea dolorem ratione sit debitis deserunt repellendus numquam ab vel perspiciatis corporis!", "https://images.pexels.com/photos/4230630/pexels-photo-4230630.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", "2025-08-02", 2),
       ("Lorem ipsum dolor sit amet consectetur adipisicing elit", "Lorem, ipsum dolor sit amet consectetur adipisicing elit. A possimus excepturi aliquid nihil cumque ipsam facere aperiam at! Ea dolorem ratione sit debitis deserunt repellendus numquam ab vel perspiciatis corporis!", "https://images.pexels.com/photos/6157049/pexels-photo-6157049.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", "2025-08-05", 0),
       ("blabla ipsum dolor sit amet consectetur adipisicing elit", "Lorem, ipsum dolor sit amet consectetur adipisicing elit. A possimus excepturi aliquid nihil cumque ipsam facere aperiam at! Ea dolorem ratione sit debitis deserunt repellendus numquam ab vel perspiciatis corporis!", "https://images.pexels.com/photos/7008010/pexels-photo-7008010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", "2025-07-15", 2),
       ("Lorem ipsum dolor sit amet consectetur adipisicing elit", "Lorem, ipsum dolor sit amet consectetur adipisicing elit. A possimus excepturi aliquid nihil cumque ipsam facere aperiam at! Ea dolorem ratione sit debitis deserunt repellendus numquam ab vel perspiciatis corporis!", "https://images.pexels.com/photos/6489663/pexels-photo-6489663.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", "2025-08-08", 0),
       ("blabla ipsum dolor sit amet consectetur adipisicing elit", "Lorem, ipsum dolor sit amet consectetur adipisicing elit. A possimus excepturi aliquid nihil cumque ipsam facere aperiam at! Ea dolorem ratione sit debitis deserunt repellendus numquam ab vel perspiciatis corporis!", "https://images.pexels.com/photos/4230630/pexels-photo-4230630.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", "2025-07-25", 2),
       ("Lorem ipsum dolor sit amet consectetur adipisicing elit", "Lorem, ipsum dolor sit amet consectetur adipisicing elit. A possimus excepturi aliquid nihil cumque ipsam facere aperiam at! Ea dolorem ratione sit debitis deserunt repellendus numquam ab vel perspiciatis corporis!", "https://images.pexels.com/photos/6157049/pexels-photo-6157049.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", "2025-07-06", 0),
       ("blabla ipsum dolor sit amet consectetur adipisicing elit", "Lorem, ipsum dolor sit amet consectetur adipisicing elit. A possimus excepturi aliquid nihil cumque ipsam facere aperiam at! Ea dolorem ratione sit debitis deserunt repellendus numquam ab vel perspiciatis corporis!", "https://images.pexels.com/photos/6157049/pexels-photo-6157049.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", "2025-08-06", 1);


SELECT description
FROM Posts
WHERE title LIKE '%1%';