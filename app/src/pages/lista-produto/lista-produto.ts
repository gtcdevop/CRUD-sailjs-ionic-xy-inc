import { ProdutoModel } from './../../providers/produto/ProdutoModel';
import { NotificacaoProvider, MensageModel, MensagemTipo } from './../../providers/notificacao/notificacao';
import { ProdutoProvider } from './../../providers/produto/produto';
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

  public listaProdutos: ProdutoModel[];

  // [
  //   {
  //     id: "Id1",
  //     name: "Nome do Produto",
  //     description: "Descricao",
  //     price: 10,
  //     category: "Products"
  //   },
  //   {
  //     id: "Id2",
  //     name: "Nome do Produto2",
  //     description: "Descricao",
  //     price: 10,
  //     category: "Products"
  //   },

  //   {
  //     id: "Id3",
  //     name: "Nome do Produto3",
  //     description: "Descricao",
  //     price: 10,
  //     category: "Products"
  //   },
  // ];

  constructor(public navCtrl: NavController,
    private _notificacaoProvider: NotificacaoProvider,
    private _produtoProvider: ProdutoProvider) {

  }

  /**
   * Ao carregar a pagina, recarregar a lista de produtos.
   */
  ionViewDidLoad() {
    this._buscaProdutos();
  }

  private _buscaProdutos() {
    this.listaProdutos = null;
    this._notificacaoProvider.mostraLoading();
    this._produtoProvider.getListaProduto().then(listaProdutos => {
      this._notificacaoProvider.escondeLoading();
      console.log(this.listaProdutos);
      this.listaProdutos = listaProdutos;
    }).catch(err => {
      console.error(err);
      this._notificacaoProvider.escondeLoading();
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
   * Remove o produto do sistema
   * @param produto a ser removido
   */
  public deletarProduto(produto: ProdutoModel) {
    if (confirm("Deseja remover " + produto.description)) {
      this._notificacaoProvider.mostraLoading();
      this._produtoProvider.deleteProduto(produto).then(succ => {
        this._notificacaoProvider.escondeLoading();
        this._notificacaoProvider.mostraMensagem(succ);
      }).catch(err => {
        this._notificacaoProvider.escondeLoading();
        this._notificacaoProvider.mostraMensagem(err);
      })
    }
  }

}
