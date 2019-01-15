import { ProdutoModel } from './index';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as firebaseHelper from 'firebase-functions-helper';
import * as express from 'express';
import * as bodyParser from "body-parser";
import * as  cors from 'cors';
import { Utils } from "./utils/utils";

admin.initializeApp(functions.config().firebase);


const db = admin.firestore();
const app = express();
const main = express();
const produtoCollection = 'produtos';


export interface ProdutoModel {
   id?: string;
   name: string;
   description: string;
   price: number;
   category: string;
}

export interface ErroModel {
   status: number;
   motivo: string;
}


main.use('/v1', app);
main.use(bodyParser.json());
main.use(bodyParser.urlencoded({ extended: false }));
main.use(cors());

// Salvar um produto
app.post('/' + produtoCollection, (req, res) => {
   // Valida se produto esta ok
   const opa = Utils.validaRequest(req)
   if (opa) {
      return res.status(opa.status).send(opa.motivo);
   } else {
      return firebaseHelper.firestore
         .createNewDocument(db, produtoCollection, req.body).then(novo => {
            const novoRetorno: ProdutoModel = req.body;
            novoRetorno.id = novo.id;
            res.status(201).send(novoRetorno);
         }).catch(err => {
            res.status(400).send(err);
         });
   }

})

// Buscar todos produtos
app.get("/" + produtoCollection, (req, res) => {
   return firebaseHelper.firestore
      .backup(db, produtoCollection)
      .then(data => {
         if (data[produtoCollection]) {
            res.status(200).send(Object.keys(data[produtoCollection]).map(function (a, i) {
               let produtoModelIn: ProdutoModel = {
                  id: a,
                  category: data[produtoCollection][a].category ? data[produtoCollection][a].category : '',
                  price: data[produtoCollection][a].price ? data[produtoCollection][a].price : '',
                  description: data[produtoCollection][a].description ? data[produtoCollection][a].description : '',
                  name: data[produtoCollection][a].name ? data[produtoCollection][a].name : ''
               }
               return produtoModelIn;
            }))
         } else {
            res.status(200).send("[]")
         }
      })
});

// Atualizar produto
app.put("/" + produtoCollection + "/:idProduto", (req, res) => {
   // verificar se Id esta presente na requisicao ou no body
   const id = Utils.getIdNoRequest(req);
   // Verificar body

   if (id) {
      return firebaseHelper.firestore
         .updateDocument(db, produtoCollection, req.query.idProduto, req.body).then(opa => {
            res.status(200).send('Produto atualizado ' + JSON.stringify(opa));
         }).catch(err => {
            console.error(err);
            res.status(400).send(JSON.stringify(err));
         });
   } else {
      const erro: ErroModel = { motivo: "Parâmetro Id obrigatório", status: 400 };
      return res.status(erro.status).send(erro.motivo);
   }
})

// Deletar um produto
app.delete('/' + produtoCollection + '/:idProduto', (req, res) => {
   return firebaseHelper.firestore
      .deleteDocument(db, produtoCollection, req.params.idProduto).then(succ => {
         res.status(204).send('Documento deletado' + JSON.stringify(succ));
      }).catch(err => {
         res.status(400).send('ERRO' + JSON.stringify(err));
      });
})

// Buscar um unico produto
app.get('/' + produtoCollection + '/:idProduto', (req, res) => {
   firebaseHelper.firestore
      .getDocument(db, produtoCollection, req.params.idProduto)
      .then(doc => {
         if (doc) {
            const produtoModel: ProdutoModel = {
               id: req.params.idProduto,
               category: doc.category ? doc.category : '',
               price: doc.price ? doc.price : '',
               description: doc.description ? doc.description : '',
               name: doc.name ? doc.name : ''
            };
            res.status(200).send(produtoModel);
         } else {
            res.status(404).send({});
         }
      }).catch(err => {
         console.error("Aqui deu erro")
         res.status(400).send(err);
      });
})


export const api = functions.https.onRequest(main);