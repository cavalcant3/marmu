import type { Request, Response } from "express";
import * as materialService from "../services/materialService.js";

export async function create(req: Request, res: Response) {
  try {
    const material = await materialService.createMaterial({
      ...req.body,
      usuario_id: req.user!.userId,
    });
    res.status(201).json({ success: true, data: material });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: { type: "validation-failed", title: "Validation Failed", status: 400, detail: (error as Error).message },
    });
  }
}

export async function list(req: Request, res: Response) {
  const materials = await materialService.listMaterials(req.user!.userId);
  res.status(200).json({ success: true, data: materials });
}

export async function getById(req: Request, res: Response) {
  const material = await materialService.getMaterial(req.params.id, req.user!.userId);
  if (!material) {
    res.status(404).json({ success: false, error: { type: "not-found", title: "Not Found", status: 404, detail: "Material não encontrado" } });
    return;
  }
  res.status(200).json({ success: true, data: material });
}

export async function update(req: Request, res: Response) {
  await materialService.updateMaterial(req.params.id, req.user!.userId, req.body);
  res.status(200).json({ success: true });
}

export async function remove(req: Request, res: Response) {
  await materialService.deleteMaterial(req.params.id, req.user!.userId);
  res.status(204).send();
}
