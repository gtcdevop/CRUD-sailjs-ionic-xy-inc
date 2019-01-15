import { NotificacaoProvider, MensageModel, MensagemTipo } from './../../providers/notificacao/notificacao';
import { ProdutoProvider } from './../../providers/produto/produto';
import { ProdutoModel } from './../../../../functions/src/index';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * pagina para listagem de produtos e edicao do mesmo
 */
@IonicPage()
@Component({
  selector: 'page-lista-produto',
  templateUrl: 'lista-produto.html',
})
export class ListaProdutoPage {

  public listaProdutos: ProdutoModel[] = [
    {
      id: "Id1",
      name: "Nome do Produto",
      description: "Descricao",
      price: 10,
      category: "Products"
    },
    {
      id: "Id2",
      name: "Nome do Produto2",
      description: "Descricao",
      price: 10,
      category: "Products"
    },

    {
      id: "Id3",
      name: "Nome do Produto3",
      description: "Descricao",
      price: 10,
      category: "Products"
    },
  ];

  constructor(public navCtrl: NavController,
    private _notificacaoProvider: NotificacaoProvider,
    private _produtoProvider: ProdutoProvider) {

    this._produtoProvider.getListaProduto().then(listaProdutos => {
      this.listaProdutos = listaProdutos
    })

  }

  /**
   * Edita um produto com chamada da pagina Edita produto
   * @param produto instancia ProdutoModel que deverá ser atualizado
   */
  public editaProduto(produto: ProdutoModel) {
    this.navCtrl.push("NovoProdutoPage", { "produto": produto });
  }

  /**
   * Chama pagina para adicionar novo produto
   */
  public paginaAdicionaProduto() {
    this.navCtrl.push("NovoProdutoPage");
  }

  /**
   * Remove um produto.
   * @returns promise com mensagem de sucesso ou falha;
   * @param produtoId é o produto que deverá ser removido
   */
  public removeProduto(produtoId: string) {
    let msg: MensageModel = { msg: "Produto removido com sucesso", type: MensagemTipo.info };
    this._notificacaoProvider.mostraMensagem(msg);
  }


}
