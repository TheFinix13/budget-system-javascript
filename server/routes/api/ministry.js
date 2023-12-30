const express = require("express");
const router = express.Router();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");

router.get("/show_ministries", async (req, res) => {
  try {
    const details = await prisma.ministry.findMany({
      include: {
        User: {
          select: {
            firstname: true,
            lastname: true,
            email: true,
            id: true,
          },
        },
        Departments: {
          include: {
            Units: true,
          },
        },
      },
    });

    if (!details) {
      return res
        .status(400)
        .send({ status: false, msg: "No ministry found", code: "E101-1" });
    }

    // Add a departmentCount and unitCount field to each ministry
    const ministryData = details.map((ministry) => {
      const departmentCount = ministry.Departments.length;
      const unitCount = ministry.Departments.reduce(
        (acc, department) => acc + department.Units.length,
        0
      );

      return {
        ...ministry,
        departmentCount,
        unitCount,
      };
    });

    return res.status(200).send({ status: true, data: ministryData });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: false, msg: err, code: "E501-1" });
  }
});

router.get("/show_all_ministries", async (req, res) => {
  try {
    const details = await prisma.ministry.findMany();

    if (!details) {
      return res
        .status(400)
        .send({ status: false, msg: "No ministry found", code: "E101-1" });
    }

    return res.status(200).send({ status: true, data: details });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: false, msg: err, code: "E501-1" });
  }
});

// http://localhost:5000/api/ministry/add_ministry

//endpoint to create ministry and user
router.post("/add_ministry", async (req, res) => {
  try {
    const {
      name,
      description,
      location,
      sector,
      email,
      password,
      firstname,
      lastname,
    } = req.body;
    if (
      !name ||
      !description ||
      !location ||
      !sector ||
      !email ||
      !password ||
      !firstname ||
      !lastname
    ) {
      return res
        .status(400)
        .send({ status: false, msg: "Please fill all fields" });
    }

    //checking if a user with email already exist
    let found = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (found) {
      return res
        .status(400)
        .send({ msg: "User with email already exist", status: false });
    }

    let found1 = await prisma.ministry.findFirst({
      where: {
        name,
      },
    });

    if (found1) {
      return res
        .status(400)
        .send({ msg: "Ministry with name exist", status: false });
    }

    // create the ministry
    const newMinistry = await prisma.ministry.create({
      data: {
        name: name,
        description: description,
        location: location,
        sector: sector,
      },
    });

    //Create salt and hash
    const salt = await bcrypt.genSalt(10);
    let pass = await bcrypt.hash(password, salt);

    //creating a new user
    const user = await prisma.user.create({
      data: {
        firstname,
        lastname,
        email,
        password: pass,
        type: "ministry",
        Ministry: {
          connect: {
            id: newMinistry.id,
          },
        },
      },
    });

    res
      .status(200)
      .send({ status: true, data: { ministry: newMinistry, user } });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: false, msg: "Server error" });
  }
});

//endpoint to update ministry
router.patch("/update_ministry/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, location, sector } = req.body;

    // check if the ministry with the specified id exists
    const ministry = await prisma.ministry.findFirst({
      where: {
        id: parseInt(id),
      },
    });
    if (!ministry) {
      return res
        .status(404)
        .send({ status: false, message: "Ministry not found" });
    }

    // update the ministry
    const updatedMinistry = await prisma.ministry.update({
      where: {
        id: parseInt(id),
      },
      data: {
        name: name,
        description: description,
        location: location,
        sector: sector,
      },
    });
    res.status(200).send({ status: true, data: updatedMinistry });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: false, message: "Server error" });
  }
});

router.get("/show_department_count", async (req, res) => {
  const { termId } = req.params;
  try {
    let details = await prisma.ministry.findMany({
      include: {
        Departments: true,
      },
    });

    const CountByMinistry = details.reduce((obj, ministry) => {
      obj[ministry.name] = ministry.Departments.length;
      return obj;
    }, {});

    if (!details) {
      return res
        .status(400)
        .send({ status: false, msg: "No department found" });
    }

    return res.status(200).send({
      status: true,
      data: CountByMinistry,
      msg: "Ministries found",
    });
  } catch (error) {
    console.log(error);
    res.statusMessage(500).send({ status: false, msg: error });
  }
});

router.get("/ministry-department-count", async (req, res) => {
  try {
    // get the total number of ministries
    const ministryCount = await prisma.ministry.count();

    // get the total number of departments
    const departmentCount = await prisma.department.count();

    res.status(200).send({
      status: true,
      data: { ministryCount, departmentCount },
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ message: "An error occurred while retrieving the counts" });
  }
});

module.exports = router;
