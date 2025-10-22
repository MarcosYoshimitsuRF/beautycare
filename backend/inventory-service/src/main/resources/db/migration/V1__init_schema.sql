-- Fase 0: V1__init_schema.sql (Microservicio: inventory_db)
-- Creación de las tablas de Inventario según el modelo de datos.

CREATE TABLE proveedores (
                             id BIGSERIAL PRIMARY KEY,
                             nombre VARCHAR(255) NOT NULL,
                             ruc VARCHAR(20) UNIQUE,
                             telefono VARCHAR(20)
);

CREATE TABLE insumos (
                         id BIGSERIAL PRIMARY KEY,
                         nombre VARCHAR(255) NOT NULL,
                         stock INT NOT NULL DEFAULT 0,
                         stock_minimo INT NOT NULL DEFAULT 0,
                         unidad VARCHAR(50) -- (ej. 'ml', 'gr', 'unidad')
);

CREATE TABLE compras (
                         id BIGSERIAL PRIMARY KEY,
                         proveedor_id BIGINT,
                         fecha DATE NOT NULL,
                         total DECIMAL(10, 2) NOT NULL,
                         FOREIGN KEY (proveedor_id) REFERENCES proveedores(id)
);

-- Esta tabla define la relación (no-FK) con el servicio core
CREATE TABLE consumo_insumo (
                                id BIGSERIAL PRIMARY KEY,
    -- Este campo almacena el ID del servicio de 'beautycare_db'.
    -- NO LLEVA FK, es solo un campo numérico.
                                servicio_id BIGINT NOT NULL,
                                insumo_id BIGINT NOT NULL,
                                cantidad_por_servicio DECIMAL(10, 2) NOT NULL,
                                FOREIGN KEY (insumo_id) REFERENCES insumos(id)
);

-- Índices
CREATE INDEX idx_consumo_insumo_servicio_id ON consumo_insumo(servicio_id);