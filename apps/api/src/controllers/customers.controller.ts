import type { Request, Response } from "express";
import { customerInputSchema, portalAccessInputSchema } from "@firearmour/shared";
import { customerListQuerySchema } from "../validation/query.schema.js";
import * as customersService from "../services/customers.service.js";

export async function list(req: Request, res: Response) {
  const query = customerListQuerySchema.parse(req.query);
  const customers = await customersService.listCustomers(req.businessId!, query);
  res.json(customers);
}

export async function get(req: Request, res: Response) {
  const customer = await customersService.getCustomer(req.businessId!, req.params.id!);
  res.json(customer);
}

export async function create(req: Request, res: Response) {
  const input = customerInputSchema.parse(req.body);
  const customer = await customersService.createCustomer(req.businessId!, input);
  res.status(201).json(customer);
}

export async function update(req: Request, res: Response) {
  const input = customerInputSchema.partial().parse(req.body);
  const customer = await customersService.updateCustomer(req.businessId!, req.params.id!, input);
  res.json(customer);
}

export async function remove(req: Request, res: Response) {
  await customersService.archiveCustomer(req.businessId!, req.params.id!);
  res.status(204).end();
}

export async function getPortalAccess(req: Request, res: Response) {
  const access = await customersService.getPortalAccess(req.businessId!, req.params.id!);
  res.json(access);
}

export async function createPortalAccess(req: Request, res: Response) {
  const input = portalAccessInputSchema.parse(req.body);
  const access = await customersService.createOrResetPortalAccess(req.businessId!, req.params.id!, input.email);
  res.status(201).json(access);
}
