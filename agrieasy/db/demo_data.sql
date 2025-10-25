-- Demo Data for AgriHub Presentation
-- This script populates the database with sample data for demonstration purposes

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
  ('550e8400-e29b-41d4-a716-446655440012', '+919876543221', 'admin@agrihub.com', 'System Admin', '$2b$10$8K1mN7X8Yk8Q8mN7X8Yk8Q8mN7X8Yk8Q8mN7X8Yk8Q8mN7X8Yk8Q8mN7X8Yk8Q', 'ADMIN', NOW() - INTERVAL '60 days');

-- Insert Demo Equipment
INSERT INTO equipment (id, vendor_id, name, description, price_per_day, image_url, created_at) VALUES
  ('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440004', 'John Deere Tractor 5045D', 'Modern 45HP tractor perfect for medium-sized farms. Features power steering, oil immersed brakes, and dual clutch.', 2500.00, 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&h=300&fit=crop', NOW() - INTERVAL '20 days'),
  ('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440004', 'Combine Harvester', 'High-efficiency combine harvester for wheat, rice, and corn. 200HP engine with 6-cylinder turbocharged diesel.', 8000.00, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop', NOW() - INTERVAL '18 days'),
  ('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440004', 'Rice Transplanter', '6-row rice transplanter with automatic seedling feeding system. Perfect for paddy fields.', 3500.00, 'https://images.unsplash.com/photo-1592982375447-20b24b5b5d40?w=400&h=300&fit=crop', NOW() - INTERVAL '15 days'),
  ('660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440005', 'Water Pump Set', '5HP diesel water pump for irrigation. High flow rate suitable for large farms.', 800.00, 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop', NOW() - INTERVAL '12 days'),
  ('660e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440005', 'Spraying Drone', 'Agricultural drone for pesticide and fertilizer spraying. 10L tank capacity with GPS navigation.', 15000.00, 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=300&fit=crop', NOW() - INTERVAL '10 days'),
  ('660e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440005', 'Seed Drill Machine', '12-row seed drill with fertilizer attachment. Suitable for wheat, corn, and soybean.', 4500.00, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop', NOW() - INTERVAL '8 days');

-- Insert Demo Input Products
INSERT INTO input_products (id, supplier_id, name, category, price, stock, image_url, created_at) VALUES
  ('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440006', 'Premium NPK Fertilizer 20-20-20', 'FERTILIZER', 1250.00, 500, 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop', NOW() - INTERVAL '25 days'),
  ('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440006', 'Organic Compost', 'FERTILIZER', 800.00, 200, 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=300&fit=crop', NOW() - INTERVAL '22 days'),
  ('770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440006', 'Pesticide - Insect Killer', 'PESTICIDE', 650.00, 300, 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop', NOW() - INTERVAL '20 days'),
  ('770e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440006', 'Herbicide - Weed Control', 'PESTICIDE', 950.00, 150, 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400&h=300&fit=crop', NOW() - INTERVAL '18 days'),
  ('770e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440007', 'Vermicompost', 'FERTILIZER', 450.00, 400, 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&h=300&fit=crop', NOW() - INTERVAL '16 days'),
  ('770e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440007', 'Bio-Fertilizer', 'FERTILIZER', 550.00, 250, 'https://images.unsplash.com/photo-1592982375447-20b24b5b5d40?w=400&h=300&fit=crop', NOW() - INTERVAL '14 days'),
  ('770e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440007', 'Neem Oil Pesticide', 'PESTICIDE', 750.00, 180, 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop', NOW() - INTERVAL '12 days'),
  ('770e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440007', 'Potash Fertilizer', 'FERTILIZER', 1100.00, 320, 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=300&fit=crop', NOW() - INTERVAL '10 days');

-- Insert Demo Produce
INSERT INTO produce (id, farmer_id, name, price, stock, image_url, created_at) VALUES
  ('880e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Fresh Tomatoes', 80.00, 1000, 'https://images.unsplash.com/photo-1561136594-7f684bac5b4c?w=400&h=300&fit=crop', NOW() - INTERVAL '5 days'),
  ('880e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'Organic Onions', 60.00, 800, 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', NOW() - INTERVAL '4 days'),
  ('880e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'Green Spinach', 40.00, 600, 'https://images.unsplash.com/photo-1576045050606-b82e10a93e33?w=400&h=300&fit=crop', NOW() - INTERVAL '3 days'),
  ('880e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', 'Fresh Carrots', 50.00, 900, 'https://images.unsplash.com/photo-1582515073490-4e1c34e0607c?w=400&h=300&fit=crop', NOW() - INTERVAL '6 days'),
  ('880e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440002', 'Bell Peppers', 120.00, 400, 'https://images.unsplash.com/photo-1561136594-7f684bac5b4c?w=400&h=300&fit=crop', NOW() - INTERVAL '5 days'),
  ('880e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440002', 'Cucumbers', 35.00, 700, 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=400&h=300&fit=crop', NOW() - INTERVAL '4 days'),
  ('880e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440003', 'Potatoes', 45.00, 1500, 'https://images.unsplash.com/photo-1594736797933-d0601ba3a63a?w=400&h=300&fit=crop', NOW() - INTERVAL '7 days'),
  ('880e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440003', 'Cauliflower', 90.00, 300, 'https://images.unsplash.com/photo-1566847438217-76e82d383f32?w=400&h=300&fit=crop', NOW() - INTERVAL '6 days'),
  ('880e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440003', 'Green Beans', 70.00, 500, 'https://images.unsplash.com/photo-1628773822503-930a7eaecf80?w=400&h=300&fit=crop', NOW() - INTERVAL '5 days'),
  ('880e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440003', 'Cabbage', 55.00, 600, 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=300&fit=crop', NOW() - INTERVAL '4 days');

-- Insert Demo Vehicles
INSERT INTO vehicles (id, transporter_id, vehicle_type, capacity_kg, plate_number, image_url, created_at) VALUES
  ('990e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440008', 'Refrigerated Truck', 5000, 'MH12AB1234', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', NOW() - INTERVAL '30 days'),
  ('990e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440008', 'Pickup Truck', 2000, 'MH12CD5678', 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop', NOW() - INTERVAL '25 days'),
  ('990e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440008', 'Cargo Van', 1500, 'MH12EF9012', 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop', NOW() - INTERVAL '20 days'),
  ('990e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440009', 'Flatbed Truck', 8000, 'MH12GH3456', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', NOW() - INTERVAL '35 days'),
  ('990e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440009', 'Container Truck', 10000, 'MH12IJ7890', 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop', NOW() - INTERVAL '28 days'),
  ('990e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440009', 'Mini Truck', 1000, 'MH12KL1357', 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop', NOW() - INTERVAL '22 days');

-- Insert Demo Cart/Orders (for demonstration)
-- Note: These would typically be in separate tables, but for demo purposes, we'll add some sample data
