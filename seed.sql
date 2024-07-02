-- Rishikesh Tables

CREATE TABLE Industry_Info (
    industry_id int PRIMARY KEY IDENTITY(1,1),
    industry_name varchar(255) NOT NULL,
    introduction varchar(700) NOT NULL
);

CREATE TABLE Industry_Challenges (
    challenge_id int PRIMARY KEY IDENTITY(1,1),
    industry_id int NOT NULL,
    challenge_name varchar(200) NOT NULL,
    challenge_description varchar(255) NOT NULL,
    challenge_content varchar(255) NOT NULL,
    FOREIGN KEY (industry_id) REFERENCES Industry_Info(industry_id)
);

-- Create Questions table
CREATE TABLE Questions (
    question_id INT PRIMARY KEY IDENTITY(1,1),
    industry_id INT,
    question_text VARCHAR(700) NOT NULL,
    FOREIGN KEY (industry_id) REFERENCES Industry_Info(industry_id)
);

-- Create Options table
CREATE TABLE Options (
    option_id INT PRIMARY KEY IDENTITY(1,1),
    question_id INT,
    option_text VARCHAR(255) NOT NULL,
    FOREIGN KEY (question_id) REFERENCES Questions(question_id)
);

-- Create Correct_Answers table
CREATE TABLE Correct_Answers (
    question_id INT,
    correct_option_id INT NOT NULL,
    PRIMARY KEY (question_id, correct_option_id),
    FOREIGN KEY (question_id) REFERENCES Questions(question_id),
    FOREIGN KEY (correct_option_id) REFERENCES Options(option_id)
);




-- Rishikesh Insert
INSERT INTO Industry_Info (industry_name, introduction)
VALUES 
('Agriculture', 'Agriculture involves the cultivation of crops and the rearing of animals to produce food, fiber, medicinal plants, and other products used to sustain and enhance human life.'),
('Crop Production', 'Crop production involves the growing of plants for food, fiber, and other uses.'),
('Livestock Farming', 'Livestock farming involves the rearing of animals for meat, milk, eggs, and other products.');

INSERT INTO Industry_Challenges (industry_id, challenge_name, challenge_description, challenge_content)
VALUES 
(1, 'Sustainable Agriculture Practices', 'Implementing farming practices that are sustainable and environmentally friendly.', 'Includes challenges such as crop rotation, conservation tillage, and reducing chemical inputs.'),
(1, 'Labor Shortages', 'Addressing the issue of insufficient labor in agriculture.', 'Challenges include attracting young people to farming, mechanization, and improving labor conditions.'),
(1, 'Market Access', 'Ensuring farmers have access to markets to sell their produce.', 'Challenges include transportation infrastructure, market information systems, and negotiating fair prices.'),
(2, 'Pest and Disease Management', 'Managing pests and diseases is crucial for crop health and yield.', 'Challenges include developing resistant crop varieties, using biocontrol methods, and integrated pest management.'),
(2, 'Climate Change Adaptation', 'Adapting crop production to changing climate conditions.', 'Includes practices such as crop rotation, selecting drought-resistant varieties, and sustainable water management.'),
(2, 'Soil Fertility Management', 'Maintaining soil fertility for optimal crop growth.', 'Challenges include nutrient management, using organic fertilizers, and preventing soil erosion.'),
(3, 'Animal Health and Welfare', 'Ensuring the health and welfare of livestock is essential for productivity and ethical farming.', 'Challenges include disease prevention, proper housing, and humane handling practices.'),
(3, 'Feed and Nutrition', 'Providing adequate and balanced nutrition to livestock.', 'Includes challenges such as formulating balanced diets, managing feed costs, and sourcing high-quality feed.'),
(3, 'Environmental Impact', 'Mitigating the environmental impact of livestock farming.', 'Challenges include managing waste, reducing greenhouse gas emissions, and sustainable grazing practices.');


INSERT INTO Questions (industry_id, question_text) VALUES 
(1, 'What is the process of growing crops called?'),
(1, 'Which of the following is a common method for improving soil fertility?'),
(2, 'Which crop is known as the staple food for half of the world''s population?'),
(2, 'Which technique involves planting different crops in succession on the same land?'),
(3, 'What is the primary purpose of livestock farming?'),
(3, 'Which of the following animals is commonly raised for milk production?');

INSERT INTO Options (question_id, option_text) VALUES 
(1, 'Crop Production'),
(1, 'Livestock Farming'),
(1, 'Horticulture'),
(1, 'Aquaculture'),

(2, 'Irrigation'),
(2, 'Crop Rotation'),
(2, 'Pesticide Application'),
(2, 'Harvesting'),

(3, 'Wheat'),
(3, 'Corn'),
(3, 'Rice'),
(3, 'Soybeans'),

(4, 'Monoculture'),
(4, 'Crop Rotation'),
(4, 'Polyculture'),
(4, 'Agroforestry'),

(5, 'Crop production'),
(5, 'Raising animals for food and other products'),
(5, 'Soil improvement'),
(5, 'Water conservation'),

(6, 'Chickens'),
(6, 'Pigs'),
(6, 'Cows'),
(6, 'Goats');
INSERT INTO Correct_Answers (question_id, correct_option_id) VALUES 
(1, 1),
(2, 6),
(3, 11),
(4, 14),
(5, 18),
(6, 23);



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
user_id INT,
FOREIGN KEY (user_id) REFERENCES User_Account(user_id)
);


CREATE TABLE Comments(
	comment_id INT PRIMARY KEY IDENTITY(1,1),
	author VARCHAR(50),
	date_column DATE DEFAULT CONVERT(DATE, GETDATE()),  
	message VARCHAR(300),
	post_id INT, 
	FOREIGN KEY (post_id) REFERENCES Posts(post_id),
	user_id INT,
FOREIGN KEY (user_id) REFERENCES User_Account(user_id)
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