import { inject, Injectable } from '@angular/core';
import { addDoc, collection, collectionData, deleteDoc, doc, docData, Firestore, getDocs, query, setDoc, where } from '@angular/fire/firestore';
import { User } from './user';
import { from, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  firestore = inject(Firestore);
  collection = collection(this.firestore, 'users');

  getUsers(): Observable<User[]> {
    return collectionData(this.collection, { idField: 'id' }) as Observable<User[]>;
  }

  getUser(id: string): Observable<User> {
    return docData(doc(this.firestore, `users/${id}`), { idField: 'id' }) as Observable<User>;
  }

  getUserByEmail(email: string): Observable<User | undefined> {
    const usersRef = collection(this.firestore, 'users');
    const q = query(usersRef, where('email', '==', email));
    
    return collectionData(q, { idField: 'id' }).pipe(
      map(users => (users.length > 0 ? users[0] as User : undefined))
    );
  }

  getUsersByRoles(role_ids: string[]): Observable<User[] | undefined> {  
    const usersRef = collection(this.firestore, 'users');
    const q = query(usersRef, where('role_id', 'in', role_ids));
    return collectionData(q, { idField: 'id' }).pipe(
      map(users => users as User[])
    );
  }
  

  addUser(user: User): Observable<string> {
    return from(addDoc(this.collection, user).then(resp => resp.id));
  }

  deleteUser(id: string): Observable<void> {
    return from(deleteDoc(doc(this.firestore, `users/${id}`)));
  }

  updateUser(user: User): Observable<void> {
    return from(setDoc(doc(this.firestore, `users/${user.id}`), user));
  }
}
