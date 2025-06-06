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
      await prisma.leadHistory.create({
        data: {
          originalLeadId: lead.id,
          name: lead.name,
          residenceAdd: lead.residenceAdd,
          contactNo: lead.contactNo,
          email: lead.email,
          requirement: lead.requirement,
          budget: lead.budget,
          howHeard: lead.howHeard,
          referredBy: lead.agentId ?? null,
          projectDetail: lead.projectDetail,
          location: lead.location,
          createdAt: lead.createdAt,
        },
      });

      await prisma.visit.deleteMany({ where: { leadId: lead.id } });
      await prisma.lead.delete({ where: { id: lead.id } });
    }
  }
};
