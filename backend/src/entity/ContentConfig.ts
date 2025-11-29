import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class ContentConfig extends BaseEntity {

  @PrimaryColumn({
    type: 'varchar'
  })
  contentId: string;

  @Column({ type: 'varchar', nullable: false })
  description: string;

  @Column({ type: 'varchar', nullable: false })
  valueType: string;

  @Column('jsonb', { nullable: true })
  translate: LanguageContent[];
}

export interface LanguageContent {
  lang: string;
  value: string;
  image: string;
}