-- Invoice Bank Verification Database Schema
-- PostgreSQL

-- Drop tables if they exist (for clean reinstall)
DROP TABLE IF EXISTS verification_logs;
DROP TABLE IF EXISTS invoices;

-- Create invoices table
CREATE TABLE invoices (
    id SERIAL PRIMARY KEY,
    invoice_number VARCHAR(100) UNIQUE NOT NULL,
    bank_name VARCHAR(255) NOT NULL,
    bank_account_number VARCHAR(100) NOT NULL,
    beneficiary_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create verification_logs table
CREATE TABLE verification_logs (
    id SERIAL PRIMARY KEY,
    invoice_number VARCHAR(100) NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    verified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_invoice_number ON invoices(invoice_number);
CREATE INDEX idx_verification_logs_invoice ON verification_logs(invoice_number);
CREATE INDEX idx_verification_logs_timestamp ON verification_logs(verified_at);

-- Insert sample data for testing
INSERT INTO invoices (invoice_number, bank_name, bank_account_number, beneficiary_name) VALUES
('INV-2024-001', 'HSBC Bank', '1234567890', 'ABC Trading Co.'),
('INV-2024-002', 'Standard Chartered', '9876543210', 'XYZ Imports Ltd.'),
('INV-2024-003', 'Citibank', '5555666677', 'Global Exports Inc.');
