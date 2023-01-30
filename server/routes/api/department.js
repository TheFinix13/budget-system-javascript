const express = require("express");
const router = express.Router();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.get("/show_all_departments/:ministry_id", async (req, res) => {
  const { ministry_id } = req.params;
  let where = {};
  if (ministry_id && ministry_id != 0) where.ministryId = parseInt(ministry_id);
  try {
    const departments = await prisma.department.findMany({
      where,
      include: {
        Ministry: true,
      },
    });
    if (!departments) {
      return res
        .status(400)
        .send({ status: false, msg: "No department found", code: "E101-1" });
    }

    return res
      .status(200)
      .send({ status: true, data: departments, msg: "Department found" });
  } catch (error) {
    console.log(error);
  }
});

router.get("/show_departments/:ministry_id", async (req, res) => {
  const { ministry_id } = req.params;
  try {
    const departments = await prisma.department.findMany({
      where: {
        ministryId: parseInt(ministry_id),
      },
    });
    if (!departments) {
      return res
        .status(400)
        .send({ status: false, msg: "No department found", code: "E101-1" });
    }

    return res
      .status(200)
      .send({ status: true, data: departments, msg: "Department found" });
  } catch (error) {
    console.log(error);
  }
});

router.post("/add_department/:ministryId", async (req, res) => {
  const { ministryId } = req.params;
  try {
    const { name, description } = req.body;
    if (!name || !description || !ministryId) {
      return res.status(400).send({
        status: false,
        msg: "All fields are required",
        code: "E101-2",
      });
    }

    const newDepartment = await prisma.department.create({
      data: { name, description, ministryId: Number(ministryId) },
    });
    res
      .status(200)
      .send({ status: true, data: newDepartment, msg: "Department created" });
  } catch (error) {
    console.log(error);
  }
});

router.get("/show_all_departments", async (req, res) => {
  try {
    const details = await prisma.department.findMany({
      include: {
        Ministry: true,
      },
      orderBy: [
        {
          name: "desc",
        },
        {
          Ministry: {
            name: "desc",
          },
        },
      ],
    });
    if (!details) {
      return res
        .status(400)
        .send({ status: false, msg: "No department found" });
    }

    return res
      .status(200)
      .send({ status: true, data: details, msg: "Department found" });
  } catch (error) {
    console.log(error);
    res.statusMessage(500).send({ status: false, msg: error });
  }
});

router.get("/show_all_budgets/:ministryId/:termId", async (req, res) => {
  const { ministryId, termId } = req.params;
  try {
    let term = termId;
    if (!term) {
      let x = await prisma.term.findFirst({
        where: {
          status: "active",
        },
      });
      term = x.id;
    }
    let details = await prisma.budget.findMany({
      where: {
        Department: {
          ministryId: Number(ministryId),
        },
        termId: Number(term),
      },
      include: {
        Department: true,
        Unit: true,
      },
    });

    const departments = await prisma.department.findMany({
      where: {
        ministryId: Number(ministryId),
      },
      select: {
        name: true,
        Units: true,
      },
    });

    const unitsCountByDepartment = departments.reduce((obj, department) => {
      obj[department.name] = department.Units.length;
      return obj;
    }, {});

    const totalUnits = departments.reduce(
      (sum, department) => sum + department.Units.length,
      0
    );

    let totalAccountedUnits = details.length;

    let totalDepartments = departments.length;
    // details.reduce((sum, department) => sum + department.Units.length, 0);

    if (!details) {
      return res
        .status(400)
        .send({ status: false, msg: "No department found" });
    }

    details = details.reduce((groups, item) => {
      if (!groups[item.Department.name]) {
        groups[item.Department.name] = [];
      }
      groups[item.Department.name].push(item);
      return groups;
    }, {});

    return res.status(200).send({
      status: true,
      data: details,
      totalUnits,
      unitsCountByDepartment,
      totalAccountedUnits,
      totalDepartments,
      msg: "Department found",
    });
  } catch (error) {
    console.log(error);
    res.statusMessage(500).send({ status: false, msg: error });
  }
});

router.patch("/update/:id", async (req, res) => {
  try {
    // get the department ID from the request parameters
    const departmentId = req.params.id;

    // get the updated department data from the request body
    const { name, description } = req.body;

    // update the department in the database
    const updatedDepartmentData = await prisma.department.update({
      where: { id: Number(departmentId) },
      data: { name, description },
    });

    // return the updated department data to the client

    return res.status(200).send({
      status: true,
      data: updatedDepartmentData,
      msg: "Department updated successfullt.",
    });
  } catch (error) {
    console.log(error);
    res.statusMessage(500).send({ status: false, msg: error });
  }
});
module.exports = router;
