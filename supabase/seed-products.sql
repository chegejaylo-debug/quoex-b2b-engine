-- Seed data for B2B Industrial Supply Products
-- Run this in Supabase SQL Editor to populate the products table

-- Clear existing data (optional - comment out if you want to keep existing data)
-- TRUNCATE TABLE products CASCADE;

-- Insert Hardware Products
INSERT INTO products (name, category, price, image_url, created_at) VALUES
('Premium Blue Triangle Cement 42.5R', 'Hardware', 1450, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', NOW()),
('Simba Cement 32.5N - 50kg Bag', 'Hardware', 1280, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', NOW()),
('Steel Reinforcement Bars 12mm - 6m', 'Hardware', 850, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', NOW()),
('Steel Reinforcement Bars 16mm - 6m', 'Hardware', 1200, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', NOW()),
('Galvanized Steel Sheets 0.5mm - 2x1m', 'Hardware', 3200, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', NOW()),
('PVC Pipes 32mm - 6m Length', 'Hardware', 450, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', NOW()),
('PVC Pipes 50mm - 6m Length', 'Hardware', 680, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', NOW()),
('Copper Electrical Wire 2.5mm - 100m Roll', 'Hardware', 2800, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', NOW()),
('Electrical Switches 16A - Pack of 10', 'Hardware', 850, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', NOW()),
('LED Bulbs 12W - Pack of 5', 'Hardware', 1200, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', NOW()),
('Door Handles Stainless Steel - Pack of 5', 'Hardware', 650, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', NOW()),
('Padlocks Heavy Duty - Pack of 3', 'Hardware', 890, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', NOW()),
('Nails 4 inch - 5kg Box', 'Hardware', 1200, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', NOW()),
('Screws 8mm - 2kg Box', 'Hardware', 950, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', NOW()),
('Hammer Fiberglass Handle', 'Hardware', 450, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', NOW());

-- Insert Agriculture Products
INSERT INTO products (name, category, price, image_url, created_at) VALUES
('NPK Fertilizer 50kg Bag', 'Agriculture', 3800, 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400', NOW()),
('UREA Fertilizer 50kg Bag', 'Agriculture', 3200, 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400', NOW()),
('DAP Fertilizer 50kg Bag', 'Agriculture', 4200, 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400', NOW()),
('Maize Seeds Hybrid 1kg', 'Agriculture', 450, 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400', NOW()),
('Wheat Seeds Improved 1kg', 'Agriculture', 380, 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400', NOW()),
('Bean Seeds KAT 1kg', 'Agriculture', 280, 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400', NOW()),
('Pesticide Broad Spectrum 1L', 'Agriculture', 1200, 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400', NOW()),
('Herbicide Selective 1L', 'Agriculture', 950, 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400', NOW()),
('Fungicide Systemic 500ml', 'Agriculture', 850, 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400', NOW()),
('Sprayer Pump 16L Manual', 'Agriculture', 2800, 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400', NOW()),
('Drip Irrigation Kit 100m', 'Agriculture', 4500, 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400', NOW()),
('Greenhouse Film 200 micron 6x10m', 'Agriculture', 8500, 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400', NOW()),
('Garden Hoe Steel Handle', 'Agriculture', 650, 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400', NOW()),
('Machete Agricultural', 'Agriculture', 450, 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400', NOW()),
('Watering Can 10L Plastic', 'Agriculture', 380, 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400', NOW());

-- Insert Construction Products
INSERT INTO products (name, category, price, image_url, created_at) VALUES
('River Sand 20 Tonnes', 'Construction', 15000, 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400', NOW()),
('Ballast 20 Tonnes', 'Construction', 18000, 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400', NOW()),
('Building Stones 2x9 20 Tonnes', 'Construction', 22000, 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400', NOW()),
('Machine Cut Stones 6x9 20 Tonnes', 'Construction', 28000, 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400', NOW()),
('Brick Red Clay 1000 pieces', 'Construction', 12000, 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400', NOW()),
('Concrete Blocks 6x9 100 pieces', 'Construction', 8500, 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400', NOW()),
('Roofing Tiles Clay 100 pieces', 'Construction', 35000, 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400', NOW()),
('Mabati Iron Sheets 3m - Pack of 10', 'Construction', 28000, 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400', NOW()),
('Guttering System PVC 6m', 'Construction', 3200, 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400', NOW()),
('Window Frames Aluminum 4x4', 'Construction', 8500, 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400', NOW()),
('Door Frames Hardwood 7x3', 'Construction', 6500, 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400', NOW()),
('Floor Tiles Ceramic 60x60 50 pieces', 'Construction', 18000, 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400', NOW()),
('Wall Paint Interior 20L Bucket', 'Construction', 8500, 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400', NOW()),
('Wall Paint Exterior 20L Bucket', 'Construction', 9500, 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400', NOW()),
('Waterproof Membrane Roll 20m²', 'Construction', 4500, 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400', NOW());

-- Insert Electronics Products
INSERT INTO products (name, category, price, image_url, created_at) VALUES
('Solar Panel 300W Monocrystalline', 'Electronics', 28000, 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400', NOW()),
('Solar Battery 200Ah Deep Cycle', 'Electronics', 35000, 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400', NOW()),
('Solar Charge Controller 30A', 'Electronics', 4500, 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400', NOW()),
('Solar Inverter 3000W Pure Sine', 'Electronics', 38000, 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400', NOW()),
('LED Strip Lights 5m RGB', 'Electronics', 1200, 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400', NOW()),
('Security Camera WiFi 1080P', 'Electronics', 5500, 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400', NOW()),
('Digital Door Lock Biometric', 'Electronics', 15000, 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400', NOW()),
('Smart Plug WiFi 16A - Pack of 2', 'Electronics', 2800, 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400', NOW()),
('Motion Sensor LED Light 10W', 'Electronics', 1200, 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400', NOW()),
('Power Bank 20000mAh Solar', 'Electronics', 4500, 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400', NOW()),
('Electric Fence Energizer 5 Joule', 'Electronics', 8500, 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400', NOW()),
('Water Pump Solar 100W', 'Electronics', 12000, 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400', NOW()),
('Voltage Stabilizer 5000VA', 'Electronics', 15000, 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400', NOW()),
('UPS 1500VA Online', 'Electronics', 28000, 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400', NOW()),
('Generator Petrol 5kVA', 'Electronics', 65000, 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400', NOW());

-- Insert Wholesale Products
INSERT INTO products (name, category, price, image_url, created_at) VALUES
('Rice Basmati Premium 50kg Bag', 'Wholesale', 8500, 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', NOW()),
('Maize Flour 50kg Bag', 'Wholesale', 4200, 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', NOW()),
('Wheat Flour 50kg Bag', 'Wholesale', 5500, 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', NOW()),
('Sugar White 50kg Bag', 'Wholesale', 7200, 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', NOW()),
('Cooking Oil 20L Jerrycan', 'Wholesale', 6800, 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', NOW()),
('Salt Iodized 50kg Bag', 'Wholesale', 1800, 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', NOW()),
('Beans Yellow 50kg Bag', 'Wholesale', 9500, 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', NOW()),
('Beans Red 50kg Bag', 'Wholesale', 8800, 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', NOW()),
('Green Peas 50kg Bag', 'Wholesale', 7500, 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', NOW()),
('Lentils 50kg Bag', 'Wholesale', 6800, 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', NOW()),
('Tea Leaves Bulk 50kg', 'Wholesale', 12000, 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', NOW()),
('Coffee Beans Arabica 50kg', 'Wholesale', 35000, 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', NOW()),
('Dried Milk Powder 25kg', 'Wholesale', 28000, 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', NOW()),
('Pasta Spaghetti 20kg Box', 'Wholesale', 4500, 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', NOW()),
('Rice Brown 50kg Bag', 'Wholesale', 7800, 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', NOW());

-- Insert Technology Products
INSERT INTO products (name, category, price, image_url, created_at) VALUES
('Laptop Business 15.6" i7 16GB RAM', 'Technology', 145000, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400', NOW()),
('Desktop PC Tower i5 8GB RAM', 'Technology', 85000, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400', NOW()),
('Monitor 24" LED Full HD', 'Technology', 25000, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400', NOW()),
('Keyboard Mechanical RGB', 'Technology', 8500, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400', NOW()),
('Mouse Wireless Gaming', 'Technology', 4500, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400', NOW()),
('Printer Laser Multifunction', 'Technology', 45000, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400', NOW()),
('Scanner Document A4', 'Technology', 35000, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400', NOW()),
('Projector 1080P HDMI', 'Technology', 65000, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400', NOW()),
('Router WiFi 6 Dual Band', 'Technology', 8500, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400', NOW()),
('Network Switch 16 Port Gigabit', 'Technology', 12000, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400', NOW()),
('Hard Drive External 4TB USB 3.0', 'Technology', 15000, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400', NOW()),
('SSD 1TB NVMe', 'Technology', 12000, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400', NOW()),
('RAM 16GB DDR4 3200MHz', 'Technology', 8500, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400', NOW()),
('Webcam HD 1080P', 'Technology', 4500, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400', NOW()),
('Headset USB Noise Cancelling', 'Technology', 5500, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400', NOW());

-- Insert Home Goods Products
INSERT INTO products (name, category, price, image_url, created_at) VALUES
('Mattress Queen Size Memory Foam', 'Home Goods', 45000, 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400', NOW()),
('Bed Frame King Size Wooden', 'Home Goods', 55000, 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400', NOW()),
('Sofa Set 3-Seater Leather', 'Home Goods', 85000, 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400', NOW()),
('Dining Table 6-Seater Wooden', 'Home Goods', 65000, 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400', NOW()),
('Wardrobe 3-Door Mirrored', 'Home Goods', 45000, 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400', NOW()),
('Coffee Table Glass Top', 'Home Goods', 15000, 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400', NOW()),
('Bookshelf 5-Shelf Wooden', 'Home Goods', 25000, 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400', NOW()),
('TV Stand Modern Design', 'Home Goods', 18000, 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400', NOW()),
('Office Chair Ergonomic', 'Home Goods', 25000, 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400', NOW()),
('Refrigerator Double Door 500L', 'Home Goods', 85000, 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400', NOW()),
('Washing Machine Front Load 8kg', 'Home Goods', 65000, 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400', NOW()),
('Microwave Oven 30L Convection', 'Home Goods', 28000, 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400', NOW()),
('Air Conditioner Split 18000 BTU', 'Home Goods', 85000, 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400', NOW()),
('Water Dispenser Hot & Cold', 'Home Goods', 15000, 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400', NOW()),
('Blender 1500W Professional', 'Home Goods', 8500, 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400', NOW());

-- Insert Industrial Products
INSERT INTO products (name, category, price, image_url, created_at) VALUES
('Industrial Drill Press 16mm', 'Industrial', 45000, 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400', NOW()),
('Angle Grinder 9 inch 2000W', 'Industrial', 8500, 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400', NOW()),
('Circular Saw 7 inch 1800W', 'Industrial', 12000, 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400', NOW()),
('Jigsaw 700W Variable Speed', 'Industrial', 6500, 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400', NOW()),
('Router 1400W Plunge Base', 'Industrial', 9500, 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400', NOW()),
('Belt Sander 1000W 3x18 inch', 'Industrial', 7500, 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400', NOW()),
('Welder ARC 250A Portable', 'Industrial', 35000, 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400', NOW()),
('Compressor 50L 2HP', 'Industrial', 28000, 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400', NOW()),
('Nail Gun Pneumatic Framing', 'Industrial', 8500, 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400', NOW()),
('Impact Wrench 1/2 inch 700ft-lb', 'Industrial', 12000, 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400', NOW()),
('Chain Saw 18 inch 2000W', 'Industrial', 15000, 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400', NOW()),
('Concrete Mixer 130L Electric', 'Industrial', 45000, 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400', NOW()),
('Tile Cutter 600mm Manual', 'Industrial', 8500, 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400', NOW()),
('Heat Gun 2000W Variable Temp', 'Industrial', 3500, 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400', NOW()),
('Workbench with Vise 1500mm', 'Industrial', 18000, 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400', NOW());

-- Verify the data
SELECT category, COUNT(*) as product_count, AVG(price) as avg_price 
FROM products 
GROUP BY category 
ORDER BY product_count DESC;
