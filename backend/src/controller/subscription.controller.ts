import { NextFunction, Request, Response } from "express";
import prisma from "../utils/prisma";
import { ValidationError } from "../packages";
import { subMonths, format } from "date-fns";


export const createPlan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, price, duration } = req.body;

    if (!name || !price || !duration) {
      throw new ValidationError("Name, price and duration are required.");
    }

    const priceNum = Number(price);
    const durationNum = Number(duration);

    if (isNaN(priceNum) || isNaN(durationNum)) {
      throw new ValidationError("Price and duration must be valid numbers.");
    }

    const plan = await prisma.subscriptionPlan.create({
      data: { 
        name, 
        description, 
        price : priceNum, 
        duration : durationNum 
      },
    });

    res.status(201).json({plan});
  } catch (error) {
    next(error);
  }
};

export const getAllPlans = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const plans = await prisma.subscriptionPlan.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json({plans});
  } catch (error) {
    next(error);
  }
};

export const updatePlan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, description, price, duration } = req.body;

    const plan = await prisma.subscriptionPlan.update({
      where: { id },
      data: { name, description, price, duration },
    });

    res.status(200).json(plan);
  } catch (error) {
    next(error);
  }
};

export const deletePlan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const active = await prisma.agentSubscription.findFirst({
      where: {
        planId: id,
        isActive: true,
      },
    });

    if (active) {
      throw new ValidationError("Cannot delete plan. Active agents are using this plan.");
    }

    await prisma.subscriptionPlan.delete({ where: { id } });

    res.status(200).json({ message: "Plan deleted successfully." });
  } catch (error) {
    next(error);
  }
};

export const setDefaultPlan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { planId } = req.params;

    const plan = await prisma.subscriptionPlan.findUnique({ where: { id: planId } });

    if (!plan) {
      throw new ValidationError("Subscription plan not found.");
    }

    // Start a transaction: unset current default and set the new one
    await prisma.$transaction([
      prisma.subscriptionPlan.updateMany({
        where: { isDefault: true },
        data: { isDefault: false }
      }),
      prisma.subscriptionPlan.update({
        where: { id: planId },
        data: { isDefault: true }
      })
    ]);

    res.status(200).json({
      message: "Default subscription plan updated successfully."
    });
  } catch (error) {
    next(error);
  }
};

// for agent to request a subscription 
export const requestSubscription = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { agentId } = req.params;
    const { planId, paymentRef } = req.body;

    if (!planId || !paymentRef) {
      throw new ValidationError("Plan ID and payment reference are required.");
    }
    if (!agentId) {
      throw new ValidationError("AgentID is required.");
    }

    const existing = await prisma.agentSubscription.findFirst({
      where: { agentId, isActive: true },
    });

    if (existing) {
      throw new ValidationError("You already have an active subscription.");
    }

    const request = await prisma.agentSubscription.create({
      data: {
        planId,
        agentId,
        paymentRef,
        status: "pending",
        isActive: false,
      },
    });

    res.status(201).json({ message: "Subscription request submitted.", request });
  } catch (error) {
    next(error);
  }
};

// for admin to see pending requests for confirmation 
export const getPendingRequests = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const requests = await prisma.agentSubscription.findMany({
      where: { status: "pending" },
      include: {
        agent: true,
        plan: true,
      },
    });

    res.status(200).json({requests});
  } catch (error) {
    next(error);
  }
};

export const confirmSubscription = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const request = await prisma.agentSubscription.findUnique({ where: { id }, include: { plan: true } });

    if (!request || request.status !== "pending") {
      throw new ValidationError("Invalid subscription request.");
    }

    const expiresAt = new Date(Date.now() + request.plan.duration * 86400000);

    const updated = await prisma.agentSubscription.update({
      where: { id },
      data: {
        status: "confirmed",
        isActive: true,
        confirmedAt: new Date(),
        expiresAt,
      },
    });

    res.status(200).json({ message: "Subscription confirmed.", updated });
  } catch (error) {
    next(error);
  }
};

export const rejectSubscription = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const rejected = await prisma.agentSubscription.update({
      where: { id },
      data: {
        status: "rejected",
        isActive: false,
      },
    });

    res.status(200).json({ message: "Subscription request rejected.", rejected });
  } catch (error) {
    next(error);
  }
};

export const getActiveAgentPlan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { agentId } = req.params;

    const active = await prisma.agentSubscription.findFirst({
      where: {
        agentId,
        isActive: true,
        expiresAt: { gte: new Date() },
      },
    });
    
    if (!active) {
      res.status(200).json({ message: "No active subscription found." });
      return;
    }

    res.status(200).json({active});
  } catch (error) {
    next(error);
  }
};

export const getPlan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { planId } = req.params;

    const plan = await prisma.subscriptionPlan.findFirst({
      where: {
        id: planId
      },
    });
    
    if (!plan) {
      res.status(200).json({ message: "No plan subscription found." });
      return;
    }

    res.status(200).json({plan});
  } catch (error) {
    next(error);
  }
};

export const getAdminRevenueStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const confirmedSubs = await prisma.agentSubscription.findMany({
      where: { status: "confirmed" },
      include: { plan: true },
    });

    const totalRevenue = confirmedSubs.reduce((acc, sub) => acc + sub.plan.price, 0);

    // Map for the last 12 months with 0 values
    const monthlyRevenueMap: Record<string, number> = {};
    const today = new Date();

    for (let i =11; i >= 0; i--) {
      const month = format(subMonths(today, i), "yyyy-MM");
      monthlyRevenueMap[month] = 0;
    }

    // Adding revenue to the appropriate month
    confirmedSubs.forEach((sub) => {
      const confirmedDate = new Date(sub.confirmedAt!);
      const month = format(confirmedDate, "yyyy-MM");

      if (month in monthlyRevenueMap) {
        monthlyRevenueMap[month] += sub.plan.price;
      }
    });

    // Converting to array format
    const monthlyRevenueArray = Object.entries(monthlyRevenueMap).map(
      ([month, revenue]) => ({
        month,
        revenue,
      })
    );

    res.status(200).json({
      totalRevenue,
      monthlyRevenue: monthlyRevenueArray,
    });
  } catch (error) {
    next(error);
  }
};
