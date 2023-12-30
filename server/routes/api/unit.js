const express = require("express");
const router = express.Router();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.get("/show_units/:department_id", async (req, res) => {
  const { department_id } = req.params;
  try {
    const units = await prisma.unit.findMany({
      where: {
        departmentId: parseInt(department_id),
      },
    });
    if (!units) {
      return res
        .status(400)
        .send({ status: false, msg: "No unit found", code: "E101-1" });
    }

    return res
      .status(200)
      .send({ status: true, data: units, msg: "Units found" });
  } catch (error) {
    console.log(error);
  }
});

router.get("/show_all_units", async (req, res) => {
  try {
    const details = await prisma.unit.findMany({
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
        .send({ status: false, msg: "No units found", code: "E101-1" });
    }

    return res.status(200).send({ status: true, data: details });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: false, msg: err });
  }
});

router.get("/show_all_units/:ministry_id", async (req, res) => {
  const { ministry_id } = req.params;
  try {
    const details = await prisma.unit.findMany({
      where: {
        Department: {
          ministryId: parseInt(ministry_id),
        },
      },
      include: {
        Department: {
          select: {
            Ministry: true,
            name: true,
            id: true,
          },
        },
      },
    });

    if (!details) {
      return res
        .status(400)
        .send({ status: false, msg: "No units found", code: "E101-1" });
    }

    return res.status(200).send({ status: true, data: details });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: false, msg: err });
  }
});
router.post("/add_unit/:departmentId", async (req, res) => {
  const { departmentId } = req.params;
  try {
    const { name, description, number } = req.body;
    if (!name || !description || !number) {
      return res
        .status(400)
        .send({ status: false, msg: "Please fill all fields" });
    }
    const newUnit = await prisma.unit.create({
      data: { name, description, departmentId: Number(departmentId), number },
    });
    res.status(200).send({ status: true, data: newUnit, msg: "Unit created" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: false, msg: "Server Error" });
  }
});

router.put("/update_unit/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const updateUnit = await prisma.unit.update({
      where: {
        id: Number(id),
      },
      data: req.body,
    });
    res.status(200).send({
      status: true,
      data: updateUnit,
      msg: "Unit updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: false, msg: "Server Error" });
  }
});

module.exports = router;
