/**
 * PostgreSQL Schema for Blog Application
 * 
 * To run locally:
 *   createdb blog_db
 *   psql -U postgres -d blog_db -f schema.sql
 * 
 * On Render.com:
 *   1. Create PostgreSQL instance from dashboard
 *   2. Copy Internal Database URL
 *   3. Run: psql $DATABASE_URL -f schema.sql
 */

-- Enable UUID extension for secure random IDs
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables in correct order (uncomment to reset)
-- DROP TABLE IF EXISTS Posts CASCADE;
-- DROP TABLE IF EXISTS Users CASCADE;

-- Create Users table
CREATE TABLE IF NOT EXISTS Users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(30) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    img TEXT DEFAULT NULL,
    role VARCHAR(20) DEFAULT 'user' NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Posts table
CREATE TABLE IF NOT EXISTS Posts (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) DEFAULT NULL,
    img TEXT NOT NULL DEFAULT '',
    date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    userId INTEGER NOT NULL REFERENCES Users(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_posts_category ON Posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_date ON Posts(date DESC);
CREATE INDEX IF NOT EXISTS idx_posts_userid ON Posts(userId);

INSERT INTO Users (username, email, password, img, role)
VALUES ('admin', 'admin@mail.com', 'azertyazerty', 'image_post_09.png', 'admin');

-- ============================================
-- SAMPLE DATA - Various Categories
-- ============================================

-- SCIENCE Posts
INSERT INTO Posts (title, description, category, img, date, userId) VALUES
('Exploration d''un paysage montagneux au lever du soleil', 'Ce paysage capture la beauté d''un lever de soleil sur une chaîne de montagnes majestueuse. Les couleurs chaudes illuminent les sommets.', 'SCIENCE', 'image_post_01.jpg', '2025-08-06', 1),
('La sérénité d''un lac au cœur de la nature', 'Un lac calme reflète parfaitement le ciel. Cette scène evoke le calme et la tranquillité pour se reconnecter à la nature.', 'SCIENCE', 'image_post_02.jpg', '2025-08-14', 1),
('Randonnée à travers les vallées verdoyantes', 'Une vallée luxuriante où la nature s''étend à perte de vue. Parfait pour les passionnés de randonnée.', 'SCIENCE', 'image_post_03.jpg', '2025-08-02', 1),
('Les mystères de l''ocean profond', 'Découvrez les créatures étranges qui habitent dans les profondeurs oceaniques où la lumière ne pénètre jamais.', 'SCIENCE', 'image_post_01.jpg', '2025-07-20', 1),
('L''architecture des arbres millénaires', 'Ces arbres ont traversé des siècles. Leur structure raconte l''histoire de notre planète.', 'SCIENCE', 'image_post_02.jpg', '2025-07-15', 1)
ON CONFLICT DO NOTHING;

-- ART Posts
INSERT INTO Posts (title, description, category, img, date, userId) VALUES
('Quand la nature devient une œuvre d''art', 'Les contrastes entre lumière et ombre transforment ce paysage en véritable tableau vivant.', 'ART', 'image_post_05.jpg', '2025-07-15', 1),
('Beauté naturelle capturée à l''instant parfait', 'Une photographie prise au moment idéal capturant toute la richesse des paysages naturels.', 'ART', 'image_post_09.png', '2025-08-06', 1),
('L''abstraction des couleurs naturelles', 'Comment la nature crée ses propres compositions abstraites à travers les saisons.', 'ART', 'image_post_01.jpg', '2025-06-28', 1),
('Graffitis urbains : l''art de la rue', 'Explorez l''évolution du street art et son impact sur nos villes modernes.', 'ART', 'image_post_02.jpg', '2025-07-01', 1),
('La peinture numérique nouvelle ère', 'Comment les artistes numériques redéfinissent les limites de la création.', 'ART', 'image_post_03.jpg', '2025-07-10', 1)
ON CONFLICT DO NOTHING;

-- DESIGN Posts
INSERT INTO Posts (title, description, category, img, date, userId) VALUES
('Harmonie des formes et des couleurs naturelles', 'Un paysage où les lignes naturelles des collines créent une composition visuelle équilibrée.', 'DESIGN', 'image_post_04.jpg', '2025-08-05', 1),
('Paysage minimaliste et atmosphère apaisante', 'Une scène épurée mettant en avant la simplicité de la nature. Inspire les designers.', 'DESIGN', 'image_post_06.jpg', '2025-08-08', 1),
('Design durable : construire avec la nature', 'Comment intégrer les principes naturels dans l''architecture moderne.', 'DESIGN', 'image_post_01.jpg', '2025-07-22', 1),
('Ergonomie des espaces naturels', 'Étude sur la façon dont les espaces naturels influencent notre bien-être.', 'DESIGN', 'image_post_02.jpg', '2025-07-18', 1),
('Typography et nature : une alliance inattendue', 'Comment les formes naturelles inspirent la typographie contemporaine.', 'DESIGN', 'image_post_03.jpg', '2025-07-25', 1)
ON CONFLICT DO NOTHING;

-- CINEMA Posts
INSERT INTO Posts (title, description, category, img, date, userId) VALUES
('Un décor naturel digne d''un film cinématographique', 'Ce paysage spectaculaire pourrait servir de décor à un film. Les couleurs créent une ambiance immersive.', 'CINEMA', 'image_post_07.jpg', '2025-07-25', 1),
('Immersion dans un coucher de soleil dramatique', 'Un coucher de soleil intense aux teintes rouges et orangées transforme ce paysage en scène dramatique.', 'CINEMA', 'image_post_08.jpg', '2025-07-06', 1),
('Les meilleurs plans природы au cinéma', 'Analyse des scènes naturelles les plus emblématiques du cinéma mondial.', 'CINEMA', 'image_post_01.jpg', '2025-06-15', 1),
('L''effet spéciaux naturels au cinéma', 'Comment les réalisateurs utilisent les éléments naturels pour créer des effets spéciaux.', 'CINEMA', 'image_post_02.jpg', '2025-06-20', 1),
('Soundtracks forestiers : la musique de la nature', 'L''utilisation des sons naturels dans la bande originale des films.', 'CINEMA', 'image_post_03.jpg', '2025-06-25', 1)
ON CONFLICT DO NOTHING;

-- TECHNOLOGY Posts
INSERT INTO Posts (title, description, category, img, date, userId) VALUES
('IA et photographie : la nouvelle frontières', 'Comment l''intelligence artificielle révolutionne la capture d''images naturelles.', 'TECHNOLOGY', 'image_post_01.jpg', '2025-08-01', 1),
('Drones et exploration naturelle', 'L''utilisation des drones pour découvrir des paysages inaccessible.', 'TECHNOLOGY', 'image_post_02.jpg', '2025-07-28', 1),
('Réalité augmentée au service de la nature', 'Comment la RA nous aide à comprendre et protéger les écosystèmes.', 'TECHNOLOGY', 'image_post_03.jpg', '2025-07-15', 1),
('Capteurs invisibles : la technologie cachée', 'Découvrez les appareils qui capturent la nature sans la déranger.', 'TECHNOLOGY', 'image_post_04.jpg', '2025-07-20', 1),
('BLOCKCHAIN pour la conservation', 'Comment la blockchain peut aider à protéger les zones naturelles.', 'TECHNOLOGY', 'image_post_05.jpg', '2025-07-12', 1)
ON CONFLICT DO NOTHING;

-- FOOD Posts
INSERT INTO Posts (title, description, category, img, date, userId) VALUES
('Cuisine from garden to table', 'Le parcours des ingrédients depuis le jardin jusqu''à lassiette. Une approche durable.', 'FOOD', 'image_post_06.jpg', '2025-08-10', 1),
('Fermentation : l''art ancestral', 'Découvrez les techniques de fermentation pour préserver les récolte.', 'FOOD', 'image_post_01.jpg', '2025-08-05', 1),
('Photographier les aliments naturellement', 'Conseils pour capturer la beauté naturelle des aliments frais.', 'FOOD', 'image_post_02.jpg', '2025-07-30', 1),
('Les super-aliments de la nature', 'Liste des aliments naturels les plus riches en nutriments.', 'FOOD', 'image_post_03.jpg', '2025-07-25', 1),
('Manger local : un engagement', 'Pourquoi choisir des produits locaux fait toute la différence.', 'FOOD', 'image_post_04.jpg', '2025-07-20', 1)
ON CONFLICT DO NOTHING;

-- Comments
COMMENT ON TABLE Users IS 'Users table with authentication and profile information';
COMMENT ON TABLE Posts IS 'Blog posts linked to users via foreign key';
COMMENT ON COLUMN Users.role IS 'User role: user (default) or admin';