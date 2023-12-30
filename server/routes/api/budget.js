const express = require("express");
const router = express.Router();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.get("/show_budgets/:department_id", async (req, res) => {
  const { department_id } = req.params;
  try {
    const budgets = await prisma.budget.findMany({
      where: {
        departmentId: parseInt(department_id),
      },
    });
    if (!budgets) {
      return res
        .status(400)
        .send({ status: false, msg: "No budget found", code: "E101-1" });
    }

    return res
      .status(200)
      .send({ status: true, data: budgets, msg: "Budgets found" });
  } catch (error) {
    console.log(error);
  }
});

router.get("/show_all_budgets", async (req, res) => {
  try {
    const details = await prisma.budget.findMany({
      include: {
        Department: {
          select: {
            Ministry: true,
            name: true,
          },
        },
      },
    });

    if (!details) {
      return res
        .status(400)
        .send({ status: false, msg: "No budgets found", code: "E101-1" });
    }

    return res.status(200).send({ status: true, data: details });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: false, msg: err });
  }
});

router.get("/show_all_budgets/:ministry_id", async (req, res) => {
  const { ministry_id } = req.params;
  try {
    const details = await prisma.budget.findMany({
      where: {
        Unit: {
          Department: {
            ministryId: parseInt(ministry_id),
          },
        },
      },
      include: {
        Department: {
          select: {
            Ministry: true,
            name: true,
          },
        },
      },
    });

    if (!details) {
      return res
        .status(400)
        .send({ status: false, msg: "No budgets found", code: "E101-1" });
    }

    return res.status(200).send({ status: true, data: details });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: false, msg: err });
  }
});

router.get("/show_budget_by_id/:unitId/:termId", async (req, res) => {
  const { unitId, termId } = req.params;
  try {
    const details = await prisma.budget.findFirst({
      where: {
        unitId: Number(unitId),
        termId: Number(termId),
      },
      // include: {
      //   Department: {
      //     select: {
      //       Ministry: true,
      //       name: true,
      //     },
      //   },
      // },
    });

    if (!details) {
      return res
        .status(400)
        .send({ status: false, msg: "No budgets found", code: "E101-1" });
    }

    return res.status(200).send({ status: true, data: details });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: false, msg: err });
  }
});
router.post("/add_budget", async (req, res) => {
  const { amount, termId, unitId, departmentId, data } = req.body;

  const found = await prisma.budget.findFirst({
    where: {
      termId: Number(termId),
      unitId: Number(unitId),
    },
  });
  if (found) {
    return res
      .status(400)
      .send({ status: false, msg: "Budget for this unit already exist." });
  }

  try {
    if (!amount || !termId || !unitId || !departmentId || !data) {
      return res
        .status(400)
        .send({ status: false, msg: "Please fill all fields" });
    }
    const newBudget = await prisma.budget.create({
      data: {
        amount: parseFloat(amount),
        termId: Number(termId),
        unitId: Number(unitId),
        departmentId: Number(departmentId),
        data,
      },
    });
    res
      .status(200)
      .send({ status: true, data: newBudget, msg: "Budget created" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: false, msg: "Server Error" });
  }
});

router.put("/update_budget/:id", async (req, res) => {
  const id = req.params.id;
  const { amount, data } = req.body;
  try {
    const update_budget = await prisma.budget.update({
      where: {
        id: Number(id),
      },
      data: {
        data,
        amount: parseFloat(amount),
      },
    });
    res
      .status(200)
      .send({ status: true, data: update_budget, msg: "Budget updated" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: false, msg: "Server Error" });
  }
});

router.get("/unit-budgets/:termId/:departmentId", async (req, res) => {
  const { termId, departmentId } = req.params;
  try {
    const budgets = await prisma.budget.findMany({
      where: {
        termId: Number(termId),
        departmentId: Number(departmentId),
      },
      include: {
        Unit: true,
      },
    });
    res.status(200).send({ status: true, data: budgets });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: false, msg: "Server error" });
  }
});

module.exports = router;
