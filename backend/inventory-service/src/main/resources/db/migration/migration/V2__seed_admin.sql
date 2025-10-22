-- Fase 1: V2__seed_admin.sql
-- Inserta los roles base del sistema y el usuario administrador inicial.

-- 1. Insertar los roles definidos por el sistema
-- (Aunque el plan solo menciona el seed del admin, necesitamos los roles para la asignación)
INSERT INTO roles (nombre) VALUES ('ADMIN')
    ON CONFLICT (nombre) DO NOTHING;

INSERT INTO roles (nombre) VALUES ('CLIENTE')
    ON CONFLICT (nombre) DO NOTHING;

INSERT INTO roles (nombre) VALUES ('STAFF')
    ON CONFLICT (nombre) DO NOTHING;


-- 2. Insertar el usuario Administrador
-- Contraseña es 'admin123' (Encriptada con BCrypt Cost=10)
-- Hash: $2a$10$gP/n60/9abfB/831vX..De8.MCf.h.RhO.uY5u.VL/flXl.Nv.V/u
INSERT INTO usuarios (username, password_bcrypt, enabled)
VALUES ('admin', '$2a$10$gP/n60/9abfB/831vX..De8.MCf.h.RhO.uY5u.VL/flXl.Nv.V/u', true)
    ON CONFLICT (username) DO NOTHING;


-- 3. Asignar el Rol 'ADMIN' al usuario 'admin'
-- (Usamos sub-consultas para asegurar que se usen los IDs correctos)
INSERT INTO usuarios_roles (usuario_id, rol_id)
SELECT
    (SELECT id FROM usuarios WHERE username = 'admin'),
    (SELECT id FROM roles WHERE nombre = 'ADMIN')
    ON CONFLICT (usuario_id, rol_id) DO NOTHING;