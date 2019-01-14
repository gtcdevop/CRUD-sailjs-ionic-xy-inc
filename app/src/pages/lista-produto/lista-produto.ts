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

  public listaProdutos: ProdutoModel[] = [];

  constructor(public navCtrl: NavController,
    private _produtoProvider: ProdutoProvider) {

    this._produtoProvider.getListaProduto().then(listaProdutos => {
      this.listaProdutos = listaProdutos
    })


  }
  public

}
