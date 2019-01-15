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
          let dadoRemapeado = data.map(cadaProduto => {
            if (cadaProduto.price) {
              cadaProduto.price = parseFloat(cadaProduto.price.toString());
            } else {
              cadaProduto.price = 0;
            }
            return cadaProduto;
          })
          accept(dadoRemapeado as ProdutoModel[]);// Busquei data
        } else {
          accept([]);
        }
      }, (error) => {
        console.log("getListaProduto ", error, "Tentativa", tentativa);
        setTimeout(() => {
          tentativa++;
          if (tentativa < this.QUANTIDADE_MAX_TENTATIVA) {
            this.getListaProduto(tentativa);
          } else {
            let msg: MensageModel = { msg: "Erro ao ler", type: MensagemTipo.erro };
            reject(msg);
          }
        }, 500 * tentativa)
      })
    })
  }

  public editaProduto(produto: ProdutoModel, idProduto: string, tentativa = 0): Promise<any> {
    return new Promise((accept, reject) => {
      this.http.put(apiRequest.url + "produtos/" + idProduto, produto).subscribe(data => {
        console.log(data);
        if (data == true) {
          let msg: MensageModel = { msg: "Edição de produto " + produto.name + " realizada com sucesso! ", type: MensagemTipo.sucesso };
          accept(msg);// Salvei o dado
        } else {
          let msg: MensageModel = { msg: "Erro ao atualizar produto ", type: MensagemTipo.alerta };
          reject(msg);
        }
      }, (error) => {
        console.log("editaProduto ", error, "Tentativa", tentativa);
        setTimeout(() => {
          tentativa++;
          if (tentativa < this.QUANTIDADE_MAX_TENTATIVA) {
            this.editaProduto(produto, idProduto, tentativa);
          } else {
            let msg: MensageModel = { msg: "Erro ao editar produto", type: MensagemTipo.erro };
            reject(msg);
          }
        }, 500 * tentativa)
      })
    });
  }



  /**
   * Adiciona o produto na api.
   * @param produto:ProdutoModel = instancia completa do produto.
   * @param tentativa quantidade de tentativas recursivas para realizar a operação.
   */
  public adicionaProduto(produto: ProdutoModel, tentativa = 0): Promise<any> {
    //removve id, se presente no produto
    return new Promise((accept, reject) => {
      this.http.post<ProdutoModel>(apiRequest.url + "produtos/", produto).subscribe(data => {
        console.log(data); //TODO(gustavo) verificar como vem o dado
        accept((data as ProdutoModel));// Salvei o dado
      }, (error) => {
        console.error("adicionaProduto ", error, "Tentativa", tentativa);
        setTimeout(() => {
          tentativa++;
          if (tentativa < this.QUANTIDADE_MAX_TENTATIVA) {
            this.adicionaProduto(produto, tentativa);
          } else {
            let msg: MensageModel = { msg: "Erro ao adicionar o produto", type: MensagemTipo.erro, stackTrace: error };
            reject(msg);
          }
        }, 500 * tentativa)
      })
    });
  }

  public deleteProduto(produto: ProdutoModel, tentativa = 0): Promise<any> {
    // deleta o produto
    return new Promise((accept, reject) => {
      this.http.delete(apiRequest.url + "produtos/" + produto.id).subscribe(data => {
        accept();// Dado removido com sucesso
      }, (error) => {
        console.log("deleteProduto ", error, "Tentativa", tentativa);
        setTimeout(() => {
          tentativa++;
          if (tentativa < this.QUANTIDADE_MAX_TENTATIVA) {
            this.deleteProduto(produto, tentativa);
          } else {
            let msg: MensageModel = { msg: "Erro ao remover produto", type: MensagemTipo.erro };
            reject(msg);
          }
        }, 500 * tentativa)
      })
    });
  }
}
