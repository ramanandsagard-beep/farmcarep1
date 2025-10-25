-- AgriEasy PostgreSQL schema and seed data
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- Roles as CHECK, app enforces RBAC
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone VARCHAR(20) UNIQUE NOT NULL,
  email VARCHAR(120) UNIQUE,
  name VARCHAR(100) NOT NULL,
  avatar_url VARCHAR(255),
  password VARCHAR(255),
  role VARCHAR(32) NOT NULL CHECK (role IN (
    'FARMER','EQUIPMENT_VENDOR','INPUT_SUPPLIER','TRANSPORTER','CONSUMER','ADMIN'
  )),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS equipment (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(120) NOT NULL,
  description TEXT,
  price_per_day NUMERIC(10,2) NOT NULL,
  available BOOLEAN NOT NULL DEFAULT true,
  image_url VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS equipment_bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  equipment_id UUID NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
  farmer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING','CONFIRMED','CANCELLED','COMPLETED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (end_time > start_time)
);

-- Prevent overlapping bookings per equipment
ALTER TABLE equipment_bookings
  ADD CONSTRAINT no_overlap_equipment
  EXCLUDE USING gist (
    equipment_id WITH =,
    tstzrange(start_time, end_time, '[)') WITH &&
  );

CREATE TABLE IF NOT EXISTS input_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supplier_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(120) NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('FERTILIZER','PESTICIDE','OTHER')),
  price NUMERIC(10,2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  image_url VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS produce (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farmer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(120) NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  image_url VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transporter_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  vehicle_type VARCHAR(50) NOT NULL,
  capacity_kg INTEGER NOT NULL,
  plate_number VARCHAR(32) NOT NULL UNIQUE,
  image_url VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS transport_bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  farmer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  source TEXT NOT NULL,
  destination TEXT NOT NULL,
  pickup_time TIMESTAMPTZ NOT NULL,
  drop_time TIMESTAMPTZ NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'REQUESTED' CHECK (status IN ('REQUESTED','ACCEPTED','IN_TRANSIT','COMPLETED','CANCELLED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (drop_time > pickup_time)
);

-- Prevent overlapping bookings per vehicle
ALTER TABLE transport_bookings
  ADD CONSTRAINT no_overlap_vehicle
  EXCLUDE USING gist (
    vehicle_id WITH =,
    tstzrange(pickup_time, drop_time, '[)') WITH &&
  );

CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_type VARCHAR(20) NOT NULL CHECK (item_type IN ('INPUT','PRODUCE')),
  item_id UUID NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, item_type, item_id)
);

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL DEFAULT 'CREATED' CHECK (status IN ('CREATED','PAID','SHIPPED','DELIVERED','CANCELLED')),
  total_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  item_type VARCHAR(20) NOT NULL CHECK (item_type IN ('INPUT','PRODUCE')),
  item_id UUID NOT NULL,
  quantity INTEGER NOT NULL,
  price NUMERIC(10,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  provider VARCHAR(50) NOT NULL DEFAULT 'RAZORPAY_MOCK',
  status VARCHAR(20) NOT NULL CHECK (status IN ('CREATED','PAID','FAILED','REFUNDED')),
  amount NUMERIC(12,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  entity_type VARCHAR(20) NOT NULL CHECK (entity_type IN ('EQUIPMENT','INPUT','PRODUCE','VEHICLE','ORDER')),
  entity_id UUID NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(120) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(10) NOT NULL DEFAULT 'PUSH' CHECK (type IN ('SMS','EMAIL','PUSH')),
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS configs (
  key VARCHAR(100) PRIMARY KEY,
  value TEXT NOT NULL
);

-- Seed comprehensive demo data for presentation
-- Insert Demo Users with different roles
INSERT INTO users (id, phone, email, name, password, role, created_at) VALUES
  -- Farmers
  ('550e8400-e29b-41d4-a716-446655440001', '+919876543210', 'farmer1@agrihub.com', 'Rajesh Kumar', '$2b$10$8K1mN7X8Yk8Q8mN7X8Yk8Q8mN7X8Yk8Q8mN7X8Yk8Q8mN7X8Yk8Q8mN7X8Yk8Q', 'FARMER', NOW() - INTERVAL '30 days'),
  ('550e8400-e29b-41d4-a716-446655440002', '+919876543211', 'farmer2@agrihub.com', 'Priya Sharma', '$2b$10$8K1mN7X8Yk8Q8mN7X8Yk8Q8mN7X8Yk8Q8mN7X8Yk8Q8mN7X8Yk8Q8mN7X8Yk8Q', 'FARMER', NOW() - INTERVAL '25 days'),
  ('550e8400-e29b-41d4-a716-446655440003', '+919876543212', 'farmer3@agrihub.com', 'Amit Patel', '$2b$10$8K1mN7X8Yk8Q8mN7X8Yk8Q8mN7X8Yk8Q8mN7X8Yk8Q8mN7X8Yk8Q8mN7X8Yk8Q', 'FARMER', NOW() - INTERVAL '20 days'),

  -- Equipment Vendors
  ('550e8400-e29b-41d4-a716-446655440004', '+919876543213', 'vendor1@agrihub.com', 'GreenTech Equipment', '$2b$10$8K1mN7X8Yk8Q8mN7X8Yk8Q8mN7X8Yk8Q8mN7X8Yk8Q8mN7X8Yk8Q8mN7X8Yk8Q', 'EQUIPMENT_VENDOR', NOW() - INTERVAL '35 days'),
  ('550e8400-e29b-41d4-a716-446655440005', '+919876543214', 'vendor2@agrihub.com', 'Modern Agri Tools', '$2b$10$8K1mN7X8Yk8Q8mN7X8Yk8Q8mN7X8Yk8Q8mN7X8Yk8Q8mN7X8Yk8Q8mN7X8Yk8Q', 'EQUIPMENT_VENDOR', NOW() - INTERVAL '28 days'),

  -- Input Suppliers
  ('550e8400-e29b-41d4-a716-446655440006', '+919876543215', 'supplier1@agrihub.com', 'AgriChem Solutions', '$2b$10$8K1mN7X8Yk8Q8mN7X8Yk8Q8mN7X8Yk8Q8mN7X8Yk8Q8mN7X8Yk8Q8mN7X8Yk8Q', 'INPUT_SUPPLIER', NOW() - INTERVAL '40 days'),
  ('550e8400-e29b-41d4-a716-446655440007', '+919876543216', 'supplier2@agrihub.com', 'Organic Fertilizers Ltd', '$2b$10$8K1mN7X8Yk8Q8mN7X8Yk8Q8mN7X8Yk8Q8mN7X8Yk8Q8mN7X8Yk8Q8mN7X8Yk8Q', 'INPUT_SUPPLIER', NOW() - INTERVAL '32 days'),

  -- Transporters
  ('550e8400-e29b-41d4-a716-446655440008', '+919876543217', 'transport1@agrihub.com', 'Fast Cargo Services', '$2b$10$8K1mN7X8Yk8Q8mN7X8Yk8Q8mN7X8Yk8Q8mN7X8Yk8Q8mN7X8Yk8Q8mN7X8Yk8Q', 'TRANSPORTER', NOW() - INTERVAL '45 days'),
  ('550e8400-e29b-41d4-a716-446655440009', '+919876543218', 'transport2@agrihub.com', 'Green Transport Co', '$2b$10$8K1mN7X8Yk8Q8mN7X8Yk8Q8mN7X8Yk8Q8mN7X8Yk8Q8mN7X8Yk8Q8mN7X8Yk8Q', 'TRANSPORTER', NOW() - INTERVAL '38 days'),

  -- Consumers
  ('550e8400-e29b-41d4-a716-446655440010', '+919876543219', 'consumer1@agrihub.com', 'Local Restaurant', '$2b$10$8K1mN7X8Yk8Q8mN7X8Yk8Q8mN7X8Yk8Q8mN7X8Yk8Q8mN7X8Yk8Q8mN7X8Yk8Q', 'CONSUMER', NOW() - INTERVAL '15 days'),
  ('550e8400-e29b-41d4-a716-446655440011', '+919876543220', 'consumer2@agrihub.com', 'Fresh Market', '$2b$10$8K1mN7X8Yk8Q8mN7X8Yk8Q8mN7X8Yk8Q8mN7X8Yk8Q8mN7X8Yk8Q8mN7X8Yk8Q', 'CONSUMER', NOW() - INTERVAL '22 days'),

  -- Admin
  ('550e8400-e29b-41d4-a716-446655440012', '+919876543221', 'admin@agrihub.com', 'System Admin', '$2b$10$8K1mN7X8Yk8Q8mN7X8Yk8Q8mN7X8Yk8Q8mN7X8Yk8Q8mN7X8Yk8Q8mN7X8Yk8Q', 'ADMIN', NOW() - INTERVAL '60 days')

ON CONFLICT (id) DO NOTHING;

-- Insert Demo Equipment
INSERT INTO equipment (id, vendor_id, name, description, price_per_day, image_url, created_at) VALUES
  ('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440004', 'John Deere Tractor 5045D', 'Modern 45HP tractor perfect for medium-sized farms. Features power steering, oil immersed brakes, and dual clutch.', 2500.00, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop', NOW() - INTERVAL '20 days'),
  ('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440004', 'Combine Harvester', 'High-efficiency combine harvester for wheat, rice, and corn. 200HP engine with 6-cylinder turbocharged diesel.', 8000.00, 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&h=300&fit=crop', NOW() - INTERVAL '18 days'),
  ('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440004', 'Rice Transplanter', '6-row rice transplanter with automatic seedling feeding system. Perfect for paddy fields.', 3500.00, 'https://images.unsplash.com/photo-1592982375447-20b24b5b5d40?w=400&h=300&fit=crop', NOW() - INTERVAL '15 days'),
  ('660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440005', 'Water Pump Set', '5HP diesel water pump for irrigation. High flow rate suitable for large farms.', 800.00, 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop', NOW() - INTERVAL '12 days'),
  ('660e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440005', 'Spraying Drone', 'Agricultural drone for pesticide and fertilizer spraying. 10L tank capacity with GPS navigation.', 15000.00, 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=300&fit=crop', NOW() - INTERVAL '10 days'),
  ('660e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440005', 'Seed Drill Machine', '12-row seed drill with fertilizer attachment. Suitable for wheat, corn, and soybean.', 4500.00, 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop', NOW() - INTERVAL '8 days')

ON CONFLICT (id) DO NOTHING;

-- Insert Demo Input Products
INSERT INTO input_products (id, supplier_id, name, category, price, stock, image_url, created_at) VALUES
  ('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440006', 'Premium NPK Fertilizer 20-20-20', 'FERTILIZER', 1250.00, 500, 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop', NOW() - INTERVAL '25 days'),
  ('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440006', 'Organic Compost', 'FERTILIZER', 800.00, 200, 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop', NOW() - INTERVAL '22 days'),
  ('770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440006', 'Pesticide - Insect Killer', 'PESTICIDE', 650.00, 300, 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop', NOW() - INTERVAL '20 days'),
  ('770e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440006', 'Herbicide - Weed Control', 'PESTICIDE', 950.00, 150, 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400&h=300&fit=crop', NOW() - INTERVAL '18 days'),
  ('770e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440007', 'Vermicompost', 'FERTILIZER', 450.00, 400, 'https://images.unsplash.com/photo-1592982375447-20b24b5b5d40?w=400&h=300&fit=crop', NOW() - INTERVAL '16 days'),
  ('770e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440007', 'Bio-Fertilizer', 'FERTILIZER', 550.00, 250, 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop', NOW() - INTERVAL '14 days'),
  ('770e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440007', 'Neem Oil Pesticide', 'PESTICIDE', 750.00, 180, 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&h=300&fit=crop', NOW() - INTERVAL '12 days'),
  ('770e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440007', 'Potash Fertilizer', 'FERTILIZER', 1100.00, 320, 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=300&fit=crop', NOW() - INTERVAL '10 days')

ON CONFLICT (id) DO NOTHING;

-- Insert Demo Produce
INSERT INTO produce (id, farmer_id, name, price, stock, image_url, created_at) VALUES
  ('880e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Fresh Tomatoes', 80.00, 1000, 'https://images.unsplash.com/photo-1561136594-7f684bac5b4c?w=400&h=300&fit=crop', NOW() - INTERVAL '5 days'),
  ('880e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'Organic Onions', 60.00, 800, 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', NOW() - INTERVAL '4 days'),
  ('880e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'Green Spinach', 40.00, 600, 'https://images.unsplash.com/photo-1576045050606-b82e10a93e33?w=400&h=300&fit=crop', NOW() - INTERVAL '3 days'),
  ('880e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', 'Fresh Carrots', 50.00, 900, 'https://images.unsplash.com/photo-1582515073490-4e1c34e0607c?w=400&h=300&fit=crop', NOW() - INTERVAL '6 days'),
  ('880e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440002', 'Bell Peppers', 120.00, 400, 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&h=300&fit=crop', NOW() - INTERVAL '5 days'),
  ('880e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440002', 'Cucumbers', 35.00, 700, 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=400&h=300&fit=crop', NOW() - INTERVAL '4 days'),
  ('880e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440003', 'Potatoes', 45.00, 1500, 'https://images.unsplash.com/photo-1594736797933-d0601ba3a63a?w=400&h=300&fit=crop', NOW() - INTERVAL '7 days'),
  ('880e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440003', 'Cauliflower', 90.00, 300, 'https://images.unsplash.com/photo-1566847438217-76e82d383f32?w=400&h=300&fit=crop', NOW() - INTERVAL '6 days'),
  ('880e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440003', 'Green Beans', 70.00, 500, 'https://images.unsplash.com/photo-1628773822503-930a7eaecf80?w=400&h=300&fit=crop', NOW() - INTERVAL '5 days'),
  ('880e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440003', 'Cabbage', 55.00, 600, 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=400&h=300&fit=crop', NOW() - INTERVAL '4 days')

ON CONFLICT (id) DO NOTHING;

-- Insert Demo Vehicles
INSERT INTO vehicles (id, transporter_id, vehicle_type, capacity_kg, plate_number, image_url, created_at) VALUES
  ('990e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440008', 'Refrigerated Truck', 5000, 'MH12AB1234', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', NOW() - INTERVAL '30 days'),
  ('990e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440008', 'Pickup Truck', 2000, 'MH12CD5678', 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop', NOW() - INTERVAL '25 days'),
  ('990e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440008', 'Cargo Van', 1500, 'MH12EF9012', 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop', NOW() - INTERVAL '20 days'),
  ('990e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440009', 'Flatbed Truck', 8000, 'MH12GH3456', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', NOW() - INTERVAL '35 days'),
  ('990e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440009', 'Container Truck', 10000, 'MH12IJ7890', 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop', NOW() - INTERVAL '28 days'),
  ('990e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440009', 'Mini Truck', 1000, 'MH12KL1357', 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop', NOW() - INTERVAL '22 days')

ON CONFLICT (id) DO NOTHING;

-- Insert Demo Orders (for presentation)
INSERT INTO orders (id, user_id, status, total_amount, created_at) VALUES
  ('aa0e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440010', 'DELIVERED', 850.00, NOW() - INTERVAL '7 days'),
  ('aa0e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440011', 'SHIPPED', 420.00, NOW() - INTERVAL '3 days'),
  ('aa0e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440010', 'PAID', 320.00, NOW() - INTERVAL '1 day')

ON CONFLICT (id) DO NOTHING;

-- Insert Demo Order Items
INSERT INTO order_items (order_id, item_type, item_id, quantity, price) VALUES
  ('aa0e8400-e29b-41d4-a716-446655440001', 'PRODUCE', '880e8400-e29b-41d4-a716-446655440001', 10, 80.00),
  ('aa0e8400-e29b-41d4-a716-446655440001', 'PRODUCE', '880e8400-e29b-41d4-a716-446655440002', 2, 60.00),
  ('aa0e8400-e29b-41d4-a716-446655440002', 'PRODUCE', '880e8400-e29b-41d4-a716-446655440004', 8, 50.00),
  ('aa0e8400-e29b-41d4-a716-446655440003', 'INPUT', '770e8400-e29b-41d4-a716-446655440001', 1, 1250.00)

ON CONFLICT DO NOTHING;

-- Insert Demo Reviews
INSERT INTO reviews (user_id, entity_type, entity_id, rating, comment, created_at) VALUES
  ('550e8400-e29b-41d4-a716-446655440010', 'PRODUCE', '880e8400-e29b-41d4-a716-446655440001', 5, 'Excellent quality tomatoes! Very fresh and perfect for our restaurant dishes.', NOW() - INTERVAL '5 days'),
  ('550e8400-e29b-41d4-a716-446655440011', 'EQUIPMENT', '660e8400-e29b-41d4-a716-446655440001', 4, 'Great tractor for our farm operations. Reliable and fuel efficient.', NOW() - INTERVAL '8 days'),
  ('550e8400-e29b-41d4-a716-446655440001', 'VEHICLE', '990e8400-e29b-41d4-a716-446655440001', 5, 'Fast delivery and professional service. Highly recommended!', NOW() - INTERVAL '3 days')

ON CONFLICT DO NOTHING;

-- Insert Demo Notifications
INSERT INTO notifications (user_id, title, message, type, is_read, created_at) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Order Delivered', 'Your order #001 has been delivered successfully.', 'PUSH', true, NOW() - INTERVAL '1 day'),
  ('550e8400-e29b-41d4-a716-446655440010', 'New Review', 'Someone reviewed your produce. Check it out!', 'PUSH', false, NOW() - INTERVAL '2 hours'),
  ('550e8400-e29b-41d4-a716-446655440004', 'Booking Request', 'New equipment booking request for John Deere Tractor.', 'PUSH', false, NOW() - INTERVAL '1 hour')

ON CONFLICT DO NOTHING;
