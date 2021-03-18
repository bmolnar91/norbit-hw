ALTER TABLE IF EXISTS ONLY public.track DROP CONSTRAINT IF EXISTS pk_track_id CASCADE;
ALTER TABLE IF EXISTS ONLY public.track DROP CONSTRAINT IF EXISTS fk_position_id CASCADE;
ALTER TABLE IF EXISTS ONLY public.position DROP CONSTRAINT IF EXISTS pk_position_id CASCADE;


DROP TABLE IF EXISTS public.track;
CREATE TABLE track (
    id UUID NOT NULL,
    start_time timestamp without time zone,
    end_time timestamp without time zone
);

DROP TABLE IF EXISTS public.position;
CREATE TABLE position (
    id bigserial NOT NULL,
    latitude double precision,
    longitude double precision,
    heading double precision,
    actual_time timestamp without time zone,
    track_id UUID NOT NULL
);


ALTER TABLE ONLY track
    ADD CONSTRAINT pk_track_id PRIMARY KEY (id);

ALTER TABLE ONLY position
    ADD CONSTRAINT pk_position_id PRIMARY KEY (id);

ALTER TABLE ONLY position
    ADD CONSTRAINT fk_track_id FOREIGN KEY (track_id) REFERENCES track(id) ON DELETE CASCADE;


DROP PROCEDURE IF EXISTS insert_track(UUID);
CREATE OR REPLACE PROCEDURE insert_track(id UUID)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO track (id, start_time)
    VALUES (id, DATE_TRUNC('second', CURRENT_TIMESTAMP));

    COMMIT;
END;$$
;

DROP PROCEDURE IF EXISTS insert_position(double precision, double precision, double precision, UUID);
CREATE OR REPLACE PROCEDURE insert_position(
    lat double precision,
    lon double precision,
    heading double precision,
    track_id UUID
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE track
        SET end_time = DATE_TRUNC('second', CURRENT_TIMESTAMP)
        WHERE id = track_id;

    INSERT INTO position (latitude, longitude, heading, actual_time, track_id)
    VALUES (lat, lon, heading, DATE_TRUNC('second', CURRENT_TIMESTAMP), track_id);

    COMMIT;
END;$$
;

DROP PROCEDURE IF EXISTS delete_track(UUID);
CREATE OR REPLACE PROCEDURE delete_track(track_id UUID)
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM track
        WHERE id = track_id;
    
    COMMIT;
END;$$
;

DROP VIEW IF EXISTS tracks;
CREATE VIEW tracks AS
    SELECT * FROM track;

DROP VIEW IF EXISTS positions;
CREATE VIEW positions AS
    SELECT * FROM position;
