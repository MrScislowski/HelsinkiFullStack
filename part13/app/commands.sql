CREATE TABLE blogs (
  id SERIAL PRIMARY KEY,
  author TEXT,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  likes INTEGER DEFAULT 0
);

INSERT INTO blogs (author, url, title) VALUES ('Charles Eisenstein', 'https://charleseisenstein.org/essays/the-coronation/', 'The Coronation');
INSERT INTO blogs (author, url, title, likes) VALUES ('Nate Silver', 'https://www.natesilver.net/p/the-border-may-tip-the-election-to', 'The border may tip the election to Trump', 250);