import { apiRequest } from './../../app/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProdutoModel } from './ProdutoModel';
import { MensageModel, MensagemTipo } from '../notificacao/notificacao';

@Injectable()
export class ProdutoProvider {

  private QUANTIDADE_MAX_TENTATIVA = 5;
  constructor(public http: HttpClient) {
    console.log('Hello ProdutoProvider Provider');
  }

  /**
  * GET - Get lista de produtos e retorna uma promise
  * @param tentativa -- quantidade de tentativas a serem realizadas antes de mostrar a mensagem de erro
  */
  public getListaProduto(tentativa = 0): Promise<any> {
    return new Promise((accept, reject) => {
      this.http.get<ProdutoModel[]>(apiRequest.url + "produtos/").subscribe(data => {
        console.log(data);
        if (data) {
          return data.map(cadaProduto => {
            if (cadaProduto.price) {
              cadaProduto.price = parseFloat(cadaProduto.price.toString());
            } else {
              cadaProduto.price = 0;
            }
            return cadaProduto;
          })
        }
        accept((data as ProdutoModel[]));// Busquei data
      }, (error) => {
        console.log("getListaProduto ", error, "Tentativa", tentativa);
        setTimeout(() => {
          tentativa++;
          if (tentativa < this.QUANTIDADE_MAX_TENTATIVA) {
            this.getListaProduto(tentativa)
          } else {
            let msg: MensageModel = { msg: "Erro ao ler", type: MensagemTipo.erro };
            reject(msg);
          }
        }, 500 * tentativa)
      })
    })
  }

}
