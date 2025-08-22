# Example database installation

- create/configure a PostgreSQL database, e.g. "toh" `sudo -u postgres psql -d template1`, then enter the following SQL commands:

```sql
CREATE USER test WITH PASSWORD 'testpass';
CREATE DATABASE toh;
\c toh
CREATE TABLE hero(id SERIAL PRIMARY KEY, name text NOT NULL);
CREATE OR REPLACE FUNCTION herowithterm(term text)
    RETURNS SETOF hero LANGUAGE 'sql' STABLE
AS $$
    select * from hero where name ILIKE '%'||term||'%'
$$;
INSERT INTO hero (id, name) VALUES
(1, 'Mr. Nice'),
(2, 'Narco'),
(3, 'Bombasto'),
(4, 'Celeritas'),
(5, 'Magneta'),
(6, 'RubberMan'),
(7, 'Dynama'),
(8, 'Dr IQ'),
(9, 'Magma'),
(10, 'Tornado');
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO test;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO test;
\q
```

- Run the PostGraphile server with `postgraphile -c postgres://test:testpass@/toh --cors --enhance-graphiql -n localhost -p 5000 -q /graphql &`
