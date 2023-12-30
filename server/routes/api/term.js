const express = require("express");
const router = express.Router();

const { PrismaClient } = require("@prisma/client");
const { auth } = require("../../middleware/auth");
const prisma = new PrismaClient();

//endpoint to create a Term
router.post("/add_term", async (req, res) => {
  try {
    const { name, year } = req.body;

    if (!name || !year) {
      return res
        .status(400)
        .send({ status: false, msg: "Please fill all fields" });
    }

    //creating a new term
    const newTerm = await prisma.term.create({
      data: {
        name: name,
        year: Number(year),
      },
    });
    return res.status(200).send({ status: true, data: newTerm });
  } catch (err) {
    console.log(err);
  }
});

router.put("/update_term/:id", async (req, res) => {
  const { id } = req.params;

  // Update the status of the specified record to active
  const updatedRecord = await prisma.term.update({
    where: { id: Number(id) },
    data: { status: "active" },
  });

  // Update the status of all other records to inactive
  await prisma.term.updateMany({
    where: { id: { not: Number(id) } },
    data: { status: "inactive" },
  });

  return res.status(200).send({
    status: true,
    msg: "Term updated successfully",
    data: updatedRecord,
  });
});

//endpoint to show terms
router.get("/show_term", async (req, res) => {
  try {
    const term = await prisma.term.findMany();

    if (!term) {
      return res
        .status(400)
        .send({ status: false, msg: "No term found", code: "E101-1" });
    }
    return res.status(200).send({ status: true, data: term });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: false, msg: "Server Error" });
  }
});

//endpoint to show terms
router.get("/show_active_term/:id", auth, async (req, res) => {
  let id = req.params.id;
  try {
    const term = await prisma.term.findFirst({
      where: {
        status: "active",
      },
    });

    const ministry = await prisma.ministry.findFirst({
      where: {
        User: {
          id: Number(id),
        },
      },
    });
    let budget_request = {};
    if (ministry && term) {
      budget_request = await prisma.budgetRequest.findFirst({
        where: {
          ministryId: Number(ministry.id),
          termId: term.id,
        },
      });
    }

    if (!term) {
      return res
        .status(400)
        .send({ status: false, msg: "No term found", code: "E101-1" });
    }
    return res
      .status(200)
      .send({ status: true, data: { ...term, budget_request } });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: false, msg: "Server Error" });
  }
});

//endpoint to show a term

module.exports = router;
