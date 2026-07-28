import type { Request, Response } from "express";
import * as pedidoService from "../services/pedidoService.js";

export async function create(req: Request, res: Response) {
  try {
    const pedido = await pedidoService.createPedido(req.body);
    res.status(201).json({ success: true, data: pedido });
  } catch (error) {
    res.status(400).json({ success: false, error: { type: "validation-failed", title: "Validation Failed", status: 400, detail: (error as Error).message } });
  }
}

export async function list(req: Request, res: Response) {
  const pedidos = await pedidoService.listPedidos(req.user!.userId, req.query.status as string);
  res.status(200).json({ success: true, data: pedidos });
}

export async function getById(req: Request, res: Response) {
  const pedido = await pedidoService.getPedido(req.params.id, req.user!.userId);
  if (!pedido) {
    res.status(404).json({ success: false, error: { type: "not-found", title: "Not Found", status: 404, detail: "Pedido não encontrado" } });
    return;
  }
  res.status(200).json({ success: true, data: pedido });
}

export async function entregar(req: Request, res: Response) {
  await pedidoService.marcarEntregue(req.params.id, req.user!.userId);
  res.status(200).json({ success: true });
}
