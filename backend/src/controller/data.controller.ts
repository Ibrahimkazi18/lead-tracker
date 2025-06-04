import { NextFunction, Request, Response } from "express";
import prisma from "../utils/prisma";
import { ValidationError } from "../packages";
import { HowHeard, Requirement } from "@prisma/client";

// Fetch all the agents in the database
export const getAllAgents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const agents = await prisma.agent.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    res.status(200).json({ agents });
  } catch (error) {
    return next(error);
  }
};

export const getAllAgentsForReferral = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { agentId } = req.query;

    if (!agentId || typeof agentId !== "string") {
      res.status(400).json({ message: "agentId is required" });
      return;
    }

    // Get current agent's referralIds
    const currentAgent = await prisma.agent.findUnique({
      where: { id: agentId },
      select: { referralIds: true },
    });

    if (!currentAgent) {
      res.status(404).json({ message: "Agent not found" });
      return;
    }

    // Fetch all agents excluding those in referralIds and the current agent himself
    const agents = await prisma.agent.findMany({
      where: {
        id: {
          notIn: [agentId, ...(currentAgent.referralIds || [])],
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    res.status(200).json({ agents });
  } catch (error) {
    return next(error);
  }
};

// Update Agent Info (e.g., name, image, referralIds)
export const updateAgent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { agentId, referralIds } = req.body;

    const agent = await prisma.agent.findUnique({ where: { id: agentId } });

    if (!agent) {
      return next(new ValidationError("Agent not found!"));
    }

    const updatedAgent = await prisma.agent.update({
      where: { id: agentId },
      data: {
        referralIds: {
          set: Array.from(new Set([...(agent.referralIds || []), referralIds || []])),
        },
      },
    });

    res.status(200).json({
      message: "Agent updated successfully",
      data: updatedAgent,
    });
  } catch (error) {
    return next(error);
  }
};


// Fetch a single agent and their referred agents
export const getReferralAgents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id : agentId } = req.params;

    const agent = await prisma.agent.findUnique({
      where: { id: agentId },
    });

    if (!agent) {
      return next(new ValidationError("Agent not found!"));
    }

    // Fetch full referral agents
    const referrals = await prisma.agent.findMany({
      where: {
        id: {
          in: agent.referralIds,
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    res.status(200).json({
        referrals
    });
  } catch (error) {
    return next(error);
  }
};


// delete referral agents
export const deleteReferralAgent = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { id: referralId } = req.params;
        const { agentId } = req.query;

        const agent = await prisma.agent.findUnique({ where: { id: agentId } });
        
        if (!agent) {
            return next(new ValidationError("Agent not found!"));
        }

        const updatedReferralIds = (agent.referralIds || []).filter((id: string) => id !== referralId);

        await prisma.agent.update({
            where: { id: agentId },
            data: {
                referralIds: {
                set: updatedReferralIds,
                },
            },
        });

        res.status(200).json({
            message : "Dicount code deleted succesfully!",
        })
        
    } catch (error) {
        next(error);
    }
}


// Creating a lead
export const createLead = async (req: any, res: Response, next: NextFunction) => {
    try {
        const {
            agentId,
            name,
            residenceAdd,
            contactNo,
            email,
            requirement,
            budget,
            howHeard,
            projectDetail,
            location,
            referredBy
        } = req.body;

        if(!agentId || !contactNo || !name || !residenceAdd ||  !email || !requirement || !budget || !howHeard || !location) {
            throw next(new ValidationError("Some Fields are Missing."));
        }

        let require;

        if(requirement === "R_1RK") require = Requirement.R_1RK;
        if(requirement === "R_1BHK") require = Requirement.R_1BHK;
        if(requirement === "R_2BHK") require = Requirement.R_2BHK;
        if(requirement === "R_3BHK") require = Requirement.R_3BHK;
        if(requirement === "R_4BHK") require = Requirement.R_4BHK;
        if(requirement === "SHOP") require = Requirement.SHOP;


        let how;

        if(howHeard === "HORDING") how = HowHeard.HORDING;
        if(howHeard === "FRIENDS") how = HowHeard.FRIENDS;
        if(howHeard === "STANDEY") how = HowHeard.STANDEY;
        if(howHeard === "OTHER_SOURCES") how = HowHeard.OTHER_SOURCES;

        const lead = await prisma.lead.create({
            data: {
                name,
                residenceAdd,
                contactNo,
                email,
                requirement: require!,
                howHeard: how!,
                budget,
                agentId,
                projectDetail,
                location,
                referredBy : {
                    connect : {id : referredBy}
                }
            },
        });

        res.status(201).json({ lead });

    } catch (error) {
        next(error);
    }
}

// Adding a visit to the lead
export const addVisit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { leadId, description, images = [] } = req.body;

    const visit = await prisma.visit.create({
      data: {
        leadId,
        description,
        images,
      },
    });

    res.status(201).json({ visit });
  } catch (error) {
    next(error);
  }
}; 


// Updating Status of leads
export const updateLeadStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { leadId, status } = req.body; // status = CONVERTED | REJECTED

    const lead = await prisma.lead.update({
      where: { id: leadId },
      data: { 
        status,
        convertedAt: status === "CONVERTED" ? new Date() : undefined,
        rejectedAt: status === "REJECTED" ? new Date() : undefined,
    },
    });

    res.status(200).json({ lead });
  } catch (error) {
    next(error);
  }
};


// fetch agent's leads
export const getAgentLeads = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { agentId } = req.params; 

    const leads = await prisma.lead.findMany({
      where: { agentId: agentId, status: "PENDING" },
      include : {visits : true},
      orderBy : { createdAt : "asc"},
    });

    // Map the Prisma leads to match the frontend LeadType
    const formattedLeads = leads.map((lead) => {
      return {
        id: lead.id,
        name: lead.name,
        email: lead.email,
        contactNo: lead.contactNo,
        budget: lead.budget,
        location: lead.location || "",
        projectDetail: lead.projectDetail || "",
        residenceAdd: lead.residenceAdd,
        howHeard: lead.howHeard,
        requirement: lead.requirement,
        referredById: lead.referredById || "", 
        agentId: lead.agentId,
        status: lead.status,
        createdAt: lead.createdAt.toISOString(),
        convertedAt: lead.convertedAt?.toISOString(),
        rejectedAt: lead.rejectedAt?.toISOString(),
        visits: lead.visits.map((visit) => ({
            id: visit.id,
            leadId: visit.leadId,
            images: visit.images,
            descitption: visit.description || "",
            createdAt: visit.createdAt.toISOString(),
        })),
      };
    });

    res.status(200).json({ formattedLeads });
  } catch (error) {
    next(error);
  }
};



// Fetching stats for dahsboard

// leads per week
export const getLeadsByWeek = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { agentId } = req.params;
    if (!agentId) res.status(401).json({ message: "Unauthorized" });

    const leads = await prisma.lead.findMany({
        where: { agentId },
        select: { createdAt: true },
    });

    const grouped: { week: string; total: number }[] = [];

    leads.forEach(({ createdAt }) => {
        const weekStart = new Date(createdAt);
        weekStart.setHours(0, 0, 0, 0);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());

        const iso = weekStart.toISOString();
        const existing = grouped.find((g) => g.week === iso);
        if (existing) {
        existing.total += 1;
        } else {
        grouped.push({ week: iso, total: 1 });
        }
    });

    res.status(201).json(grouped);

  } catch (error) {
    next(error);
  }
};


// Leads converted in a month
export const getConvertedLeadsByMonth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { agentId } = req.params;
    if (!agentId) res.status(401).json({ message: "Unauthorized" });

    const leads = await prisma.lead.findMany({
        where: { status: 'CONVERTED', agentId, convertedAt: { not: null } },
        select: { convertedAt: true },
    });

    const grouped: Record<string, number> = {};

    leads.forEach(({ convertedAt }) => {
    if (!convertedAt) return;
        const month = `${convertedAt.getFullYear()}-${(convertedAt.getMonth() + 1).toString().padStart(2, '0')}`;
        grouped[month] = (grouped[month] || 0) + 1;
    });

    res.json(Object.entries(grouped).map(([month, total]) => ({ month, total })));

  } catch (error) {
    next(error);
  }
};


// Top 5 agents
export const getTopAgents = async (req: Request, res: Response) => {
  const leads = await prisma.lead.findMany({
    where: { status: 'CONVERTED' },
    select: { agentId: true },
  });

  const filteredLeads = leads.filter(lead => lead.agentId !== null);

  const countMap: Record<string, number> = {};

  filteredLeads.forEach(({ agentId }) => {
    if (!agentId) return;
    countMap[agentId] = (countMap[agentId] || 0) + 1;
  });

  const sortedAgents = Object.entries(countMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const agentIds = sortedAgents.map(([id]) => id);

  const agents = await prisma.agent.findMany({
    where: { id: { in: agentIds } },
    select: { id: true, name: true },
  });

  const result = sortedAgents.map(([id, total]) => {
    const agent = agents.find((a) => a.id === id);
    return { id, name: agent?.name || "Unknown", total };
  });

  res.json(result);
};


// leads expiring in 7 days
export const getExpiringLeads = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { agentId } = req.params;
        if (!agentId) res.status(401).json({ message: "Unauthorized" });

        const now = new Date();
        const ninetyDaysAgo = new Date(now.getTime() - 83 * 24 * 60 * 60 * 1000); // Leads created ~83 days ago

        const leads = await prisma.lead.findMany({
            where: {
            agentId,
            createdAt: { lte: ninetyDaysAgo },
            status: 'PENDING',
            },
            select: { id: true, name: true, createdAt: true },
        });

        res.json(leads);
    } catch (error) {
        next(error);
    }
};


// status pie chart
export const getStatusDistribution = async (req: Request, res: Response, next: NextFunction) => {
    try {
        
        const { agentId } = req.params;
        if (!agentId) res.status(401).json({ message: "Unauthorized" });
    
        const leads = await prisma.lead.findMany({
            where : { agentId },
            select: { status: true },
        });
        
        const counts: Record<string, number> = {};
        
        leads.forEach(({ status }) => {
            counts[status] = (counts[status] || 0) + 1;
        });
        
        res.json(Object.entries(counts).map(([status, total]) => ({ status, total })));

    } catch (error) {
        next(error);
    }
};
