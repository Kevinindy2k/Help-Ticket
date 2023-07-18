const { prisma } = require("../../../../prisma/prisma");
// import { sendTicketCreate } from "../../../../lib/nodemailer/ticket/create";

export default async function createTicket(req, res) {
  const { name, company, detail, title, priority, email, issue, engineer } =
    req.body;

  try {
    const ticket = await prisma.ticket
      .create({
        data: {
          name,
          title,
          detail,
          priority: priority ? priority : "low",
          issue,
          email,
          client:
            company !== undefined
              ? {
                  connect: { id: company.id },
                }
              : undefined,
          fromImap: false,
          assignedTo:
            engineer && engineer.name !== "Unassigned"
              ? {
                  connect: { id: engineer.id },
                }
              : undefined,
          isComplete: Boolean(false),
        },
      })
      .then((ticket) => {
        console.log(ticket);
        // sendTicketCreate(ticket);
      });

    res
      .status(200)
      .json({
        message: "Ticket created correctly",
        success: true,
        ticket: ticket,
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error, success: false });
  }
}
