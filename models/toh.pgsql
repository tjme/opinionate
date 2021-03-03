-- PostgreSQL database creation script for Angular "Tour of Heroes" tutorial
-- May be better to use "int GENERATED BY DEFAULT AS IDENTITY" (or ALWAYS) rather than SERIAL for primary keys, but current PostGraphile v4-alpha is problematic, see #631.

-- Could use citext and LIKE instead of ILIKE:
-- CREATE EXTENSION IF NOT EXISTS citext;

DROP TABLE IF EXISTS hero CASCADE;
CREATE TABLE hero(
id SERIAL PRIMARY KEY,
name text NOT NULL);

CREATE OR REPLACE FUNCTION herowithterm(
  term text)
    RETURNS SETOF hero LANGUAGE 'sql' STABLE
AS $$
    select *
    from hero
    where name ILIKE '%'||term||'%'
$$;

INSERT INTO hero (id, name) OVERRIDING SYSTEM VALUE VALUES
    (1,'Mr. Nice'),
    (2,'Narco'),
    (3,'Bombasto'),
    (4,'Celeritas'),
    (5,'Magneta'),
    (6,'RubberMan'),
    (7,'Dynama'),
    (8,'Dr IQ'),
    (9,'Magma'),
    (10,'Tornado');

ALTER SEQUENCE hero_id_seq RESTART WITH 21;