CREATE TABLE IF NOT EXISTS Users (
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    img VARCHAR(255)
);

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

INSERT INTO Posts (title, description, category, img, date, userId)
VALUES
    ("Exploration d’un paysage montagneux au lever du soleil",
     "Ce paysage capture la beauté d’un lever de soleil sur une chaîne de montagnes majestueuse. Les couleurs chaudes illuminent les sommets, créant une atmosphère paisible et inspirante pour les amateurs de nature.",
     "SCIENCE", "image_post_01.jpg", "2025-08-06", 1),

    ("La sérénité d’un lac au cœur de la nature",
     "Un lac calme entouré de forêts denses reflète parfaitement le ciel. Cette scène évoque le calme et la tranquillité, idéale pour s’évader du quotidien et se reconnecter à la nature.",
     "SCIENCE", "image_post_02.jpg", "2025-08-14", 1),

    ("Randonnée à travers les vallées verdoyantes",
     "Cette image met en avant une vallée luxuriante où la nature s’étend à perte de vue. Un endroit parfait pour les passionnés de randonnée et d’aventure en plein air.",
     "SCIENCE", "image_post_03.jpg", "2025-08-02", 2),

    ("Harmonie des formes et des couleurs naturelles",
     "Un paysage où les lignes naturelles des collines et les nuances de couleurs créent une composition visuelle équilibrée. Un bel exemple de design naturel inspirant.",
     "DESIGN", "image_post_04.jpg", "2025-08-05", 2),

    ("Quand la nature devient une œuvre d’art",
     "Les contrastes entre lumière et ombre dans ce paysage offrent une esthétique unique, transformant la nature en véritable tableau vivant.",
     "ART", "image_post_05.jpg", "2025-07-15", 2),

    ("Paysage minimaliste et atmosphère apaisante",
     "Une scène épurée mettant en avant la simplicité de la nature. Ce type de paysage inspire les designers par son minimalisme et son équilibre visuel.",
     "DESIGN", "image_post_06.jpg", "2025-08-08", 1),

    ("Un décor naturel digne d’un film cinématographique",
     "Ce paysage spectaculaire pourrait facilement servir de décor à un film. Les couleurs, la profondeur et la lumière créent une ambiance immersive.",
     "CINEMA", "image_post_07.jpg", "2025-07-25", 2),

    ("Immersion dans un coucher de soleil dramatique",
     "Un coucher de soleil intense avec des teintes rouges et orangées transforme ce paysage en une scène dramatique digne du cinéma.",
     "CINEMA", "image_post_08.jpg", "2025-07-06", 1),

    ("Beauté naturelle capturée à l’instant parfait",
     "Une photographie prise au moment idéal, capturant toute la richesse et la diversité des paysages naturels. Un instant figé qui inspire contemplation et émerveillement.",
     "ART", "image_post_09.png", "2025-08-06", 1);
