const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");
const Industry_Info = require("../models/industry_info");
const Industry_Challenges = require("../models/industry_challenges");
const industry_info_controller = require("../controller/industry_info_controller");
const validateRole = require("../middleware/validateRole");

jest.mock("fs");
jest.mock("jsdom");

jest.mock("../models/industry_info", () => ({
    getAllIndustryInfo: jest.fn(),
    getIndustryInfo: jest.fn(),
    updateIndustryInfo: jest.fn(),
}));

jest.mock('../middleware/validateRole', () => ({
    validateUserRole: jest.fn(),
}));

jest.mock("../models/industry_challenges", () => ({
    getAllIndustryChallenges: jest.fn(),
    getIndustryChallenges: jest.fn(),
    createNewChallenge: jest.fn(),
    updateChallenge: jest.fn(),
    deleteIndustryChallenge: jest.fn(),
}));
  

describe('createNewChallenge', () => {
    let req, res;
  
    beforeEach(() => {
      req = { body: {} }; // Mock request body
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      jest.clearAllMocks(); // Clear all mocks before each test
    });
  
    it('should create a new challenge successfully when role is admin', async () => {
      const mockNewChallenge = {
        challenge_id: 1,
        industry_id: 1,
        challenge_name: 'New Challenge',
        challenge_description: 'Description of the new challenge',
        challenge_content: 'Content of the new challenge',
      };

      // Mock the role validation and challenge creation
      validateRole.validateUserRole.mockResolvedValue('admin');
      Industry_Challenges.createNewChallenge.mockResolvedValue(mockNewChallenge);
  
      req.body = mockNewChallenge;
  
      await industry_info_controller.createNewChallenge(req, res);
  
      expect(validateRole.validateUserRole).toHaveBeenCalledWith(req);
      expect(Industry_Challenges.createNewChallenge).toHaveBeenCalledWith(mockNewChallenge);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockNewChallenge);
    });
  
    it('should return 401 status when role is user', async () => {
      validateRole.validateUserRole.mockResolvedValue('user');
  
      await industry_info_controller.createNewChallenge(req, res);
  
      expect(validateRole.validateUserRole).toHaveBeenCalledWith(req);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'Access error', 
        details: 'You are not an Admin. Lack of access.' 
      });
    });
  
    it('should return 401 status for unexpected role values', async () => {
      validateRole.validateUserRole.mockResolvedValue('guest'); // Mock an unexpected role
  
      await industry_info_controller.createNewChallenge(req, res);
  
      expect(validateRole.validateUserRole).toHaveBeenCalledWith(req);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'Access error', 
        details: 'guest' 
      });
    });
  
    it('should return 500 status when there is an error creating the challenge', async () => {
      const mockError = new Error('Creation failed');
      validateRole.validateUserRole.mockResolvedValue('admin');
      Industry_Challenges.createNewChallenge.mockRejectedValue(mockError);

      req.body = { /* Mock new challenge data */ };
  
      await industry_info_controller.createNewChallenge(req, res);
  
      expect(validateRole.validateUserRole).toHaveBeenCalledWith(req);
      expect(Industry_Challenges.createNewChallenge).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'Error creating Challenge', 
        error: mockError.message 
      });
    });
});

/* */ 
describe("getAllIndustryInfo", () => {
    let req, res;
  
    beforeEach(() => {
      req = {}; // No industry_id needed
      res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
  
      jest.clearAllMocks(); // Clear all mocks before each test
    });
  
    it("should return industry info and challenges with a 200 status", async () => {
      const mockIndustryInfo = [
        {
          industry_id: 1,
          industry_name: "Tech",
          introduction: "Tech Industry",
        },
        {
          industry_id: 2,
          industry_name: "Finance",
          introduction: "Finance Industry",
        },
      ];
      const mockChallenges = [[
        {
          challenge_id: 2,
          industry_id: 1,
          challenge_name: "Labor Shortages",
          challenge_description: "Addressing the issue of insufficient labor in agriculture.",
          challenge_content: "Challenges include attracting young people to farming, mechanization, and improving labor conditions."
        },
        {
          challenge_id: 3,
          industry_id: 1,
          challenge_name: "Market Access",
          challenge_description: "Ensuring farmers have access to markets to sell their produce.",
          challenge_content: "Challenges include transportation infrastructure, market information systems, and negotiating fair prices."
        }
    ]];
  
      Industry_Info.getAllIndustryInfo.mockResolvedValue(mockIndustryInfo);
      Industry_Challenges.getAllIndustryChallenges.mockResolvedValue(mockChallenges);
  
      await industry_info_controller.getAllIndustryInfo(req, res);
  
      expect(Industry_Info.getAllIndustryInfo).toHaveBeenCalled();
      expect(Industry_Challenges.getAllIndustryChallenges).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({
        industry: mockIndustryInfo,
        challanges: mockChallenges,
      });
    });
  
    it("should return a 404 status if no industry info found", async () => {
      Industry_Info.getAllIndustryInfo.mockResolvedValue([]);
      Industry_Challenges.getAllIndustryChallenges.mockResolvedValue([]);
  
      await industry_info_controller.getAllIndustryInfo(req, res);
  
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith("Industries not found");
    });
  
    it("should return a 500 status if there is an error", async () => {
      const mockError = new Error("Database error");
      Industry_Info.getAllIndustryInfo.mockRejectedValue(mockError);
  
      await industry_info_controller.getAllIndustryInfo(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("Error retrieving Industries");
    });
});

describe("getIndustryInfo", () => {
    let req, res;
  
    beforeEach(() => {
      req = { params: { id: "1" } }; // Mock request with industry_id parameter
      res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
  
      jest.clearAllMocks(); // Clear all mocks before each test
    });
    
    it('should return modified HTML with 200 status when data and challenges are found', async () => {
        const mockIndustryInfo = {
          industry_id: 1,
          industry_name: 'Tech Industry',
          introduction: 'Introduction to Tech Industry',
        };
        const mockChallenges = [
          {
            challenge_id: 2,
            industry_id: 1,
            challenge_name: 'Labor Shortages',
            challenge_description: 'Addressing the issue of insufficient labor in agriculture.',
            challenge_content: 'Challenges include attracting young people to farming, mechanization, and improving labor conditions.',
          },
          {
            challenge_id: 3,
            industry_id: 1,
            challenge_name: 'Market Access',
            challenge_description: 'Ensuring farmers have access to markets to sell their produce.',
            challenge_content: 'Challenges include transportation infrastructure, market information systems, and negotiating fair prices.',
          },
          {
            challenge_id: 22,
            industry_id: 1,
            challenge_name: 'Farm Land',
            challenge_description: 'Some Countries do not have much land to farm on.',
            challenge_content: 'Lack of space is always a problem for small countries. This is more pronounced in agriculture due to its relation to a nations sustainability.',
          },
        ];
    
        // Mock the return values of the database methods
        Industry_Info.getIndustryInfo.mockResolvedValue(mockIndustryInfo);
        Industry_Challenges.getIndustryChallenges.mockResolvedValue(mockChallenges);
    
        // Mock the fs.readFile function
        fs.readFile.mockImplementation((path, encoding, callback) => {
          callback(null, `
            <html>
              <body>
                <div id="main_intro"></div>
                <a id="QuizButtonA"></a>
                <div id="IndustryName"></div>
                <div id="IndustryIntro"></div>
                <div id="ChallengeIntro"></div>
                <div id="ChallengeContainer"></div>
                <div id="PageTitle"></div>
              </body>
            </html>
          `);
        });
    
        // Mock JSDOM
        const mockJSDOM = {
          window: {
            document: {
              getElementById: jest.fn((id) => {
                const element = {
                  style: { backgroundImage: '' },
                  href: '',
                  textContent: '',
                  appendChild: jest.fn(),
                  createElement: jest.fn(() => ({
                    appendChild: jest.fn(),
                    textContent: '',
                    id: '',
                    classList: { add: jest.fn() },
                  })),
                };
    
                // Mock specific elements based on IDs
                switch (id) {
                  case 'ChallengeIntro':
                    return {
                      ...element,
                      appendChild: jest.fn().mockImplementation((child) => {
                        if (child.id === 'ChallengeIntroContainer') {
                          const challengeContainers = [
                            `<div id="ChallengeIntroContainer" class="show"><div id="ChallengeIntroNo">1</div><div id="ChallengeNameDesContainer"><div id="ChallengeIntroTitle">Labor Shortages</div><div id="ChallengeIntroDescription">Addressing the issue of insufficient labor in agriculture.</div></div></div>`,
                            `<div id="ChallengeIntroContainer" class="show"><div id="ChallengeIntroNo">2</div><div id="ChallengeNameDesContainer"><div id="ChallengeIntroTitle">Market Access</div><div id="ChallengeIntroDescription">Ensuring farmers have access to markets to sell their produce.</div></div></div>`,
                            `<div id="ChallengeIntroContainer" class="show"><div id="ChallengeIntroNo">3</div><div id="ChallengeNameDesContainer"><div id="ChallengeIntroTitle">Farm Land</div><div id="ChallengeIntroDescription">Some Countries do not have much land to farm on.</div></div></div>`,
                          ];
                          child.innerHTML = challengeContainers.join('');
                        }
                      }),
                    };
                  case 'ChallengeContainer':
                    return {
                      ...element,
                      appendChild: jest.fn().mockImplementation((child) => {
                        if (child.id === 'ChallengeContentContainer') {
                          const challengeContents = [
                            `<div id="ChallengeContentContainer" class="show"><h1>Labor Shortages</h1><h2>Overcoming Labor Shortages</h2><p>Challenges include attracting young people to farming, mechanization, and improving labor conditions.</p></div>`,
                            `<div id="ChallengeContentContainer" class="show"><h1>Market Access</h1><h2>Overcoming Market Access</h2><p>Challenges include transportation infrastructure, market information systems, and negotiating fair prices.</p></div>`,
                            `<div id="ChallengeContentContainer" class="show"><h1>Farm Land</h1><h2>Overcoming Farm Land</h2><p>Lack of space is always a problem for small countries. This is more pronounced in agriculture due to its relation to a nations sustainability.</p></div>`,
                          ];
                          child.innerHTML = challengeContents.join('');
                        }
                      }),
                    };
                  default:
                    return element;
                }
              }),
            },
          },
          serialize: jest.fn(() => 'modified HTML content'),
        };
        JSDOM.mockImplementation(() => mockJSDOM);
    
        // Spy on res.send to capture the modified HTML content
        const sendSpy = jest.spyOn(res, 'send');
    
        await industry_info_controller.getIndustryInfo(req, res);
    
        expect(Industry_Info.getIndustryInfo).toHaveBeenCalledWith(1);
        expect(Industry_Challenges.getIndustryChallenges).toHaveBeenCalledWith(1);
        expect(fs.readFile).toHaveBeenCalledWith(
          path.join(__dirname, '../public', 'html', 'industry.html'),
          'utf8',
          expect.any(Function)
        );
    
        // Log the content sent in the response
        const sentContent = sendSpy.mock.calls[0][0];
        console.log('Sent HTML content:', sentContent);
    
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith('modified HTML content');
      });
    
  
    it("should return a 404 status if no industry or challenges data is found", async () => {
        //Works for when the industry id gives no return values

        const mockChallenges = [
            {
              challenge_id: 2,
              industry_id: 1,
              challenge_name: "Labor Shortages",
              challenge_description: "Addressing the issue of insufficient labor in agriculture.",
              challenge_content: "Challenges include attracting young people to farming, mechanization, and improving labor conditions."
            },       
        ];
        Industry_Info.getIndustryInfo.mockResolvedValue(null);
        Industry_Challenges.getIndustryChallenges.mockResolvedValue(mockChallenges);
            
        await industry_info_controller.getIndustryInfo(req, res);
    
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith("Industry not found");
    });
    
    it("should return a 500 status if there is an error reading the file", async () => {
      const mockError = new Error("File read error");
      Industry_Info.getIndustryInfo.mockResolvedValue({ industry_id: 1 });
      Industry_Challenges.getIndustryChallenges.mockResolvedValue([]);
  
      fs.readFile.mockImplementation((path, encoding, callback) => {
        callback(mockError);
      });
  
      await industry_info_controller.getIndustryInfo(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("Internal Server Error");
    });
  
    it("should return a 500 status if there is an error fetching data", async () => {
      const mockError = new Error("Database error");
      Industry_Info.getIndustryInfo.mockRejectedValue(mockError);
  
      await industry_info_controller.getIndustryInfo(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("Error retrieving Industry_Info");
    });
});

describe("updateChallenge", () => {
    let req, res;
  
    beforeEach(() => {
      req = {
        body: {
          challenge_id: 1,
          challenge_name: "Updated Challenge Name",
          challenge_description: "Updated Challenge Description",
          challenge_content: "Updated Challenge Content",
        },
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        send: jest.fn(),
      };
  
      jest.clearAllMocks(); // Clear all mocks before each test
    });
  
    it("should update challenge and return 200 status for admin", async () => {
      const mockRole = "admin";
      const mockUpdatedChallenge = {
        challenge_id: 1,
        challenge_name: "Updated Challenge Name",
        challenge_description: "Updated Challenge Description",
        challenge_content: "Updated Challenge Content",
      };
  
      validateRole.validateUserRole.mockResolvedValue(mockRole);
      Industry_Challenges.updateChallenge.mockResolvedValue(mockUpdatedChallenge);
  
      await industry_info_controller.updateChallenge(req, res);
  
      expect(validateRole.validateUserRole).toHaveBeenCalledWith(req);
      expect(Industry_Challenges.updateChallenge).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUpdatedChallenge);
    });
  
    it("should return 401 status if the role is user", async () => {
      const mockRole = "user";
  
      validateRole.validateUserRole.mockResolvedValue(mockRole);
  
      await industry_info_controller.updateChallenge(req, res);
  
      expect(validateRole.validateUserRole).toHaveBeenCalledWith(req);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "Access error",
        details: "You are not an Admin. Lack of access.",
      });
    });
  
    it("should return 401 status if the role is unknown", async () => {
      const mockRole = "unknown";
  
      validateRole.validateUserRole.mockResolvedValue(mockRole);
  
      await industry_info_controller.updateChallenge(req, res);
  
      expect(validateRole.validateUserRole).toHaveBeenCalledWith(req);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "Access error",
        details: mockRole,
      });
    });
  
    it("should return 404 status if challenge not found", async () => {
      const mockRole = "admin";
  
      validateRole.validateUserRole.mockResolvedValue(mockRole);
      Industry_Challenges.updateChallenge.mockResolvedValue(null);
  
      await industry_info_controller.updateChallenge(req, res);
  
      expect(validateRole.validateUserRole).toHaveBeenCalledWith(req);
      expect(Industry_Challenges.updateChallenge).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith("Challenge not found");
    });
  
    it("should return 500 status if there is an error", async () => {
      const mockRole = "admin";
      const mockError = new Error("Database error");
  
      validateRole.validateUserRole.mockResolvedValue(mockRole);
      Industry_Challenges.updateChallenge.mockRejectedValue(mockError);
  
      await industry_info_controller.updateChallenge(req, res);
  
      expect(validateRole.validateUserRole).toHaveBeenCalledWith(req);
      expect(Industry_Challenges.updateChallenge).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("Error creating Challenge");
    });
});

describe("updateIndustryInfo", () => {
    let req, res;
  
    beforeEach(() => {
      req = {
        body: {
          id: 1,
          introduction: "Updated Industry Introduction",
        },
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        send: jest.fn(),
      };
  
      jest.clearAllMocks(); // Clear all mocks before each test
    });
  
    it("should update industry info and return 200 status for admin", async () => {
      const mockRole = "admin";
      const mockUpdatedIndustryInfo = {
        id: 1,
        introduction: "Updated Industry Introduction",
      };
  
      validateRole.validateUserRole.mockResolvedValue(mockRole);
      Industry_Info.updateIndustryInfo.mockResolvedValue(mockUpdatedIndustryInfo);
  
      await industry_info_controller.updateIndustryInfo(req, res);
  
      expect(validateRole.validateUserRole).toHaveBeenCalledWith(req);
      expect(Industry_Info.updateIndustryInfo).toHaveBeenCalledWith(req.body.id, req.body.introduction);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUpdatedIndustryInfo);
    });
  
    it("should return 401 status if the role is user", async () => {
      const mockRole = "user";
  
      validateRole.validateUserRole.mockResolvedValue(mockRole);
  
      await industry_info_controller.updateIndustryInfo(req, res);
  
      expect(validateRole.validateUserRole).toHaveBeenCalledWith(req);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "Access error",
        details: "You are not an Admin. Lack of access.",
      });
    });
  
    it("should return 401 status if the role is unknown", async () => {
      const mockRole = "unknown";
  
      validateRole.validateUserRole.mockResolvedValue(mockRole);
  
      await industry_info_controller.updateIndustryInfo(req, res);
  
      expect(validateRole.validateUserRole).toHaveBeenCalledWith(req);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "Access error",
        details: mockRole,
      });
    });
  
    it("should return 404 status if industry info not found", async () => {
      const mockRole = "admin";
  
      validateRole.validateUserRole.mockResolvedValue(mockRole);
      Industry_Info.updateIndustryInfo.mockResolvedValue(null);
  
      await industry_info_controller.updateIndustryInfo(req, res);
  
      expect(validateRole.validateUserRole).toHaveBeenCalledWith(req);
      expect(Industry_Info.updateIndustryInfo).toHaveBeenCalledWith(req.body.id, req.body.introduction);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith("Industry not found");
    });
  
    it("should return 500 status if there is an error", async () => {
      const mockRole = "admin";
      const mockError = new Error("Database error");
  
      validateRole.validateUserRole.mockResolvedValue(mockRole);
      Industry_Info.updateIndustryInfo.mockRejectedValue(mockError);
  
      await industry_info_controller.updateIndustryInfo(req, res);
  
      expect(validateRole.validateUserRole).toHaveBeenCalledWith(req);
      expect(Industry_Info.updateIndustryInfo).toHaveBeenCalledWith(req.body.id, req.body.introduction);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("Error Updating Industry");
    });
});
 

describe("deleteIndustryChallenge", () => {
    let req, res;
  
    beforeEach(() => {
      req = {
        params: {
          id: "1",
        },
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        send: jest.fn(),
      };
  
      jest.clearAllMocks(); // Clear all mocks before each test
    });
  
    it("should delete industry challenge and return 200 status for admin", async () => {
      const mockRole = "admin";
      const mockDeletedChallenge = {
        id: 1,
        name: "Deleted Challenge",
      };
  
      validateRole.validateUserRole.mockResolvedValue(mockRole);
      Industry_Challenges.deleteIndustryChallenge.mockResolvedValue(mockDeletedChallenge);
  
      await industry_info_controller.deleteIndustryChallenge(req, res);
  
      expect(validateRole.validateUserRole).toHaveBeenCalledWith(req);
      expect(Industry_Challenges.deleteIndustryChallenge).toHaveBeenCalledWith(parseInt(req.params.id));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockDeletedChallenge);
    });
  
    it("should return 401 status if the role is user", async () => {
      const mockRole = "user";
  
      validateRole.validateUserRole.mockResolvedValue(mockRole);
  
      await industry_info_controller.deleteIndustryChallenge(req, res);
  
      expect(validateRole.validateUserRole).toHaveBeenCalledWith(req);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "Access error",
        details: "You are not an Admin. Lack of access.",
      });
    });
  
    it("should return 401 status if the role is unknown", async () => {
      const mockRole = "unknown";
  
      validateRole.validateUserRole.mockResolvedValue(mockRole);
  
      await industry_info_controller.deleteIndustryChallenge(req, res);
  
      expect(validateRole.validateUserRole).toHaveBeenCalledWith(req);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "Access error",
        details: mockRole,
      });
    });
  
    it("should return 404 status if challenge not found", async () => {
      const mockRole = "admin";
  
      validateRole.validateUserRole.mockResolvedValue(mockRole);
      Industry_Challenges.deleteIndustryChallenge.mockResolvedValue(null);
  
      await industry_info_controller.deleteIndustryChallenge(req, res);
  
      expect(validateRole.validateUserRole).toHaveBeenCalledWith(req);
      expect(Industry_Challenges.deleteIndustryChallenge).toHaveBeenCalledWith(parseInt(req.params.id));
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith("Challenge not found");
    });
  
    it("should return 500 status if there is an error", async () => {
      const mockRole = "admin";
      const mockError = new Error("Database error");
  
      validateRole.validateUserRole.mockResolvedValue(mockRole);
      Industry_Challenges.deleteIndustryChallenge.mockRejectedValue(mockError);
  
      await industry_info_controller.deleteIndustryChallenge(req, res);
  
      expect(validateRole.validateUserRole).toHaveBeenCalledWith(req);
      expect(Industry_Challenges.deleteIndustryChallenge).toHaveBeenCalledWith(parseInt(req.params.id));
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("Error deleting Challenge");
    });
});
  