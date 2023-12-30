const express = require("express");
const router = express.Router();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  try {
    const budgetRequests = await prisma.budgetRequest.findMany({
      include: {
        Term: true,
        Ministry: true,
      },
    });
    res.status(200).send({ status: true, data: budgetRequests });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: false, msg: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const budgetRequest = await prisma.budgetRequest.findOne({
      where: {
        id: Number(id),
      },
      include: {
        Term: true,
        Ministry: true,
      },
    });
    if (!budgetRequest) {
      return res
        .status(404)
        .send({ status: false, msg: "Budget request not found" });
    }
    res.status(200).send({ status: true, data: budgetRequest });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: false, msg: "Server error" });
  }
});

router.post("/add_budgetrequest", async (req, res) => {
  try {
    const { termId, ministryId } = req.body;
    // Check if there is already an active budget request for the given term ID and ministry ID
    const activeBudgetRequest = await prisma.budgetRequest.findFirst({
      where: {
        termId: Number(termId),
        ministryId: Number(ministryId),
      },
    });
    // Calculate total amount using aggregate method
    const totalAmount = await prisma.budget.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        termId: Number(termId),
        Department: {
          ministryId: Number(ministryId),
        },
      },
    });

    // If active budget request exists, update it
    if (activeBudgetRequest) {
      const updatedBudgetRequest = await prisma.budgetRequest.update({
        where: {
          id: activeBudgetRequest.id,
        },
        data: {
          total_amount: totalAmount._sum.amount,
        },
      });
      return res.status(200).send({
        status: true,
        data: updatedBudgetRequest,
        msg: "Budget request updated",
      });
    }
    // If active budget request does not exist, create a new one
    else {
      const budgetRequest = await prisma.budgetRequest.create({
        data: {
          total_amount: totalAmount._sum.amount,
          Term: {
            connect: {
              id: Number(termId),
            },
          },
          Ministry: {
            connect: {
              id: Number(ministryId),
            },
          },
        },
        include: {
          Term: true,
          Ministry: true,
        },
      });
      return res.status(200).send({
        status: true,
        data: budgetRequest,
        msg: "Budget request created",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: false, msg: "Server error" });
  }
});

router.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const updatedBudgetRequest = await prisma.budgetRequest.update({
      where: {
        id: Number(id),
      },
      data: req.body,
      include: {
        Term: true,
        Ministry: true,
      },
    });
    if (!updatedBudgetRequest) {
      return res
        .status(404)
        .send({ status: false, msg: "Budget request not found" });
    }
    res.status(200).send({
      status: true,
      data: updatedBudgetRequest,
      msg: "Budget request updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: false, msg: "Server error" });
  }
});

router.get("/show_all/:term_id", async (req, res) => {
  const id = req.params.term_id;
  try {
    // fetch all budget requests
    const budgetRequests = await prisma.budgetRequest.findMany({
      where: {
        termId: Number(id),
      },
      include: {
        Ministry: true,
      },
    });

    res.status(200).send({
      status: true,
      data: budgetRequests,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ message: "An error occurred while fetching budget requests" });
  }
});

module.exports = router;
