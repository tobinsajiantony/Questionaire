import { Injectable } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestore } from '@angular/fire/firestore';
import { promise } from 'protractor';
import { resolve } from 'dns';
import { rejects } from 'assert';
import { Question } from '../Models/Question.Model';

@Injectable({
    providedIn: 'root'
})

export class crud{
    constructor(private afs: AngularFirestore){
    }
    //methods
    getCollection(path: string){
      return this.afs.collection<any>(path).valueChanges()
    }

    generateDocumentId(){
      return this.afs.createId();
    }

    saveDocument(CollectionPath: string, data: Question){
      return this.afs.collection(CollectionPath).doc(data.questionId).set(data)
    }

    saveCommonDocument(CollectionPath: string, data: any){
      return this.afs.collection(CollectionPath).doc(this.generateDocumentId()).set(Object.assign({}, data))
    }

    deleteDocument(CollectionPath: string, documentId: string){
        return this.afs.collection(CollectionPath).doc(documentId).delete()
      }
    getCollectionQuerying(path: string, filterProperty: string, filterValue: string){
      return this.afs.collection<any>(path ,x => x.where(filterProperty, '==', filterValue)).valueChanges()
    }  

}