
export class User {

  public id: number;
  public userIdNumber: number;
  public firstName: string ;
  public lastName: string ;
  public username: string ;
  public email: string;
  public password: string;
  public lastLoginDisplay: Date;
  public registrationDate: Date;
  public isActive: boolean;
  public isNonLocked: boolean;
  public rolePermissions: string;
  public authorities: [];

  constructor() {
    this.firstName = '';
    this.lastName = '';
    this.username = '';
    this.email = '';
    this.password = '';
    this.isActive = false;
    this.isNonLocked = false;
    this.rolePermissions = '';
    this.authorities = [];
  }
}
