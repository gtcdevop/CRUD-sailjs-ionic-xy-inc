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

  public listaProdutos: ProdutoModel[]; // lista de produto presente na UI

  constructor(public navCtrl: NavController,
    private _notificacaoProvider: NotificacaoProvider,
    private _produtoProvider: ProdutoProvider) {

  }

  /**
   * Ao carregar a pagina, recarregar a lista de produtos.
   */
  ionViewDidLoad() {
    console.log("Lista Produto")
    this._buscaProdutos();
  }

  ionViewWillEnter() {
    console.log("Lista Produto")
    this._buscaProdutos();
  }

  private _buscaProdutos(): Promise<any> {
    this.listaProdutos = null;
    this._notificacaoProvider.mostraLoading();
    let promise: Promise<any> = this._produtoProvider.getListaProduto();
    promise.then(listaProdutos => {
      this._notificacaoProvider.escondeLoading();
      console.log(this.listaProdutos);
      this.listaProdutos = listaProdutos;
    }).catch(err => {
      console.error(err);
      this._notificacaoProvider.escondeLoading();
    })
    return promise;
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
        this._buscaProdutos().then(() => {
          this._notificacaoProvider.escondeLoading();
          this._notificacaoProvider.mostraMensagem(succ);
        }).catch(err => {
          this._notificacaoProvider.escondeLoading();
          this._notificacaoProvider.mostraMensagem(err);
        });
      }).catch(err => {
        this._notificacaoProvider.escondeLoading();
        this._notificacaoProvider.mostraMensagem(err);
      })
    }
  }

}
