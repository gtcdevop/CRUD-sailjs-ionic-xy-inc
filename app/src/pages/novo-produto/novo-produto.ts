import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProdutoModel } from '../../providers/produto/ProdutoModel';

/**
 * Generated class for the NovoProdutoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-novo-produto',
  templateUrl: 'novo-produto.html',
})
export class NovoProdutoPage {

  public produtoEditado: ProdutoModel = null;

  constructor(public navCtrl: NavController, public navParams: NavParams) {

    if (this.navParams.get("produto")) {
      this.produtoEditado = this.navParams.get("produto") as ProdutoModel;
      console.log("Edita produto", this.produtoEditado);
    } else {
      console.log("Adiciona novo produto");
    }
  }

}
