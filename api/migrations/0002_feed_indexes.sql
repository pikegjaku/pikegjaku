-- Migration number: 0002 	 2026-10-06T03:34:02.048Z

CREATE INDEX idx_posts_feed ON posts (Status, Type, Urgent DESC, Created_At DESC, _id);

DROP INDEX idx_posts_user;

CREATE INDEX idx_posts_user ON posts (User, Created_At DESC);
