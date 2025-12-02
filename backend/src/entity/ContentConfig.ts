import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";

export enum ControlType {
  Select = 'select',
  TextInput = 'textinput',
  TextArea = 'textarea',
}

@Entity()
export class ContentConfig extends BaseEntity {

  @PrimaryColumn({
    type: 'varchar'
  })
  contentId: string;

  @Column({ type: 'varchar', nullable: true })
  contentGroup: string;

  @Column({ type: 'varchar', nullable: false })
  description: string;

  @Column({ type: 'varchar', nullable: false })
  valueType: string;

  @Column({ type: 'varchar', nullable: false, default: ControlType.TextInput })
  controlType: ControlType;

  @Column('jsonb', { nullable: true })
  meta: Record<string, any> | null;

  @Column('jsonb', { nullable: true })
  translate: LanguageContent[];

  @Column({ type: 'boolean', nullable: false, default: true })
  isPublic: boolean;

  @Column({ type: 'integer', nullable: false, default: 0 })
  order: number;
}

export interface LanguageContent {
  lang: string;
  value: string;
  image: string;
}