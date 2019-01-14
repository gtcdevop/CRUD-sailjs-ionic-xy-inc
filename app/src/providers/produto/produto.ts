import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class ProdutoProvider {

  constructor(public http: HttpClient) {
    console.log('Hello ProdutoProvider Provider');
  }


  public getListaProduto():Promise<any> {
    return new Promise((accept, reject) => {
      
    })
  }

}
