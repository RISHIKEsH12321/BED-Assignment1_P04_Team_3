const sql = require("mssql");
const Industry_Info = require("../models/industry_info");

jest.mock("mssql", () => {
  return {
    connect: jest.fn(),
    close: jest.fn(),
  };
});
/*
*/
describe("Industry_Info.getAllIndustryInfo", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should retrieve all industry information from the database", async () => {
    const mockIndustryInfo = [
      {
        industry_id: 1,
        industry_name: 'Agriculture',
        introduction: 'Agriculture is the foundation of human civilization, essential for food security and economic growth. It involves the cultivation of crops and rearing of livestock, supporting global economies and related industries. Modern agriculture integrates advanced technologies to boost productivity, efficiency, and sustainability, addressing the challenges of a growing population and changing climate.',
      },
      {
        industry_id: 2,
        industry_name: 'Crop Production',
        introduction: 'Crop production involves the growing of plants for food, fiber, and other uses.',
      },
    ];

    const mockRequest = {
      query: jest.fn().mockResolvedValue({ recordset: mockIndustryInfo }),
    };
    const mockConnection = {
      request: jest.fn().mockReturnValue(mockRequest),
      close: jest.fn().mockResolvedValue(undefined),
    };

    sql.connect.mockResolvedValue(mockConnection); // Return the mock connection

    const industryInfo = await Industry_Info.getAllIndustryInfo();
    expect(sql.connect).toHaveBeenCalledWith(expect.any(Object));
    expect(mockConnection.close).toHaveBeenCalledTimes(1);
    expect(industryInfo).toHaveLength(2);
    expect(industryInfo[0]).toEqual(mockIndustryInfo[0]);
    expect(industryInfo[1]).toEqual(mockIndustryInfo[1]);
  });

  it("should handle errors when retrieving industry information", async () => {
    const errorMessage = "Database Error";
    sql.connect.mockRejectedValue(new Error(errorMessage));
    await expect(Industry_Info.getAllIndustryInfo()).rejects.toThrow(errorMessage);
  });
});


describe("Industry_Info.getIndustryInfo", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it("should retrieve specific industry information from the database by id", async () => {
      const mockIndustryInfo = {
        industry_id: 1,
        industry_name: 'Agriculture',
        introduction: 'Agriculture is the foundation of human civilization, essential for food security and economic growth. It involves the cultivation of crops and rearing of livestock, supporting global economies and related industries. Modern agriculture integrates advanced technologies to boost productivity, efficiency, and sustainability, addressing the challenges of a growing population and changing climate.',
      };
  
      const mockRequest = {
        input: jest.fn().mockReturnThis(),
        query: jest.fn().mockResolvedValue({ recordset: [mockIndustryInfo] }),
      };
      const mockConnection = {
        request: jest.fn().mockReturnValue(mockRequest),
        close: jest.fn().mockResolvedValue(undefined),
      };
  
      sql.connect.mockResolvedValue(mockConnection); // Return the mock connection
  
      const industryInfo = await Industry_Info.getIndustryInfo(1);
      expect(sql.connect).toHaveBeenCalledWith(expect.any(Object));
      expect(mockConnection.request).toHaveBeenCalled();
      expect(mockRequest.input).toHaveBeenCalledWith("id", 1);
      expect(mockRequest.query).toHaveBeenCalledWith("SELECT * FROM Industry_Info WHERE industry_id = @id;");
      expect(mockConnection.close).toHaveBeenCalledTimes(1);
      expect(industryInfo).toEqual(mockIndustryInfo);
    });
  
    it("should return undefined if the industry id is invalid", async () => {
      const mockRequest = {
        input: jest.fn().mockReturnThis(),
        query: jest.fn().mockResolvedValue({ recordset: [] }),
      };
      const mockConnection = {
        request: jest.fn().mockReturnValue(mockRequest),
        close: jest.fn().mockResolvedValue(undefined),
      };
  
      sql.connect.mockResolvedValue(mockConnection); // Return the mock connection
  
      const industryInfo = await Industry_Info.getIndustryInfo(999);
      expect(sql.connect).toHaveBeenCalledWith(expect.any(Object));
      expect(mockConnection.request).toHaveBeenCalled();
      expect(mockRequest.input).toHaveBeenCalledWith("id", 999);
      expect(mockRequest.query).toHaveBeenCalledWith("SELECT * FROM Industry_Info WHERE industry_id = @id;");
      expect(mockConnection.close).toHaveBeenCalledTimes(1);
      expect(industryInfo).toBeUndefined();
    });
  
    it("should handle errors when retrieving industry information by id", async () => {
      const errorMessage = "Database Error";
      sql.connect.mockRejectedValue(new Error(errorMessage));
      await expect(Industry_Info.getIndustryInfo(1)).rejects.toThrow(errorMessage);
    });
});

describe("Industry_Info.updateIndustryInfo", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it("should update industry information in the database by id", async () => {
      const id = 1;
      const newIntroduction = "New introduction for the industry.";
  
      const mockRequest = {
        input: jest.fn().mockReturnThis(),
        query: jest.fn().mockResolvedValue({ rowsAffected: [1] }),
      };
      const mockConnection = {
        request: jest.fn().mockReturnValue(mockRequest),
        close: jest.fn().mockResolvedValue(undefined),
      };
  
      sql.connect.mockResolvedValue(mockConnection); // Return the mock connection
  
      const rowsAffected = await Industry_Info.updateIndustryInfo(id, newIntroduction);
      expect(sql.connect).toHaveBeenCalledWith(expect.any(Object));
      expect(mockConnection.request).toHaveBeenCalled();
      expect(mockRequest.input).toHaveBeenCalledWith("introduction", newIntroduction);
      expect(mockRequest.input).toHaveBeenCalledWith("id", id);
  
      const expectedQuery = `UPDATE Industry_Info SET introduction = @introduction WHERE industry_id = @id;`;      
  
      expect(mockRequest.query).toHaveBeenCalledWith(expectedQuery);
      expect(mockConnection.close).toHaveBeenCalledTimes(1);
      expect(rowsAffected).toEqual([1]);
    });
  
    it("should return 0 if the industry id is invalid", async () => {
      const id = 999;
      const newIntroduction = "New introduction for the industry.";
  
      const mockRequest = {
        input: jest.fn().mockReturnThis(),
        query: jest.fn().mockResolvedValue({ rowsAffected: [0] }),
      };
      const mockConnection = {
        request: jest.fn().mockReturnValue(mockRequest),
        close: jest.fn().mockResolvedValue(undefined),
      };
  
      sql.connect.mockResolvedValue(mockConnection); // Return the mock connection
  
      const rowsAffected = await Industry_Info.updateIndustryInfo(id, newIntroduction);
      expect(sql.connect).toHaveBeenCalledWith(expect.any(Object));
      expect(mockConnection.request).toHaveBeenCalled();
      expect(mockRequest.input).toHaveBeenCalledWith("introduction", newIntroduction);
      expect(mockRequest.input).toHaveBeenCalledWith("id", id);
      
      const expectedQuery = `UPDATE Industry_Info SET introduction = @introduction WHERE industry_id = @id;`;
  
      expect(mockRequest.query).toHaveBeenCalledWith(expectedQuery);
      expect(mockConnection.close).toHaveBeenCalledTimes(1);
      expect(rowsAffected).toEqual([0]);
    });
  
    it("should handle errors when updating industry information", async () => {
      const errorMessage = "Database Error";
      sql.connect.mockRejectedValue(new Error(errorMessage));
      await expect(Industry_Info.updateIndustryInfo(1, "New introduction")).rejects.toThrow(errorMessage);
    });
});
