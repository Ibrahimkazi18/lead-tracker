import prisma from "./prisma";

export const archiveOldLeads = async () => {
  const agents = await prisma.agent.findMany({
    select: { id: true, leadExpiryDays: true },
  });

  for (const agent of agents) {
    const expiryDays = agent.leadExpiryDays || 90;
    const expiryDate = new Date(Date.now() - expiryDays * 24 * 60 * 60 * 1000);

    const expiredLeads = await prisma.lead.findMany({
      where: {
        createdAt: { lt: expiryDate },
        status: "PENDING",
        agentId: agent.id,
      },
    });

    for (const lead of expiredLeads) {
      await prisma.lead.update({
        where: { id: lead.agentId },
        data: {
          status: "REJECTED",
          rejectedAt: new Date(),
        },
      });
    }
  }
};
