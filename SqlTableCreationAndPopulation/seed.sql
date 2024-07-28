-- YeChyang Tables

CREATE TABLE User_Account (
	user_id INT PRIMARY KEY IDENTITY(1,1),
	username VARCHAR(50) NOT NULL,
	user_email VARCHAR(100) NOT NULL UNIQUE,
	user_phonenumber VARCHAR(15),
	user_password VARCHAR(255) NOT NULL,
	user_role VARCHAR(20) NOT NULL DEFAULT 'user'
);

CREATE TABLE Admin_Account (
	admin_id INT PRIMARY KEY IDENTITY(1,1),
	user_id INT NOT NULL,
	username VARCHAR(50) NOT NULL,
	user_email VARCHAR(100) NOT NULL UNIQUE,
	user_phonenumber VARCHAR(15),
	user_password VARCHAR(255) NOT NULL,
	user_role VARCHAR(20) NOT NULL DEFAULT 'admin',
FOREIGN KEY (user_id) REFERENCES User_Account(user_id)
);


CREATE TABLE Profile (
	profile_id INT PRIMARY KEY IDENTITY(1,1),
	user_id INT NOT NULL,
	about_me VARCHAR(MAX), 
	country VARCHAR(100), 
	position VARCHAR(100), 
	security_code VARCHAR(50), 
	profile_picture_url VARBINARY(MAX), 
	FOREIGN KEY (user_id) REFERENCES User_Account(user_id)
)


CREATE TABLE Codes (
	code_id INT PRIMARY KEY IDENTITY(1,1),
	user_id INT,
	security_code VARCHAR(50)
	FOREIGN KEY (user_id) REFERENCES User_Account(user_id)
)

CREATE TABLE playlists (
    playlist_id INT PRIMARY KEY IDENTITY,
    user_id INT NOT NULL, 
    title VARCHAR(255) NOT NULL,
    description TEXT,
);

CREATE TABLE playlist_video (
    playlist_video_id INT PRIMARY KEY IDENTITY,
    playlist_id VARCHAR(255) NOT NULL,
    video_id VARCHAR(255) NOT NULL
);

INSERT INTO Codes (user_id, security_code) VALUES 
	(NULL,	'A1b2C3d4E5'),
	(NULL,	'F6g7H8i9J0'),
	(NULL,	'K1L2M3n4O5'),
	(NULL,	'P6Q7R8s9T0'),
	(NULL,	'U1V2W3x4Y5'),
	(NULL,	'T7u8V9w0X1'),
	(NULL,	'R4s5G6t7Y8'),
	(NULL,	'W1z2F3x4H5'),
	(NULL,	'Q9m0P1n2B3'),
	(NULL,	'D6k7L8j9S0'),
	(NULL,	'E3v4N5c6M7'),
	(NULL,	'U8i9O0q1Z2'),
	(NULL,	'J5h6R7t8A9'),
	(NULL,	'K2f3G4w5V6'),
	(NULL,	'L1x2P3y4B5'),
	(NULL,	'A7s8C9d0E1'),
	(NULL,	'F4n5H6m7J8'),
	(NULL,	'V9u0T1w2X3'),
	(NULL,	'N6l7Q8o9I0'),
	(NULL,	'Y3z4K5x6F7'),
	(NULL,	'O1r2E3p4U5'),

--Joseph
CREATE TABLE Posts(
	post_id INT PRIMARY KEY IDENTITY(1,1), 
	date_column DATE DEFAULT CONVERT(DATE, GETDATE()), 
	header VARCHAR(50), 
	message VARCHAR(300),
	author VARCHAR(50)
);


CREATE TABLE Comments(
	comment_id INT PRIMARY KEY IDENTITY(1,1),
	author VARCHAR(50),
	date_column DATE DEFAULT CONVERT(DATE, GETDATE()),  
	message VARCHAR(300),
	post_id INT, 
	FOREIGN KEY (post_id) REFERENCES Posts(post_id)
);

-- Louis table
CREATE TABLE Feedback (
	id INT PRIMARY KEY IDENTITY(1,1),
	type VARCHAR(255) NOT NULL,
	name VARCHAR(255) NOT NULL,
	email VARCHAR(255) NOT NULL,
	number INT NOT NULL,
	comment VARCHAR(500) NOT NULL,
	resolve VARCHAR(1) NOT NULL DEFAULT 'N',
	favourite VARCHAR(1) NOT NULL DEFAULT 'N',
	date_created DATE NOT NULL DEFAULT GETDATE()
);

INSERT INTO Feedback (type, name, email, number, comment) VALUES
('bug', 'john', 'john@mail.com', 123, 'there is a bug'),
('others', 'bob', 'bob@mail.com', 321, 'very informative!'),
('account', 'sam', 'sam@mail.com', 1234, 'I cannnot login')