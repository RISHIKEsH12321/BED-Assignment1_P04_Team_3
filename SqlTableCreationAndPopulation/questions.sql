-- Insert the question and get the question_id
DECLARE @question_id_1 INT;
INSERT INTO Questions (industry_id, question_text)
VALUES (1, 'What is the primary goal of sustainable agriculture?');
SELECT @question_id_1 = SCOPE_IDENTITY();

-- Insert options and get their option_ids
DECLARE @option_id_1_1 INT, @option_id_1_2 INT, @option_id_1_3 INT, @option_id_1_4 INT;

INSERT INTO Options (question_id, option_text)
VALUES (@question_id_1, 'Maximizing short-term yields');
SELECT @option_id_1_1 = SCOPE_IDENTITY();

INSERT INTO Options (question_id, option_text)
VALUES (@question_id_1, 'Minimizing environmental impact');
SELECT @option_id_1_2 = SCOPE_IDENTITY();

INSERT INTO Options (question_id, option_text)
VALUES (@question_id_1, 'Expanding land use without limits');
SELECT @option_id_1_3 = SCOPE_IDENTITY();

INSERT INTO Options (question_id, option_text)
VALUES (@question_id_1, 'Promoting monoculture crops');
SELECT @option_id_1_4 = SCOPE_IDENTITY();

-- Insert the correct answer
INSERT INTO Correct_Answers (question_id, correct_option_id)
VALUES (@question_id_1, @option_id_1_2);

-- Insert the question and get the question_id
DECLARE @question_id_2 INT;
INSERT INTO Questions (industry_id, question_text)
VALUES (1, 'Which agricultural practice aims to improve soil fertility and structure?');
SELECT @question_id_2 = SCOPE_IDENTITY();

-- Insert options and get their option_ids
DECLARE @option_id_2_1 INT, @option_id_2_2 INT, @option_id_2_3 INT, @option_id_2_4 INT;

INSERT INTO Options (question_id, option_text)
VALUES (@question_id_2, 'No-till farming');
SELECT @option_id_2_1 = SCOPE_IDENTITY();

INSERT INTO Options (question_id, option_text)
VALUES (@question_id_2, 'Pesticide application');
SELECT @option_id_2_2 = SCOPE_IDENTITY();

INSERT INTO Options (question_id, option_text)
VALUES (@question_id_2, 'Land clearing');
SELECT @option_id_2_3 = SCOPE_IDENTITY();

INSERT INTO Options (question_id, option_text)
VALUES (@question_id_2, 'Overgrazing');
SELECT @option_id_2_4 = SCOPE_IDENTITY();

-- Insert the correct answer
INSERT INTO Correct_Answers (question_id, correct_option_id)
VALUES (@question_id_2, @option_id_2_1);

-- Insert the question and get the question_id
DECLARE @question_id_3 INT;
INSERT INTO Questions (industry_id, question_text)
VALUES (1, 'Which factor contributes most significantly to food insecurity in rural areas?');
SELECT @question_id_3 = SCOPE_IDENTITY();

-- Insert options and get their option_ids
DECLARE @option_id_3_1 INT, @option_id_3_2 INT, @option_id_3_3 INT, @option_id_3_4 INT;

INSERT INTO Options (question_id, option_text)
VALUES (@question_id_3, 'Lack of transportation infrastructure');
SELECT @option_id_3_1 = SCOPE_IDENTITY();

INSERT INTO Options (question_id, option_text)
VALUES (@question_id_3, 'Low agricultural productivity');
SELECT @option_id_3_2 = SCOPE_IDENTITY();

INSERT INTO Options (question_id, option_text)
VALUES (@question_id_3, 'High market prices');
SELECT @option_id_3_3 = SCOPE_IDENTITY();

INSERT INTO Options (question_id, option_text)
VALUES (@question_id_3, 'Excessive rainfall');
SELECT @option_id_3_4 = SCOPE_IDENTITY();

-- Insert the correct answer
INSERT INTO Correct_Answers (question_id, correct_option_id)
VALUES (@question_id_3, @option_id_3_2);

-- Insert the question and get the question_id
DECLARE @question_id_4 INT;
INSERT INTO Questions (industry_id, question_text)
VALUES (1, 'Which crop rotation technique helps in reducing soil-borne diseases?');
SELECT @question_id_4 = SCOPE_IDENTITY();

-- Insert options and get their option_ids
DECLARE @option_id_4_1 INT, @option_id_4_2 INT, @option_id_4_3 INT, @option_id_4_4 INT;

INSERT INTO Options (question_id, option_text)
VALUES (@question_id_4, 'Continuous monoculture');
SELECT @option_id_4_1 = SCOPE_IDENTITY();

INSERT INTO Options (question_id, option_text)
VALUES (@question_id_4, 'Sequential cropping');
SELECT @option_id_4_2 = SCOPE_IDENTITY();

INSERT INTO Options (question_id, option_text)
VALUES (@question_id_4, 'Mixed cropping');
SELECT @option_id_4_3 = SCOPE_IDENTITY();

INSERT INTO Options (question_id, option_text)
VALUES (@question_id_4, 'Crop diversification');
SELECT @option_id_4_4 = SCOPE_IDENTITY();

-- Insert the correct answer
INSERT INTO Correct_Answers (question_id, correct_option_id)
VALUES (@question_id_4, @option_id_4_4);


-- Insert the question and get the question_id
DECLARE @question_id_5 INT;
INSERT INTO Questions (industry_id, question_text)
VALUES (1, 'What is the main advantage of drip irrigation over traditional irrigation methods?');
SELECT @question_id_5 = SCOPE_IDENTITY();

-- Insert options and get their option_ids
DECLARE @option_id_5_1 INT, @option_id_5_2 INT, @option_id_5_3 INT, @option_id_5_4 INT;

INSERT INTO Options (question_id, option_text)
VALUES (@question_id_5, 'Higher water use efficiency');
SELECT @option_id_5_1 = SCOPE_IDENTITY();

INSERT INTO Options (question_id, option_text)
VALUES (@question_id_5, 'Lower initial cost');
SELECT @option_id_5_2 = SCOPE_IDENTITY();

INSERT INTO Options (question_id, option_text)
VALUES (@question_id_5, 'Easier management');
SELECT @option_id_5_3 = SCOPE_IDENTITY();

INSERT INTO Options (question_id, option_text)
VALUES (@question_id_5, 'Minimal maintenance');
SELECT @option_id_5_4 = SCOPE_IDENTITY();

-- Insert the correct answer
INSERT INTO Correct_Answers (question_id, correct_option_id)
VALUES (@question_id_5, @option_id_5_1);

-- Insert the question and get the question_id
DECLARE @question_id_6 INT;
INSERT INTO Questions (industry_id, question_text)
VALUES (1, 'Which agricultural method involves growing crops without the use of synthetic pesticides and fertilizers?');
SELECT @question_id_6 = SCOPE_IDENTITY();

-- Insert options and get their option_ids
DECLARE @option_id_6_1 INT, @option_id_6_2 INT, @option_id_6_3 INT, @option_id_6_4 INT;

INSERT INTO Options (question_id, option_text)
VALUES (@question_id_6, 'Organic farming');
SELECT @option_id_6_1 = SCOPE_IDENTITY();

INSERT INTO Options (question_id, option_text)
VALUES (@question_id_6, 'Hydroponics');
SELECT @option_id_6_2 = SCOPE_IDENTITY();

INSERT INTO Options (question_id, option_text)
VALUES (@question_id_6, 'Aeroponics');
SELECT @option_id_6_3 = SCOPE_IDENTITY();

INSERT INTO Options (question_id, option_text)
VALUES (@question_id_6, 'Aquaponics');
SELECT @option_id_6_4 = SCOPE_IDENTITY();

-- Insert the correct answer
INSERT INTO Correct_Answers (question_id, correct_option_id)
VALUES (@question_id_6, @option_id_6_1);

-- Insert the question and get the question_id
DECLARE @question_id_7 INT;
INSERT INTO Questions (industry_id, question_text)
VALUES (1, 'In integrated pest management (IPM), what is emphasized to control pests?');
SELECT @question_id_7 = SCOPE_IDENTITY();

-- Insert options and get their option_ids
DECLARE @option_id_7_1 INT, @option_id_7_2 INT, @option_id_7_3 INT, @option_id_7_4 INT;

INSERT INTO Options (question_id, option_text)
VALUES (@question_id_7, 'Sole reliance on chemical pesticides');
SELECT @option_id_7_1 = SCOPE_IDENTITY();

INSERT INTO Options (question_id, option_text)
VALUES (@question_id_7, 'Biological control methods');
SELECT @option_id_7_2 = SCOPE_IDENTITY();

INSERT INTO Options (question_id, option_text)
VALUES (@question_id_7, 'Planting resistant crop varieties');
SELECT @option_id_7_3 = SCOPE_IDENTITY();

INSERT INTO Options (question_id, option_text)
VALUES (@question_id_7, 'No pest control measures');
SELECT @option_id_7_4 = SCOPE_IDENTITY();

-- Insert the correct answer
INSERT INTO Correct_Answers (question_id, correct_option_id)
VALUES (@question_id_7, @option_id_7_2);

-- Insert the question and get the question_id
DECLARE @question_id_8 INT;
INSERT INTO Questions (industry_id, question_text)
VALUES (1, 'What is a key benefit of agroforestry systems?');
SELECT @question_id_8 = SCOPE_IDENTITY();

-- Insert options and get their option_ids
DECLARE @option_id_8_1 INT, @option_id_8_2 INT, @option_id_8_3 INT, @option_id_8_4 INT;

INSERT INTO Options (question_id, option_text)
VALUES (@question_id_8, 'Reduced soil erosion');
SELECT @option_id_8_1 = SCOPE_IDENTITY();

INSERT INTO Options (question_id, option_text)
VALUES (@question_id_8, 'Higher water use');
SELECT @option_id_8_2 = SCOPE_IDENTITY();

INSERT INTO Options (question_id, option_text)
VALUES (@question_id_8, 'Increased chemical inputs');
SELECT @option_id_8_3 = SCOPE_IDENTITY();

INSERT INTO Options (question_id, option_text)
VALUES (@question_id_8, 'Monoculture planting');
SELECT @option_id_8_4 = SCOPE_IDENTITY();

-- Insert the correct answer
INSERT INTO Correct_Answers (question_id, correct_option_id)
VALUES (@question_id_8, @option_id_8_1);

-- Insert the question and get the question_id
DECLARE @question_id_9 INT;
INSERT INTO Questions (industry_id, question_text)
VALUES (1, 'Which factor is crucial for successful silvopastoral systems?');
SELECT @question_id_9 = SCOPE_IDENTITY();

-- Insert options and get their option_ids
DECLARE @option_id_9_1 INT, @option_id_9_2 INT, @option_id_9_3 INT, @option_id_9_4 INT;

INSERT INTO Options (question_id, option_text)
VALUES (@question_id_9, 'Minimal tree cover');
SELECT @option_id_9_1 = SCOPE_IDENTITY();

INSERT INTO Options (question_id, option_text)
VALUES (@question_id_9, 'Limited pasture rotation');
SELECT @option_id_9_2 = SCOPE_IDENTITY();

INSERT INTO Options (question_id, option_text)
VALUES (@question_id_9, 'Compatibility between trees and livestock');
SELECT @option_id_9_3 = SCOPE_IDENTITY();

INSERT INTO Options (question_id, option_text)
VALUES (@question_id_9, 'High pesticide application');
SELECT @option_id_9_4 = SCOPE_IDENTITY();

-- Insert the correct answer
INSERT INTO Correct_Answers (question_id, correct_option_id)
VALUES (@question_id_9, @option_id_9_3);

-- Insert the question and get the question_id
DECLARE @question_id_10 INT;
INSERT INTO Questions (industry_id, question_text)
VALUES (1, 'What is a characteristic of sustainable intensification in agriculture?');
SELECT @question_id_10 = SCOPE_IDENTITY();

-- Insert options and get their option_ids
DECLARE @option_id_10_1 INT, @option_id_10_2 INT, @option_id_10_3 INT, @option_id_10_4 INT;

INSERT INTO Options (question_id, option_text)
VALUES (@question_id_10, 'Expanding agricultural land');
SELECT @option_id_10_1 = SCOPE_IDENTITY();

INSERT INTO Options (question_id, option_text)
VALUES (@question_id_10, 'Maximizing short-term yields');
SELECT @option_id_10_2 = SCOPE_IDENTITY();

INSERT INTO Options (question_id, option_text)
VALUES (@question_id_10, 'Using resources efficiently');
SELECT @option_id_10_3 = SCOPE_IDENTITY();

INSERT INTO Options (question_id, option_text)
VALUES (@question_id_10, 'Reducing biodiversity');
SELECT @option_id_10_4 = SCOPE_IDENTITY();

-- Insert the correct answer
INSERT INTO Correct_Answers (question_id, correct_option_id)
VALUES (@question_id_10, @option_id_10_3);

-- Insert the question and get the question_id
DECLARE @question_id_11 INT;
INSERT INTO Questions (industry_id, question_text)
VALUES (1, 'Which practice helps in maintaining genetic diversity in crops?');
SELECT @question_id_11 = SCOPE_IDENTITY();

-- Insert options and get their option_ids
DECLARE @option_id_11_1 INT, @option_id_11_2 INT, @option_id_11_3 INT, @option_id_11_4 INT;

INSERT INTO Options (question_id, option_text)
VALUES (@question_id_11, 'Monoculture');
SELECT @option_id_11_1 = SCOPE_IDENTITY();

INSERT INTO Options (question_id, option_text)
VALUES (@question_id_11, 'Plant breeding');
SELECT @option_id_11_2 = SCOPE_IDENTITY();

INSERT INTO Options (question_id, option_text)
VALUES (@question_id_11, 'Genetic modification');
SELECT @option_id_11_3 = SCOPE_IDENTITY();

INSERT INTO Options (question_id, option_text)
VALUES (@question_id_11, 'Crop rotation');
SELECT @option_id_11_4 = SCOPE_IDENTITY();

-- Insert the correct answer
INSERT INTO Correct_Answers (question_id, correct_option_id)
VALUES (@question_id_11, @option_id_11_4);

-- Insert the question and get the question_id
DECLARE @question_id_12 INT;
INSERT INTO Questions (industry_id, question_text)
VALUES (1, 'What is a significant challenge in organic farming?');
SELECT @question_id_12 = SCOPE_IDENTITY();

-- Insert options and get their option_ids
DECLARE @option_id_12_1 INT, @option_id_12_2 INT, @option_id_12_3 INT, @option_id_12_4 INT;

INSERT INTO Options (question_id, option_text)
VALUES (@question_id_12, 'High synthetic pesticide use');
SELECT @option_id_12_1 = SCOPE_IDENTITY();

INSERT INTO Options (question_id, option_text)
VALUES (@question_id_12, 'Limited soil fertility management options');
SELECT @option_id_12_2 = SCOPE_IDENTITY();

INSERT INTO Options (question_id, option_text)
VALUES (@question_id_12, 'Excessive use of antibiotics');
SELECT @option_id_12_3 = SCOPE_IDENTITY();

INSERT INTO Options (question_id, option_text)
VALUES (@question_id_12, 'Dependency on fossil fuels');
SELECT @option_id_12_4 = SCOPE_IDENTITY();

-- Insert the correct answer
INSERT INTO Correct_Answers (question_id, correct_option_id)
VALUES (@question_id_12, @option_id_12_2);

-- Insert the question and get the question_id
DECLARE @question_id_13 INT;
INSERT INTO Questions (industry_id, question_text)
VALUES (1, 'Which method is commonly used to conserve soil moisture?');
SELECT @question_id_13 = SCOPE_IDENTITY();

-- Insert options and get their option_ids
DECLARE @option_id_13_1 INT, @option_id_13_2 INT, @option_id_13_3 INT, @option_id_13_4 INT;

INSERT INTO Options (question_id, option_text)
VALUES (@question_id_13, 'Irrigation');
SELECT @option_id_13_1 = SCOPE_IDENTITY();

INSERT INTO Options (question_id, option_text)
VALUES (@question_id_13, 'Mulching');
SELECT @option_id_13_2 = SCOPE_IDENTITY();

INSERT INTO Options (question_id, option_text)
VALUES (@question_id_13, 'Plowing');
SELECT @option_id_13_3 = SCOPE_IDENTITY();

INSERT INTO Options (question_id, option_text)
VALUES (@question_id_13, 'Fertilization');
SELECT @option_id_13_4 = SCOPE_IDENTITY();

-- Insert the correct answer
INSERT INTO Correct_Answers (question_id, correct_option_id)
VALUES (@question_id_13, @option_id_13_2);

-- Insert the question and get the question_id
DECLARE @question_id_14 INT;
INSERT INTO Questions (industry_id, question_text)
VALUES (1, 'What is the purpose of crop cover in conservation agriculture?');
SELECT @question_id_14 = SCOPE_IDENTITY();

-- Insert options and get their option_ids
DECLARE @option_id_14_1 INT, @option_id_14_2 INT, @option_id_14_3 INT, @option_id_14_4 INT;

INSERT INTO Options (question_id, option_text)
VALUES (@question_id_14, 'Increase soil erosion');
SELECT @option_id_14_1 = SCOPE_IDENTITY();

INSERT INTO Options (question_id, option_text)
VALUES (@question_id_14, 'Protect soil from erosion');
SELECT @option_id_14_2 = SCOPE_IDENTITY();

INSERT INTO Options (question_id, option_text)
VALUES (@question_id_14, 'Reduce soil fertility');
SELECT @option_id_14_3 = SCOPE_IDENTITY();

INSERT INTO Options (question_id, option_text)
VALUES (@question_id_14, 'Increase pesticide use');
SELECT @option_id_14_4 = SCOPE_IDENTITY();

-- Insert the correct answer
INSERT INTO Correct_Answers (question_id, correct_option_id)
VALUES (@question_id_14, @option_id_14_2);
-- Insert the question and get the question_id
DECLARE @question_id_15 INT;
INSERT INTO Questions (industry_id, question_text)
VALUES (1, 'Which practice is essential for preventing nutrient depletion in soil?');
SELECT @question_id_15 = SCOPE_IDENTITY();

-- Insert options and get their option_ids
DECLARE @option_id_15_1 INT, @option_id_15_2 INT, @option_id_15_3 INT, @option_id_15_4 INT;

INSERT INTO Options (question_id, option_text)
VALUES (@question_id_15, 'Monocropping');
SELECT @option_id_15_1 = SCOPE_IDENTITY();

INSERT INTO Options (question_id, option_text)
VALUES (@question_id_15, 'Crop rotation');
SELECT @option_id_15_2 = SCOPE_IDENTITY();

INSERT INTO Options (question_id, option_text)
VALUES (@question_id_15, 'Deforestation');
SELECT @option_id_15_3 = SCOPE_IDENTITY();

INSERT INTO Options (question_id, option_text)
VALUES (@question_id_15, 'Overgrazing');
SELECT @option_id_15_4 = SCOPE_IDENTITY();

-- Insert the correct answer
INSERT INTO Correct_Answers (question_id, correct_option_id)
VALUES (@question_id_15, @option_id_15_2);

-- Insert the question and get the question_id
DECLARE @question_id_16 INT;
INSERT INTO Questions (industry_id, question_text)
VALUES (1, 'Which type of agriculture emphasizes the use of local inputs and knowledge?');
SELECT @question_id_16 = SCOPE_IDENTITY();

-- Insert options and get their option_ids
DECLARE @option_id_16_1 INT, @option_id_16_2 INT, @option_id_16_3 INT, @option_id_16_4 INT;
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_16, 'Industrial agriculture');
SELECT @option_id_16_1 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_16, 'Permaculture');
SELECT @option_id_16_2 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_16, 'Genetically modified farming');
SELECT @option_id_16_3 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_16, 'Monoculture farming');
SELECT @option_id_16_4 = SCOPE_IDENTITY();

-- Insert the correct answer
INSERT INTO Correct_Answers (question_id, correct_option_id)
VALUES (@question_id_16, @option_id_16_2);

-- Insert the question and get the question_id
DECLARE @question_id_17 INT;
INSERT INTO Questions (industry_id, question_text)
VALUES (1, 'What is a primary concern in precision agriculture?');
SELECT @question_id_17 = SCOPE_IDENTITY();

-- Insert options and get their option_ids
DECLARE @option_id_17_1 INT, @option_id_17_2 INT, @option_id_17_3 INT, @option_id_17_4 INT;
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_17, 'High labor requirements');
SELECT @option_id_17_1 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_17, 'Accurate data collection and analysis');
SELECT @option_id_17_2 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_17, 'Increased pesticide use');
SELECT @option_id_17_3 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_17, 'Low initial costs');
SELECT @option_id_17_4 = SCOPE_IDENTITY();

-- Insert the correct answer
INSERT INTO Correct_Answers (question_id, correct_option_id)
VALUES (@question_id_17, @option_id_17_2);

-- Insert the question and get the question_id
DECLARE @question_id_18 INT;
INSERT INTO Questions (industry_id, question_text)
VALUES (1, 'What is the main goal of sustainable agriculture?');
SELECT @question_id_18 = SCOPE_IDENTITY();

-- Insert options and get their option_ids
DECLARE @option_id_18_1 INT, @option_id_18_2 INT, @option_id_18_3 INT, @option_id_18_4 INT;
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_18, 'Maximize short-term profits');
SELECT @option_id_18_1 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_18, 'Ensure long-term viability of farming systems');
SELECT @option_id_18_2 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_18, 'Increase chemical inputs');
SELECT @option_id_18_3 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_18, 'Reduce biodiversity');
SELECT @option_id_18_4 = SCOPE_IDENTITY();

-- Insert the correct answer
INSERT INTO Correct_Answers (question_id, correct_option_id)
VALUES (@question_id_18, @option_id_18_2);

-- Insert the question and get the question_id
DECLARE @question_id_19 INT;
INSERT INTO Questions (industry_id, question_text)
VALUES (1, 'Which approach aims to restore degraded lands?');
SELECT @question_id_19 = SCOPE_IDENTITY();

-- Insert options and get their option_ids
DECLARE @option_id_19_1 INT, @option_id_19_2 INT, @option_id_19_3 INT, @option_id_19_4 INT;
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_19, 'Conventional tillage');
SELECT @option_id_19_1 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_19, 'Agroecology');
SELECT @option_id_19_2 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_19, 'Heavy pesticide use');
SELECT @option_id_19_3 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_19, 'Monocropping');
SELECT @option_id_19_4 = SCOPE_IDENTITY();

-- Insert the correct answer
INSERT INTO Correct_Answers (question_id, correct_option_id)
VALUES (@question_id_19, @option_id_19_2);

-- Insert the question and get the question_id
DECLARE @question_id_20 INT;
INSERT INTO Questions (industry_id, question_text)
VALUES (1, 'What is a potential benefit of using biotechnology in agriculture?');
SELECT @question_id_20 = SCOPE_IDENTITY();

-- Insert options and get their option_ids
DECLARE @option_id_20_1 INT, @option_id_20_2 INT, @option_id_20_3 INT, @option_id_20_4 INT;
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_20, 'Reduced crop yields');
SELECT @option_id_20_1 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_20, 'Increased pest resistance');
SELECT @option_id_20_2 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_20, 'Higher chemical dependency');
SELECT @option_id_20_3 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_20, 'Decreased crop diversity');
SELECT @option_id_20_4 = SCOPE_IDENTITY();

-- Insert the correct answer
INSERT INTO Correct_Answers (question_id, correct_option_id)
VALUES (@question_id_20, @option_id_20_2);

-- Insert the question and get the question_id
DECLARE @question_id_21 INT;
INSERT INTO Questions (industry_id, question_text)
VALUES (2, 'Which farming technique involves rotating different crops seasonally to improve soil health?');
SELECT @question_id_21 = SCOPE_IDENTITY();

-- Insert options and get their option_ids
DECLARE @option_id_21_1 INT, @option_id_21_2 INT, @option_id_21_3 INT, @option_id_21_4 INT;
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_21, 'Monoculture');
SELECT @option_id_21_1 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_21, 'Intercropping');
SELECT @option_id_21_2 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_21, 'Hydroponics');
SELECT @option_id_21_3 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_21, 'Aquaponics');
SELECT @option_id_21_4 = SCOPE_IDENTITY();

-- Insert the correct answer
INSERT INTO Correct_Answers (question_id, correct_option_id)
VALUES (@question_id_21, @option_id_21_2);

-- Insert the question and get the question_id
DECLARE @question_id_22 INT;
INSERT INTO Questions (industry_id, question_text)
VALUES (2, 'What is a primary benefit of genetically modified (GM) crops?');
SELECT @question_id_22 = SCOPE_IDENTITY();

-- Insert options and get their option_ids
DECLARE @option_id_22_1 INT, @option_id_22_2 INT, @option_id_22_3 INT, @option_id_22_4 INT;
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_22, 'Increased biodiversity');
SELECT @option_id_22_1 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_22, 'Reduced pest resistance');
SELECT @option_id_22_2 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_22, 'Improved crop yield');
SELECT @option_id_22_3 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_22, 'Higher environmental impact');
SELECT @option_id_22_4 = SCOPE_IDENTITY();

-- Insert the correct answer
INSERT INTO Correct_Answers (question_id, correct_option_id)
VALUES (@question_id_22, @option_id_22_3);

-- Insert the question and get the question_id
DECLARE @question_id_23 INT;
INSERT INTO Questions (industry_id, question_text)
VALUES (2, 'Which technology uses satellite imagery and sensors to optimize farming practices?');
SELECT @question_id_23 = SCOPE_IDENTITY();

-- Insert options and get their option_ids
DECLARE @option_id_23_1 INT, @option_id_23_2 INT, @option_id_23_3 INT, @option_id_23_4 INT;
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_23, 'Traditional farming');
SELECT @option_id_23_1 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_23, 'Precision agriculture');
SELECT @option_id_23_2 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_23, 'Organic farming');
SELECT @option_id_23_3 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_23, 'Subsistence farming');
SELECT @option_id_23_4 = SCOPE_IDENTITY();

-- Insert the correct answer
INSERT INTO Correct_Answers (question_id, correct_option_id)
VALUES (@question_id_23, @option_id_23_2);

-- Insert the question and get the question_id
DECLARE @question_id_24 INT;
INSERT INTO Questions (industry_id, question_text)
VALUES (2, 'What is a potential drawback of monoculture farming?');
SELECT @question_id_24 = SCOPE_IDENTITY();

-- Insert options and get their option_ids
DECLARE @option_id_24_1 INT, @option_id_24_2 INT, @option_id_24_3 INT, @option_id_24_4 INT;
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_24, 'Increased biodiversity');
SELECT @option_id_24_1 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_24, 'Soil degradation');
SELECT @option_id_24_2 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_24, 'Lower yields');
SELECT @option_id_24_3 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_24, 'Decreased pest resistance');
SELECT @option_id_24_4 = SCOPE_IDENTITY();

-- Insert the correct answer
INSERT INTO Correct_Answers (question_id, correct_option_id)
VALUES (@question_id_24, @option_id_24_2);

-- Insert the question and get the question_id
DECLARE @question_id_25 INT;
INSERT INTO Questions (industry_id, question_text)
VALUES (2, 'Which farming method integrates crops and livestock to improve sustainability?');
SELECT @question_id_25 = SCOPE_IDENTITY();

-- Insert options and get their option_ids
DECLARE @option_id_25_1 INT, @option_id_25_2 INT, @option_id_25_3 INT, @option_id_25_4 INT;
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_25, 'Permaculture');
SELECT @option_id_25_1 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_25, 'Agroforestry');
SELECT @option_id_25_2 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_25, 'Regenerative agriculture');
SELECT @option_id_25_3 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_25, 'Integrated farming');
SELECT @option_id_25_4 = SCOPE_IDENTITY();

-- Insert the correct answer
INSERT INTO Correct_Answers (question_id, correct_option_id)
VALUES (@question_id_25, @option_id_25_4);

-- Insert the question and get the question_id
DECLARE @question_id_26 INT;
INSERT INTO Questions (industry_id, question_text)
VALUES (2, 'What is the primary purpose of crop rotation?');
SELECT @question_id_26 = SCOPE_IDENTITY();

-- Insert options and get their option_ids
DECLARE @option_id_26_1 INT, @option_id_26_2 INT, @option_id_26_3 INT, @option_id_26_4 INT;
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_26, 'Increase soil erosion');
SELECT @option_id_26_1 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_26, 'Reduce soil fertility');
SELECT @option_id_26_2 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_26, 'Control pests and diseases');
SELECT @option_id_26_3 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_26, 'Increase chemical use');
SELECT @option_id_26_4 = SCOPE_IDENTITY();

-- Insert the correct answer
INSERT INTO Correct_Answers (question_id, correct_option_id)
VALUES (@question_id_26, @option_id_26_3);

-- Insert the question and get the question_id
DECLARE @question_id_27 INT;
INSERT INTO Questions (industry_id, question_text)
VALUES (2, 'Which practice aims to reduce water usage in farming?');
SELECT @question_id_27 = SCOPE_IDENTITY();

-- Insert options and get their option_ids
DECLARE @option_id_27_1 INT, @option_id_27_2 INT, @option_id_27_3 INT, @option_id_27_4 INT;
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_27, 'Flood irrigation');
SELECT @option_id_27_1 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_27, 'Sprinkler irrigation');
SELECT @option_id_27_2 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_27, 'Drip irrigation');
SELECT @option_id_27_3 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_27, 'Furrow irrigation');
SELECT @option_id_27_4 = SCOPE_IDENTITY();

-- Insert the correct answer
INSERT INTO Correct_Answers (question_id, correct_option_id)
VALUES (@question_id_27, @option_id_27_3);

-- Insert the question and get the question_id
DECLARE @question_id_28 INT;
INSERT INTO Questions (industry_id, question_text)
VALUES (3, 'Which approach combines trees and agriculture in a sustainable manner?');
SELECT @question_id_28 = SCOPE_IDENTITY();

-- Insert options and get their option_ids
DECLARE @option_id_28_1 INT, @option_id_28_2 INT, @option_id_28_3 INT, @option_id_28_4 INT;
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_28, 'Agroforestry');
SELECT @option_id_28_1 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_28, 'Monoculture');
SELECT @option_id_28_2 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_28, 'Industrial farming');
SELECT @option_id_28_3 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_28, 'Hydroponics');
SELECT @option_id_28_4 = SCOPE_IDENTITY();

-- Insert the correct answer
INSERT INTO Correct_Answers (question_id, correct_option_id)
VALUES (@question_id_28, @option_id_28_1);

-- Insert the question and get the question_id
DECLARE @question_id_29 INT;
INSERT INTO Questions (industry_id, question_text)
VALUES (3, 'What is the benefit of intercropping?');
SELECT @question_id_29 = SCOPE_IDENTITY();

-- Insert options and get their option_ids
DECLARE @option_id_29_1 INT, @option_id_29_2 INT, @option_id_29_3 INT, @option_id_29_4 INT;
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_29, 'Increased pest pressure');
SELECT @option_id_29_1 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_29, 'Improved soil fertility');
SELECT @option_id_29_2 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_29, 'Higher water usage');
SELECT @option_id_29_3 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_29, 'Reduced crop yield');
SELECT @option_id_29_4 = SCOPE_IDENTITY();

-- Insert the correct answer
INSERT INTO Correct_Answers (question_id, correct_option_id)
VALUES (@question_id_29, @option_id_29_2);

-- Insert the question and get the question_id
DECLARE @question_id_30 INT;
INSERT INTO Questions (industry_id, question_text)
VALUES (3, 'Which practice helps in conserving soil moisture?');
SELECT @question_id_30 = SCOPE_IDENTITY();

-- Insert options and get their option_ids
DECLARE @option_id_30_1 INT, @option_id_30_2 INT, @option_id_30_3 INT, @option_id_30_4 INT;
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_30, 'No-till farming');
SELECT @option_id_30_1 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_30, 'Tillage');
SELECT @option_id_30_2 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_30, 'Slash-and-burn');
SELECT @option_id_30_3 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_30, 'Overgrazing');
SELECT @option_id_30_4 = SCOPE_IDENTITY();

-- Insert the correct answer
INSERT INTO Correct_Answers (question_id, correct_option_id)
VALUES (@question_id_30, @option_id_30_1);

-- Insert the question and get the question_id
DECLARE @question_id_31 INT;
INSERT INTO Questions (industry_id, question_text)
VALUES (3, 'Which method involves growing crops without soil?');
SELECT @question_id_31 = SCOPE_IDENTITY();

-- Insert options and get their option_ids
DECLARE @option_id_31_1 INT, @option_id_31_2 INT, @option_id_31_3 INT, @option_id_31_4 INT;
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_31, 'Conventional farming');
SELECT @option_id_31_1 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_31, 'Hydroponics');
SELECT @option_id_31_2 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_31, 'Subsistence farming');
SELECT @option_id_31_3 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_31, 'Polyculture');
SELECT @option_id_31_4 = SCOPE_IDENTITY();

-- Insert the correct answer
INSERT INTO Correct_Answers (question_id, correct_option_id)
VALUES (@question_id_31, @option_id_31_2);

-- Insert the question and get the question_id
DECLARE @question_id_32 INT;
INSERT INTO Questions (industry_id, question_text)
VALUES (3, 'What is the goal of regenerative agriculture?');
SELECT @question_id_32 = SCOPE_IDENTITY();

-- Insert options and get their option_ids
DECLARE @option_id_32_1 INT, @option_id_32_2 INT, @option_id_32_3 INT, @option_id_32_4 INT;
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_32, 'Deplete soil nutrients');
SELECT @option_id_32_1 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_32, 'Restore soil health');
SELECT @option_id_32_2 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_32, 'Increase chemical use');
SELECT @option_id_32_3 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_32, 'Reduce biodiversity');
SELECT @option_id_32_4 = SCOPE_IDENTITY();

-- Insert the correct answer
INSERT INTO Correct_Answers (question_id, correct_option_id)
VALUES (@question_id_32, @option_id_32_2);

-- Insert the question and get the question_id
DECLARE @question_id_33 INT;
INSERT INTO Questions (industry_id, question_text)
VALUES (3, 'Which farming technique uses minimal soil disturbance?');
SELECT @question_id_33 = SCOPE_IDENTITY();

-- Insert options and get their option_ids
DECLARE @option_id_33_1 INT, @option_id_33_2 INT, @option_id_33_3 INT, @option_id_33_4 INT;
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_33, 'No-till farming');
SELECT @option_id_33_1 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_33, 'Conventional plowing');
SELECT @option_id_33_2 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_33, 'Intensive tillage');
SELECT @option_id_33_3 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_33, 'Rotational grazing');
SELECT @option_id_33_4 = SCOPE_IDENTITY();

-- Insert the correct answer
INSERT INTO Correct_Answers (question_id, correct_option_id)
VALUES (@question_id_33, @option_id_33_1);

-- Insert the question and get the question_id
DECLARE @question_id_34 INT;
INSERT INTO Questions (industry_id, question_text)
VALUES (3, 'Which practice involves planting different crops in close proximity?');
SELECT @question_id_34 = SCOPE_IDENTITY();

-- Insert options and get their option_ids
DECLARE @option_id_34_1 INT, @option_id_34_2 INT, @option_id_34_3 INT, @option_id_34_4 INT;
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_34, 'Monoculture');
SELECT @option_id_34_1 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_34, 'Intercropping');
SELECT @option_id_34_2 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_34, 'Crop rotation');
SELECT @option_id_34_3 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_34, 'Agroforestry');
SELECT @option_id_34_4 = SCOPE_IDENTITY();

-- Insert the correct answer
INSERT INTO Correct_Answers (question_id, correct_option_id)
VALUES (@question_id_34, @option_id_34_2);
-- Insert the question and get the question_id
DECLARE @question_id_35 INT;
INSERT INTO Questions (industry_id, question_text)
VALUES (3, 'What is the benefit of crop diversification?');
SELECT @question_id_35 = SCOPE_IDENTITY();

-- Insert options and get their option_ids
DECLARE @option_id_35_1 INT, @option_id_35_2 INT, @option_id_35_3 INT, @option_id_35_4 INT;
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_35, 'Increased dependency on a single crop');
SELECT @option_id_35_1 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_35, 'Reduced risk of crop failure');
SELECT @option_id_35_2 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_35, 'Higher input costs');
SELECT @option_id_35_3 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_35, 'Increased chemical use');
SELECT @option_id_35_4 = SCOPE_IDENTITY();

-- Insert the correct answer
INSERT INTO Correct_Answers (question_id, correct_option_id)
VALUES (@question_id_35, @option_id_35_2);

-- Insert the question and get the question_id
DECLARE @question_id_36 INT;
INSERT INTO Questions (industry_id, question_text)
VALUES (3, 'Which farming system integrates crops and livestock?');
SELECT @question_id_36 = SCOPE_IDENTITY();

-- Insert options and get their option_ids
DECLARE @option_id_36_1 INT, @option_id_36_2 INT, @option_id_36_3 INT, @option_id_36_4 INT;
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_36, 'Monoculture');
SELECT @option_id_36_1 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_36, 'Agroforestry');
SELECT @option_id_36_2 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_36, 'Mixed farming');
SELECT @option_id_36_3 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_36, 'Hydroponics');
SELECT @option_id_36_4 = SCOPE_IDENTITY();

-- Insert the correct answer
INSERT INTO Correct_Answers (question_id, correct_option_id)
VALUES (@question_id_36, @option_id_36_3);

-- Insert the question and get the question_id
DECLARE @question_id_37 INT;
INSERT INTO Questions (industry_id, question_text)
VALUES (3, 'What is the main advantage of organic farming?');
SELECT @question_id_37 = SCOPE_IDENTITY();

-- Insert options and get their option_ids
DECLARE @option_id_37_1 INT, @option_id_37_2 INT, @option_id_37_3 INT, @option_id_37_4 INT;
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_37, 'Higher chemical input');
SELECT @option_id_37_1 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_37, 'Improved soil health');
SELECT @option_id_37_2 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_37, 'Reduced crop diversity');
SELECT @option_id_37_3 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_37, 'Increased water usage');
SELECT @option_id_37_4 = SCOPE_IDENTITY();

-- Insert the correct answer
INSERT INTO Correct_Answers (question_id, correct_option_id)
VALUES (@question_id_37, @option_id_37_2);

-- Insert the question and get the question_id
DECLARE @question_id_38 INT;
INSERT INTO Questions (industry_id, question_text)
VALUES (3, 'Which practice involves growing different crops in the same area in sequential seasons?');
SELECT @question_id_38 = SCOPE_IDENTITY();

-- Insert options and get their option_ids
DECLARE @option_id_38_1 INT, @option_id_38_2 INT, @option_id_38_3 INT, @option_id_38_4 INT;
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_38, 'Monocropping');
SELECT @option_id_38_1 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_38, 'Intercropping');
SELECT @option_id_38_2 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_38, 'Crop rotation');
SELECT @option_id_38_3 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_38, 'Agroforestry');
SELECT @option_id_38_4 = SCOPE_IDENTITY();

-- Insert the correct answer
INSERT INTO Correct_Answers (question_id, correct_option_id)
VALUES (@question_id_38, @option_id_38_3);

-- Insert the question and get the question_id
DECLARE @question_id_39 INT;
INSERT INTO Questions (industry_id, question_text)
VALUES (4, 'What is a key goal of precision agriculture?');
SELECT @question_id_39 = SCOPE_IDENTITY();

-- Insert options and get their option_ids
DECLARE @option_id_39_1 INT, @option_id_39_2 INT, @option_id_39_3 INT, @option_id_39_4 INT;
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_39, 'Uniform application of inputs');
SELECT @option_id_39_1 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_39, 'Maximize use of chemical fertilizers');
SELECT @option_id_39_2 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_39, 'Optimize field-level management');
SELECT @option_id_39_3 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_39, 'Increase monoculture practices');
SELECT @option_id_39_4 = SCOPE_IDENTITY();

-- Insert the correct answer
INSERT INTO Correct_Answers (question_id, correct_option_id)
VALUES (@question_id_39, @option_id_39_3);

-- Insert the question and get the question_id
DECLARE @question_id_40 INT;
INSERT INTO Questions (industry_id, question_text)
VALUES (4, 'Which technology is commonly used in precision agriculture for monitoring crops?');
SELECT @question_id_40 = SCOPE_IDENTITY();

-- Insert options and get their option_ids
DECLARE @option_id_40_1 INT, @option_id_40_2 INT, @option_id_40_3 INT, @option_id_40_4 INT;
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_40, 'Drones');
SELECT @option_id_40_1 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_40, 'Tractors');
SELECT @option_id_40_2 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_40, 'Plows');
SELECT @option_id_40_3 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_40, 'Seed drills');
SELECT @option_id_40_4 = SCOPE_IDENTITY();

-- Insert the correct answer
INSERT INTO Correct_Answers (question_id, correct_option_id)
VALUES (@question_id_40, @option_id_40_1);

-- Insert the question and get the question_id
DECLARE @question_id_41 INT;
INSERT INTO Questions (industry_id, question_text)
VALUES (4, 'What is the purpose of using GPS in precision agriculture?');
SELECT @question_id_41 = SCOPE_IDENTITY();

-- Insert options and get their option_ids
DECLARE @option_id_41_1 INT, @option_id_41_2 INT, @option_id_41_3 INT, @option_id_41_4 INT;
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_41, 'Navigating through fields');
SELECT @option_id_41_1 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_41, 'Monitoring soil health');
SELECT @option_id_41_2 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_41, 'Applying fertilizers precisely');
SELECT @option_id_41_3 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_41, 'Mapping field variability');
SELECT @option_id_41_4 = SCOPE_IDENTITY();

-- Insert the correct answer
INSERT INTO Correct_Answers (question_id, correct_option_id)
VALUES (@question_id_41, @option_id_41_4);

-- Insert the question and get the question_id
DECLARE @question_id_42 INT;
INSERT INTO Questions (industry_id, question_text)
VALUES (4, 'Which practice in precision agriculture helps in water management?');
SELECT @question_id_42 = SCOPE_IDENTITY();

-- Insert options and get their option_ids
DECLARE @option_id_42_1 INT, @option_id_42_2 INT, @option_id_42_3 INT, @option_id_42_4 INT;
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_42, 'Variable rate technology');
SELECT @option_id_42_1 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_42, 'Satellite imagery');
SELECT @option_id_42_2 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_42, 'Yield monitoring');
SELECT @option_id_42_3 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_42, 'Geographic information system');
SELECT @option_id_42_4 = SCOPE_IDENTITY();

-- Insert the correct answer
INSERT INTO Correct_Answers (question_id, correct_option_id)
VALUES (@question_id_42, @option_id_42_1);
-- Insert the question and get the question_id
DECLARE @question_id_43 INT;
INSERT INTO Questions (industry_id, question_text)
VALUES (4, 'Which sensor technology is used to measure soil moisture levels in precision agriculture?');
SELECT @question_id_43 = SCOPE_IDENTITY();

-- Insert options and get their option_ids
DECLARE @option_id_43_1 INT, @option_id_43_2 INT, @option_id_43_3 INT, @option_id_43_4 INT;
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_43, 'Optical sensors');
SELECT @option_id_43_1 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_43, 'Capacitive sensors');
SELECT @option_id_43_2 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_43, 'Thermal sensors');
SELECT @option_id_43_3 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_43, 'Mechanical sensors');
SELECT @option_id_43_4 = SCOPE_IDENTITY();

-- Insert the correct answer
INSERT INTO Correct_Answers (question_id, correct_option_id)
VALUES (@question_id_43, @option_id_43_2);

-- Insert the question and get the question_id
DECLARE @question_id_44 INT;
INSERT INTO Questions (industry_id, question_text)
VALUES (4, 'What is the main purpose of yield monitoring in precision agriculture?');
SELECT @question_id_44 = SCOPE_IDENTITY();

-- Insert options and get their option_ids
DECLARE @option_id_44_1 INT, @option_id_44_2 INT, @option_id_44_3 INT, @option_id_44_4 INT;
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_44, 'To map soil types');
SELECT @option_id_44_1 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_44, 'To assess crop performance');
SELECT @option_id_44_2 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_44, 'To calibrate equipment');
SELECT @option_id_44_3 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_44, 'To monitor weather patterns');
SELECT @option_id_44_4 = SCOPE_IDENTITY();

-- Insert the correct answer
INSERT INTO Correct_Answers (question_id, correct_option_id)
VALUES (@question_id_44, @option_id_44_2);

-- Insert the question and get the question_id
DECLARE @question_id_45 INT;
INSERT INTO Questions (industry_id, question_text)
VALUES (5, 'What is the primary focus of regenerative agriculture?');
SELECT @question_id_45 = SCOPE_IDENTITY();

-- Insert options and get their option_ids
DECLARE @option_id_45_1 INT, @option_id_45_2 INT, @option_id_45_3 INT, @option_id_45_4 INT;
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_45, 'Maximizing yield');
SELECT @option_id_45_1 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_45, 'Enhancing soil health');
SELECT @option_id_45_2 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_45, 'Increasing pesticide use');
SELECT @option_id_45_3 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_45, 'Promoting monoculture');
SELECT @option_id_45_4 = SCOPE_IDENTITY();

-- Insert the correct answer
INSERT INTO Correct_Answers (question_id, correct_option_id)
VALUES (@question_id_45, @option_id_45_2);

-- Insert the question and get the question_id
DECLARE @question_id_46 INT;
INSERT INTO Questions (industry_id, question_text)
VALUES (5, 'Which practice in regenerative agriculture aims to restore soil biodiversity?');
SELECT @question_id_46 = SCOPE_IDENTITY();

-- Insert options and get their option_ids
DECLARE @option_id_46_1 INT, @option_id_46_2 INT, @option_id_46_3 INT, @option_id_46_4 INT;
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_46, 'Synthetic fertilizers');
SELECT @option_id_46_1 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_46, 'Cover cropping');
SELECT @option_id_46_2 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_46, 'Monocropping');
SELECT @option_id_46_3 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_46, 'Tillage');
SELECT @option_id_46_4 = SCOPE_IDENTITY();

-- Insert the correct answer
INSERT INTO Correct_Answers (question_id, correct_option_id)
VALUES (@question_id_46, @option_id_46_2);

-- Insert the question and get the question_id
DECLARE @question_id_47 INT;
INSERT INTO Questions (industry_id, question_text)
VALUES (5, 'What is a benefit of no-till farming?');
SELECT @question_id_47 = SCOPE_IDENTITY();

-- Insert options and get their option_ids
DECLARE @option_id_47_1 INT, @option_id_47_2 INT, @option_id_47_3 INT, @option_id_47_4 INT;
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_47, 'Increased soil erosion');
SELECT @option_id_47_1 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_47, 'Improved soil structure');
SELECT @option_id_47_2 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_47, 'Higher water runoff');
SELECT @option_id_47_3 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_47, 'Reduced soil organic matter');
SELECT @option_id_47_4 = SCOPE_IDENTITY();

-- Insert the correct answer
INSERT INTO Correct_Answers (question_id, correct_option_id)
VALUES (@question_id_47, @option_id_47_2);

-- Insert the question and get the question_id
DECLARE @question_id_48 INT;
INSERT INTO Questions (industry_id, question_text)
VALUES (5, 'Which crop is commonly used in crop rotation to improve soil nitrogen levels?');
SELECT @question_id_48 = SCOPE_IDENTITY();

-- Insert options and get their option_ids
DECLARE @option_id_48_1 INT, @option_id_48_2 INT, @option_id_48_3 INT, @option_id_48_4 INT;
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_48, 'Wheat');
SELECT @option_id_48_1 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_48, 'Corn');
SELECT @option_id_48_2 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_48, 'Soybeans');
SELECT @option_id_48_3 = SCOPE_IDENTITY();
INSERT INTO Options (question_id, option_text)
VALUES (@question_id_48, 'Sunflowers');
SELECT @option_id_48_4 = SCOPE_IDENTITY();

-- Insert the correct answer
INSERT INTO Correct_Answers (question_id, correct_option_id)
VALUES (@question_id_48, @option_id_48_3);

