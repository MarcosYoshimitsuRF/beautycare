-- Fase 0: V1__init_schema.sql (Servicio Core: beautycare_db)
-- Creación de las tablas Core según el modelo de datos.

-- Tabla de Usuarios y Roles
CREATE TABLE usuarios (
                          id BIGSERIAL PRIMARY KEY,
                          username VARCHAR(100) NOT NULL UNIQUE,
                          password_bcrypt VARCHAR(255) NOT NULL,
                          enabled BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE roles (
                       id BIGSERIAL PRIMARY KEY,
                       nombre VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE usuarios_roles (
                                usuario_id BIGINT NOT NULL,
                                rol_id BIGINT NOT NULL,
                                PRIMARY KEY (usuario_id, rol_id),
                                FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
                                FOREIGN KEY (rol_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- Tablas de Catálogos del Negocio
CREATE TABLE clientes (
                          id BIGSERIAL PRIMARY KEY,
                          nombre VARCHAR(255) NOT NULL,
                          celular VARCHAR(20),
                          email VARCHAR(100) UNIQUE
);

CREATE TABLE profesionales (
                               id BIGSERIAL PRIMARY KEY,
                               nombre VARCHAR(255) NOT NULL,
                               especialidad VARCHAR(150)
);

CREATE TABLE servicios (
                           id BIGSERIAL PRIMARY KEY,
                           nombre VARCHAR(255) NOT NULL,
                           precio DECIMAL(10, 2) NOT NULL,
                           duracion_min INT NOT NULL
);

-- Tablas Operativas
CREATE TABLE citas (
                       id BIGSERIAL PRIMARY KEY,
                       cliente_id BIGINT NOT NULL,
                       profesional_id BIGINT NOT NULL,
                       servicio_id BIGINT NOT NULL,
                       fecha_hora_inicio TIMESTAMP NOT NULL,
                       fecha_hora_fin TIMESTAMP NOT NULL,
                       estado VARCHAR(50) NOT NULL, -- (ej. PENDIENTE, REALIZADA, CANCELADA)
                       FOREIGN KEY (cliente_id) REFERENCES clientes(id),
                       FOREIGN KEY (profesional_id) REFERENCES profesionales(id),
                       FOREIGN KEY (servicio_id) REFERENCES servicios(id)
);

CREATE TABLE pagos (
                       id BIGSERIAL PRIMARY KEY,
                       cita_id BIGINT NOT NULL,
                       monto DECIMAL(10, 2) NOT NULL,
                       metodo VARCHAR(50),
                       fecha_hora TIMESTAMP NOT NULL,
                       FOREIGN KEY (cita_id) REFERENCES citas(id)
);

-- Índices para optimizar búsquedas comunes
CREATE INDEX idx_citas_fecha_inicio ON citas(fecha_hora_inicio);
CREATE INDEX idx_citas_profesional_fecha ON citas(profesional_id, fecha_hora_inicio);