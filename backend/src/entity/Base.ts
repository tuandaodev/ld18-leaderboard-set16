import {
  BaseEntity,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

export class Base extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({
    type: "timestamptz"
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: "timestamptz"
  })
  updatedAt: Date;

  @DeleteDateColumn({
    type: "timestamptz"
  })
  deleteAt: Date;
}
