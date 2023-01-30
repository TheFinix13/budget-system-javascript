const express = require("express");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const router = express.Router();

router.get("/expenditure-report", async (req, res) => {
  try {
    const { termId, departmentId, unitId, ministryId } = req.query;
    // define filter criteria for querying expenditure data
    const where = {};
    if (ministryId && ministryId != 0)
      where.Department = { ministryId: parseInt(ministryId) };
    if (termId && termId != 0) where.termId = parseInt(termId);
    if (departmentId && departmentId != 0)
      where.Department = { id: parseInt(departmentId) };
    if (unitId && unitId != 0) where.Unit = { id: parseInt(unitId) };

    // fetch expenditure data based on the filter criteria
    const expenditureData = await prisma.expenditure.findMany({
      where,
      include: {
        Department: true,
        Unit: true,
      },
    });

    // group expenditure data by department and unit
    const expenditureByDepartment = expenditureData.reduce(
      (acc, expenditure) => {
        const departmentName = expenditure.Department.name;
        if (!acc[departmentName]) {
          acc[departmentName] = {
            units: {},
            total: 0, // initialize department total to 0
          };
        }

        const unitName = expenditure.Unit.name;
        if (!acc[departmentName]["units"][unitName]) {
          acc[departmentName]["units"][unitName] = expenditure.amount;
        } else {
          acc[departmentName]["units"][unitName] += expenditure.amount;
        }

        // update department total
        acc[departmentName]["total"] += expenditure.amount;

        return acc;
      },
      {}
    );

    res.status(200).send({
      status: true,
      data: {
        operationData: expenditureData,
        operationByDepartment: expenditureByDepartment,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: false,
      msg: "An error occurred while generating the report",
    });
  }
});

router.get("/budget-report", async (req, res) => {
  try {
    const { termId, departmentId, unitId, ministryId } = req.query;
    // define filter criteria for querying expenditure data
    const where = {};
    if (ministryId && ministryId != 0)
      where.Department = { ministryId: parseInt(ministryId) };
    if (termId && termId != 0) where.termId = parseInt(termId);
    if (departmentId && departmentId != 0)
      where.Department = { id: parseInt(departmentId) };
    if (unitId && unitId != 0) where.Unit = { id: parseInt(unitId) };

    // fetch expenditure data based on the filter criteria
    const budgetData = await prisma.budget.findMany({
      where,
      include: {
        Department: true,
        Unit: true,
      },
    });

    // group expenditure data by department and unit
    const budgetByDepartment = budgetData.reduce((acc, budget) => {
      const departmentName = budget.Department.name;
      if (!acc[departmentName]) {
        acc[departmentName] = {
          units: {},
          total: 0, // initialize department total to 0
        };
      }

      const unitName = budget.Unit.name;
      if (!acc[departmentName]["units"][unitName]) {
        acc[departmentName]["units"][unitName] = budget.amount;
      } else {
        acc[departmentName]["units"][unitName] += budget.amount;
      }

      // update department total
      acc[departmentName]["total"] += budget.amount;

      return acc;
    }, {});

    res.status(200).send({
      status: true,
      data: {
        operationData: budgetData,
        operationByDepartment: budgetByDepartment,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: false,
      msg: "An error occurred while generating the report",
    });
  }
});
module.exports = router;
