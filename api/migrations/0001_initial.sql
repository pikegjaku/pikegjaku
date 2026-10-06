-- Migration number: 0001 	 2026-10-05T19:46:54.572Z

CREATE TABLE countries (
    _id TEXT PRIMARY KEY,
    Name TEXT NOT NULL UNIQUE,
    Code INTEGER NOT NULL UNIQUE,
    Cities INTEGER DEFAULT 0,
    Posts INTEGER DEFAULT 0,
    Users INTEGER DEFAULT 0,
    Created_At TEXT NOT NULL,
    Updated_At TEXT NOT NULL,
    Deleted INTEGER DEFAULT 0,
    Deleted_At TEXT DEFAULT NULL
) STRICT;

CREATE TABLE cities (
    _id TEXT PRIMARY KEY,
    Name TEXT NOT NULL UNIQUE,
    Value TEXT NOT NULL UNIQUE,
    Posts INTEGER DEFAULT 0,
    Users INTEGER DEFAULT 0,
    Country TEXT NOT NULL,
    Created_At TEXT NOT NULL,
    Updated_At TEXT NOT NULL,
    Deleted INTEGER DEFAULT 0,
    Deleted_At TEXT DEFAULT NULL
) STRICT;

CREATE INDEX idx_cities_country ON cities (Country);

CREATE TABLE centers (
    _id TEXT PRIMARY KEY,
    Name TEXT NOT NULL,
    Phone TEXT NOT NULL,
    Address TEXT NOT NULL,
    City TEXT NOT NULL,
    Country TEXT NOT NULL,
    Location TEXT DEFAULT NULL,
    Active INTEGER DEFAULT 1,
    Created_At TEXT NOT NULL,
    Updated_At TEXT NOT NULL,
    Deleted INTEGER DEFAULT 0,
    Deleted_At TEXT DEFAULT NULL
) STRICT;

CREATE TABLE users (
    _id TEXT PRIMARY KEY,
    Name TEXT DEFAULT NULL,
    Surname TEXT DEFAULT NULL,
    Phone TEXT NOT NULL UNIQUE,
    PhoneCountryCode TEXT DEFAULT '+383',
    Avatar TEXT DEFAULT NULL,
    BloodGroup TEXT DEFAULT NULL,
    Role TEXT DEFAULT 'user',
    ProfileCompleted INTEGER DEFAULT 0,
    CompletedRegistration INTEGER DEFAULT 0,
    Visits INTEGER DEFAULT 1,
    Posts INTEGER DEFAULT 0,
    Country TEXT DEFAULT NULL,
    City TEXT DEFAULT NULL,
    Deleted INTEGER DEFAULT 0,
    Deleted_At TEXT DEFAULT NULL,
    Last_Active TEXT NOT NULL,
    Created_At TEXT NOT NULL,
    Updated_At TEXT DEFAULT NULL
) STRICT;

CREATE TABLE posts (
    _id TEXT PRIMARY KEY,
    Title TEXT DEFAULT NULL,
    Description TEXT DEFAULT NULL,
    Type TEXT NOT NULL DEFAULT 'blood',
    BloodGroup TEXT DEFAULT NULL,
    Urgent INTEGER DEFAULT 0,
    Status TEXT DEFAULT 'approved',
    Reach INTEGER DEFAULT 0,
    User TEXT NOT NULL,
    Country TEXT DEFAULT NULL,
    City TEXT DEFAULT NULL,
    Views INTEGER DEFAULT 0,
    Deleted INTEGER DEFAULT 0,
    Deleted_At TEXT DEFAULT NULL,
    Created_At TEXT DEFAULT NULL,
    Updated_At TEXT DEFAULT NULL
) STRICT;

CREATE INDEX idx_posts_user ON posts (User);

CREATE TABLE verifications (
    _id TEXT PRIMARY KEY,
    User TEXT NOT NULL,
    Type TEXT DEFAULT 'phone',
    Code INTEGER NOT NULL UNIQUE,
    Expired INTEGER DEFAULT 0,
    Attempts INTEGER DEFAULT 0,
    Used INTEGER DEFAULT 0,
    Expires_At TEXT NOT NULL,
    Generated_At TEXT NOT NULL,
    Metadata TEXT NOT NULL DEFAULT '{}'
) STRICT;

CREATE INDEX idx_verifications_user ON verifications (User);

CREATE TABLE waitlists (
    _id TEXT PRIMARY KEY,
    Email TEXT NOT NULL UNIQUE,
    Subscribed_At TEXT NOT NULL,
    Metadata TEXT NOT NULL DEFAULT '{}'
) STRICT;
