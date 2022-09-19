import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

const genRandStr = (length: number) => {
  const characters = '0123456789';
  let result = '';
  const charLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charLength));
  }

  return 'Anon' + result;
};

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('numeric', { default: Math.random() * 999 })
  intraId: number;

  @Column('varchar', { default: genRandStr(6) })
  displayname: string;

  @Column('varchar', { default: genRandStr(6) })
  username: string;

  @Column('varchar', {
    default:
      'https://images.unsplash.com/photo-1521985429101-21bed8b75e47?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
    nullable: true,
  })
  picture: string;

  @Column('varchar', { default: 'offline' })
  status: string;

  @Column('numeric', { default: 0 })
  wins: number;

  @Column('numeric', { default: 0 })
  losses: number;

  @Column('boolean', { default: false })
  twoFAEnabled: boolean;

  @Column('varchar', { nullable: true })
  twoFASecret: string;
}
