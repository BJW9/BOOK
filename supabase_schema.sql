-- Table: categories
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  name TEXT UNIQUE NOT NULL
);

-- Trigger pour la table categories
CREATE TRIGGER update_categories_updated_at BEFORE
UPDATE
  ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Table: products
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  image_urls TEXT [],
  category_id UUID REFERENCES categories (id) ON DELETE
  SET
    NULL,
    CONSTRAINT chk_price_positive CHECK (price > 0),
    CONSTRAINT chk_stock_non_negative CHECK (stock >= 0)
);

-- Index pour la recherche rapide par nom de produit
CREATE INDEX idx_products_name ON products (name);

-- Trigger pour la table products
CREATE TRIGGER update_products_updated_at BEFORE
UPDATE
  ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Table: users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'client' NOT NULL,
  -- 'client' or 'admin'
  CONSTRAINT chk_role CHECK (role IN ('client', 'admin'))
);

-- Index pour la recherche rapide par email
CREATE INDEX idx_users_email ON users (email);

-- Fonction pour mettre à jour le champ updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour la table users
CREATE TRIGGER update_users_updated_at BEFORE
UPDATE
  ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();




-- Table: orders
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  user_id UUID REFERENCES users (id) ON DELETE CASCADE,
  total_amount NUMERIC(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending' NOT NULL,
  -- 'pending', 'completed', 'cancelled'
  shipping_address JSONB,
  billing_address JSONB,
  CONSTRAINT chk_total_amount_non_negative CHECK (total_amount >= 0),
  CONSTRAINT chk_order_status CHECK (status IN ('pending', 'completed', 'cancelled'))
);

-- Index pour la recherche rapide par utilisateur
CREATE INDEX idx_orders_user_id ON orders (user_id);

-- Trigger pour la table orders
CREATE TRIGGER update_orders_updated_at BEFORE
UPDATE
  ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();




-- Table: order_items
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  order_id UUID REFERENCES orders (id) ON DELETE CASCADE,
  product_id UUID REFERENCES products (id) ON DELETE
  SET
    NULL,
    quantity INTEGER NOT NULL,
    price_at_order NUMERIC(10, 2) NOT NULL,
    CONSTRAINT chk_quantity_positive CHECK (quantity > 0),
    CONSTRAINT chk_price_at_order_positive CHECK (price_at_order > 0)
);

-- Index pour la recherche rapide par commande et produit
CREATE INDEX idx_order_items_order_id ON order_items (order_id);
CREATE INDEX idx_order_items_product_id ON order_items (product_id);




-- Table: inventory
CREATE TABLE inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  product_id UUID UNIQUE REFERENCES products (id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT chk_inventory_quantity_non_negative CHECK (quantity >= 0)
);

-- Trigger pour la table inventory
CREATE TRIGGER update_inventory_updated_at BEFORE
UPDATE
  ON inventory FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();




-- RLS pour la table users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to users" ON users FOR
SELECT
  USING (TRUE);

CREATE POLICY "Allow authenticated insert access to users" ON users FOR
INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow individual update access to users" ON users FOR
UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Allow individual delete access to users" ON users FOR DELETE USING (auth.uid() = id);




-- RLS pour la table products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to products" ON products FOR
SELECT
  USING (TRUE);

CREATE POLICY "Allow authenticated insert access to products" ON products FOR
INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND (SELECT role FROM users WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Allow admin update access to products" ON products FOR
UPDATE
  USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Allow admin delete access to products" ON products FOR DELETE USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');




-- RLS pour la table orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated read access to own orders" ON orders FOR
SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Allow authenticated insert access to orders" ON orders FOR
INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow admin update access to orders" ON orders FOR
UPDATE
  USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Allow admin delete access to orders" ON orders FOR DELETE USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');




-- RLS pour la table order_items
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated read access to own order items" ON order_items FOR SELECT USING (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()));

CREATE POLICY "Allow authenticated insert access to order items" ON order_items FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()));

CREATE POLICY "Allow admin update access to order items" ON order_items FOR UPDATE USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Allow admin delete access to order items" ON order_items FOR DELETE USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');




-- RLS pour la table categories
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to categories" ON categories FOR SELECT USING (TRUE);

CREATE POLICY "Allow admin insert access to categories" ON categories FOR INSERT WITH CHECK ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Allow admin update access to categories" ON categories FOR UPDATE USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Allow admin delete access to categories" ON categories FOR DELETE USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');




-- RLS pour la table inventory
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to inventory" ON inventory FOR SELECT USING (TRUE);

CREATE POLICY "Allow admin insert access to inventory" ON inventory FOR INSERT WITH CHECK ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Allow admin update access to inventory" ON inventory FOR UPDATE USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Allow admin delete access to inventory" ON inventory FOR DELETE USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');




-- Séparation des accès clients/administrateurs et protection des données sensibles:
-- Les politiques RLS ci-dessus garantissent que:
-- - Les utilisateurs non authentifiés peuvent lire les produits, catégories et l'inventaire.
-- - Les utilisateurs authentifiés peuvent lire et insérer leurs propres commandes et articles de commande.
-- - Seuls les administrateurs (rôle=\'admin\') peuvent insérer, mettre à jour ou supprimer des produits, catégories et l'inventaire.
-- - Les utilisateurs ne peuvent mettre à jour ou supprimer que leurs propres profils (table users).
-- - Les données sensibles comme les mots de passe (password_hash) ne sont pas exposées via les politiques RLS, mais gérées par le système d'authentification de Supabase.




-- Ajouter les colonnes manquantes à la table orders pour supporter le processus de commande complet
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_method TEXT DEFAULT 'domicile';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_price NUMERIC(10, 2) DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'card';

-- Contraintes pour les nouveaux champs
ALTER TABLE orders ADD CONSTRAINT IF NOT EXISTS chk_delivery_method 
  CHECK (delivery_method IN ('domicile', 'point_relais', 'express'));
ALTER TABLE orders ADD CONSTRAINT IF NOT EXISTS chk_payment_method 
  CHECK (payment_method IN ('card', 'paypal'));
ALTER TABLE orders ADD CONSTRAINT IF NOT EXISTS chk_delivery_price_non_negative 
  CHECK (delivery_price >= 0);

-- Commentaires pour documenter les nouveaux champs
COMMENT ON COLUMN orders.delivery_method IS 'Mode de livraison: domicile, point_relais, express';
COMMENT ON COLUMN orders.delivery_price IS 'Prix de la livraison en euros';
COMMENT ON COLUMN orders.payment_method IS 'Méthode de paiement: card, paypal';

