import type { Request, Response } from "express";
import { customerInputSchema } from "@firearmour/shared";
import { customerListQuerySchema } from "../validation/query.schema.js";
import * as customersService from "../services/customers.service.js";

export async function list(req: Request, res: Response) {
  const query = customerListQuerySchema.parse(req.query);
  const customers = await customersService.listCustomers(query);
  res.json(customers);
}

export async function get(req: Request, res: Response) {
  const customer = await customersService.getCustomer(req.params.id!);
  res.json(customer);
}

export async function create(req: Request, res: Response) {
  const input = customerInputSchema.parse(req.body);
  const customer = await customersService.createCustomer(input);
  res.status(201).json(customer);
}

export async function update(req: Request, res: Response) {
  const input = customerInputSchema.partial().parse(req.body);
  const customer = await customersService.updateCustomer(req.params.id!, input);
  res.json(customer);
}

export async function remove(req: Request, res: Response) {
  await customersService.archiveCustomer(req.params.id!);
  res.status(204).end();
}
