-- Fase 1: V2__seed_admin.sql (MODIFICADO para DataSeeder)
-- Inserta SOLAMENTE los roles base del sistema.
-- El usuario admin (y otros) será creado/verificado por el DataSeeder.java

-- 1. Insertar los roles definidos por el sistema
INSERT INTO roles (nombre) VALUES ('ADMIN') ON CONFLICT (nombre) DO NOTHING;
INSERT INTO roles (nombre) VALUES ('CLIENTE') ON CONFLICT (nombre) DO NOTHING;
INSERT INTO roles (nombre) VALUES ('STAFF') ON CONFLICT (nombre) DO NOTHING;

-- SECCIÓN DE INSERT USUARIO Y USUARIO_ROLES ELIMINADA