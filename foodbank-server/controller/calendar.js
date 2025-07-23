const prisma = require("../config/prisma");

exports.createCalendar = async (req, res) => {
  try {
    const { suplyer, polink, discription, userId, date } = req.body;

    if (!suplyer || !userId || !date) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const newCalendarEntry = await prisma.calendar.create({
      data: {
        suplyer: suplyer,
        polink: polink,
        discription: discription,
        staffId: parseInt(userId), // Make sure this is an integer
        date: new Date(date), // Convert to JS Date object
      },
    });

    return res.status(201).json(newCalendarEntry);
  } catch (err) {
    console.error("Create calendar error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

exports.getCalendar = async (req, res) => {
  const userId = req.params.id;
  try {
    const calendar = await prisma.calendar.findMany({
      where: {
        staffId: Number(userId),
      },
    });

    // Convert to FullCalendar format
    const formattedCalendar = calendar.map((event) => ({
      id: String(event.id),
      title: event.suplyer,
      start: event.date,
      allDay: true,
      extendedProps: {
        description: event.discription,
        poLink: event.polink,
        isSuccess: event.isSuccess,
        isPaySuccess: event.isPaySuccess,
      },
    }));

    res.send(formattedCalendar);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `server error.` });
  }
};

exports.updateCalendar = async (req, res) => {
  try {
    const calendarId = req.params.id;
    const { suplyer, polink, discription, date } = req.body;

    const updatedCalendar = await prisma.calendar.update({
      where: {
        id: Number(calendarId),
      },
      data: {
        suplyer,
        polink,
        discription,
        date: new Date(date),
      },
    });

    return res.status(200).json(updatedCalendar);
  } catch (err) {
    console.error(err);

    // Prisma throws a specific error if record is not found
    if (err.code === "P2025") {
      return res.status(404).json({ message: "Event not found" });
    }

    return res.status(500).json({ message: "Server error" });
  }
};

exports.deleteCalendar = async (req, res) => {
  try {
    const calendarId = req.params.id;
    if (!calendarId) {
      return res.send(`calendar ID in requier!!`);
    }
    await prisma.calendar.delete({
      where: {
        id: Number(calendarId),
      },
    });
    res.send(`Delete Success!`);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `server error` });
  }
};

exports.getCalendarAdmin = async (req, res) => {
  try {
    const getAllCalendar = await prisma.calendar.findMany();
    // Convert to FullCalendar format
    const formattedCalendar = getAllCalendar.map((event) => ({
      id: String(event.id),
      title: event.suplyer,
      start: event.date,
      allDay: true,
      extendedProps: {
        description: event.discription,
        poLink: event.polink,
        isSuccess: event.isSuccess,
        isPaySuccess: event.isPaySuccess,
      },
    }));

    res.send(formattedCalendar);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `server error` });
  }
};

exports.updateSuccessPo = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const update = await prisma.calendar.update({
      where: {
        id: Number(id),
      },
      data: {
        isSuccess: Boolean(status),
      },
    });

    res.send(update);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `server error` });
  }
};

exports.updatePaySuccess = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const update = await prisma.calendar.update({
      where: {
        id: Number(id),
      },
      data: {
        isPaySuccess: Boolean(status),
      },
    });

    res.send(update);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `server error` });
  }
};

exports.detailupdate = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, polink } = req.body;

    console.log(req.body);

    console.log(description, polink);
    if ((!description, !polink)) {
      return res.status(404).json({ message: `Data Not Found` });
    }

    const update = await prisma.calendar.update({
      where: {
        id: Number(id),
      },
      data: {
        discription: description,
        polink: polink,
      },
    });
    res.send(update);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `Server error` });
  }
};
