-- PostgreSQL v18+ may allow VIRTUAL in place of STORED

ALTER TABLE actor ADD COLUMN _id_ text GENERATED ALWAYS AS (last_name || ', ' || first_name || ' (' || actor_id || ')') STORED;
ALTER TABLE category ADD COLUMN _id_ text GENERATED ALWAYS AS (name || ' (' || category_id || ')') STORED;
ALTER TABLE film ADD COLUMN _id_ text GENERATED ALWAYS AS (title || ' (' || film_id || ')') STORED;
ALTER TABLE language ADD COLUMN _id_ text GENERATED ALWAYS AS (name || ' (' || language_id || ')') STORED;
