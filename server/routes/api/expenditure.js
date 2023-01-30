const express = require("express");
const router = express.Router();
const { validateModel } = require("prismavalidator");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.get("/show_expenditures", async (req, res) => {
  try {
    const expenditures = await prisma.expenditure.findMany({
      include: {
        Term: true,
        Unit: true,
        BudgetRequest: true,
      },
    });

    if (!expenditures) {
      return res
        .status(400)
        .send({ status: false, msg: "No expenditures found" });
    }

    return res.status(200).send({ status: true, data: expenditures });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: false, msg: "Server error" });
  }
});

router.get("/show_expenditures/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const expenditure = await prisma.expenditure.findOne({
      where: {
        id: Number(id),
      },
      include: {
        Term: true,
        Unit: true,
        BudgetRequest: true,
      },
    });
    if (!expenditure) {
      return res
        .status(404)
        .send({ status: false, msg: "Expenditure not found" });
    }
    res.status(200).send({ status: true, data: expenditure });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: false, msg: "Server error" });
  }
});

router.post("/add_expenditure", async (req, res) => {
  console.log(req.body);
  let x = validateModel(prisma, "Expenditure", req.body, ["id", "createdAt"]);
  if (!x.isValid) {
    return res.status(400).send({ status: false, msg: x.error });
  }
  try {
    const {
      amount,
      date,
      description,
      termId,
      unitId,
      departmentId,
      budgetRequestId,
    } = req.body;

    // Retrieve budget request
    const budget = await prisma.budget.findFirst({
      where: {
        unitId: Number(unitId),
        termId: Number(termId),
      },
    });
    console.log(budget);
    // Calculate total amount of expenditures for budget request
    const expenditureTotal = await prisma.expenditure.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        termId: Number(termId),
        unitId: Number(unitId),
      },
    });
    console.log(expenditureTotal);
    // Check if total amount of expenditures plus new expenditure is greater than budget request total amount
    if (
      parseFloat(budget.amount) <
      parseFloat(expenditureTotal._sum.amount) + parseFloat(amount)
    ) {
      return res.status(400).send({
        status: false,
        msg: "Total expenditure exceeds budget request total amount",
      });
    }
    // Create expenditure
    const expenditure = await prisma.expenditure.create({
      data: {
        amount: parseFloat(amount),
        date: new Date(date),
        description,
        termId: Number(termId),
        unitId: Number(unitId),
        departmentId: Number(departmentId),
        budgetRequestId: budgetRequestId,
      },
      include: {
        Term: true,
        Unit: true,
        BudgetRequest: true,
      },
    });
    res
      .status(200)
      .send({ status: true, data: expenditure, msg: "Expenditure created" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: false, msg: "Server error" });
  }
});

router.put("/update_expenditure/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const updatedExpenditure = await prisma.expenditure.update({
      where: {
        id: Number(id),
      },
      data: req.body,
      include: {
        Term: true,
        Unit: true,
        BudgetRequest: true,
      },
    });
    if (!updatedExpenditure) {
      return res
        .status(404)
        .send({ status: false, msg: "Expenditure not found" });
    }
    res.status(200).send({
      status: true,
      data: updatedExpenditure,
      msg: "Expenditure updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: false, msg: "Server error" });
  }
});

router.get("/show_all_expenditures/:ministryId/:termId", async (req, res) => {
  const { ministryId, termId } = req.params;
  try {
    const expenditureData = await prisma.expenditure.findMany({
      where: {
        Department: { ministryId: Number(ministryId) },
        termId: Number(termId),
      },
      include: {
        Department: true,
        Unit: true,
      },
    });

    const expenditureByDepartment = expenditureData.reduce(
      (acc, expenditure) => {
        const departmentName = expenditure.Department.name;
        if (!acc[departmentName]) {
          acc[departmentName] = {
            units: {},
            total: 0,
          };
        }

        const unitName = expenditure.Unit.name;
        if (!acc[departmentName]["units"][unitName]) {
          acc[departmentName]["units"][unitName] = expenditure.amount;
        } else {
          acc[departmentName]["units"][unitName] += expenditure.amount;
        }

        acc[departmentName]["total"] += expenditure.amount;

        return acc;
      },
      {}
    );

    const responseData = Object.keys(expenditureByDepartment).map(
      (departmentName) => {
        return {
          department_id: expenditureData.find(
            (expenditure) => expenditure.Department.name === departmentName
          ).Department.id,
          department_name: departmentName,
          total: expenditureByDepartment[departmentName]["total"],
          units: Object.entries(
            expenditureByDepartment[departmentName]["units"]
          ).map(([unitName, amount]) => ({
            [unitName]: amount,
          })),
        };
      }
    );
    res.status(200).send({ status: true, data: responseData });
  } catch (error) {
    console.log(error);
    res.statusMessage(500).send({ status: false, msg: error });
  }
});

router.get("/unit/:termId/:unitId", async (req, res) => {
  const { unitId, termId } = req.params;
  try {
    const expenditures = await prisma.expenditure.findMany({
      where: {
        unitId: Number(unitId),
        termId: Number(termId),
      },
      include: {
        Unit: true,
        BudgetRequest: true,
      },
    });
    res.status(200).send({ status: true, data: expenditures });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: false, msg: "Server error" });
  }
});

router.get("/department/:termId/:departmentId", async (req, res) => {
  try {
    const { departmentId, termId } = req.params;
    const expenditureData = await prisma.expenditure.findMany({
      where: {
        departmentId: Number(departmentId),
        termId: Number(termId),
      },
      include: {
        Department: true,
        Unit: true,
      },
      orderBy: {
        unitId: "asc",
      },
    });

    res.status(200).send({ status: true, data: expenditureData });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: false, msg: "Server error" });
  }
});

router.get("/budget-vs-expenditure/:termId/:ministryId", async (req, res) => {
  try {
    const { termId, ministryId } = req.params;

    let where = {
      termId: parseInt(termId),
    };
    if (ministryId === null) {
      where.ministryId = parseInt(ministryId);
    }
    // get budget request data for the specific ministry and term
    const budgetRequestData = await prisma.budgetRequest.findMany({
      where,
    });

    let where1 = {
      termId: parseInt(termId),
    };
    if (ministryId === null) {
      where.Department = {
        ministryId: parseInt(ministryId),
      };
    }

    // get expenditure data for the specific ministry and term
    const expenditureData = await prisma.expenditure.findMany({
      where: { ...where1 },
    });

    // calculate total budget request and expenditure amounts
    const totalBudgetRequest = budgetRequestData.reduce(
      (acc, budgetRequest) => acc + budgetRequest.total_amount,
      0
    );
    const totalExpenditure = expenditureData.reduce(
      (acc, expenditure) => acc + expenditure.amount,
      0
    );

    // return data in the desired format
    return res.status(200).send({
      status: true,
      data: {
        budget_request: totalBudgetRequest,
        expenditure: totalExpenditure,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: false, msg: "Server error" });
  }
});

router.get(
  "/budget-vs-expenditure/:termId/:ministryId/:departmentId",
  async (req, res) => {
    try {
      const { termId, ministryId, departmentId } = req.params;

      // get budget data for the specific department and term
      const budgetData = await prisma.budget.findMany({
        where: {
          termId: parseInt(termId),
          departmentId: parseInt(departmentId),
        },
      });

      // get expenditure data for the specific department and term
      const expenditureData = await prisma.expenditure.findMany({
        where: {
          termId: parseInt(termId),
          departmentId: parseInt(departmentId),
        },
      });

      // calculate total budget and expenditure amounts
      const totalBudget = budgetData.reduce(
        (acc, budget) => acc + budget.amount,
        0
      );
      console.log(budgetData);
      const totalExpenditure = expenditureData.reduce(
        (acc, expenditure) => acc + expenditure.amount,
        0
      );
      // return data in the desired format
      return res.status(200).send({
        status: true,
        data: {
          budget: totalBudget,
          expenditure: totalExpenditure,
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({ status: false, msg: "Server error" });
    }
  }
);

router.get("/unit/budget-vs-expenditure/:termId/:unitId", async (req, res) => {
  try {
    const { termId, unitId } = req.params;

    // get budget data for the specific department and term
    const budgetData = await prisma.budget.findMany({
      where: {
        termId: parseInt(termId),
        unitId: parseInt(unitId),
      },
    });

    // get expenditure data for the specific department and term
    const expenditureData = await prisma.expenditure.findMany({
      where: {
        termId: parseInt(termId),
        unitId: parseInt(unitId),
      },
    });

    // calculate total budget and expenditure amounts
    const totalBudget = budgetData.reduce(
      (acc, budget) => acc + budget.amount,
      0
    );
    const totalExpenditure = expenditureData.reduce(
      (acc, expenditure) => acc + expenditure.amount,
      0
    );
    // return data in the desired format
    return res.status(200).send({
      status: true,
      data: {
        budget: totalBudget,
        expenditure: totalExpenditure,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: false, msg: "Server error" });
  }
});

router.get("/department-expenses/:termId/:ministryId", async (req, res) => {
  try {
    const { termId, ministryId } = req.params;

    // get expenditure data for the specific ministry and term
    const expenditureData = await prisma.expenditure.findMany({
      where: {
        termId: parseInt(termId),
        Department: {
          ministryId: parseInt(ministryId),
        },
      },
      include: {
        Department: true,
      },
    });

    // group expenditure data by department
    let exd = {};
    expenditureData.map((expenditure) => {
      let departmentName = expenditure.Department.name;
      if (!exd[departmentName]) {
        exd[departmentName] = 0;
      }
      exd[departmentName] += expenditure.amount;
    });

    // return data in the desired format for the doughnut chart

    return res.status(200).send({
      status: true,
      data: exd,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: false, msg: "Server error" });
  }
});

router.get("/ministry-expenses/:termId", async (req, res) => {
  try {
    const { termId } = req.params;

    // get expenditure data for the specific ministry and term
    const expenditureData = await prisma.expenditure.findMany({
      where: { termId: parseInt(termId) },
      include: {
        Department: {
          select: { Ministry: true },
        },
      },
    });

    // group expenditure data by department
    const expenditureByMinistry = expenditureData.reduce((acc, expenditure) => {
      const ministryName = expenditure.Department.Ministry.name;
      if (!acc[ministryName]) {
        acc[ministryName] = 0;
      }
      acc[ministryName] += expenditure.amount;
      return acc;
    }, {});

    // return data in the desired format for the doughnut chart

    return res.status(200).send({
      status: true,
      data: expenditureByMinistry,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: false, msg: "Server error" });
  }
});

router.get("/expenditure-by-unit/:termId/:departmentId", async (req, res) => {
  try {
    const { termId, departmentId } = req.params;

    // get expenditure data for the specific department and term
    const expenditureData = await prisma.expenditure.findMany({
      where: {
        termId: parseInt(termId),
        Department: {
          id: parseInt(departmentId),
        },
      },
      include: {
        Unit: true,
      },
    });

    // group expenditure data by unit and calculate total expenditure amount for each unit
    const expenditureByUnit = expenditureData.reduce((acc, expenditure) => {
      const unitName = expenditure.Unit.name;
      const unitNumber = expenditure.Unit.number;
      if (!acc[unitName]) {
        acc[unitName] = {
          unitNumber,
          totalAmount: expenditure.amount,
        };
      } else {
        acc[unitName].totalAmount += expenditure.amount;
      }
      return acc;
    }, {});

    // return data in the desired format
    return res.status(200).send({
      status: true,
      data: expenditureByUnit,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: false, msg: "Server error" });
  }
});

router.get("/by-time/:ministryId/:timeFrame", async (req, res) => {
  const { timeFrame, ministryId } = req.params;

  // determine the start and end dates based on the specified time frame
  let startDate, endDate;
  if (timeFrame === "daily") {
    endDate = new Date();
    startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
  } else if (timeFrame === "weekly") {
    endDate = new Date();
    startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
  } else if (timeFrame === "monthly") {
    endDate = new Date();
    startDate = new Date(endDate.getFullYear(), 0, 1);
  } else {
    return res.status(400).json({ message: "Invalid time frame specified" });
  }

  try {
    let where = {
      date: { gte: startDate, lte: endDate },
    };
    if (ministryId === null) {
      where.Department = {
        ministryId: parseInt(ministryId),
      };
    }
    // get expenditure data for the specified time frame and ministry
    let expenditureData = await prisma.expenditure.findMany({
      where,
    });

    if (timeFrame === "daily") {
      // group data by day
      expenditureData = expenditureData.reduce((acc, expenditure) => {
        const day = expenditure.date.toLocaleDateString();
        if (!acc[day]) {
          acc[day] = expenditure.amount;
        } else {
          acc[day] += expenditure.amount;
        }
        return acc;
      }, {});

      // fill in missing dates with blank values
      for (
        let d = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
        d <= endDate;
        d.setDate(d.getDate() + 1)
      ) {
        const day = d.toLocaleDateString();
        if (!expenditureData[day]) {
          expenditureData[day] = 1;
        }
      }
    } else if (timeFrame === "weekly") {
      // group data by week
      expenditureData = expenditureData.reduce((acc, expenditure) => {
        const week = Math.floor(expenditure.date.getDate() / 7) + 1;
        if (!acc[week]) {
          acc[week] = expenditure.amount;
        } else {
          acc[week] += expenditure.amount;
        }
        return acc;
      }, {});

      // fill in missing weeks with blank values
      for (
        let d = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
        d <= endDate;
        d.setDate(d.getDate() + 7)
      ) {
        const week = Math.floor(d.getDate() / 7) + 1;
        if (!expenditureData[week]) {
          expenditureData[week] = 0;
        }
      }
    } else if (timeFrame === "monthly") {
      // group data by month
      expenditureData = expenditureData.reduce((acc, expenditure) => {
        const month = expenditure.date.getMonth();
        if (!acc[month]) {
          acc[month] = expenditure.amount;
        } else {
          acc[month] += expenditure.amount;
        }
        return acc;
      }, {});
    }

    // fill in missing months with blank values
    for (
      let d = new Date(endDate.getFullYear(), 0, 1);
      d <= endDate;
      d.setMonth(d.getMonth() + 1)
    ) {
      const month = d.getMonth();
      if (!expenditureData[month]) {
        expenditureData[month] = 0;
      }
    }

    res.status(200).send({ status: true, data: expenditureData });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: false, msg: "Server error" });
  }
});

module.exports = router;
