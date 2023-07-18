const { prisma } = require("../../../../prisma/prisma");
// import { sendTicketCreate } from "../../../../lib/nodemailer/ticket/create";

export default async function handler(req, res) {
  const { name, detail, title, priority, email, issue, client } = req.body;

  try {
    await prisma.ticket
      .create({
        data: {
          name,
          title,
          detail,
          priority: priority ? priority : "low",
          issue,
          email,
          clientId: Number(client),
          assignedTo: undefined,
          isComplete: Boolean(false),
        },
      })
      .then((ticket) => {
        console.log(ticket);

      });

  

    res
      .status(200)
      .json({ message: "Ticket created correctly", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
}
