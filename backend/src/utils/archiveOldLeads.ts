import { addDays } from "date-fns"; 
import prisma from "./prisma";

export const archiveOldLeads = async () => {
  const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);

  const expiredLeads = await prisma.lead.findMany({
    where: {
      createdAt: { lt: ninetyDaysAgo },
      status: "PENDING", 
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
};
