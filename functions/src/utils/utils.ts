import { ErroModel, ProdutoModel } from './../index';
import { Request } from "express";

export class Utils {


   public static getIdNoRequest(req: Request): string {
      if (req.query && req.query.idProduto) {
         return req.query.idProduto;
      } else if (req.body && req.body.id) {
         return req.body.id;
      } else {
         return "";
      }
   }

   public static validaRequest(req: Request): ErroModel {
      let body: ProdutoModel = req.body as ProdutoModel;
      if (!body) {
         return { motivo: "Há erros presentes na validação", status: 400 };
      } else if (!body.name) {
         return { motivo: "Nome está incompleto", status: 400 };
      } else if (!body.description) {
         return { motivo: "Descrição faltando", status: 400 };
      } else if (!body.price) {
         return { motivo: "Preço não configurado", status: 400 };
      } else if (!body.category) {
         return { motivo: "Categoria não setada", status: 400 };
      }
      return null;
   }
}