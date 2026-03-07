CREATE TABLE blogs (id SERIAL PRIMARY KEY, author TEXT, url TEXT NOT NULL, title TEXT NOT NULL, likes INTEGER DEFAULT 0);

INSERT INTO blogs (author, url, title) VALUES ('Alex Edwards', 'https://www.alexedwards.net/blog/when-is-it-ok-to-panic-in-go', 'When it is OK to panic in Go?');

INSERT INTO blogs (author, url, title) VALUES ('Dan Abramov', 'https://overreacted.io/a-complete-guide-to-useeffect', 'A Complete Guide to useEffect');