ALTER TABLE IF EXISTS ONLY public.track DROP CONSTRAINT IF EXISTS pk_track_id CASCADE;
ALTER TABLE IF EXISTS ONLY public.track DROP CONSTRAINT IF EXISTS fk_position_id CASCADE;
ALTER TABLE IF EXISTS ONLY public.position DROP CONSTRAINT IF EXISTS pk_position_id CASCADE;


DROP TABLE IF EXISTS public.track;
CREATE TABLE track (
    id serial NOT NULL,
    start_time timestamp without time zone,
    end_time timestamp without time zone
);

DROP TABLE IF EXISTS public.position;
CREATE TABLE position (
    id serial NOT NULL,
    lat double precision,
    lon double precision,
    heading double precision,
    track_id integer NOT NULL
);


ALTER TABLE ONLY track
    ADD CONSTRAINT pk_track_id PRIMARY KEY (id);

ALTER TABLE ONLY position
    ADD CONSTRAINT pk_position_id PRIMARY KEY (id);

ALTER TABLE ONLY position
    ADD CONSTRAINT fk_track_id FOREIGN KEY (track_id) REFERENCES track(id);
