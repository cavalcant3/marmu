import type { Request, Response } from "express";
import * as orcamentoService from "../services/orcamentoService.js";

export async function create(req: Request, res: Response) {
  try {
    const orcamento = await orcamentoService.createOrcamento({
      ...req.body,
      usuario_id: req.user!.userId,
    });
    res.status(201).json({ success: true, data: orcamento });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: { type: "validation-failed", title: "Validation Failed", status: 400, detail: (error as Error).message },
    });
  }
}

export async function list(req: Request, res: Response) {
  const orcamentos = await orcamentoService.listOrcamentos(req.user!.userId);
  res.status(200).json({ success: true, data: orcamentos });
}

export async function getById(req: Request, res: Response) {
  const orcamento = await orcamentoService.getOrcamento(req.params.id, req.user!.userId);
  if (!orcamento) {
    res.status(404).json({ success: false, error: { type: "not-found", title: "Not Found", status: 404, detail: "Orçamento não encontrado" } });
    return;
  }
  res.status(200).json({ success: true, data: orcamento });
}
